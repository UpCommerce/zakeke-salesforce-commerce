/* eslint-disable */
'use strict';

/** @module calculate */
/**
 * This javascript file implements methods (via Common.js exports) that are needed by
 * the new (smaller) CalculateCart.ds script file.  This allows OCAPI calls to reference
 * these tools via the OCAPI 'hook' mechanism
 */

var HashMap = require('dw/util/HashMap');
var PromotionMgr = require('dw/campaign/PromotionMgr');
var ShippingMgr = require('dw/order/ShippingMgr');
var ShippingLocation = require('dw/order/ShippingLocation');
var TaxMgr = require('dw/order/TaxMgr');
var Logger = require('dw/system/Logger');
var Status = require('dw/system/Status');
var HookMgr = require('dw/system/HookMgr');
var collections = require('*/cartridge/scripts/util/collections');

var base = module.superModule;


exports.calculate = function (basket) {
	base.calculate(basket);

    
    // ===================================================
    // =====         ZAKEKE Adjustments              =====
    // ===================================================
    calculateProductPricesAdjustmentZakeke(basket);

    // since we might have bonus product line items, we need to
    // reset product prices
    calculateProductPrices(basket);

    // ===================================================
    // =====         CALCULATE TAX                   =====
    // ===================================================

    HookMgr.callHook('dw.order.calculateTax', 'calculateTax', basket);

    // ===================================================
    // =====         CALCULATE BASKET TOTALS         =====
    // ===================================================

    basket.updateTotals();

    // ===================================================
    // =====            DONE                         =====
    // ===================================================

    return new Status(Status.OK);
};

/**
 * @function calculateProductPricesAdjustmentZakeke
 *
 * Add product price adjustment only for customized product 
 * in the product line items.  This function returns nothing
 *
 * @param {object} basket The basket containing the elements to be computed
 */
function calculateProductPricesAdjustmentZakeke(basket){
	var Resource = require('dw/web/Resource');
	var zakGlobalSite = require('*/cartridge/scripts/zakGlobalSite');
	var ZakCustomizationModel=require('*/cartridge/scripts/models/ZakCustomizationModel');
	
    var productLineItems = basket.getAllProductLineItems().iterator();
	
    while (productLineItems.hasNext()) {
        var productLineItem = productLineItems.next();
        var fixedAmount=null;
		
        if (!empty(productLineItem.getCustom().ZAKEKE_CompositionID)) {
        	var compositionId=productLineItem.getCustom().ZAKEKE_CompositionID;
        	var quantity=productLineItem.quantity.value;
        	var productID=productLineItem.productID;
        	var customizationType=productLineItem.getCustom().ZAKEKE_CustomizationType;
        	var platformType=zakGlobalSite.PLATFORM_USED;//SITEGENESIS
        	
        	var priceCustomiz=productLineItem.getCustom().ZAKEKE_CompositionPrice;
        	var priceCustomizNoTaxes=productLineItem.getCustom().ZAKEKE_CompositionPriceNoTaxes;
        	
        	//ZAKEKE_Control: this variable is used to choose if customizationAPI call has to be done or not
        	//It saves the preceding "<compositionId>____<quantity>" for which the call has already been done
        	var controlCustomizationCall=productLineItem.getCustom().ZAKEKE_Control;
        	var controlObjectReturn= {control: ''};
        	var toCall=isToCallCustomizationModel(controlCustomizationCall, compositionId, quantity, controlObjectReturn);
        	if(toCall){
        		var modelCustomization=ZakCustomizationModel.get(productID, compositionId, quantity, customizationType, platformType);
                var obj=modelCustomization.customization(); //obj={compositionPreview: xxxx, compositionUnitPrice: xxxx, compositionUnitPriceNoTaxes: xxxxx}
                
                priceCustomiz=obj.compositionUnitPrice;
                priceCustomizNoTaxes=obj.compositionUnitPriceNoTaxes;
                
                productLineItem.getCustom().ZAKEKE_CompositionPreview = obj.compositionPreview;
                productLineItem.getCustom().ZAKEKE_CompositionPrice = priceCustomiz;//Unit composition price in session currency (WITH TAXES)
                productLineItem.getCustom().ZAKEKE_CompositionPriceNoTaxes = priceCustomizNoTaxes;//Unit composition price in session currency (NO TAXES)
                productLineItem.getCustom().ZAKEKE_Control = controlObjectReturn.control;
        	}
        	
        	
            if (priceCustomiz>0){
                var adj=productLineItem.getPriceAdjustmentByPromotionID(compositionId);
                
                if (empty(adj)){
                    fixedAmount = productLineItem.createPriceAdjustment(compositionId);
                }
                else {
                    fixedAmount=adj;
                }
                
                fixedAmount.setManual(false);
                fixedAmount.setPriceValue(priceCustomiz*quantity);
                fixedAmount.setLineItemText(Resource.msgf('calculate.productPriceAdjustment','zakeke',null,compositionId));
            }
        }
    }	
}


/**
 * @function isToCallCustomizationModel
 *
 * Returns if the customizationAPI call has to be done or not 
 * checking the value of control field. It's called for each lineItem
 *
 * @param {string} control Control field
 * @param {string} compositionId The compositionId
 * @param {int} quantity The quantity
 * @param {object} controlReturn The value of control object to fill "{control: ''}"
 */
function isToCallCustomizationModel(control, compositionId, quantity, controlReturn){
	var toCall=false;
	
	var chrSpli='____';//4chr
	var controlArray=null;
	
	if(empty(control)){
		toCall=true;
		controlReturn.control = compositionId+chrSpli+quantity;
	}
	else{
		controlArray=control.split(chrSpli);
		var compId=controlArray[0];
		var quant=controlArray[1];
		
		if(compId!=compositionId || quant!=quantity){
			toCall=true;
			controlReturn.control = compositionId+chrSpli+quantity;
		}
	}
	
	return toCall;
}


/**
 * @function calculateProductPrices
 *
 * Calculates product prices based on line item quantities. Set calculates prices
 * on the product line items.  This updates the basket and returns nothing
 *
 * @param {object} basket The basket containing the elements to be computed
 */
function calculateProductPrices (basket) {
    // get total quantities for all products contained in the basket
    var productQuantities = basket.getProductQuantities();
    var productQuantitiesIt = productQuantities.keySet().iterator();

    // get product prices for the accumulated product quantities
    var productPrices = new HashMap();

    while (productQuantitiesIt.hasNext()) {
        var prod = productQuantitiesIt.next();
        var quantity = productQuantities.get(prod);
        productPrices.put(prod, prod.priceModel.getPrice(quantity));
    }

    // iterate all product line items of the basket and set prices
    var productLineItems = basket.getAllProductLineItems().iterator();
    while (productLineItems.hasNext()) {
        var productLineItem = productLineItems.next();

        // handle non-catalog products
        if (!productLineItem.catalogProduct) {
            productLineItem.setPriceValue(productLineItem.basePrice.valueOrNull);
            continue;
        }

        var product = productLineItem.product;

        // handle option line items
        if (productLineItem.optionProductLineItem) {
            // for bonus option line items, we do not update the price
            // the price is set to 0.0 by the promotion engine
            if (!productLineItem.bonusProductLineItem) {
                productLineItem.updateOptionPrice();
            }
        // handle bundle line items, but only if they're not a bonus
        } else if (productLineItem.bundledProductLineItem) {
            // no price is set for bundled product line items
        // handle bonus line items
        // the promotion engine set the price of a bonus product to 0.0
        // we update this price here to the actual product price just to
        // provide the total customer savings in the storefront
        // we have to update the product price as well as the bonus adjustment
        } else if (productLineItem.bonusProductLineItem && product !== null) {
            var price = product.priceModel.price;
            var adjustedPrice = productLineItem.adjustedPrice;
            productLineItem.setPriceValue(price.valueOrNull);
            // get the product quantity
            var quantity2 = productLineItem.quantity;
            // we assume that a bonus line item has only one price adjustment
            var adjustments = productLineItem.priceAdjustments;
            if (!adjustments.isEmpty()) {
                var adjustment = adjustments.iterator().next();
                var adjustmentPrice = price.multiply(quantity2.value).multiply(-1.0).add(adjustedPrice);
                adjustment.setPriceValue(adjustmentPrice.valueOrNull);
            }


        // set the product price. Updates the 'basePrice' of the product line item,
        // and either the 'netPrice' or the 'grossPrice' based on the current taxation
        // policy

        // handle product line items unrelated to product
        } else if (product === null) {
            productLineItem.setPriceValue(null);
        // handle normal product line items
        } else {
            productLineItem.setPriceValue(productPrices.get(product).valueOrNull);
        }
    }
}


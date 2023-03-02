/**
* Module for managing the pricing of product
*
* @module models/ZakPricingModel
*/

'use strict';


var Site = require('dw/system/Site');
var ProductMgr = require('dw/catalog/ProductMgr');
var TaxMgr = require('dw/order/TaxMgr');

var zakGlobal = require('*/cartridge/scripts/zakGlobal');

// Helpers--------------
var getCustomerID = function (customer) {
    var customerID = '0';

    if (customer.authenticated) {
        customerID = customer.getProfile().getCustomerNo();
    }

    return customerID;
};


/**
 * getCustomerTaxRate
 * Get the tax rate to apply to the customer
 *
 * @param {dw.customer.Customer} customer The customer
 * @param {number} productTaxClassID The tax class
 * @return {number} The tax rate to apply to the customer
 *
 */
var getCustomerTaxRate = function (customer, productTaxClassID) {
    var rate = null;

    var custaddress = customer.addressBook.getPreferredAddress();
    if (custaddress) {
        var shippLocation = new dw.order.ShippingLocation(custaddress);
        if (shippLocation) {
            var taxJurisd = TaxMgr.getTaxJurisdictionID(shippLocation);
            if (taxJurisd) {
                rate = TaxMgr.getTaxRate(productTaxClassID, taxJurisd);
            }
        }
    }

    return rate;
};


/**
 * getTaxationRate
 * Get the tax rate to apply
 *
 * @param {dw.catalog.Product} productSel The selected product
 * @param {dw.customer.Customer} customer Customer of the site
 * @return {number} The tax rate to apply
 *
 */
var getTaxationRate = function (productSel, customer) {
    var productTaxClassID = productSel.taxClassID;
    var defaultTaxJurisdictionID = TaxMgr.defaultTaxJurisdictionID;
    var taxRate = TaxMgr.getTaxRate(productTaxClassID, defaultTaxJurisdictionID);

    var customerID = getCustomerID(customer);
    if (customerID !== '0') {
        var rate = getCustomerTaxRate(customer, productTaxClassID);
        if (rate) {
            taxRate = rate;
        }
    }

    return taxRate;
};


//---------------------------------------------------------------
// Sitegenesis helpers----------------------------------------------------
//---------------------------------------------------------------

/*
*
*	Get the unit price value from the priceObject
*		-In case of promotion returns the promo price (even if there is a quantity discount)
*		-In case of quantity discount (with NO promotion discount) it returns the promo price
*		-No promotion, no quantity discount => sale price
*
*  @function getPriceFromPricingObjectSITEGENESIS
*
*  @param {Object} object of pricing of an item
*  @returns {Number}
*
* */
var getPriceFromPricingObjectSITEGENESIS = function (priceObject) {
    var price = 'ND';

    if (priceObject.isPromoPrice === true) {
        price = priceObject.promoPriceMoney.value;
    } else {
        price = priceObject.salePriceMoney.value;
    }

    return price;
};

/**
* Gets pricing
*
* @param {dw.catalog.Product} item Product item
* @param {number} quantity of product
* @returns {Object} Object of pricing that doesn't include the promotions (managed only in the cart)
*/
var getPricingSITEGENESIS = function (item, quantity) {
    var Money = require('dw/value/Money');
    var Promotion = require('dw/campaign/Promotion');
    var PromotionMgr = require('dw/campaign/PromotionMgr');
    var Quantity = require('dw/value/Quantity');

    var priceModel = item.getPriceModel();
    var salesPrice = priceModel.getPrice(new Quantity(quantity, ''));
    var salesPriceUnit = priceModel.getPrice();

    var promoPrice = Money.NOT_AVAILABLE;
    var isPromoPrice = false;

    var promos = PromotionMgr.activeCustomerPromotions.getProductPromotions(item);
    if (promos && promos.length) {
        var promo = promos[0];
        var promoClass = promo.getPromotionClass();
        if (promoClass && promoClass.equals(Promotion.PROMOTION_CLASS_PRODUCT)) {
            if (item.optionProduct) {
                promoPrice = promo.getPromotionalPrice(item, item.getOptionModel());
            } else {
                promoPrice = promo.getPromotionalPrice(item);
            }
        }

        if (promoPrice.available && salesPrice.compareTo(promoPrice) !== 0) {
            isPromoPrice = true;
        }
    }


    var isQuantitiesPrice = salesPrice.value !== salesPriceUnit.value;

    var pricing = {
        salePriceMoney: salesPrice, // sale price considering quantity
        salesPriceUnitMoney: salesPriceUnit, // sale price considering quantity=1
        isPromoPrice: isPromoPrice, // there is a promotion price
        promoPriceMoney: promoPrice, // promotion price considering quantity=1
        isQuantitiesPrice: isQuantitiesPrice // There is a price discount linked to the quantity selected
    };

    return pricing;
};


/**
* Get the unit prices of the variants of a certain master product.
* Returns the object:
* [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
*	0: {productID: "Zakeke_Tshirt-1", price: 25.5, option: Array(2)}
*	1: {productID: "Zakeke_Tshirt-2", price: 26, option: Array(2)}
*	...
*	...
*
*	where option:
*	0: {optionID: "Color", valueID: "W"}
*	1: {optionID: "Size", valueID: "S"}
*
* @function getUnitPricesVariantsSITEGENESIS
* @param {dw.catalog.Product} productMaster the master product
* @param {number} quantity of product
* @param {dw.catalog.Product} productSelected product or variant selected
* @returns {Object}
**/
var getUnitPricesVariantsSITEGENESIS = function (productMaster, quantity, productSelected) {
    var price = null;
    var unitPrices = null;


    // Product standard
    if (productMaster.variants.empty === true) {
        var priceObject = getPricingSITEGENESIS(productMaster, quantity);
        price = getPriceFromPricingObjectSITEGENESIS(priceObject);

        unitPrices = [{ productID: productMaster.ID, price: price, selected: true, option: { optionID: null, valueID: null } }];
    } else { // Variants of a master
        var variants = productMaster.variants.toArray();

        unitPrices = variants.map(function (p) {
            var priceObject = getPricingSITEGENESIS(p, quantity);
            price = getPriceFromPricingObjectSITEGENESIS(priceObject);

            var isVariantSelected = false;
            if (p.ID === productSelected.ID) { isVariantSelected = true; }

            var attributes = p.variationModel.getProductVariationAttributes().toArray();
            var options = attributes.map(function (k) {
                var values = p.variationModel.getSelectedValue(k);

                return { optionID: k.ID, valueID: values.value };
            });

            return { productID: p.ID, price: price, selected: isVariantSelected, option: options };
        });
    }

    return unitPrices;
};


//---------------------------------------------------------------
// SFRA helpers----------------------------------------------------
//---------------------------------------------------------------
/*
*
*	Get the unit price value from the priceObject
*		-In case of quantity discount it returns the price with discount quantity  (even if there is a promotion discount)
*		-In case of promotion (with NO quantity discount) returns the promo price
*		-No promotion, no quantity discount => sale price
*  @function getPriceFromPricingObjectSFRA
*
*  @param {Object} priceObject of pricing of an item
*  @param {Number} quantity of item
*  @returns {Number}
*
* */
var getPriceFromPricingObjectSFRA = function (priceObject, quantity) {
    var price = null;

    if (priceObject.type !== 'tiered') {
        price = priceObject.sales.value;
    } else {
        var tiersTotal = priceObject.tiers;

        for (var i = 0; i < tiersTotal.length; i++) {
            var tier = tiersTotal[i];
            var isLast = (i === (tiersTotal.length - 1));

            var tierNext = { quantity: 1000000, sales: { value: tier.price.sales.value } };
            if (isLast === false) {
                tierNext = tiersTotal[i + 1];
            }

            if (quantity >= tier.quantity && quantity < tierNext.quantity) {
                price = tier.price.sales.value;
                break;
            }
        }
    }

    return price;
};


/**
* Get the unit prices of the variants of a certain master product.
* Returns the object:
* [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
*	0: {productID: "Zakeke_Tshirt-1", price: 25.5, option: Array(2)}
*	1: {productID: "Zakeke_Tshirt-2", price: 26, option: Array(2)}
*	...
*	...
*
*	where option:
*	0: {optionID: "Color", valueID: "W"}
*	1: {optionID: "Size", valueID: "S"}
*
* @function getUnitPricesVariantsSFRA
*
* @param {dw.catalog.Product} productMaster the master product
* @param {number} quantity of product
* @param {dw.catalog.Product} productSelected product or variant selected
* @returns {Object}
**/
var getUnitPricesVariantsSFRA = function (productMaster, quantity, productSelected) {
    var priceFactory = require('*/cartridge/scripts/factories/price');
    var PromotionMgr = require('dw/campaign/PromotionMgr');

    var promotions = null;
    var unitPrices = null;
    var priceObject = null;
    var currentOptionModel = null;// we don't manage the option product


    // Product standard
    if (productMaster.variants.empty === true) {
        promotions = PromotionMgr.activeCustomerPromotions.getProductPromotions(productMaster);
		// priceFactory.getPrice(product, currency, useSimplePrice, promotions, currentOptionModel)
        priceObject = priceFactory.getPrice(productMaster, null, true, promotions, currentOptionModel);
        var priceFinal = getPriceFromPricingObjectSFRA(priceObject, quantity);

        unitPrices = [{ productID: productMaster.ID, price: priceFinal, selected: true, option: { optionID: null, valueID: null } }];
    } else { // Variants of a master
        var variants = productMaster.variants.toArray();

        unitPrices = variants.map(function (p) {
            var attributes = p.variationModel.getProductVariationAttributes().toArray();

            var options = attributes.map(function (k) {
                var values = p.variationModel.getSelectedValue(k);

                return { optionID: k.ID, valueID: values.value };
            });

            var isVariantSelected = false;
            if (p.ID === productSelected.ID) { isVariantSelected = true; }

            var selectedVariant = p;// p.variationModel.selectedVariant;
            var promotions = PromotionMgr.activeCustomerPromotions.getProductPromotions(selectedVariant);

            // priceFactory.getPrice(product, currency, useSimplePrice, promotions, currentOptionModel)
            var priceObject = priceFactory.getPrice(selectedVariant, null, true, promotions, currentOptionModel);
            var priceFinal = getPriceFromPricingObjectSFRA(priceObject, quantity);

            return { productID: p.ID, price: priceFinal, selected: isVariantSelected, option: options };
        });
    }


    return unitPrices;
};


//---------------------------------------

/**
 * ZakPricingModel class providing pricing information about a product (only simple product (1) or variant of a master (2))
 *
 * @class module:models/ZakPricingModel
 *
 * @param {Object} pricingOptions options for calculate the pricing
 * @param {dw.catalog.Product} product selected
 */
var ZakPricingModel = function (pricingOptions, product) {
    this.object = product;
    this.quantity = pricingOptions.quantity;
    this.platform = pricingOptions.platform;

    this.master = this.object;
    if (this.productType() === zakGlobal.PRODUCT_TYPES.VARIANT) {
    	this.master = this.object.getMasterProduct();
    }

    if (this.platform === zakGlobal.PLATFORM_TYPES.SFRA) {
    	this.unitPrices = getUnitPricesVariantsSFRA(this.master, this.quantity, this.object);
    } else {
    	this.unitPrices = getUnitPricesVariantsSITEGENESIS(this.master, this.quantity, this.object);
    }

    this.taxRate = getTaxationRate(this.object, session.getCustomer());
    this.taxPolicy = TaxMgr.getTaxationPolicy();// 0=GROSS, 1=NET

    this.currency = session.getCurrency().currencyCode; // Session Currency CODE
    this.currencyBase = Site.current.defaultCurrency; // Base Currency CODE
};


ZakPricingModel.prototype.productType = function () {
    var type = zakGlobal.PRODUCT_TYPES.NORMAL;

    if (this.object.variant) {
        type = zakGlobal.PRODUCT_TYPES.VARIANT;
    }
    return type;
};


/**
 * Gets a new instance of ZakConfigModel.
 *
 * @returns {module:models/ZakPricingModel} A new ZakConfigModel instance
 * @param {Object} pricingOptions options for calculate the pricing
 * 		{selectedProductID: <string>, quantity: <number>, platform: <number>}
 */
ZakPricingModel.get = function (pricingOptions) {
    if (empty(pricingOptions)) {
        return null;
    }
    var product = ProductMgr.getProduct(pricingOptions.selectedProductID);
    if (product === null) {
        return null;
    }

    return new ZakPricingModel(pricingOptions, product);
};


/** The ZakPricingModel class */
module.exports = ZakPricingModel;


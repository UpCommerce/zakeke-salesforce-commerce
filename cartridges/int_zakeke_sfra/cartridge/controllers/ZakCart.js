/**
* This controller manages the adding of the products, chosen in the zakCustomize page, in the cart
*
* @module  controllers/zakCart
*/

'use strict';

var BasketMgr = require('dw/order/BasketMgr');
var txn = require('dw/system/Transaction');

var zakGlobal = require('*/cartridge/scripts/zakGlobal');
var zakHelper = require('*/cartridge/scripts/helpers/zakHelper');
var ProductMgr = require('dw/catalog/ProductMgr');
var ZakConfigModel = require('*/cartridge/scripts/models/ZakConfigModel');


var server = require('server');


/**
* show: Add the product, chosen in the zakCustomize page, adding the 'zakeke' line item fields:
*		ZAKEKE_CompositionID= Composition ID,
*		ZAKEKE_CompositionPrice= Additional composition unit price expressed in the session currency
*		ZAKEKE_CompositionPreview= The url of the image preview for the customized product
*		ZAKEKE_Composition= string representation of json object that contains all the options/values of the made customization.
*/
server.post('Show', server.middleware.https, function (req, res, next) {
    var basket = null;
    var shipments = null;
    var productLineProduct = null;
    var err = null;

    var bodyString = req.body;
    var body = JSON.parse(bodyString);

    var json = { status: 'OK', message: '' };

    try {
        txn.begin();

        basket = BasketMgr.getCurrentOrNewBasket();
        shipments = basket.getShipments().toArray();

        var lineItems = basket.getProductLineItems(body.productID).toArray();
        lineItems.forEach(function (item) {
            basket.removeProductLineItem(item);
        });

        productLineProduct = basket.createProductLineItem(body.productID, shipments[0]);
        productLineProduct.getCustom().ZAKEKE_CompositionID = body.compositionID;
        productLineProduct.getCustom().ZAKEKE_CustomizationType = body.customizationType;
        productLineProduct.getCustom().ZAKEKE_Composition = '';
        if (body.customizationType === zakGlobal.CUSTOMIZATION_TYPES.CONFIGURATOR) {
        	productLineProduct.getCustom().ZAKEKE_Composition = JSON.stringify(body.zakOptions);
        }
        // these fields below will be loaded in the calculate function
        productLineProduct.getCustom().ZAKEKE_CompositionPrice = 0;
        productLineProduct.getCustom().ZAKEKE_CompositionPriceNoTaxes = 0;
        productLineProduct.getCustom().ZAKEKE_CompositionPreview = '';
        productLineProduct.getCustom().ZAKEKE_Control = '';

        productLineProduct.setQuantityValue(body.quantity);

        var config = ZakConfigModel.get();
        var zakConf = config.zakekeConfig();
        var zakekeEnableStockTracking = zakConf.ZAKEKE_EnableStockTracking;
        if(zakekeEnableStockTracking){
            var patchProducts =  zakHelper.getPatchProducts(body.compositionID);
            if(!empty(patchProducts) && basket){
                patchProducts.forEach(product => {
                    if(product.pid){
                        var isAlreadyInBasket = basket.getProductLineItems(product.pid);
                        var patchProductLineItem;
                        if(isAlreadyInBasket.empty){
                            patchProductLineItem = basket.createProductLineItem(product.pid, shipments[0]);
                            patchProductLineItem.getCustom().ZAKEKE_IsPatchLineItem = true;
                            var qty = body.quantity * product.qty;
                            patchProductLineItem.setQuantityValue(qty);
                        } else {
                            patchProductLineItem = isAlreadyInBasket[0];
                            patchProductLineItem.getCustom().ZAKEKE_IsPatchLineItem = true;
                            var qty = patchProductLineItem.quantity + (body.quantity * product.qty);
                            patchProductLineItem.setQuantityValue(qty);
                        }

                        
                       
                    }
                });
            }
            productLineProduct.getCustom().ZAKEKE_PatchProducts = JSON.stringify(patchProducts);
        }
        
        txn.commit();
    } catch (e) {
        err = e;

        json.status = 'ERR';
        json.message = err.message;

        txn.rollback();
    }


    res.json(json);
    next();
});


module.exports = server.exports();


/* global empty */
/* eslint no-underscore-dangle:0 */
var base = module.superModule;
var server = require('server');
var collections = require('*/cartridge/scripts/util/collections');
var Transaction = require('dw/system/Transaction');
var BasketMgr = require('dw/order/BasketMgr');
var Decimal = require('dw/util/Decimal');
var ZakConfigModel = require('*/cartridge/scripts/models/ZakConfigModel');
server.extend(base);

server.append('Show', function (req, res, next) {
    var viewData = res.getViewData();
    viewData.zakekeShowPatchProduct = false;
    res.setViewData(viewData);
    return next();
});

/**
 * Cart-MiniCart : The Cart-MiniCart endpoint is responsible for displaying the cart icon in the header with the number of items in the current basket
 * @name Base/Cart-MiniCart
 * @function
 * @memberof Cart
 * @param {middleware} - server.middleware.include
 * @param {category} - sensitive
 * @param {renders} - isml
 * @param {serverfunction} - get
 */
 server.append('MiniCart', function (req, res, next) {
    var BasketMgr = require('dw/order/BasketMgr');
    var collections = require('*/cartridge/scripts/util/collections');

    var currentBasket = BasketMgr.getCurrentBasket();
    var quantityTotal = 0;

    if (currentBasket) {
        collections.forEach(currentBasket.productLineItems, function (lineItem) {
            if(lineItem.getCustom().ZAKEKE_IsPatchLineItem){
                return;
            }
            quantityTotal += lineItem.quantity.value;
        });
    } else {
        quantityTotal = 0;
    }
    var viewData = res.getViewData();
    viewData.quantityTotal = quantityTotal;
    res.setViewData(viewData);
    next();
});

/**
 * Cart-RemoveProductLineItem : The Cart-RemoveProductLineItem endpoint removes a product line item from the basket
 * @name Base/Cart-RemoveProductLineItem
 * @function
 * @memberof Cart
 * @param {querystringparameter} - pid - the product id
 * @param {querystringparameter} - uuid - the universally unique identifier of the product object
 * @param {category} - sensitive
 * @param {returns} - json
 * @param {serverfunction} - get
 */
 server.replace('RemoveProductLineItem', function (req, res, next) {
    var BasketMgr = require('dw/order/BasketMgr');
    var Resource = require('dw/web/Resource');
    var Transaction = require('dw/system/Transaction');
    var URLUtils = require('dw/web/URLUtils');
    var CartModel = require('*/cartridge/models/cart');
    var basketCalculationHelpers = require('*/cartridge/scripts/helpers/basketCalculationHelpers');

    var currentBasket = BasketMgr.getCurrentBasket();

    if (!currentBasket) {
        res.setStatusCode(500);
        res.json({
            error: true,
            redirectUrl: URLUtils.url('Cart-Show').toString()
        });

        return next();
    }

    var isProductLineItemFound = false;
    var bonusProductsUUIDs = [];

    Transaction.wrap(function () {
        if (req.querystring.pid && req.querystring.uuid) {
            var productLineItems = currentBasket.getAllProductLineItems(req.querystring.pid);
            var bonusProductLineItems = currentBasket.bonusLineItems;
            var mainProdItem;
            for (var i = 0; i < productLineItems.length; i++) {
                var item = productLineItems[i];
                if ((item.UUID === req.querystring.uuid)) {
                    if (bonusProductLineItems && bonusProductLineItems.length > 0) {
                        for (var j = 0; j < bonusProductLineItems.length; j++) {
                            var bonusItem = bonusProductLineItems[j];
                            mainProdItem = bonusItem.getQualifyingProductLineItemForBonusProduct();
                            if (mainProdItem !== null
                                && (mainProdItem.productID === item.productID)) {
                                bonusProductsUUIDs.push(bonusItem.UUID);
                            }
                        }
                    }

                    var config = ZakConfigModel.get();
                    var zakConf = config.zakekeConfig();
                    var zakekeEnableStockTracking = zakConf.ZAKEKE_EnableStockTracking;
                    if(zakekeEnableStockTracking){
                        var patchProductJson =  item.getCustom().ZAKEKE_PatchProducts;
                        if(!empty(patchProductJson)){
                            var patchProducts = JSON.parse(patchProductJson);
                            patchProducts.forEach(product => {
                                var patchProductLineItems = currentBasket.getAllProductLineItems(product.pid);
                                for (var i = 0; i < patchProductLineItems.length; i++) {
                                    var patchItem = patchProductLineItems[i];
                                    if(patchItem){
                                        var updatedQty = patchItem.quantityValue - (item.quantityValue * product.qty);
                                        if(updatedQty > 0){
                                            patchItem.setQuantityValue(updatedQty);
                                        } else{
                                            currentBasket.removeProductLineItem(patchItem);
                                        }
                                    }
                                }
                            });
                        }
                    }

                    var shipmentToRemove = item.shipment;
                    currentBasket.removeProductLineItem(item);
                    if (shipmentToRemove.productLineItems.empty && !shipmentToRemove.default) {
                        currentBasket.removeShipment(shipmentToRemove);
                    }
                    isProductLineItemFound = true;
                    break;
                }
            }
        }
        basketCalculationHelpers.calculateTotals(currentBasket);
    });

    if (isProductLineItemFound) {
        var basketModel = new CartModel(currentBasket);
        var basketModelPlus = {
            basket: basketModel,
            toBeDeletedUUIDs: bonusProductsUUIDs
        };
        res.json(basketModelPlus);
    } else {
        res.setStatusCode(500);
        res.json({ errorMessage: Resource.msg('error.cannot.remove.product', 'cart', null) });
    }

    return next();
});




/**
 * Cart-UpdateQuantity : The Cart-UpdateQuantity endpoint handles updating the quantity of a product line item in the basket
 * @name Base/Cart-UpdateQuantity
 * @function
 * @memberof Cart
 * @param {querystringparameter} - pid - the product id
 * @param {querystringparameter} - quantity - the quantity to be updated for the line item
 * @param {querystringparameter} -  uuid - the universally unique identifier of the product object
 * @param {category} - sensitive
 * @param {returns} - json
 * @param {serverfunction} - get
 */
 server.replace('UpdateQuantity', function (req, res, next) {
    var BasketMgr = require('dw/order/BasketMgr');
    var Resource = require('dw/web/Resource');
    var Transaction = require('dw/system/Transaction');
    var URLUtils = require('dw/web/URLUtils');
    var CartModel = require('*/cartridge/models/cart');
    var collections = require('*/cartridge/scripts/util/collections');
    var cartHelper = require('*/cartridge/scripts/cart/cartHelpers');
    var basketCalculationHelpers = require('*/cartridge/scripts/helpers/basketCalculationHelpers');

    var currentBasket = BasketMgr.getCurrentBasket();

    if (!currentBasket) {
        res.setStatusCode(500);
        res.json({
            error: true,
            redirectUrl: URLUtils.url('Cart-Show').toString()
        });

        return next();
    }

    var productId = req.querystring.pid;
    var updateQuantity = parseInt(req.querystring.quantity, 10);
    var uuid = req.querystring.uuid;
    var productLineItems = currentBasket.productLineItems;
    var matchingLineItem = collections.find(productLineItems, function (item) {
        return item.productID === productId && item.UUID === uuid;
    });
    var availableToSell = 0;

    var totalQtyRequested = 0;
    var qtyAlreadyInCart = 0;
    var minOrderQuantity = 0;
    var perpetual = false;
    var canBeUpdated = false;
    var bundleItems;
    var bonusDiscountLineItemCount = currentBasket.bonusDiscountLineItems.length;

    if (matchingLineItem) {
        if (matchingLineItem.product.bundle) {
            bundleItems = matchingLineItem.bundledProductLineItems;
            canBeUpdated = collections.every(bundleItems, function (item) {
                var quantityToUpdate = updateQuantity *
                    matchingLineItem.product.getBundledProductQuantity(item.product).value;
                qtyAlreadyInCart = cartHelper.getQtyAlreadyInCart(
                    item.productID,
                    productLineItems,
                    item.UUID
                );
                totalQtyRequested = quantityToUpdate + qtyAlreadyInCart;
                availableToSell = item.product.availabilityModel.inventoryRecord.ATS.value;
                perpetual = item.product.availabilityModel.inventoryRecord.perpetual;
                minOrderQuantity = item.product.minOrderQuantity.value;
                return (totalQtyRequested <= availableToSell || perpetual) &&
                    (quantityToUpdate >= minOrderQuantity);
            });
        } else {
            availableToSell = matchingLineItem.product.availabilityModel.inventoryRecord.ATS.value;
            perpetual = matchingLineItem.product.availabilityModel.inventoryRecord.perpetual;
            qtyAlreadyInCart = cartHelper.getQtyAlreadyInCart(
                productId,
                productLineItems,
                matchingLineItem.UUID
            );
            totalQtyRequested = updateQuantity + qtyAlreadyInCart;
            minOrderQuantity = matchingLineItem.product.minOrderQuantity.value;
            canBeUpdated = (totalQtyRequested <= availableToSell || perpetual) &&
                (updateQuantity >= minOrderQuantity);
        }
    }

    if (canBeUpdated) {
        Transaction.wrap(function () {
            matchingLineItem.setQuantityValue(updateQuantity);

            var config = ZakConfigModel.get();
            var zakConf = config.zakekeConfig();
            var zakekeEnableStockTracking = zakConf.ZAKEKE_EnableStockTracking;
            if(zakekeEnableStockTracking){
                var patchProductJson =  matchingLineItem.getCustom().ZAKEKE_PatchProducts;
                if(!empty(patchProductJson)){
                    var patchProducts = JSON.parse(patchProductJson);
                    patchProducts.forEach(product => {
                        var patchProductLineItems = currentBasket.getAllProductLineItems(product.pid);
                        for (var i = 0; i < patchProductLineItems.length; i++) {
                            var patchItem = patchProductLineItems[i];
                            if(patchItem){
                                var updatedQty = matchingLineItem.quantityValue * product.qty;
                                patchItem.setQuantityValue(updatedQty);
                            }
                        }
                    });
                }
            }

            var previousBounsDiscountLineItems = collections.map(currentBasket.bonusDiscountLineItems, function (bonusDiscountLineItem) {
                return bonusDiscountLineItem.UUID;
            });

            basketCalculationHelpers.calculateTotals(currentBasket);
            if (currentBasket.bonusDiscountLineItems.length > bonusDiscountLineItemCount) {
                var prevItems = JSON.stringify(previousBounsDiscountLineItems);

                collections.forEach(currentBasket.bonusDiscountLineItems, function (bonusDiscountLineItem) {
                    if (prevItems.indexOf(bonusDiscountLineItem.UUID) < 0) {
                        bonusDiscountLineItem.custom.bonusProductLineItemUUID = matchingLineItem.UUID; // eslint-disable-line no-param-reassign
                        matchingLineItem.custom.bonusProductLineItemUUID = 'bonus';
                        matchingLineItem.custom.preOrderUUID = matchingLineItem.UUID;
                    }
                });
            }
        });
    }

    if (matchingLineItem && canBeUpdated) {
        var basketModel = new CartModel(currentBasket);
        res.json(basketModel);
    } else {
        res.setStatusCode(500);
        res.json({
            errorMessage: Resource.msg('error.cannot.update.product.quantity', 'cart', null)
        });
    }

    return next();
});


module.exports = server.exports();

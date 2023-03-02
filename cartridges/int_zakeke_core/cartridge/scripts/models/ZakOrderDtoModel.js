/**
* Module for zakeke dto order class
* @module models/ZakOrderDtoModel
*/

'use strict';

var Site = require('dw/system/Site');


/**
 * createZakekeOrderObject
 *
 * Create the instance of zakeke DTO object
 *
 * @param {dw.order.Order} order instance
 * @param {Object} exchangeRate Exchange rates of a base currency
 * @return {Array} array containing zakeke DTO order and object with the information if the orders is Zakeke customized
 *
 */
var createZakekeOrderObject = function (order, exchangeRate) {
    var arr = [];
    var isZakekeOrderObject = { isZakekeOrder: false };
    var s = {};

    var currBase = Site.current.defaultCurrency;
    var currOrder = order.currencyCode;

    s.id = order.getOrderNo();
    s.orderDate = order.getCreationDate();
    // totalNetPrice=The grand total price for LineItemCtnr net of tax, in purchase currency. Total prices represent the sum of product prices, services prices and adjustments.
    s.totalPrice = order.totalNetPrice.value;// or totalNetPrice? or totalGrossPrice?
    s.email = order.customerEmail;

    s.orderCurrencyCode = currOrder; // order currency
    s.isOrderCurrencySystem = (currOrder === currBase);
    s.exchangeRate = exchangeRate;

    s.customer = { id: order.customerNo };
    s.shipping_address = {};
    s.line_items = [];

    var productLineItems = order.getAllProductLineItems().iterator();
    while (productLineItems.hasNext()) {
        var lineNew = {};
        var productLineItem = productLineItems.next();
        var quantity = productLineItem.getQuantity().value;

        lineNew.id = productLineItem.getUUID();
        lineNew.quantity = quantity;
        lineNew.productId = productLineItem.getProductID();
        lineNew.sku = productLineItem.getProductID();
        lineNew.productName = productLineItem.getProductName();

        var composPriceNoTaxesUnit = productLineItem.getCustom().ZAKEKE_CompositionPriceNoTaxes;
        var composPriceUnit = productLineItem.getCustom().ZAKEKE_CompositionPrice;
        var composition = productLineItem.getCustom().ZAKEKE_Composition;

        // getAdjustedNetPrice() = Returns the net price of the product line item after applying all product-level adjustments.
        lineNew.amount = productLineItem.getAdjustedNetPrice() - (composPriceNoTaxesUnit * quantity);
        lineNew.rate = (lineNew.amount) / quantity; // unit rate of the product in the purchase currency (NO taxes)
        lineNew.taxRate = productLineItem.getTaxRate();

        lineNew.compositionId = '';
        lineNew.composition = '';
        lineNew.isCustomizationItem = false;
        if (!empty(productLineItem.getCustom().ZAKEKE_CompositionID)) {
            isZakekeOrderObject.isZakekeOrder = true;

            lineNew.isCustomizationItem = true;
            lineNew.compositionId = productLineItem.getCustom().ZAKEKE_CompositionID;
            lineNew.customizationType = productLineItem.getCustom().ZAKEKE_CustomizationType;
            lineNew.composition = '';
            if (composition) {
            	lineNew.composition = composition;
            }

            lineNew.customizationRate = composPriceUnit; // unit customization price in the session currency (WITH taxes)
            lineNew.customizationRateNoTaxes = composPriceNoTaxesUnit; // unit customization price in the session currency (NO taxes)
        }

        s.line_items.push(lineNew);
    }

    arr[0] = s;
    arr[1] = isZakekeOrderObject;

    return arr;
};


/**
 * Order DTO class. It's the object to send to Zakeke service to notify the order closing
 *
 * @class ZakOrderDtoModel
 * @param {dw.order.Order} order The order object to enhance/wrap.
 * @param {ZakServicesModel} services The object necessary to call the services.
 */
var ZakOrderDtoModel = function (order, services) {
    var currBase = Site.current.defaultCurrency;
    var currOrder = order.currencyCode;
    var exchangeRate = 1;

    if (currOrder !== currBase) {
        var token = services.getTokenZakekeApi();
        var exchangeRates = services.getRateExchangeApi(token, currBase);

        exchangeRate = exchangeRates[currOrder];
    }

    var arr = createZakekeOrderObject(order, exchangeRate);
    this.dto = arr[0];
    this.isZakekeOrder = arr[1].isZakekeOrder;
};


/**
 * Gets the model from order and services
 *
 * @param {dw.order.Order} order The order object to enhance/wrap.
 * @param {ZakServicesModel} services The object necessary to call the services.
 * @return {Object} object of ZakOrderDtoModel
 */
ZakOrderDtoModel.get = function (order, services) {
    if (empty(order) || empty(services)) {
        return null;
    }

    return new ZakOrderDtoModel(order, services);
};


/** The ZakService class */
module.exports = ZakOrderDtoModel;


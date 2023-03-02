/*
	MOCK of ZakPricingModel
*/
'use strict';

var ProductMgr=require('../../dw/catalog/ProductMgr');
var zakGlobal=require('../zakGlobal');


var ZakPricingModel = function (pricingOptions, product) {
    this.object = product;
    this.quantity = pricingOptions.quantity;
    this.platform = pricingOptions.platform;

    this.master = this.object;
    if (this.productType() === zakGlobal.PRODUCT_TYPES.VARIANT) {
    	this.master = this.object.getMasterProduct();
    }

    
    this.unitPrices = [
			{productID: product.ID, price: 30, selected: true, option: [{optionID: 'WHITE', valueID: 'W'}]}, 
			{productID: product.ID, price: 40, selected: true, option: [{optionID: 'BLACK', valueID: 'B'}]}
	];

    this.taxRate = TAX_RATE;
    this.taxPolicy = TAX_POLICY;// 0=GROSS, 1=NET

    this.currency = SESSION_CURR_CODE; // Session Currency CODE
    this.currencyBase = BASE_CURR_CODE; // Base Currency CODE
}

ZakPricingModel.prototype.productType = function () {
    var type = zakGlobal.PRODUCT_TYPES.NORMAL;

    if (this.object.variant) {
        type = zakGlobal.PRODUCT_TYPES.VARIANT;
    }
    return type;
};

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
   

/** The ZakService class */
module.exports = ZakPricingModel;





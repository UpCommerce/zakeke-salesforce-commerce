'use strict';

require('../../init');

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();


var ZakGlobalMock = require('../../../mocks/int_zakeke_core/zakGlobal');

var SiteMock = require('../../../mocks/dw/system/Site');
var ProductMgrMock = require('../../../mocks/dw/catalog/ProductMgr');
var TaxMgrMock = require('../../../mocks/dw/order/TaxMgr');
var MoneyMock=require('../../../mocks/dw/value/Money');
var PromotionMock = require('../../../mocks/dw/campaign/Promotion');
var PromotionMgrMock = require('../../../mocks/dw/campaign/PromotionMgr');
var QuantityMock=require('../../../mocks/dw/value/Quantity');

var priceFactoryMock={ 
	getPrice: function(){
		return {
			type: '',
			sales: {value: 30}, 
			tiers: [],
		}
	},
	
};


var ZakPricingModel = proxyquire('../../../../cartridges/int_zakeke_core/cartridge/scripts/models/ZakPricingModel', {
	'dw/system/Site' : SiteMock, 
	'dw/catalog/ProductMgr' : ProductMgrMock,
	'dw/order/TaxMgr' : TaxMgrMock,
	 '*/cartridge/scripts/zakGlobal': ZakGlobalMock, 
	 'dw/value/Money' : MoneyMock,
	 'dw/campaign/Promotion' : PromotionMock,
	 'dw/campaign/PromotionMgr' : PromotionMgrMock,
	 'dw/value/Quantity': QuantityMock,
	 '*/cartridge/scripts/factories/price': priceFactoryMock,
	
});


describe('ZakPricingModel', function () {
	
	describe('ZakPricingModel creation', function () {
		it('should return null if pricing options is null', function () {
			var result = ZakPricingModel.get();

			assert.equal(result, null);
		});
		it('should return null if productId is unknown ', function () {
			var pricingOptions={selectedProductID: UNKNOWN_PRODUCT_ID}
			var result = ZakPricingModel.get(pricingOptions);

			assert.equal(result, null);
		});
		it('should return null if productId is empty (productId="")', function () {
			var pricingOptions={selectedProductID: ''}
			var result = ZakPricingModel.get(pricingOptions);

			assert.equal(result, null);
		});
		
		
	});
	
	describe('ZakPricingModel properties', function () {
		var pricingOptions={selectedProductID: PRODUCT_ID, quantity: QUANTITY, platform: PLATFORM}
		var result = ZakPricingModel.get(pricingOptions);
		
		it('should return a pricing model relative to product with expected productID', function () {
			assert.equal(result.object.ID, PRODUCT_ID);
		});
		it('should return a pricing model with the expected quantity', function () {
			assert.equal(result.quantity, QUANTITY);
		});
		it('should return a pricing model with the expected productType', function () {
			assert.equal(result.productType(), ZakGlobalMock.PRODUCT_TYPES.VARIANT);
		});
		
		it('should return a pricing model with the expected currency', function () {
			assert.equal(result.currency, SESSION_CURR_CODE);
		});
		
		it('should return a pricing model with the expected currency base', function () {
			assert.equal(result.currencyBase, BASE_CURR_CODE);
		});
		
		it('should return a pricing model with the expected taxRate', function () {
			assert.equal(result.taxRate, TAX_RATE);
		});
		
		it('should return a pricing model with the expected taxPolicy', function () {
			assert.equal(result.taxPolicy, TAX_POLICY);//NET
		});
		
		it('should return a pricing model with the expected unit price', function () {
			//console.log(result.master);
			assert.equal(result.unitPrices[0].price, PRICE);
		});
		
	});
	
});



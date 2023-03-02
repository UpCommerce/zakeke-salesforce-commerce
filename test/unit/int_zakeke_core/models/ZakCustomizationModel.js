'use strict';

require('../../init');

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();


var ZakGlobalMock = require('../../../mocks/int_zakeke_core/zakGlobal');
var ZakServicesModelMock=require('../../../mocks/int_zakeke_core/models/ZakServicesModel');
var ZakPricingModelMock=require('../../../mocks/int_zakeke_core/models/ZakPricingModel');



var ZakCustomizationModel = proxyquire('../../../../cartridges/int_zakeke_core/cartridge/scripts/models/ZakCustomizationModel', {
	 '*/cartridge/scripts/zakGlobal': ZakGlobalMock, 
	 '*/cartridge/scripts/models/ZakServicesModel': ZakServicesModelMock,
	 '*/cartridge/scripts/models/ZakPricingModel': ZakPricingModelMock,
	
});


describe('ZakCustomizationModel', function () {
	
	describe('ZakCustomizationModel creation', function () {
		it('should return null if parameters are undefined', function () {
			var result = ZakCustomizationModel.get();

			assert.equal(result, null);
		});
		it('should return the model if parameters are present', function () {
			var productID=PRODUCT_ID, compositionID=COMPOSITION_ID, quantity=QUANTITY, customizationType=PLUGIN_TYPE, platformType=PLATFORM;
			var result = ZakCustomizationModel.get(productID, compositionID, quantity, customizationType, platformType);
			
			assert.isObject(result);
		});
		
	});
	
	describe('ZakCustomizationModel methods', function () {
		var productID=PRODUCT_ID, compositionID=COMPOSITION_ID, quantity=QUANTITY, customizationType=PLUGIN_TYPE, platformType=PLATFORM;
		var result = ZakCustomizationModel.get(productID, compositionID, quantity, customizationType, platformType);
		
		var customiz=result.customization();
		//console.log(customiz.object);
		it('should return a customiz model with expected compositionPreview', function () {
			assert.equal(customiz.compositionPreview, URL_PREVIEW);
		});
		it('should return a customiz model with expected composition price', function () {
			assert.equal(customiz.compositionUnitPrice, COMPOSITION_PRICE*QUANTITY);
			assert.equal(customiz.compositionUnitPriceNoTaxes, COMPOSITION_PRICE*QUANTITY)
		});
		
		
	});
	
});



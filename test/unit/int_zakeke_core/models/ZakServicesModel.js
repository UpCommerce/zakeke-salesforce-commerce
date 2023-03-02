'use strict';

require('../../init');

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();


var LoggerMock = require('../../../mocks/dw/system/Logger');
var HashMapMock=require('../../../mocks/dw/util/HashMap');
var ZakApiMock = require('../../../mocks/int_zakeke_core/services/ZakApi');


var ZakServicesModel = proxyquire('../../../../cartridges/int_zakeke_core/cartridge/scripts/models/ZakServicesModel', {
	'dw/system/Logger' : LoggerMock, 
	'dw/util/HashMap': HashMapMock,
	'*/cartridge/scripts/services/ZakApi' : ZakApiMock
});


describe('ZakServicesModel', function () {
	
	describe('ZakServicesModel creation', function () {
		it('should return an object', function () {
			var result = ZakServicesModel.get();
			assert.isObject(result);
		});
	});
	
	describe('ZakServicesModel model', function () {
		var result=ZakServicesModel.get();
		
		
		describe('ZakServicesModel properties', function () {
			it('model.object should return an object', function () {
				assert.isObject(result.object);
			});
		});
		
		describe('ZakServicesModel methods', function () {
			it('getTokenZakekeApi should return a token', function () {
				assert.equal(result.getTokenZakekeApi(), TOKEN);
			});
			it('getRateExchangeApi should return an object', function () {
				var obj=result.getRateExchangeApi();
				assert.isObject(obj);
			});
			
			it('getTokenZakekeApi calls API once if session is empty', function () {
				sinon.spy(result.object, "getTokenZakekeApi");
				
				session.privacy.zakekeToken='';
				
				expect(result.object.getTokenZakekeApi.notCalled).to.be.true;
				result.getTokenZakekeApi();
				result.getTokenZakekeApi();
				expect(result.object.getTokenZakekeApi.calledOnce).to.be.true;
			});
			it('getRateExchangeApi calls API once if session is empty', function () {
				sinon.spy(result.object, "getRateExchangeApi");
				
				session.privacy.rateExchangeMap='';
				session.privacy.baseCurrency='';
				
				expect(result.object.getRateExchangeApi.notCalled).to.be.true;
				result.getRateExchangeApi('', BASE_CURR_CODE);
				result.getRateExchangeApi('', BASE_CURR_CODE);
				expect(result.object.getRateExchangeApi.calledOnce).to.be.true;
			});
		});
		
	});
	
});



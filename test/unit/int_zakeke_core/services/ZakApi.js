'use strict';

require('../../init');

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();


var LoggerMock = require('../../../mocks/dw/system/Logger');
var ZakConfigModelMok=require('../../../mocks/int_zakeke_core/models/ZakConfigModel');
var ZakGlobalMock = require('../../../mocks/int_zakeke_core/zakGlobal');


var ZakApi = proxyquire('../../../../cartridges/int_zakeke_core/cartridge/scripts/services/ZakApi', {
	'dw/svc' : {}, 
	'dw/system/Logger' : LoggerMock, 
	'*/cartridge/scripts/models/ZakConfigModel': ZakConfigModelMok,
	'*/cartridge/scripts/zakGlobal' : ZakGlobalMock
});


describe('ZakApi', function () {
	
	describe('ZakApi creation', function () {
		it('should return an object', function () {
			var result = ZakApi.get();
			assert.isObject(result);
		});
	});
	
	describe('ZakApi api', function () {
		var result=ZakApi.get();
		
		describe('ZakApi properties', function () {
			it('api.config should return an object', function () {
				assert.isObject(result.config);
			});
		});
	});
	
});



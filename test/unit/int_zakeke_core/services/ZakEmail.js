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
var MailMock = require('../../../mocks/dw/net/Mail');


var ZakEmail = proxyquire('../../../../cartridges/int_zakeke_core/cartridge/scripts/services/ZakEmail', {
	'dw/system/Logger' : LoggerMock, 
	'*/cartridge/scripts/models/ZakConfigModel': ZakConfigModelMok,
	'dw/net/Mail' : MailMock
});


describe('ZakEmail', function () {
	
	describe('ZakEmail creation', function () {
		it('should return an object', function () {
			var result = ZakEmail.get();
			assert.isObject(result);
		});
	});
	
});

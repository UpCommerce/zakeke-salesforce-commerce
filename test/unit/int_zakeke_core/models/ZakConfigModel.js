'use strict';

require('../../init');

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

var SiteMock = require('../../../mocks/dw/system/Site');
var ZakGlobalMock = require('../../../mocks/int_zakeke_core/zakGlobal');


var ZakConfigModel = proxyquire('../../../../cartridges/int_zakeke_core/cartridge/scripts/models/ZakConfigModel', {
	'dw/system/Site' : SiteMock
});


describe('ZakConfigModel', function () {
	
	describe('ZakConfigModel creation', function () {
		it('should return the config model object', function () {
			var result = ZakConfigModel.get();

			assert.isObject(result);
		});
	});
	
	describe('ZakConfigModel properties', function () {
		var result = ZakConfigModel.get();
		
		it('should return the expected ZAKEKE_Enabled', function () {
			assert.equal(result.zakekeConfig().ZAKEKE_Enabled, true);
		});
		it('should return the expected ZAKEKE_Url', function () {
			assert.equal(result.zakekeConfig().ZAKEKE_Url, 'https://zakeke-netsuite.azurewebsites.net');
		});
		it('should return the expected ZAKEKE_ApiCredential', function () {
			assert.equal(result.zakekeConfig().ZAKEKE_ApiCredential, 'ZakekeAPICredentials_<SiteName>');
		});
		it('should return the expected ZAKEKE_Email_From', function () {
			assert.equal(result.zakekeConfig().ZAKEKE_Email_From, 'from@sitegenesis.com');
		});
		it('should return the expected ZAKEKE_Email_To', function () {
			assert.equal(result.zakekeConfig().ZAKEKE_Email_To, 'to@sitegenesis.com');
		});
	});
	
});



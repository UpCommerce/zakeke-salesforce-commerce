'use strict';

require('../../init');

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

var SiteMock = require('../../../mocks/dw/system/Site');
var ZakGlobalMock = require('../../../mocks/int_zakeke_core/zakGlobal');
var ZakServicesModelMock = require('../../../mocks/int_zakeke_core/models/ZakServicesModel');
var OrderMgrMock = require('../../../mocks/dw/order/OrderMgr');


var ZakOrderDtoModel = proxyquire('../../../../cartridges/int_zakeke_core/cartridge/scripts/models/ZakOrderDtoModel', {
	'dw/system/Site' : SiteMock
});


describe('ZakOrderDtoModel', function () {
	
	describe('ZakOrderDtoModel creation', function () {
		it('should return null if order and services are both null', function () {
			var result = ZakOrderDtoModel.get();
			assert.equal(result, null);
		});
		it('should return null if services is null', function () {
			var order={};
			
			var result = ZakOrderDtoModel.get(order);
			assert.equal(result, null);
			var result = ZakOrderDtoModel.get(order, null);
			assert.equal(result, null);
		});
		it('should return null if order is null', function () {
			var services={};
			
			var result = ZakOrderDtoModel.get(null, services);
			assert.equal(result, null);
		});
		it('should return an object if order && services are not empty', function () {
			var services=ZakServicesModelMock.get();
			var order=OrderMgrMock.getOrder(ORDER_ID);
			
			var result = ZakOrderDtoModel.get(order, services);
			assert.isObject(result);
		});
	});
	
	describe('ZakOrderDtoModel model (known orderId)', function () {
		var services=ZakServicesModelMock.get();
		var order=OrderMgrMock.getOrder(ORDER_ID);
		var result = ZakOrderDtoModel.get(order, services);
		
		describe('ZakOrderDtoModel properties', function () {
			it('model.dto should return an object', function () {
				assert.isObject(result.dto);
			});
			it('model.dto should return an object with expected properties', function () {
				assert.equal(result.dto.id, order.getOrderNo());
				assert.equal(result.dto.email, order.getCustomerEmail());
				assert.equal(result.dto.customer.id, order.getCustomerNo());
				assert.equal(result.dto.totalPrice, order.getTotalNetPrice().value);
				assert.equal(result.dto.orderDate, order.getCreationDate());
				
				assert.equal(result.isZakekeOrder, true);
			});
		});
	});
	
});



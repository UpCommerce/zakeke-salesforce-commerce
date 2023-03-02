'use strict';

require('../../init');

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

var OrderMgrMock = require('../../../mocks/dw/order/OrderMgr');
var TransactionMock = require('../../../mocks/dw/system/Transaction');
var ORDER_STATUS_NEW = require('../../../mocks/dw/order/Order').ORDER_STATUS_NEW;

var ZakGlobalMock = require('../../../mocks/int_zakeke_core/zakGlobal');
var ZakServicesModelMock = require('../../../mocks/int_zakeke_core/models/ZakServicesModel');
var ZakOrderNotificationModelMock = require('../../../mocks/int_zakeke_core/models/ZakOrderNotificationModel');
var ZakOrderDtoModelMock = require('../../../mocks/int_zakeke_core/models/ZakOrderDtoModel');


var spyCallbackNoteAddedToOrder=sinon.spy();
TransactionMock.wrap=spyCallbackNoteAddedToOrder;


var ZakOrderModel = proxyquire('../../../../cartridges/int_zakeke_core/cartridge/scripts/models/ZakOrderModel', {
    'dw/order/OrderMgr': OrderMgrMock,
	'dw/system/Transaction' : TransactionMock,
	
    '*/cartridge/scripts/zakGlobal': ZakGlobalMock, 
	'*/cartridge/scripts/models/ZakServicesModel': ZakServicesModelMock, 
	'*/cartridge/scripts/models/ZakOrderNotificationModel': ZakOrderNotificationModelMock, 
	'*/cartridge/scripts/models/ZakOrderDtoModel': ZakOrderDtoModelMock, 
	
});


describe('ZakOrderModel', function () {

	describe('ZakOrderModel creation', function () {
		it('should return null if orderId is not found', function () {
			var result = ZakOrderModel.get(UNKNOWN_ORDER_ID);

			assert.equal(result, null);
		});
		it('should return null if orderId is empty (orderId=undefined)', function () {
			var result = ZakOrderModel.get();

			assert.equal(result, null);
		});
		it('should return null if orderId is empty (orderId="")', function () {
			var result = ZakOrderModel.get('');

			assert.equal(result, null);
		});
		it('should return an order if orderId is present (known orderId)', function () {
			var result = ZakOrderModel.get(ORDER_ID);
			
			assert.isObject(result);
		});
	});
	
	describe('ZakOrderModel order (known orderId)', function () {
		var result = ZakOrderModel.get(ORDER_ID);
		
		describe('ZakOrderModel properties', function () {
			it('should return an order with the expected orderID', function () {
				assert.equal(result.getOrderID(), ORDER_ID);
			});
			it('should return an order with the expected status', function () {
				
				assert.equal(result.getStatus(), ORDER_STATUS_NEW);
			});
		});
			
		describe('insertZakekeNotificationRecord', function () {
			it('order.notificationRecord should return null before calling insertZakekeNotificationRecord', function () {
				assert.equal(result.notificationRecord, null);
			});
			it('order.notificationRecord should return object after calling insertZakekeNotificationRecord', function () {
				result.insertZakekeNotificationRecord();
				assert.isObject(result.notificationRecord);
			});
		});
		
		describe('insertNotesZakekeOptions', function () {
			it('insertNotesZakekeOptions has to call Transaction.wrap 1 time', function () {
				expect(spyCallbackNoteAddedToOrder.notCalled).to.be.true;
				result.insertNotesZakekeOptions();
				expect(spyCallbackNoteAddedToOrder.calledOnce).to.be.true;
			});
		});
		
	});
});



/*
	MOCK of OrderMgr
*/
'use strict';

var Order=require('./Order');

var OrderMgr = function(){};

OrderMgr.getOrder = function(orderId){
	var order=null;
	
	if(empty(orderId)){
		order=null;
	}
	else{
		if(orderId==='000000'){
			order=null;
		}
		else if(orderId==='000001'){
			order=new Order();
		}
	}
	
	return order;
};

OrderMgr.queryOrders = function(){};
OrderMgr.searchOrder = function(){};
OrderMgr.failOrder = function(){};
OrderMgr.cancelOrder = function(){};
OrderMgr.placeOrder = function(){};
OrderMgr.searchOrders = function(){};
OrderMgr.createOrder = function(){};
OrderMgr.undoFailOrder = function(){};
OrderMgr.processOrders = function(){};
OrderMgr.describeOrder = function(){};
OrderMgr.queryOrder = function(){};
OrderMgr.createShippingOrders = function(){};

OrderMgr.prototype.order=null;

module.exports = OrderMgr;
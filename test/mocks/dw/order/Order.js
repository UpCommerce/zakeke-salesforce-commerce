/*
	MOCK of Order
*/
'use strict';
 

var Collection=require('../util/Collection');

var Order = function(){
	this.orderNo='000001';
	this.creationDate='2019-09-27T10:58:23.000Z';
	this.totalNetPrice={value: 180.54, currencyCode: 'USD'};
	this.customerEmail='m.ezza@zakeke.com';
	this.customerNo=112;
	this.currencyCode='USD';
	this.productLineItems=getCollectionLineItems();
	this.status=Order.ORDER_STATUS_NEW;
	
};

Order.ORDER_STATUS_NEW=3;

Order.prototype.orderNo=null;
Order.prototype.creationDate=null;
Order.prototype.totalNetPrice=null;
Order.prototype.customerEmail=null;
Order.prototype.customerNo=null;
Order.prototype.currencyCode=null;
Order.prototype.productLineItems=null;
Order.prototype.status=null;


Order.prototype.getOrderNo=function(){
	return this.orderNo;
}
Order.prototype.getCreationDate=function(){
	return this.creationDate;
}
Order.prototype.getTotalNetPrice=function(){
	return this.totalNetPrice;
}
Order.prototype.getCustomerNo=function(){
	return this.customerNo;
}
Order.prototype.getCustomerEmail=function(){
	return this.customerEmail;
}
Order.prototype.getCurrencyCode=function(){
	return this.currencyCode;
}
Order.prototype.getAllProductLineItems=function(){
	return this.productLineItems;
}
Order.prototype.getStatus=function(){
	return this.status;
}


var getCollectionLineItems=function(){
	var list=new Collection();
	
	list.add(getLineItem(true));
	list.add(getLineItem(false));
	
	return list;
}

var getLineItem=function(isZakeke){
	let a=null;
	
	if(isZakeke===true){
		a= {
			getUUID: function(){return 'zak35662058e539363cbc88706'},
			getQuantity: function(){return {value: 1}}, 
			getProductID: function(){return 'Zakeke-tshirt-01'}, 
			getProductName: function(){return 'Zakeke-tshirt-01'}, 
			getNetPrice: function(){return 34.23}, 
			getTaxRate: function(){return 0.22}, 
			getAdjustedNetPrice: function(){return 34.23},
			getCustom: function(){return {ZAKEKE_CompositionID: 'NETSUITE_TEST-VLuRH7FetUmN0rlnbFsTvA', ZAKEKE_Composition: '[{"optionID":"TYPE","valueID":"A"}]'}}
		}
	}
	else{
		a = {
			getUUID: function(){return '35662058e539363cbc88706f5b'},
			getQuantity: function(){return {value: 1}}, 
			getProductID: function(){return '0975666'}, 
			getProductName: function(){return 'short-men'}, 
			getNetPrice: function(){return 64.23}, 
			getTaxRate: function(){return 0.22}, 
			getAdjustedNetPrice: function(){return 64.23},
			getCustom: function(){return {ZAKEKE_CompositionID: '', ZAKEKE_Composition: ''}}
		}
	}
	
	return a;
}

module.exports = Order;


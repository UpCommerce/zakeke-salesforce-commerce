/*
	MOCK of ZakOrderDtoModel
*/
'use strict';

var Site=require('../../dw/system/Site');
var ZakServicesModel=require('./ZakServicesModel');

var ZakOrderDtoModel = function(order, services){
    let currBase=Site.current.defaultCurrency;
    let currOrder=order.currencyCode;
    let exchangeRate=1;
	
    if (currOrder!=currBase){
        let token=services.getTokenZakekeApi();
        let exchangeRates=services.getRateExchangeApi(token, currBase);

        exchangeRate=exchangeRates[currOrder];
    }
    
	var arr=createZakekeOrderObject(order, exchangeRate);
	
    this.dto=arr[0];
    this.isZakekeOrder=arr[1].isZakekeOrder;
}

ZakOrderDtoModel.get=function(order, services){
    return new ZakOrderDtoModel(order, services);
}
   

var createZakekeOrderObject=function(order, exchangeRate){
	var arr = [];
    var isZakekeOrderObject = { isZakekeOrder: false };
    let s={};
	
    let currBase=Site.current.defaultCurrency;
    let currOrder=order.currencyCode;
	
    s.id=order.getOrderNo();
    s.orderDate=order.getCreationDate();
    s.totalPrice=order.totalNetPrice.value;//or totalNetPrice? or totalGrossPrice?
    s.email=order.customerEmail;
    
    s.orderCurrencyCode=currOrder; //order currency
    s.isOrderCurrencySystem=(currOrder==currBase);
    s.exchangeRate=exchangeRate;
	
    s.customer={'id': order.customerNo};
    s.shipping_address={};
    s.line_items=[];
    
    var productLineItems = order.getAllProductLineItems().iterator();
    while (productLineItems.hasNext()) {
        var lineNew={};
        var productLineItem = productLineItems.next();
 
        lineNew.id=productLineItem.getUUID();
        lineNew.quantity = productLineItem.getQuantity().value;
        lineNew.productId= productLineItem.getProductID();
        lineNew.sku= productLineItem.getProductID();
        lineNew.productName = productLineItem.getProductName();

        //getNetPrice()=Returns the net price for the line item, which is the price of the unit before applying adjustments, 
        //		in the purchase currency, excluding tax.
        lineNew.amount = productLineItem.getNetPrice()*productLineItem.getQuantity().value;
        lineNew.rate = productLineItem.getNetPrice().value;
        lineNew.taxRate = productLineItem.getTaxRate();

        lineNew.compositionId = '';
        lineNew.composition='';
        lineNew.isCustomizationItem = false;
        if (!empty(productLineItem.getCustom().ZAKEKE_CompositionID)) {
            isZakekeOrderObject.isZakekeOrder=true;
            
            lineNew.isCustomizationItem = true;
            lineNew.compositionId = productLineItem.getCustom().ZAKEKE_CompositionID;
            lineNew.composition = productLineItem.getCustom().ZAKEKE_Composition;
        }
   
        s.line_items.push(lineNew);
    }	
	
	arr[0] = s;
    arr[1] = isZakekeOrderObject;

    return arr;
}


/** The ZakService class */
module.exports = ZakOrderDtoModel;





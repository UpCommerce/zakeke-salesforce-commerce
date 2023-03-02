/*
	MOCK of ZakServicesModel
*/
'use strict';

var ZakApi=require('../services/ZakApi');

var ZakServicesModel = function(api)
{
    this.object=api;
}

ZakServicesModel.prototype.getTokenZakekeApi=function(){
	let zakekeToken=session.privacy.zakekeToken;
	
	if (empty(zakekeToken)){
		zakekeToken=this.object.getTokenZakekeApi();
		session.privacy.zakekeToken=zakekeToken;
	}
	return zakekeToken;
}

ZakServicesModel.prototype.getRateExchangeApi=function(token, base){
	var baseCurrency=session.privacy.baseCurrency;
	var rateExchangesBaseString=null;
	var exchangeRateBase=null;
	
    if (empty(baseCurrency)===false){
    	if(base===baseCurrency){
    		rateExchangesBaseString=session.privacy.rateExchangesBase;
        	if (empty(rateExchangesBaseString)===false){
        		exchangeRateBase=JSON.parse(rateExchangesBaseString);
        	}
    	}
    }
    
    if (empty(exchangeRateBase)){
        exchangeRateBase=this.object.getRateExchangeApi(token, base);
		
        session.privacy.rateExchangesBase=JSON.stringify(exchangeRateBase);
        session.privacy.baseCurrency=base;
    }
    
    return exchangeRateBase;
}

ZakServicesModel.prototype.notifyZakekeOrderClosedApi=function(zakOrderDTO){
	return this.object.notifyZakekeOrderClosedApi(zakOrderDTO);
}

ZakServicesModel.prototype.getDesignInfoApi = function (customizationType, designId, token, quantity) {
	return this.object.getDesignInfoApi(customizationType, designId, token, quantity);
};

ZakServicesModel.get = function(){
    var api=ZakApi.get();
	
    return new ZakServicesModel(api);
}


/** The ZakServicesModel class */
module.exports = ZakServicesModel;





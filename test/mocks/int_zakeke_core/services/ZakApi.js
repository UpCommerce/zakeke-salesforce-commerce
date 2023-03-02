/*
	MOCK of ZakApi
*/
'use strict';

var ZakConfigModel=require('../models/ZakConfigModel');
var zakGlobal=require('../zakGlobal');

var ZakApi = function(config){
    if (empty(config)){
        config=ZakConfigModel.get().zakekeConfig();
    }	
	
    this.config=config;
}


ZakApi.prototype.getTokenZakekeApi=function(){
    return TOKEN;
}
ZakApi.prototype.getRateExchangeApi=function(token, base){
	var exchangeString='';
	
    if(base=='USD'){
		exchangeString=EXCHANGERATES_USD;
	}
	else{
		exchangeString=EXCHANGERATES_EUR;
	}
	
	return JSON.parse(exchangeString);
}
ZakApi.prototype.notifyZakekeOrderClosedApi=function(zakOrderDTO){
    return 'true';
}

ZakApi.prototype.getDesignInfoApi = function (customizationType, designId, token, quantity) {
    var responseApi;
	
	if(customizationType===zakGlobal.CUSTOMIZATION_TYPES.CUSTOMIZER){
		responseApi={
			pricing: {modelPriceDeltaValue: 0, modelPriceDeltaPerc: 0, designPrice: COMPOSITION_PRICE*quantity, pricingModel: ''}, 
			tempPreviewUrl: URL_PREVIEW
		}
	}
	else{
		responseApi={price: COMPOSITION_PRICE*quantity, previewUrl: URL_PREVIEW} 	
	}
	
    var  dto={
		customizationType: customizationType, 
		resp: responseApi
	};
	
	return dto;
};

ZakApi.get=function(){
    return new ZakApi();
}


/** The zakApi class */
module.exports = ZakApi;





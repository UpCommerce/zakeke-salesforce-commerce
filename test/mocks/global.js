'use strict';

var getCurrency=function() {
    return {
        currencyCode: SESSION_CURR_CODE, 
		name: SESSION_CURR_NAME, 
		symbol: SESSION_CURR_SYMBOL
    }
}


var globalDW={};

globalDW.empty=function(object){
	var result=false;
	
	var type=typeof object;
	if(type==='undefined'){
		result=true;
	}
	else if(type==='object'){
		if(object===null){
			result=true;
		}
	}
	else if(type==='string'){
		if(object==''){
			result=true;
		}
	}
	
	return result;
}

globalDW.session={
	privacy: {
		baseCurrency: '',
		zakekeToken: '',
		rateExchangeMap: null
	},
	currency: getCurrency(),
    getCurrency: function(){ return getCurrency()}, 
	sessionID: '', 
	getCustomer: function(){return {anonymous: true, authenticated: false}},
}



module.exports = globalDW;
/*
	MOCK of Site
*/
'use strict';

var sitePrefs = { 
	ZAKEKE_Enabled: ZAKEKE_Enabled, 
	ZAKEKE_Url: ZAKEKE_Url,  
	ZAKEKE_ApiCredential: ZAKEKE_ApiCredential, 
	ZAKEKE_Email_From: ZAKEKE_Email_From, 
    ZAKEKE_Email_To: ZAKEKE_Email_To
};
	
var defaultCurrency = 'USD'; 

var current =
{
	defaultCurrency: defaultCurrency,
	getCustomPreferenceValue: function (attributeID) {
		return sitePrefs[attributeID];
	},
	getPreferences: function(){
		return {
			custom: sitePrefs,
			getCustom: function(){return sitePrefs}
		}
	}
};

var Site = function(){};

Site.getCurrent = function(){return current};
Site.current=current;


module.exports = Site;
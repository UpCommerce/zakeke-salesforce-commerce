/*
	MOCK of ZakConfigModel
*/
'use strict';


var ZakConfigModel = function(sitePref)
{
    this.object=sitePref;
};

ZakConfigModel.prototype.zakekeConfig=function(){
    return {
        ZAKEKE_Enabled: ZAKEKE_Enabled,
        ZAKEKE_Url: ZAKEKE_Url, 
        ZAKEKE_ApiCredential: ZAKEKE_ApiCredential, 
		ZAKEKE_Email_From: ZAKEKE_Email_From, 
        ZAKEKE_Email_To: ZAKEKE_Email_To
    }
}

ZakConfigModel.get = function () {
    let sitePrefs={};
	
    return new ZakConfigModel(sitePrefs);
};


/** The ZakConfigModel class */
module.exports = ZakConfigModel;


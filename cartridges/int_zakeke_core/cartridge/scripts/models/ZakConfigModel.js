/**
* Module for managing the configuration site preferences
*
* @module models/ZakConfigModel
*/

'use strict';


var Site = require('dw/system/Site');

/**
 * ZakConfigModel class providing custom configuration site properties.
 *
 * @class module:models/ZakConfigModel
 * @param {dw.system.SitePreferences} sitePref Preferences of the site
 */
var ZakConfigModel = function (sitePref) {
    this.object = sitePref;
};

ZakConfigModel.prototype.zakekeConfig = function () {
    return {
        ZAKEKE_Enabled: this.object.getCustom().ZAKEKE_Enabled,
        ZAKEKE_Url: this.object.getCustom().ZAKEKE_Url,
        ZAKEKE_ApiCredential: this.object.getCustom().ZAKEKE_ApiCredential,
        ZAKEKE_Email_From: this.object.getCustom().ZAKEKE_Email_From,
        ZAKEKE_Email_To: this.object.getCustom().ZAKEKE_Email_To,
        ZAKEKE_ShowPatchProduct: this.object.getCustom().ZAKEKE_ShowPatchProduct,
        ZAKEKE_EnableStockTracking: this.object.getCustom().ZAKEKE_EnableStockTracking,
    };
};


/**
 * Gets a new instance of ZakConfigModel.
 *
 * @returns {module:models/ZakConfigModel} A new ZakConfigModel instance.
 */
ZakConfigModel.get = function () {
    var currentSite = Site.getCurrent();
    var sitePrefs = currentSite.getPreferences();

    return new ZakConfigModel(sitePrefs);
};


/** The ZakConfigModel class */
module.exports = ZakConfigModel;


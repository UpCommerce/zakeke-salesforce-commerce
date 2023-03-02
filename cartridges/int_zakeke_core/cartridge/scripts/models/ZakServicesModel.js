/**
* Module for managing the API calls using the caching mechanism of WEB session
*
* @module models/ZakServicesModel
*/
'use strict';

var logger = require('dw/system/Logger').getLogger('ZAKEKE', 'ZAKEKE');
var ZakApi = require('*/cartridge/scripts/services/ZakApi');


/**
 * ZakServicesModel class constructor
 *
 * @class ZakServicesModel
 * @param {ZakApi} api Api object
 */
var ZakServicesModel = function (api) {
    this.object = api;
};

/**
 * Gets a new token from Zakeke platform. It saves it in a session variable for future use.
 *
 * @returns {string} token
 */
ZakServicesModel.prototype.getTokenZakekeApi = function () {
    var zakekeToken = session.privacy.zakekeToken;

    if (empty(zakekeToken)) {
        logger.info('ZakServicesModel.getTokenZakekeApi - Info: Token not present. Calling getTokenZakekeApi ');

        zakekeToken = this.object.getTokenZakekeApi();
        session.privacy.zakekeToken = zakekeToken;
    } else {
        logger.info('ZakServicesModel.getTokenZakekeApi - Info: Token already present. Value={0}... ', zakekeToken.slice(0, 29));
    }

    return zakekeToken;
};

/**
 * Get the rate exchanges from an external web API relating to a base currency. It saves it in a session variable for future use.
 *
 * @param {string} token Token for API
 * @param {string} base Currency code example 'USD', 'EUR'
 * @returns {string} The string representation of the json object that contains the exchange rates
 */
ZakServicesModel.prototype.getRateExchangeApi = function (token, base) {
    var baseCurrency = session.privacy.baseCurrency;
    var rateExchangesBaseString = null;
    var exchangeRateBase = null;

    if (empty(baseCurrency) === false) {
        if (base === baseCurrency) {
            rateExchangesBaseString = session.privacy.rateExchangesBase;
            if (empty(rateExchangesBaseString) === false) {
                exchangeRateBase = JSON.parse(rateExchangesBaseString);
            }
        }
    }

    if (empty(exchangeRateBase)) {
        logger.info('ZakServicesModel.getRateExchangeApi - Info: exchangeRate not present. Calling getRateExchangeApi ');
        exchangeRateBase = this.object.getRateExchangeApi(token, base);

        session.privacy.rateExchangesBase = JSON.stringify(exchangeRateBase);
        session.privacy.baseCurrency = base;
    } else {
        logger.info('ZakServicesModel.getRateExchangeApi - Info: exchangeRate already present. Base={0} Value={1}... ', base, JSON.stringify(exchangeRateBase).slice(0, 29));
    }

    // logger.info(JSON.stringify(exchangeRateBase));
    return exchangeRateBase;
};

/**
 * Calls Zakeke Web API to notify the closing of the order.
 *
 * @param {Object} zakOrderDTO=DTO zakeke object built by createZakekeOrder(..) function
 * @returns {string} The result (true)
 */
ZakServicesModel.prototype.notifyZakekeOrderClosedApi = function (zakOrderDTO) {
    return this.object.notifyZakekeOrderClosedApi(zakOrderDTO);
};

/**
 * Calls Zakeke Web API to have the DesignInfo object.
 *
 * @param {number} customizationType=1 or 2
 * @param {number} designId=The designID
 * @param {string} token=Token necessary for API
 * @param {number} quantity=quantity of the customization chosen
 *
 * @returns {Object} The result is the DesignInfo object: dto={customizationType: x, resp: x}
 * 			where
 * 				- resp={pricing: xx, tempPreviewUrl: xx} 	in CUSTOMIZATOR
 * 				- resp={price: xx, previewUrl: xx} 			in CONFIGURATOR
 */
ZakServicesModel.prototype.getDesignInfoApi = function (customizationType, designId, token, quantity) {
    return this.object.getDesignInfoApi(customizationType, designId, token, quantity);
};

/**
 * Calls Zakeke Web API to have the Patch Product object.
 *
 * @returns {Object} The result is the Patch Product object:
 */
 ZakServicesModel.prototype.getPatchProductZakekeApi = function (designId,token) {
    return this.object.getPatchProductZakekeApi(designId,token);
};


/**
 * Gets the service model object
 *
 * @returns {Object} The result is the ZakServicesModel object.
 */
ZakServicesModel.get = function () {
    var api = ZakApi.get();

return new ZakServicesModel(api);
};


/** The ZakServicesModel class */
module.exports = ZakServicesModel;


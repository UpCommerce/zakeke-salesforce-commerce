'use strict';

var svc = require('dw/svc');
var logger = require('dw/system/Logger').getLogger('ZAKEKE', 'ZAKEKE');

var zakGlobal = require('*/cartridge/scripts/zakGlobal');
var ZakConfigModel = require('*/cartridge/scripts/models/ZakConfigModel');


/**
 * Call the Zakeke service endpoint to notify the closed order.
 *
 * @param {Object} config The zakeke configuration model
 * @param {ZakOrderDtoModel} zakOrderDTO object
 * @returns {string} The result string from the service
 */
var notifyZakekeOrderClosedApi = function (config, zakOrderDTO) {
    var LocalServiceRegistry = svc.LocalServiceRegistry;
    var nameService = zakGlobal.API_SERVICES.NotifyZakekeOrderClosedServiceName;
    var nameCredential = config.ZAKEKE_ApiCredential;

    var service = LocalServiceRegistry.createService(nameService, {
        createRequest: function (svc, args) {
            svc.setCredentialID(nameCredential);
            var path = svc.getURL() + '/api/ccloud/composer/webhook/order/create';
            logger.info('zakApi before calling - URL={0} ', path);
            svc.setURL(path);
            svc.setRequestMethod('POST');
            svc.setAuthentication('BASIC');
            svc.addHeader('Accept', 'application/json');
            svc.addHeader('Content-Type', 'application/json');

            return args;
        },
        parseResponse: function (svc, client) {
            var message = client.text;
            return message;
        },
        mockCall: function () {
            return {
                statusCode: 200,
                statusMessage: 'Success',
                text: 'true'
            };
        },
        filterLogMessage: function (msg) {
        	return msg;
        }

    });

    if (service == null) {
        throw new Error('Service ' + nameService + ' is undefined.');
    }

    var res = '';
    var data = JSON.stringify(zakOrderDTO);
    res = service.call(data);
    // in case of statusCode!=200 throw Exception
    if (res.ok === false) {
        logger.error('zakApi.notifyZakekeOrderClosedApi - Err={0} - Data={1}', res.errorMessage, data);
        throw new Error('zakApi.notifyZakekeOrderClosedApi call. - Err= ' + res.msg);
    }

    return res.object;
};


/**
 * Call the Zakeke service endpoint to get all the exchangeRates of a base currency.
 *
 * @param {Object} config The zakeke configuration model
 * @param {string} token Token for the API Zakeke
 * @param {string} base The base currency code
 * @returns {Object} The json object representing all the exchangeRates of the base currency:
 * 		ex: {"AUD":1.6156,"BRL":4.2322,"CAD":1.4705, ...}
 */
var getRateExchangeApi = function (config, token, base) {
    var LocalServiceRegistry = svc.LocalServiceRegistry;
    var nameService = zakGlobal.API_SERVICES.RateExchangesServiceName;

    var nameCredential = config.ZAKEKE_ApiCredential;

    var service = LocalServiceRegistry.createService(nameService, {
        createRequest: function (svc, args) {
            svc.setCredentialID(nameCredential);
            svc.setRequestMethod('GET');

            var path = svc.getURL() + '/api/currencyExchangeRates/' + base;
            logger.info('zakApi before calling - URL={0} ', path);
            svc.setURL(path);

            var bearer = 'Bearer ' + token;
            svc.addHeader('Authorization', bearer);

            svc.setAuthentication('NONE');
            svc.addHeader('Accept', 'application/json');

            return args;
        },
        parseResponse: function (svc, client) {
            var message = client.text;
            var resp = JSON.parse(message);
            var rates = resp.rates;

            var object = {};
            rates.forEach(function (a) {
                object[a.code] = a.rate;
            });

            return object;
        },
        mockCall: function () {
            return {
                statusCode: 200,
                statusMessage: 'Success',
                text: '{"AUD":1.6156,"BRL":4.2322,"CAD":1.4705,"CHF":1.1112,"CZK":25.5994,"DKK":7.4655,"EUR":1.0000,"GBP":0.8994,"HKD":8.8147,"HUF":325.5100,"ILS":3.9955,"JPY":121.8104,"MXN":21.5625,"MYR":4.6386,"NOK":9.6432,"NZD":1.6899,"PHP":57.7939,"PLN":4.2672,"SEK":10.5759,"SGD":1.5278,"THB":34.5050,"USD":1.1274} '
            };
        },
        filterLogMessage: function (msg) {
        	return msg;
        }
    });

    if (service == null) {
        throw new Error('Service ' + nameService + ' is undefined.');
    }

    var res = '';
    res = service.call();
    // in case of statusCode!=200 throw Exception
    if (res.ok === false) {
        logger.error('zakApi.getRateExchangeApi - Err={0} ', res.errorMessage);
        throw new Error('zakApi.getRateExchange call. - Err= ' + res.msg);
    }

    return res.object;
};


/**
 * Call the Zakeke service endpoint to get the token necessary to call Zakeke API.
 *
 * @param {Object} config The zakeke configuration model
 * @returns {string} The token
 */
var getTokenZakekeApi = function (config,ignoreCustomer) {
    var LocalServiceRegistry = svc.LocalServiceRegistry;
    var nameService = zakGlobal.API_SERVICES.TokenServiceName;

    var nameCredential = config.ZAKEKE_ApiCredential;

    var customerID = '0';
    if (customer.authenticated) {
        customerID = customer.getProfile().getCustomerNo();
    }
    var sessionID = session.sessionID;

    var service = LocalServiceRegistry.createService(nameService, {
        createRequest: function (svc, args) {
            svc.setCredentialID(nameCredential);

            var path = svc.getURL() + '/token';
            logger.info('zakApi before calling - URL={0} ', path);
            svc.setURL(path);

            svc.setRequestMethod('POST');
            svc.setAuthentication('BASIC');
            svc.addHeader('Accept', 'application/json');
            svc.addHeader('Content-Type', 'application/x-www-form-urlencoded');

            return args;
        },
        parseResponse: function (svc, client) {
            var message = client.text;
            var resp = JSON.parse(message);
            var token = resp.access_token;

            return token;
        },
        mockCall: function () {
            return {
                statusCode: 200,
                statusMessage: 'Success',
                text: '{"access_token":"xxxxxxxxxx","token_type":"bearer","expires_in":86399}'
            };
        },
        filterLogMessage: function (msg) {
        	// return msg.replace(/access_token\"\:\".*?\"/, "access_token:********");
        	return msg;
        }
    });


    if (service == null) {
        throw new Error('Service ' + nameService + ' is undefined.');
    }

    var res = '';
    var data = 'grant_type=client_credentials&access_type=S2S';
   
    if(ignoreCustomer == false){
        data = 'grant_type=client_credentials&visitorcode=' + sessionID;
        if (customerID !== '0') {
            data = 'grant_type=client_credentials&customercode=' + customerID;
        }
        logger.info('zakApi.getTokenZakekeApi - data={0} ', data);
    }
    res = service.call(data);

    // in case of statusCode!=200 throw Exception
    if (res.ok === false) {
        logger.error('zakApi.getTokenZakekeApi - Err={0} ', res.errorMessage);
        throw new Error('zakApi.getTokenZakeke call. - Err= ' + res.msg);
    }

    return res.object;
};

//	Create the object CartInfoDTO using the response of the getDesignInfoApi API calling
var buildCartInfoDTO = function (resp) {
    var dto = null;

    if (resp) {
        if (resp.pricing) {
            dto = { customizationType: zakGlobal.CUSTOMIZATION_TYPES.CUSTOMIZER, resp: resp };
        } else {
            dto = { customizationType: zakGlobal.CUSTOMIZATION_TYPES.CONFIGURATOR, resp: resp };
        }
    }

    return dto;
};


/**
 * Call the Zakeke service endpoint to get the designInfo of an order
 *
 * @param {Object} config The zakeke configuration model
 * @param {int} customizationType zakGlobal.CUSTOMIZATION_TYPES.CUSTOMIZER/CONFIGURATOR
 * @param {string} designId The designId
 * @param {string} token The token to use for zakeke API
 * @param {int} quantity Quantity of the items
 *
 * @returns {Object} The CartInfoDTO object:  {customizationType: xxxxx, resp: xxxxx };
 */
var getDesignInfoApi = function (config, customizationType, designId, token, quantity) {
    var LocalServiceRegistry = svc.LocalServiceRegistry;
    var nameService = zakGlobal.API_SERVICES.DesignInfoServiceName;

    var nameCredential = config.ZAKEKE_ApiCredential;

    var service = LocalServiceRegistry.createService(nameService, {
        createRequest: function (svc, args) {
            svc.setCredentialID(nameCredential);
            svc.setRequestMethod('GET');

            var path = svc.getURL() + '/api/';
            if (customizationType === zakGlobal.CUSTOMIZATION_TYPES.CUSTOMIZER) {
            	path = path + 'designdocs/' + designId + '/cartinfo?qty=' + quantity;
            } else {
            	path = path + 'compositiondocs/' + designId + '/cartinfo?qty=' + quantity;
            }
            logger.info('zakApi before calling - URL={0} ', path);
            svc.setURL(path);

            var bearer = 'Bearer ' + token;
            svc.addHeader('Authorization', bearer);

            svc.setAuthentication('NONE');
            svc.addHeader('Accept', 'application/json');

            return args;
        },
        parseResponse: function (svc, client) {
            var message = client.text;
            var resp = JSON.parse(message);

            var resp2 = buildCartInfoDTO(resp);
            return resp2;
        },
        filterLogMessage: function (msg) {
        	return msg;
        }

    });

    if (service == null) {
        throw new Error('Service ' + nameService + ' is undefined.');
    }

    var res = '';
    res = service.call();
    // in case of statusCode!=200 throw Exception
    if (res.ok === false) {
        logger.error('zakApi.getDesignInfoApi - Err={0} ', res.errorMessage);
        throw new Error('zakApi.getDesignInfoApi call. - Err= ' + res.msg);
    }

    return res.object;
};



/**
 * Call the Zakeke service endpoint to get the patch product to call Zakeke API.
 *
 * @param {Object} config The zakeke configuration model
 * @returns {object} The patch product object
 */
 var getPatchProductZakekeApi = function (config,designId,token) {
    var LocalServiceRegistry = svc.LocalServiceRegistry;
    var nameService = zakGlobal.API_SERVICES.PatchProductServiceName;

    if(!token){
        token = getTokenZakekeApi(config,true);
    }
    var nameCredential = config.ZAKEKE_ApiCredential;
   
    var service = LocalServiceRegistry.createService(nameService, {
        createRequest: function (svc, args) {
            svc.setCredentialID(nameCredential);
            svc.setRequestMethod('GET');

            var path = svc.getURL() + '/v1/designs/' + designId + '/items';
            logger.info('zakApi before calling - URL={0} ', path);
            svc.setURL(path);

            var bearer = 'Bearer ' + token;
            svc.addHeader('Authorization', bearer);

            svc.setAuthentication('NONE');
            svc.addHeader('Accept', 'application/json');

            return args;
        },
        parseResponse: function (svc, client) {
            var message = client.text;
            var resp = JSON.parse(message);
            return message;
        },
        mockCall: function () {
            return {
                statusCode: 200,
                statusMessage: 'Success',
                variant: {
                    "sides": [
                        {
                            "areas": [
                                {
                                    "items": [
                                        {
                                           "code": "14678"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            };
        },
        filterLogMessage: function (msg) {
        	return msg;
        }
    });


    if (service == null) {
        throw new Error('Service ' + nameService + ' is undefined.');
    }

    var res = '';
    res = service.call();
    // in case of statusCode!=200 throw Exception
    if (res.ok === false) {
        logger.error('zakApi.getPatchProductZakekeApi - Err={0} ', res.errorMessage);
        throw new Error('zakApi.getPatchProductZakekeApi call. - Err= ' + res.msg);
    }

    return res.object;
};


/**
 * ZakApi class constructor
 *
 * @class ZakApi
 * @param {Object} config Zakeke config object
 */
var ZakApi = function (config) {
    if (empty(config)) {
        config = ZakConfigModel.get().zakekeConfig();
    }
    this.config = config;
};

// Prototype of getTokenZakekeApi
ZakApi.prototype.getTokenZakekeApi = function () {
    return getTokenZakekeApi(this.config,false);
};

// Prototype of getRateExchangeApi
ZakApi.prototype.getRateExchangeApi = function (token, base) {
    return getRateExchangeApi(this.config, token, base);
};

// Prototype of notifyZakekeOrderClosedApi
ZakApi.prototype.notifyZakekeOrderClosedApi = function (zakOrderDTO) {
    return notifyZakekeOrderClosedApi(this.config, zakOrderDTO);
};

// Prototype of getDesignInfoApi
ZakApi.prototype.getDesignInfoApi = function (customizationType, designId, token, quantity) {
    return getDesignInfoApi(this.config, customizationType, designId, token, quantity);
};

// Prototype of getTokenZakekeApi
ZakApi.prototype.getPatchProductZakekeApi = function (designId,token) {
    return getPatchProductZakekeApi(this.config,designId,token);
};

/**
 * Get the ZakApi.
 *
 * @returns {Object} The ZakApi model
 */
ZakApi.get = function () {
    return new ZakApi();
};


/** The zakApi class */
module.exports = ZakApi;


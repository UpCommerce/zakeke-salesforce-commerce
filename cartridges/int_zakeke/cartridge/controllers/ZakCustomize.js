/**
* Controller that renders the Zakeke page in which the Zakeke plug-in appears as an IFRAME
*
* @module  controllers/ZakCustomize
*/

'use strict';

var guard = require('*/cartridge/scripts/guard');
var ISML = require('dw/template/ISML');
var Site = require('dw/system/Site');
var logger = require('dw/system/Logger').getLogger('ZAKEKE', 'ZAKEKE');
var ProductMgr = require('dw/catalog/ProductMgr');
var Resource = require('dw/web/Resource');

var ZakConfigModel = require('*/cartridge/scripts/models/ZakConfigModel');
var ZakServicesModel = require('*/cartridge/scripts/models/ZakServicesModel');
var ZakPricingModel = require('*/cartridge/scripts/models/ZakPricingModel');

var zakGlobal = require('*/cartridge/scripts/zakGlobal');
var zakGlobalSite = require('*/cartridge/scripts/zakGlobalSite');


/**
 * Get the options of selected product=selected variant
 * @function getOptionsProduct
 *
 * @param {dw.catalog.Product} product variation
 * @returns {Object}
 **/
var getOptionsProduct = function (product) {
    var varModel = product.variationModel;
    var varAttributes = varModel.getProductVariationAttributes().toArray();

    var opt = varAttributes.map(function (p) {
        var varValues = varModel.getSelectedValue(p);

        return [
            { id: p.ID, label: p.displayName, isGlobal: true,	zakekePlatform: true },
            { id: varValues.value, label: varValues.displayValue, zakekePlatform: true }
        ];
    });

    return opt;
};

var errGotoTemplateError = function (pidSelected) {
    ISML.renderTemplate('zakCustomizeError',
        {
            errorMsg: Resource.msg('zakCustomizeError.msgErr', 'zakeke', null),
            pidSelected: pidSelected
        }
    );
};


/**
* show: Render customize page calling the zakCustomize.isml template.
* 		In case of error renders the zakCustomizeError.isml page template
*
*/
var show = function () {
    var req = request;

    var pidSelected = req.httpParameterMap.pidSelected.stringValue;
    var pidMaster = req.httpParameterMap.pidMaster.stringValue;
    var token = req.httpParameterMap.token.stringValue;
    var quantity = req.httpParameterMap.quantity.intValue;

    if (empty(pidSelected)) {
        logger.error('zakCustomize controller: selected product NOT specified');
        errGotoTemplateError(pidSelected);
        return;
    }
    if (empty(pidMaster)) {
        logger.error('zakCustomize controller: master product NOT specified');
        errGotoTemplateError(pidSelected);
        return;
    }
    if (empty(token)) {
        logger.error('zakCustomize controller: token NOT specified');
        errGotoTemplateError(pidSelected);
        return;
    }
    if (empty(quantity)) {
        logger.error('zakCustomize controller: quantity NOT specified');
        errGotoTemplateError(pidSelected);
        return;
    }

    var config = ZakConfigModel.get();
    var zakConf = config.zakekeConfig();
    var zakekeUrl = zakConf.ZAKEKE_Url;

    var customer = session.getCustomer();
    var customerID = '0';
    if (customer.authenticated) {
        customerID = customer.getProfile().getCustomerNo();
    }

    var currency = session.getCurrency();
    var currencyBase = Site.current.defaultCurrency;
    var locale = request.locale;
    if (locale.toLowerCase() === 'default') {
    	locale = Site.current.defaultLocale;
    }

    var productSel = ProductMgr.getProduct(pidSelected);
    var enabled = !productSel.optionProduct && !productSel.bundle && !productSel.master && (productSel.product || productSel.variant);
    if (!enabled) {
        logger.error('zakCustomize controller: selected product NOT valid');
        errGotoTemplateError(pidSelected);
        return;
    }
    var productName = productSel.name;

    // Options of variation selected
    var productVariantOptions = getOptionsProduct(productSel);
    var productVariantOptionsString = JSON.stringify(productVariantOptions);

    // Product master
    var productMaster = ProductMgr.getProduct(pidMaster);

    // Zakeke product options
    var isCustomizable = productMaster.custom.ZAKEKE_is_customizable;
    var customizationType = productMaster.custom.ZAKEKE_type.value;
    if (isCustomizable !== true) {
    	logger.error('zakCustomize controller: master product NOT customizable');
    	errGotoTemplateError(pidSelected);
        return;
    }
    if (customizationType !== zakGlobal.CUSTOMIZATION_TYPES.CUSTOMIZER && customizationType !== zakGlobal.CUSTOMIZATION_TYPES.CONFIGURATOR) {
    	logger.error('zakCustomize controller: master product with ZAKEKE_type not valid');
    	errGotoTemplateError(pidSelected);
        return;
    }


    // Prices
    var pricingOptions = { selectedProductID: pidSelected, quantity: quantity, platform: zakGlobalSite.PLATFORM_USED };
    var pricingProduct = ZakPricingModel.get(pricingOptions);
    var unitPrices = pricingProduct.unitPrices;
    var unitPricesString = JSON.stringify(unitPrices);

    // Taxation
    var taxPolicy = pricingProduct.taxPolicy;
    var taxRate = pricingProduct.taxRate;

    // Exchange rates
    var exchangeRates = null;
    var services = ZakServicesModel.get();
    try {
        exchangeRates = services.getRateExchangeApi(token, currencyBase);
    } catch (e) {
        logger.error('zakCustomize controller: error during ZakServicesModel call - Exception: {0}', e.message);
    }

    if (empty(exchangeRates)) {
    	errGotoTemplateError(pidSelected);
        return;
    }

    var templateNameCustomize = 'zakCustomize';
    if (customizationType === zakGlobal.CUSTOMIZATION_TYPES.CUSTOMIZER) {
    	templateNameCustomize = 'zakCustomizeCustomizer';
    }

    var exchangeRatesString = JSON.stringify(exchangeRates);
    ISML.renderTemplate(
    	templateNameCustomize,
        {
            productName: productName,
            pidSelected: pidSelected,
            pidMaster: pidMaster,
            token: token,
            zakekeUrl: zakekeUrl,
            customerID: customerID,
            visitorcode: session.sessionID,
            currency: currency,
            currencyBase: currencyBase,
            locale: locale,
            productVariantOptions: productVariantOptionsString,
            quantity: quantity,
            unitPrices: unitPricesString,
            taxRate: taxRate,
            taxPolicy: taxPolicy,
            exchangeRates: exchangeRatesString
        }
    );
};


exports.Show = guard.ensure(['get', 'https'], show);


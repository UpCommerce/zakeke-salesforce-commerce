/**
* This controller renders the 'Customize' button in the PDP page
*
* @module  controllers/zakProductCustomize
*/
'use strict';

var guard = require('*/cartridge/scripts/guard');
var ISML = require('dw/template/ISML');
var logger = require('dw/system/Logger').getLogger('ZAKEKE', 'ZAKEKE');
var ProductMgr = require('dw/catalog/ProductMgr');
var URLUtils = require('dw/web/URLUtils');

var ZakConfigModel = require('*/cartridge/scripts/models/ZakConfigModel');
var ZakServicesModel = require('*/cartridge/scripts/models/ZakServicesModel');
var zakGlobal = require('*/cartridge/scripts/zakGlobal');


/**
* show: Render the customize button calling the zakButtonCustomize.isml template
*
*/
var show = function () {
    var req = request;
    var pid = req.httpParameterMap.pid.stringValue;
    // (enabled)=${(pdict.isProductAvailable && !pdict.Product.bundle && !pdict.Product.optionProduct && !pdict.Product.master && (pdict.Product.product || pdict.Product.variant))}
    var enabled = req.httpParameterMap.enabled.booleanValue;


    if (empty(pid) === true) {
        logger.error('zakButtonCustomize.show - Error: productID is empty');
        return;
    }
    if (enabled !== true) {
        return;
    }

    var config = ZakConfigModel.get();
    var zakConf = config.zakekeConfig();
    var zakekeEnabled = zakConf.ZAKEKE_Enabled;
    if (zakekeEnabled !== true) {
        logger.warn('zakButtonCustomize.show - Warn: zakekeEnabled={0} ', zakekeEnabled);
        return;
    }

    // If I'm here, I'm a variant product or a simple product
    var productSel = ProductMgr.getProduct(pid);
    var product = (productSel.variant === true) ? productSel.masterProduct : productSel;
    var isCustomizable = product.custom.ZAKEKE_is_customizable;
    if (isCustomizable !== true) {
        logger.info('zakButtonCustomize.show - Product {0} not customizable', pid);
        return;
    }

    var customizationType = product.custom.ZAKEKE_type.value;
    if (customizationType !== zakGlobal.CUSTOMIZATION_TYPES.CUSTOMIZER && customizationType !== zakGlobal.CUSTOMIZATION_TYPES.CONFIGURATOR) {
        logger.info('zakButtonCustomize.show - Product {0} not customizable, ZAKEKE_type not valid', pid);
        return;
    }


    var url = '#';
    var disabledAttr = '';
    var token = '';
    var services = ZakServicesModel.get();
    try {
        token = services.getTokenZakekeApi();
    } catch (e) {
        logger.error('zakButtonCustomize.show - Error:{0}', e.message);
        token = '';
    }

    if (token === '') {
        logger.error('zakButtonCustomize.show - Token empty');
        disabledAttr = ' disabled="disabled"';
    } else {
        url = URLUtils.url('ZakCustomize-Show', 'pidSelected', productSel.ID, 'token', token, 'pidMaster', product.ID);
    }

    // Se pidSelected=pidMaster => product type= PRODUCT else MASTER/VARIATIONS
    ISML.renderTemplate(
        'zakButtonCustomize',
        {
            pidSelected: productSel.ID,
            pidMaster: product.ID,
            disabledAttr: disabledAttr,
            url: url
        }
    );
};


exports.Show = guard.ensure(['get', 'https'], show);


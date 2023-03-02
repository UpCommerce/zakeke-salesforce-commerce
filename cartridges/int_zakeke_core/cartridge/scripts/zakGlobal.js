/**
* global module with APP constants
*
* @module cartridge/scripts/zakGlobal
*/

'use strict';


/** Notification status values of custom object zakOrderNotifications **/
exports.NOTIFICATION_STATUS = {
    ADDED: 'ADDED',
    OK: 'OK',
    ERR: 'ERR'
};

/** External Api urls **/
exports.API_SERVICES = {
    TokenServiceName: 'int_zakeke.http.auth.getToken',
    RateExchangesServiceName: 'int_zakeke.http.getRateExchanges',
    NotifyZakekeOrderClosedServiceName: 'int_zakeke.http.notifyZakekeOrderClosed',
    DesignInfoServiceName: 'int_zakeke.http.getDesignInfo',
    PatchProductServiceName: 'int_zakeke.http.getPatchProducts'
};

/** Type of customizator **/
exports.CUSTOMIZATION_TYPES = {
    CUSTOMIZER: 1,
    CONFIGURATOR: 2
};


/** Type of product to customize **/
exports.PRODUCT_TYPES = {
    NORMAL: 1,
    VARIANT: 2
};


/** Type of platform **/
exports.PLATFORM_TYPES = {
    SITEGENESIS: 1,
    SFRA: 2
};


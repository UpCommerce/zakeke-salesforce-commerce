/**
* zakGlobalMock
*/

'use strict';

/** Notification status values of custom object zakOrderNotifications **/
exports.NOTIFICATION_STATUS={
    ADDED: 'ADDED', 
    OK: 'OK',
    ERR: 'ERR'
}

/** External Api urls **/
exports.API_SERVICES={
    TokenServiceName: 'int_zakeke.http.auth.getToken', 
    RateExchangesServiceName: 'int_zakeke.http.getRateExchanges', 
    NotifyZakekeOrderClosedServiceName: 'int_zakeke.http.notifyZakekeOrderClosed', 
}

exports.PRODUCT_TYPES={
	NORMAL: 1, 
	VARIANT: 2
}

exports.CUSTOMIZATION_TYPES = {
    CUSTOMIZER: 1,
    CONFIGURATOR: 2
}

exports.PLATFORM_TYPES = {
    SITEGENESIS: 1,
    SFRA: 2
}

exports.PLATFORM_USED = PLATFORM;






//ONLY SFRA PLATFORM
'use strict';

var getConfig = require('@tridnguyen/config');

global.baseUrl='zakeke01-tech-prtnr-eu04-dw.demandware.net';
global.customizationType=1; //CUSTOMIZATOR=1 - CONFIGURATOR=2

if(global.customizationType===1){
	global.customizableMasterProductID='zakeke2';
	global.customizableProductID='zakeke2-1';
}
else{
	global.customizableMasterProductID='Zakeke-shoes-M';
	global.customizableProductID='Zakeke-shoes-M-1';
}


var opts = Object.assign({}, getConfig({
	isZakekeEnabled: true,
	baseUrl: 'https://' + global.baseUrl, 
    baseUrlComplete: 'https://' + global.baseUrl + '/on/demandware.store/Sites-RefArch-Site/en_US',
    locale: 'en_US', 
	customizableMasterProductID: global.customizableMasterProductID, 
	customizableProductID: global.customizableProductID,
	notCustomizableProductID: '008884303989M',
	bogusProductID: 'xxxxxxxxxxxxx', 
	customizationType: global.customizationType 
}, 'config.json'));

module.exports = opts;
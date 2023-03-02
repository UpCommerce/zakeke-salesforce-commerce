'use strict';

global.SESSION_CURR_CODE='USD';
global.SESSION_CURR_NAME='DOLLAR';
global.SESSION_CURR_SYMBOL='$';

global.BASE_CURR_CODE='USD'; //default currency del sito

global.ORDER_ID='000001';
global.UNKNOWN_ORDER_ID='XXXXXX';

global.PRODUCT_ID='zakeke2-1';
global.PRODUCT_ID_MASTER='zakeke2';
global.UNKNOWN_PRODUCT_ID='XXXXXX';

global.TOKEN='--B9N8OvAK0sOazkkeMYAoCFjGnQZXj--0';
global.EXCHANGERATES_EUR='{"AUD":1.6156,"BRL":4.2322,"CAD":1.4705,"CHF":1.1112,"CZK":25.5994,"DKK":7.4655,"EUR":1.1800,"GBP":0.8994,"HKD":8.8147,"HUF":325.5100,"ILS":3.9955,"JPY":121.8104,"MXN":21.5625,"MYR":4.6386,"NOK":9.6432,"NZD":1.6899,"PHP":57.7939,"PLN":4.2672,"SEK":10.5759,"SGD":1.5278,"THB":34.5050,"USD":1.1274}';
global.EXCHANGERATES_USD='{"AUD":1.6156,"BRL":4.2322,"CAD":1.4705,"CHF":1.1112,"CZK":25.5994,"DKK":7.4655,"EUR":1.0000,"GBP":0.8994,"HKD":8.8147,"HUF":325.5100,"ILS":3.9955,"JPY":121.8104,"MXN":21.5625,"MYR":4.6386,"NOK":9.6432,"NZD":1.6899,"PHP":57.7939,"PLN":4.2672,"SEK":10.5759,"SGD":1.5278,"THB":34.5050,"USD":1}';

global.ZAKEKE_Enabled=true;
global.ZAKEKE_Url='https://zakeke-netsuite.azurewebsites.net';
global.ZAKEKE_ApiCredential='ZakekeAPICredentials_<SiteName>';
global.ZAKEKE_Email_From='from@sitegenesis.com';
global.ZAKEKE_Email_To='to@sitegenesis.com';

var emptyMock=require('../mocks/global').empty;
var sessionMock=require('../mocks/global').session;

global.empty = emptyMock; 
global.session = sessionMock; 

global.PLATFORM=2; //  SITEGENESIS=1 - SFRA=2
global.PLUGIN_TYPE=1; // CUSTOMIZER=1 - CONFIGURATOR=2

global.TAX_POLICY=1;//NET
global.TAX_RATE=0.05;//TAX rate

global.COMPOSITION_ID='0000-0000-00000';
global.URL_PREVIEW='https//xxxxxxxxxx';
global.COMPOSITION_PRICE=3;
global.QUANTITY=1;
global.PRICE=30;


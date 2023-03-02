var assert = require('chai').assert;
var request = require('request-promise');
var config = require('../it.config');
var chai = require('chai');
var chaiSubset = require('chai-subset');
var cheerio = require('cheerio');

chai.use(chaiSubset);

describe('ZakCustomize controller: Show method', function () {
    this.timeout(10000);
	
	it('should render error page if querystring parameters are not specified', function () {
		var cookieJar = request.jar();
		var myRequest = {
			url: config.baseUrlComplete + '/ZakCustomize-Show',
			method: 'GET',
			rejectUnauthorized: false,
			resolveWithFullResponse: true,
			jar: cookieJar,
			transform: function (body) {
				return cheerio.load(body);
			}
		};
	
		return request(myRequest)
			.then(function ($) {
				var divErr=$('.div-error');
				assert.isObject(divErr);
			})
			
	});
	
	it('should render HTML Zakeke page with an iframe', function () {
		var cookieJar = request.jar();
		var myRequest = {
			url: config.baseUrlComplete + '/ZakButtonCustomize-Show?pid='+config.customizableProductID,
			method: 'GET',
			rejectUnauthorized: false,
			resolveWithFullResponse: true,
			jar: cookieJar,
			transform: function (body) {
				return cheerio.load(body);
			}
		};

		var urlZakeke='';
		var firstIndex=0;
		var	finalIndex=0;
		
		return request(myRequest)
			.then(function ($) {
				urlZakeke=$('#zak-button').attr('url-data');
				
				//console.log('urlZakeke'+urlZakeke);
				
				var myRequest1 = {
					url: config.baseUrl + urlZakeke+ '&quantity=1',
					method: 'GET',
					rejectUnauthorized: false,
					resolveWithFullResponse: true,
					jar: cookieJar,
					transform: function (body) {
						return cheerio.load(body);
					}
				};
				
				return request(myRequest1)
					.then(function ($) {
						var zakekeFrame=$('#zakeke-composer-frame');
						var zakekeContainer=$('#zakeke-container');
						
						//console.log('zakekeFrame'+zakekeFrame);
						//console.log('zakekeContainer'+zakekeContainer);
						
						if(global.customizationType===2){
							assert.isObject(zakekeFrame);
						}
						if(global.customizationType===1){
							assert.isObject(zakekeFrame);
							assert.isObject(zakekeContainer);
						}
						
				});
		});
		
	});    
        
});
var assert = require('chai').assert;
var request = require('request-promise');
var config = require('../it.config');
var chai = require('chai');
var chaiSubset = require('chai-subset');
var cheerio = require('cheerio');

chai.use(chaiSubset);

describe('ZakButtonCustomize controller: Show method', function () {
    this.timeout(10000);

	it('should render nothing if pid is null', function () {
		var cookieJar = request.jar();
		var myRequest = {
			url: config.baseUrlComplete + '/ZakButtonCustomize-Show',
			method: 'GET',
			rejectUnauthorized: false,
			resolveWithFullResponse: true,
			jar: cookieJar,
		};

		return request(myRequest)
			.then(function (response) {
				assert.equal(response.statusCode, 200);
				assert.equal(response.body, '');
			});
	});
	
	it('should render nothing if pid is not a customizable product', function () {
		var cookieJar = request.jar();
		var myRequest = {
			url: config.baseUrlComplete + '/ZakButtonCustomize-Show?pid='+config.notCustomizableProductID,
			method: 'GET',
			rejectUnauthorized: false,
			resolveWithFullResponse: true,
			jar: cookieJar,
		};

		return request(myRequest)
			.then(function (response) {
				assert.equal(response.statusCode, 200);
				assert.equal(response.body, '');
			})
	});
	
	it('should render nothing if pid is bogus', function () {
		var cookieJar = request.jar();
		var myRequest = {
			url: config.baseUrlComplete + '/ZakButtonCustomize-Show?pid='+config.bogusProductID,
			method: 'GET',
			rejectUnauthorized: false,
			resolveWithFullResponse: true,
			jar: cookieJar,
		};

		return request(myRequest)
			.then(function (response) {
				assert.equal(response.statusCode, 200);
				assert.equal(response.body, '');
			})
	});
	
	it('should render HTML button if pid is a customizable product', function () {
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

		return request(myRequest)
			.then(function ($) {
				var buttonAttr=$('#zak-button').attr('url-data');
				
				assert.notEqual(buttonAttr, '');
			});
	});    
        
});
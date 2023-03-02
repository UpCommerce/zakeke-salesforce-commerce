var assert = require('chai').assert;
var request = require('request-promise');
var config = require('../it.config');
var chai = require('chai');
var chaiSubset = require('chai-subset');
var cheerio = require('cheerio');

chai.use(chaiSubset);

describe('Product controller: extension of Show method to add pdict.zakeke object {isZakekeEnabled: '+config.isZakekeEnabled+'}', function () {
    this.timeout(10000);
	
	var itDescription='';
	if(config.isZakekeEnabled===true){
		itDescription='isZakekeEnabled=TRUE => should render an html page with zakUrl input';
	}
	else{
		itDescription='isZakekeEnabled=FALSE => shouldn t render an html page with zakUrl input';
	}
	
	it(itDescription, function () {
		var cookieJar = request.jar();
		var myRequest = {
			url: config.baseUrlComplete + '/Product-Show?pid='+config.customizableMasterProductID,
			method: 'GET',
			rejectUnauthorized: false,
			resolveWithFullResponse: true,
			jar: cookieJar,
			transform: function (body) {
				return cheerio.load(body);
			}
		};
		
		//console.log('myRequest.url'+myRequest.url);

		return request(myRequest)
			.then(function ($) {
				var zakekeFrame=$('#zakUrl');
				if(config.isZakekeEnabled===true){
					assert.isObject(zakekeFrame, 'If isZakekeEnabled=true then zakUrl input EXISTS');
				}
				else{
					assert.isNotObject(zakekeFrame, 'If isZakekeEnabled=false then zakUrl input DOESN\'T EXIST');
				}
		});
		
	});
        
});
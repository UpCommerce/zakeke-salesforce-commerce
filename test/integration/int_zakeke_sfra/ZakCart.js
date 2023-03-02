var assert = require('chai').assert;
var request = require('request-promise');
var config = require('../it.config');
var chai = require('chai');
var chaiSubset = require('chai-subset');

chai.use(chaiSubset);

describe('ZakCart controller: Show method', function () {
    this.timeout(10000);
	
	it('should add a productLineItem in the cart with custom zakeke line item fields', function () {
		var cookieJar = request.jar();
		var myRequest = {
			url: config.baseUrlComplete + '/ZakCart-Show',
			method: 'POST',
			body: {
				"productID": config.customizableProductID,
				"quantity": 1,
				"compositionPrice": 1,
				"compositionID": "NETSUITE_TEST-FFKDawPH60m20H0ZyojWZg",
				"customizationType": config.customizationType, 
				"compositionPreview": "https://zakekedev.blob.core.windows.net/files/images/composition/previews/2019/10/25/af3c9066dfa14b3cb84d914d616f754f.png",
				"zakOptions": [{"optionID":"COLOR","valueID":"W"}]
			},
			json: true // Automatically stringifies the body to JSON
		};

		return request(myRequest)
			.then(function (parsedBody) {
				assert.equal(parsedBody.status, 'OK');
				assert.equal(parsedBody.message, '');
		});
			
	});
        
});
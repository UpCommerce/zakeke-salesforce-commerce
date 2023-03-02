'use strict';

require('../../../../init');

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();


describe('zakeke productLineItem decorator', function () {
    var zakekeProductLineItemDecorator = require('../../../../../../cartridges/int_zakeke_sfra/cartridge/models/productLineItem/decorators/zakekeProductLineItemDecorator');

	var product = {};
	var apiProductMock = {};
	var options={
		lineItem: {
			getCustom: function(){
				return {
					ZAKEKE_CompositionID: '', ZAKEKE_CompositionPreview: '', 
					ZAKEKE_CompositionPrice: '', ZAKEKE_Composition: ''
				}
			}
		}
	};
	
	zakekeProductLineItemDecorator(product, apiProductMock, options);
	
    it('should create a property on the passed in object called ZAKEKE_CompositionID', function () {
        assert.property(product, 'ZAKEKE_CompositionID');
    });
	it('should create a property on the passed in object called ZAKEKE_CompositionPreview', function () {
        assert.property(product, 'ZAKEKE_CompositionPreview');
    });
	it('should create a property on the passed in object called ZAKEKE_CompositionPrice', function () {
        assert.property(product, 'ZAKEKE_CompositionPrice');
    });
	it('should create a property on the passed in object called ZAKEKE_Composition', function () {
        assert.property(product, 'ZAKEKE_Composition');
    });

});
'use strict';

require('../../../../init');

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

describe('zakeke product decorator', function () {
    var zakekeProductDecorator = require('../../../../../../cartridges/int_zakeke_sfra/cartridge/models/product/decorators/zakekeProductDecorator');

    it('should create a property on the passed in object called ZAKEKE_is_customizable', function () {
        var product = {};
        var apiProductMock = {
            getCustom: function(){
				return {ZAKEKE_is_customizable: true}
			}
        };
		var options={};
		
        zakekeProductDecorator(product, apiProductMock, options);
        assert.property(product, 'ZAKEKE_is_customizable');
    });

});
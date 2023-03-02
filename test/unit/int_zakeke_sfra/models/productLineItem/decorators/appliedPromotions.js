'use strict';

require('../../../../init');

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

var collectionsMock=require('../../../../../mocks/app_storefront_base/util/collections');


describe('applied promotions decorator for productLineItem', function () {
    var appliedPromotionsDecorator = proxyquire('../../../../../../cartridges/int_zakeke_sfra/cartridge/models/productLineItem/decorators/appliedPromotions', {
		'*/cartridge/scripts/util/collections': collectionsMock
	});

	var product = {};
	var priceAdjustmentsMock=[
		{
			promotion: null, 
			promotionID: 'promotionID'
		}
	];
	priceAdjustmentsMock.getLength=function(){return 1};
	
	var lineItemMock = {
		priceAdjustments: priceAdjustmentsMock
	};
	
	
	appliedPromotionsDecorator(product, lineItemMock);
	
    it('should create a property on the passed in object called appliedPromotions', function () {
        assert.property(product, 'appliedPromotions');
    });
	
	it('should have the property appliedPromotions with property name', function () {
        assert.property(product.appliedPromotions[0], 'name');
    });
	it('should have the property appliedPromotions with property callOutMsg', function () {
        assert.property(product.appliedPromotions[0], 'callOutMsg');
    });
	it('should have the property appliedPromotions with property details', function () {
        assert.property(product.appliedPromotions[0], 'details');
    });
	it('should have the property appliedPromotions with property promotionID', function () {
        assert.property(product.appliedPromotions[0], 'promotionID');
    });

});
/*
	MOCK of ProductMgr
*/
'use strict';

var Product=require('./Product');
var ProductPriceModel=require('./ProductPriceModel');

var ProductMgr = function(){};

ProductMgr.getProduct = function(productId){
	var product=null;
	
	if(empty(productId)){
		product=null;
	}
	else{
		if(productId===UNKNOWN_PRODUCT_ID){
			product=null;
		}
		else if(productId===PRODUCT_ID){
			product=getProduct();
		}
	}
	
	return product;
};

ProductMgr.queryOrders = function(){};

//---------------------------------------
var Collection=require('../util/Collection');
var Money=require('../value/Money');

var getProductPriceModel=function(){
	var priceModel=new ProductPriceModel();
	priceModel.price=new Money(PRICE, SESSION_CURR_CODE);
	
	return priceModel;
}

function getProduct(){
	var product=new Product();
	var master=new Product();
	
	product.ID=PRODUCT_ID;
	product.variants=new Collection();
	product.variant=true;
	product.master=false;
	product.priceModel=getProductPriceModel();
	product.variationModel=getVariationModel();
	
	
	var variantsMaster=new Collection([product]);
	
	master.ID=PRODUCT_ID_MASTER;
	master.variant=false;
	master.master=true;
	master.variants=variantsMaster;
	master.priceModel=getProductPriceModel();
	
	product.master=master;
	
	return product;
}

function getVariationModel()
{
	var variationModel={
		getProductVariationAttributes: function(){
			var variat={attributeID: 'color', displayName: 'color', ID: 'color'}
			
			return new Collection([variat]);
		},
		
		getSelectedValue: function(attribute){
			return {description: 'Black', displayValue: 'Black', ID: 'B', value: 'B'}
		}
	};
	
	return variationModel;
}


module.exports = ProductMgr;
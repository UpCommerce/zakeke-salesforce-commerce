/*
	MOCK of Product
*/
'use strict';
 

var _super = require('../object/ExtensibleObject');

var Product = function(){
	
};

Product.prototype = new _super();
Product.prototype.getName = function() {};
Product.prototype.getID = function(){
	return this.ID;
};
Product.prototype.getVariants = function(){};
Product.prototype.__id = function(){};

Product.prototype.getImage = function(){
	return new require('../content/MediaFile');	
};

Product.prototype.getMasterProduct=function(){
	return this.master;
}

Product.prototype.getShortDescription = function(){};
Product.prototype.getThumbnail = function(){};
Product.prototype.isOnline = function(){};
Product.prototype.getOnlineFlag = function(){};
Product.prototype.getOnlineFrom = function(){};
Product.prototype.getOnlineTo = function(){};
Product.prototype.getCategoryAssignments = function(){};
Product.prototype.getSearchPlacement = function(){};
Product.prototype.getSearchRank = function(){};
Product.prototype.getSiteMapChangeFrequency = function(){};
Product.prototype.getSiteMapPriority = function(){};
Product.prototype.getPageTitle = function(){};
Product.prototype.getPageDescription = function(){};
Product.prototype.getPageKeywords = function(){};
Product.prototype.getPageURL = function(){};
Product.prototype.getRecommendations = function(){};
Product.prototype.getTemplate = function(){};
Product.prototype.getAllCategories = function(){};
Product.prototype.assignedToCategory = function(){};
Product.prototype.getCategories = function(){};
Product.prototype.getLongDescription = function(){};
Product.prototype.isAssignedToCategory = function(){};
Product.prototype.getOnlineCategories = function(){};
Product.prototype.getAllCategoryAssignments = function(){};
Product.prototype.getCategoryAssignment = function(){};
Product.prototype.getPrimaryCategoryAssignment = function(){};
Product.prototype.getPrimaryCategory = function(){};
Product.prototype.getProductSetProducts = function(){};
Product.prototype.getProductSets = function(){};
Product.prototype.isProductSet = function(){};
Product.prototype.isProductSetProduct = function(){};
Product.prototype.isProduct = function(){};
Product.prototype.isSiteProduct = function(){};
Product.prototype.isAssignedToSiteCatalog = function(){};
Product.prototype.isCategorized = function(){};
Product.prototype.isRetailSet = function(){};
Product.prototype.isSearchable = function(){};
Product.prototype.getSearchableFlag = function(){};
Product.prototype.setSearchableFlag_1 = function(){};
Product.prototype.setSearchableFlag_2 = function(){};
Product.prototype.setSearchPlacement_1 = function(){};
Product.prototype.setSearchPlacement_2 = function(){};
Product.prototype.setSearchRank_1 = function(){};
Product.prototype.setSearchRank_2 = function(){};
Product.prototype.getEAN = function(){};
Product.prototype.getUPC = function(){};
Product.prototype.getBrand = function() {};
Product.prototype.isOptionProduct = function(){};
Product.prototype.getOptionModel = function(){};
Product.prototype.isMaster = function(){};
Product.prototype.isBundle = function(){};
Product.prototype.isBundled = function(){};
Product.prototype.isVariant = function(){};
Product.prototype.isVariationGroup = function(){};
Product.prototype.includedInBundle = function(){};
Product.prototype.getBundledProductQuantity = function(){};
Product.prototype.getBundledProducts = function(){};
Product.prototype.getBundles = function(){};
Product.prototype.getMinOrderQuantity = function(){};
Product.prototype.getStepQuantity = function(){};
Product.prototype.getClassificationCategory = function(){};
Product.prototype.getManufacturerName = function(){};
Product.prototype.getManufacturerSKU = function(){};
Product.prototype.setOnlineFlag_1 = function(){};
Product.prototype.setOnlineFlag_2 = function(){};
Product.prototype.getUnit = function(){};
Product.prototype.getTaxClassID = function(){};
Product.prototype.isAvailable = function(){};
Product.prototype.getAvailableFlag = function(){};
Product.prototype.setAvailableFlag = function(){};
Product.prototype.getPriceModel = function(){
	return this.priceModel;
};
Product.prototype.getVariationModel = function(){};
Product.prototype.getProductLinks = function(){};
Product.prototype.getIncomingProductLinks = function(){};
Product.prototype.getAllProductLinks = function(){};
Product.prototype.getAllIncomingProductLinks = function(){};
Product.prototype.getAttributeModel = function(){};
Product.prototype.getImages = function(){};
Product.prototype.getOrderableRecommendations = function(){};
Product.prototype.getAvailabilityModel = function(){};
Product.prototype.getAllRecommendations = function(){};
Product.prototype.getActiveData = function(){};

Product.prototype.name=null;
Product.prototype.ID=null;
Product.prototype.master=null;
Product.prototype.variants=null;
Product.prototype.image=null;
Product.prototype.shortDescription=null;
Product.prototype.thumbnail=null;
Product.prototype.onlineFlag=null;
Product.prototype.onlineFrom=null;
Product.prototype.onlineTo=null;
Product.prototype.categoryAssignments=null;
Product.prototype.searchPlacement=null;
Product.prototype.searchRank=null;
Product.prototype.siteMapChangeFrequency=null;
Product.prototype.siteMapPriority=null;
Product.prototype.pageTitle=null;
Product.prototype.pageDescription=null;
Product.prototype.pageKeywords=null;
Product.prototype.pageURL=null;
Product.prototype.recommendations=null;
Product.prototype.template=null;
Product.prototype.allCategories=null;
Product.prototype.categories=null;
Product.prototype.longDescription=null;
Product.prototype.onlineCategories=null;
Product.prototype.allCategoryAssignments=null;
Product.prototype.categoryAssignment=null;
Product.prototype.primaryCategoryAssignment=null;
Product.prototype.primaryCategory=null;
Product.prototype.productSetProducts=null;
Product.prototype.productSets=null;
Product.prototype.searchableFlag=null;
Product.prototype.EAN=null;
Product.prototype.UPC=null;
Product.prototype.brand=null;
Product.prototype.optionModel=null;
Product.prototype.bundledProductQuantity=null;
Product.prototype.bundledProducts=null;
Product.prototype.bundles=null;
Product.prototype.minOrderQuantity=null;
Product.prototype.stepQuantity=null;
Product.prototype.classificationCategory=null;
Product.prototype.manufacturerName=null;
Product.prototype.manufacturerSKU=null;
Product.prototype.unit=null;
Product.prototype.taxClassID=null;
Product.prototype.availableFlag=null;
Product.prototype.priceModel=null;
Product.prototype.variationModel=null;
Product.prototype.productLinks=null;
Product.prototype.incomingProductLinks=null;
Product.prototype.allProductLinks=null;
Product.prototype.allIncomingProductLinks=null;
Product.prototype.attributeModel=null;
Product.prototype.images=null;
Product.prototype.orderableRecommendations=null;
Product.prototype.availabilityModel=null;
Product.prototype.allRecommendations=null;
Product.prototype.activeData=null;

module.exports = Product;

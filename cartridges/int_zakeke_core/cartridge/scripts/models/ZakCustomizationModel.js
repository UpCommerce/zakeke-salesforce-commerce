/**
* Module for managing the customization options
*
* @module models/ZakCustomizationModel
*/

'use strict';

var ZakServicesModel = require('*/cartridge/scripts/models/ZakServicesModel');
var ZakPricingModel = require('*/cartridge/scripts/models/ZakPricingModel');
var zakGlobal = require('*/cartridge/scripts/zakGlobal');


// Returns the composition price in the BASE currency with taxes
//	-compositionPrice=composition price in the BASE currency without taxes
var getCompositionPriceWithTaxes = function (compositionPrice, priceModel) {
    var compositionPriceWithTaxes = 0;

    var taxPolicy = priceModel.taxPolicy;
    var taxRate = priceModel.taxRate;


    if (taxPolicy === 1) {
    	// NET PRICES
    	// Netsuite calculates all the taxes in the cart also for the customization price => the customization price coming from Zakeke (that is always NET) has to remain the same.
        compositionPriceWithTaxes = compositionPrice;
    } else {
    	// GROSS PRICES
    	// Netsuite doesn't calculate the taxes in the cart also for the customization price => the customization price coming from Zakeke (that is always NET) has to be transformed in GROSS adding taxes.
		// questo il valore memorizzato su ZAKEKE sempre NET TAXES. Devo aggiungere le tasse
        compositionPriceWithTaxes = compositionPrice + ((compositionPrice * taxRate) / 100);
    }

    return compositionPriceWithTaxes;
};


// Calculate unit customization price
// productPrice (base currency), object pricing (base currency), qty=quantity
var calculateCustomizationPrice = function (productPrice, pricing, qty) {
    var _priceVal = 0;

    if (pricing.modelPriceDeltaPerc > 0) {
        _priceVal = (productPrice * pricing.modelPriceDeltaPerc) / 100;
    } else {
        _priceVal = pricing.modelPriceDeltaValue;
    }

    if (pricing.designPrice > 0) {
        if (pricing.pricingModel && pricing.pricingModel === 'advanced') {
            _priceVal += pricing.designPrice / qty;
        } else {
            _priceVal += pricing.designPrice;
        }
    }

    return _priceVal;
};


// Returns the compositioPrice of Zakeke product customization in the SESSION currency (=currency) from BASE currency (currencyBase)
//	-compositionPrice=customization price in the BASE currency (with taxes)
// -exchangeRates calculated with "currency Base"
var getCompositionPriceCurrentCurrency = function (compositionPriceWithTaxes, currencyCode, exchangeRatesBaseCurrency) {
    var compositionPriceConverted = 0;
    var valueRate = exchangeRatesBaseCurrency[currencyCode];

    compositionPriceConverted = compositionPriceWithTaxes * valueRate;
    return compositionPriceConverted;
};


/**
 * Gets a new instance of ZakCustomizationModel.
 *
 * @param {number} productID = Product code
 * @param {Object} compositionID = CompositionID
 * @param {Object} quantity = quantity of the bought items
 * @param {Object} customizationType = CUSTOMIZER=1 OR CONFIGURATOR=2
 * @param {Object} platformType = SITEGENESIS=1 OR SFRA=2
 *
 * @returns {Object}  : {compositionPreview: xxxxx, compositionUnitPrice: xxxxx, compositionUnitPriceNoTaxes: xxxxx}
 */
var calculateCompositionElements = function (productID, compositionID, quantity, customizationType, platformType) {
    var price = 0; // unit price (in session currency)
    var priceBase = 0;// unit price (in the base currency)
    var customizPrice = 0; // unit customization price (in base currency) (no tax)
    var customizPriceTaxes = 0; // unit customization price (in base currency) (+ tax)


    var customizPriceConverted = 0; // unit customization price (in session currency) + TAX
    var customizPriceConvertedNoTaxes = 0; // unit customization price (in session currency) NO TAX

    var pricingOptions = null;
    var priceModel = null;
    var unitPrices = null;
    var unitPrice = null;
    var exchangeRates = null;
    var token = null;
    var designInfo = null;
    var compositionPreview = '';

    var services = ZakServicesModel.get();
    try {
        pricingOptions = { selectedProductID: productID, quantity: quantity, platform: platformType };
        priceModel = ZakPricingModel.get(pricingOptions);

	    unitPrices = priceModel.unitPrices;
	    unitPrice = unitPrices.filter(function (a) {
	    	return a.selected === true;
	    });

	    token = services.getTokenZakekeApi();
	    exchangeRates = services.getRateExchangeApi(token, priceModel.currencyBase);
	    designInfo = services.getDesignInfoApi(customizationType, compositionID, token, quantity);


	    if (unitPrice && exchangeRates && designInfo && token) {
	    	price = unitPrice[0].price;// session currency
	    	priceBase = getCompositionPriceCurrentCurrency(price, priceModel.currencyBase, exchangeRates);// SESS->BASE

	    	if (designInfo.customizationType === zakGlobal.CUSTOMIZATION_TYPES.CUSTOMIZER) {
	    		customizPrice = calculateCustomizationPrice(priceBase, designInfo.resp.pricing, quantity);// base currency
	    		compositionPreview = designInfo.resp.tempPreviewUrl;
	    	}	    	else {
	    		// In CONFIGURATOR "designInfo.resp.price" is TOTAL for all the quantity so I have to divide for quantity
	    		customizPrice = designInfo.resp.price / quantity;// base currency
	    		compositionPreview = designInfo.resp.previewUrl;
	    	}

	    	customizPriceTaxes = getCompositionPriceWithTaxes(customizPrice, priceModel);// BASE currency
	    	customizPriceConvertedNoTaxes = getCompositionPriceCurrentCurrency(customizPrice, priceModel.currency, exchangeRates);// //BASE->SESS (NO TAXES)
	        customizPriceConverted = getCompositionPriceCurrentCurrency(customizPriceTaxes, priceModel.currency, exchangeRates);// //BASE->SESS (+ TAXES)
	    } else {
	    	throw new Error('No price found OR exchangeRates null OR designInfo null.');
	    }
    } catch (e) {
    	throw new Error(e.message);
    }

    return { compositionPreview: compositionPreview, compositionUnitPrice: customizPriceConverted, compositionUnitPriceNoTaxes: customizPriceConvertedNoTaxes };
};


/**
 * ZakCustomizationModel class providing custom configuration site properties.
 *
 * @class module:models/ZakCustomizationModel
 * @param {Object} options to build the Model
 */
var ZakCustomizationModel = function (options) {
    this.object = options;
};


/**
 * Gets the customization elements
 * @returns {Object}  : {compositionPreview: xxxxx, compositionUnitPrice: xxxxx, compositionUnitPriceNoTaxes: xxxxx}
 *
 */
ZakCustomizationModel.prototype.customization = function () {
    var compositionsElements = calculateCompositionElements(this.object.productID, this.object.compositionID, this.object.quantity, this.object.customizationType, this.object.platformType);

    return compositionsElements;
};


/**
 * Gets a new instance of ZakCustomizationModel.
 *
 * @param {string} productID ID of item
 * @param {string} compositionID of the composition
 * @param {number} quantity of items customized
 * @param {number} customizationType = CUSTOMIZER or CONFIGURATOR
 * @param {number} platformType = SITEGENESIS or SFRA
 *
 * @returns {module:models/ZakCustomizationModel} A new ZakCustomizationModel instance.
 */
ZakCustomizationModel.get = function (productID, compositionID, quantity, customizationType, platformType) {
    if (empty(productID) || empty(compositionID)) {
        return null;
    }

    var obj = { productID: productID, compositionID: compositionID, quantity: quantity, customizationType: customizationType, platformType: platformType };

    return new ZakCustomizationModel(obj);
};


/** The ZakCustomizationModel class */
module.exports = ZakCustomizationModel;


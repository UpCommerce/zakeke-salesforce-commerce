(function () {
    'use strict';

    var zakekeComposerFrame;
    var zakekeComposerContainer;
    var zakekeConfig;

    var _zakekeCompositionPrice = 0;// necessary for addCart()


    document.addEventListener('DOMContentLoaded', function (event) {
        zakekeComposerFrame = document.getElementById('zakeke-composer-frame');
        zakekeComposerContainer = document.getElementById('zakeke-composer-container');

        zakekeConfig = {
            zakekeExchangeRates: JSON.parse(zakekeComposerContainer.getAttribute('zakeke-exchange-rates')),
            zakekeUnitPrices: JSON.parse(zakekeComposerContainer.getAttribute('zakeke-unit-prices')),
            zakekeUrl: zakekeComposerContainer.getAttribute('zakeke-url'),
            zakekeProductName: zakekeComposerContainer.getAttribute('zakeke-product-name'),
            zakekeCurrency: zakekeComposerContainer.getAttribute('zakeke-currency'),
            zakekeCulture: zakekeComposerContainer.getAttribute('zakeke-culture').replace('_', '-'),
            zakekeModelCode: zakekeComposerContainer.getAttribute('zakeke-model-code'),
            zakekeQty: zakekeComposerContainer.getAttribute('zakeke-qty'),
            zakekeCustomer: zakekeComposerContainer.getAttribute('zakeke-customer'),
            zakekeGuest: zakekeComposerContainer.getAttribute('zakeke-guest'),
            zakekeAttributes: JSON.parse(zakekeComposerContainer.getAttribute('zakeke-attributes')),
            zakekeToken: zakekeComposerContainer.getAttribute('zakeke-token'),
            zakekeCartShowUrl: zakekeComposerContainer.getAttribute('zakeke-cart-show-url'),
            zakekeZakCartShowUrl: zakekeComposerContainer.getAttribute('zakeke-zak-cart-show-url'),
            zakekeTaxPolicy: parseInt(zakekeComposerContainer.getAttribute('zakeke-tax-policy')),
            zakekeTaxRate: Number(zakekeComposerContainer.getAttribute('zakeke-tax-rate')),
            zakekeCurrencyBase: zakekeComposerContainer.getAttribute('zakeke-currency-base')
        };


        zakekeCustomizer(zakekeConfig);
    });

    var zakekeCustomizer = function (config) {
        var url = getUrlIframe(config);
        zakekeComposerFrame.src = url;

        window.addEventListener('message', messageCallback(config), false);
    };

    var getUrlIframe = function (config) {
        var url = config.zakekeUrl + '/Customizer/';
        if (isMobile()) {
            url += 'index.mobile.html?';
        }		else {
            url += 'index.html?';
        }

        var attributesQueryString = getAttributesQueryString(config);

        url = url + 'name=' + config.zakekeProductName + '&modelCode=' + config.zakekeModelCode;
        url = url + '&qty=' + config.zakekeQty + '&taxPricesPolicy=hidden&culture=' + config.zakekeCulture + '&ecommerce=ccloud&currency=' + config.zakekeCurrency;
        if (attributesQueryString) {
            url = url + '&' + attributesQueryString;
        }
        url = url + '&isClientPreviewsEnabled=1&tokenOwin=' + config.zakekeToken + '&shareUrlPrefix=';

        console.log('IFrameUrl:' + url);
        return encodeURI(url);
    };

    var getAttributesQueryString = function (config) {
        var urlString = '';

        var data = config.zakekeAttributes;
        data.forEach(function (array, index) {
            var attribute = array[0].id;
            var value = array[1].id;

            if (index == 0) {
			    urlString = 'attribute[' + attribute + ']=' + value;
            } else {
			    urlString = urlString + '&attribute[' + attribute + ']=' + value;
            }
        });
        return urlString;
    };

	/*
	 var productData = {
        color: color,
        isOutOfStock: !(product.is_purchasable && product.is_in_stock),
        finalPrice: product.price_including_tax
    };
	 * */
    var emitProductDataEvent = function (productData) {
        zakekeComposerFrame.contentWindow.postMessage({
            data: productData,
            zakekeMessageType: 1
        }, '*');
    };

    function isMobile() {
    	var res = true;

    	if (window.matchMedia('(min-width: 48em)').matches) {
    		res = false;
    	}
    	return res;
    }


    var messageCallback = function (config)	{
        var funct = function messageEventListener(event)		{
            var zakUrl = config.zakekeUrl + '/';
            if (event.origin !== zakUrl.slice(0, -1)) {
                return;
            }

            if (event.data.zakekeMessageType === 0) {
                addItemCart(event.data);
            } else if (event.data.zakekeMessageType === 1) {
                handlePriceRequest(event.data);
            }
        };

        return funct;
    };

    var _i = 0;
    var handlePriceRequest = function (request)	{
        if (_i <= 10) {
            _i++;
            return;
        }

		// priceCompositionRequest = price of Zakeke product customization in the BASE currency without taxes for the fixed quantity (>=1)
		// percentPriceComposition = percentage of customization price (to calculate with the item price)
        var priceCompositionRequest = request.design.price;
        var percentPriceComposition = request.design.percentPrice;
        var attributes = JSON.parse(request.design.color);
        var quantity = parseInt(zakekeConfig.zakekeQty);

        console.log('Composition price request= ' + priceCompositionRequest);
        console.log('Composition percentPrice request= ' + percentPriceComposition);

        var priceObj = getUnitPrice(attributes);
		// priceUnit= unit product price (in SESSION currency)
        var priceUnit = priceObj[0].price;

		// compositionPrice=composition price for chosen product customization in the 'BASE currency' of the STORE (for all the quantity) (no taxes)
        var compositionPrice = 0;
		// compositionPriceTaxes=composition price in the 'BASE currency' of the STORE (for all the quantity) (+ taxes)
        var compositionPriceTaxes = 0;
		// compositionPriceFinal=composition price in the 'SESSION currency' of the STORE (for all the quantity) (+ taxes)
        var compositionPriceFinal = 0;

        if (priceCompositionRequest > 0) {
            compositionPrice = priceCompositionRequest;
            compositionPriceTaxes = getCompositionPriceWithTaxes(compositionPrice);
            compositionPriceFinal = getCompositionPriceCurrentCurrency(compositionPriceTaxes);
        }		else {
            compositionPrice = (priceUnit * percentPriceComposition / 100) * quantity;
            compositionPriceTaxes = getCompositionPriceWithTaxes(compositionPrice);
            compositionPriceFinal = compositionPriceTaxes;
        }

		// Necessary for addCart event
        _zakekeCompositionPrice = compositionPriceFinal;
        console.log('Composition price tot= ' + compositionPrice);
        console.log('Composition price tot= ' + compositionPriceFinal);

        var productData = {
            color: attributes,
	        isOutOfStock: false,
	        finalPrice: priceUnit * quantity + compositionPriceFinal
        };

        zakekeComposerFrame.contentWindow.postMessage({
            data: productData,
            zakekeMessageType: 1
        }, '*');
    };


	// attributes=[{Id:"Color",Label:"Color",Value:{"Id":"W","Label":"W"} },..]
    var getUnitPrice = function (attributes) {
        var inputOptions = getZakekeOptions(attributes);

        var price = null;
        if (inputOptions.length == 0) {
            price = zakekeConfig.zakekeUnitPrices;
        }		else {
            var inputOptionsData = getObjectWithAttributefromArray(inputOptions);

            var priceElement = zakekeConfig.zakekeUnitPrices.find(function (value) {
                var equal = true;
                var optionsProducts = getObjectWithAttributefromArray(value.option);

				// var keys=Object.keys(optionsProducts);
                var keys = Object.keys(inputOptionsData);
                for (var j = 0; j < keys.length; j++) {
				    var key = keys[j];

				    if (optionsProducts[key] == inputOptionsData[key]) {
				      equal = true;
				    }				    else {
				      equal = false;
				      break;
				    }
                }

                return equal;
            });
            price = [priceElement];
        }

        return price;
    };

	// Get ZAKEKE options in the format [{'optionID': Id, 'valueID': Value}, ..]
    var getZakekeOptions = function (attributes) {
        var inputOptions = attributes.map(function (r, index) {
            var Id = r.Id;
            var Value = r.Value.Id;

            return { optionID: Id, valueID: Value };
        });


        return inputOptions;
    };

	// FROM: [{optionID: "color", valueID: "W"}, {optionID: "size", valueID: "S"}, ..]
	// TO:   {color: "W", size: "S", ..}
    var getObjectWithAttributefromArray = function (data) {
	    var dataObject = data.map(function (current) {
	      var optName = current.optionID;
	      var optValue = current.valueID;

	      var b = {};
	      b[optName] = optValue;
	      return b;
	    }).reduce(function (prev, curr, index) {
	      var key = (Object.keys(curr))[0];
	      var value = (Object.values(curr))[0];

	      if (index === 0) {
	        prev = {};
	      } else {
	        prev[key] = value;
	      }

	      return prev;
	    });

	    return dataObject;
    };


	// Returns the composition price in the BASE currency with taxes for all quantity
    //	-compositionPrice=composition price in the BASE currency without taxes for all the quantity
    var getCompositionPriceWithTaxes = function (compositionPrice) {
        var compositionPriceWithTaxes = 0;

        var taxPolicy = zakekeConfig.zakekeTaxPolicy;
        var taxRate = zakekeConfig.zakekeTaxRate;

		// NET PRICES
        if (taxPolicy == 1) {
            compositionPriceWithTaxes = compositionPrice;
        }
		// GROSS PRICES
        else {
			// questo il valore memorizzato su ZAKEKE sempre NET TAXES. Devo aggiungere le tasse
            compositionPriceWithTaxes = compositionPrice + (compositionPrice * taxRate / 100);
        }

        return compositionPriceWithTaxes;
    };

	// Returns the compositioPrice of Zakeke product customization in the SESSION currency with taxes for all quantity
    //	-compositionPrice=customization price in the BASE currency with taxes for all the quantity
    var getCompositionPriceCurrentCurrency = function (compositionPriceWithTaxes) {
        var compositionPriceConverted = 0;

        var currency = zakekeConfig.zakekeCurrency; // session currency
        var currencyBase = zakekeConfig.zakekeCurrencyBase; // base currency=base currency for Store in configured Zakeke
        var valueRate = zakekeConfig.zakekeExchangeRates[currency];

        compositionPriceConverted = compositionPriceWithTaxes * valueRate;

        return compositionPriceConverted;
    };

	//---------------------------------------------------------
    var addItemCart = function (request)	{
        var compositionID = request.designId;
        var compositionPreview = '';// request.message.preview;
        var attributes = JSON.parse(request.colorId);
        var quantity = parseInt(zakekeConfig.zakekeQty);
		//-----------------------
		// Tot price of the customization in the SESSION CURRENCY
        var compositionPrice = _zakekeCompositionPrice;
		//-----------------------

        var price = getUnitPrice(attributes);
        var zakOptions = getZakekeOptions(attributes);
        var callParameter = new AddCartOptions(price, compositionPrice, quantity, compositionID, compositionPreview, zakOptions);

        callCartShow(callParameter).then((resultObject)=>{
            if (resultObject.status == 'OK') {
                console.log('OK - addCart SUCCESS');
                window.location.href = zakekeConfig.zakekeCartShowUrl;
            }			else {
                console.log('ERROR: ' + resultObject.message);
            }
        });
    };


    var AddCartOptions = function (price, compositionPrice, quantity, compositionID, compositionPreview, zakOptions) {
        this.productID = price[0].productID;
        this.quantity = quantity;
        this.compositionPrice = compositionPrice;

        this.compositionID = compositionID;
        this.compositionPreview = compositionPreview;
        this.zakOptions = zakOptions;
        this.customizationType = 1;// --Customizer--
        this.platformType = 2;// --SFRA--
    };

    var callCartShow = function (parameters) {
        var service_url = zakekeConfig.zakekeZakCartShowUrl;

        return fetch(service_url, { method: 'POST', body: JSON.stringify(parameters) })
			.then((response) => {
    var b = response;
    if (response.ok) {
        return response.json();
    }
}).then((result) => {
    return result;
}).catch(ex=>console.error(ex.message));
    };

    var editCart = function (request)	{

    };
}());


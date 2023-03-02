(function () {

	"use strict";

	var zakekeComposerFrame=undefined;
	var zakekeSendIframeParamsInterval=undefined;

	var zakekeCompositionPrice=0;

	var zakekeExchangeRates=JSON.parse(document.getElementById("zakeke-composer-container").getAttribute('zakeke-exchange-rates'));
	var zakekeUnitPrices=JSON.parse(document.getElementById("zakeke-composer-container").getAttribute('zakeke-unit-prices'));
	var zakekeUrl=document.getElementById("zakeke-composer-container").getAttribute('zakeke-url');
	var zakekeProductName=document.getElementById("zakeke-composer-container").getAttribute('zakeke-product-name');
	var zakekeCurrency=document.getElementById("zakeke-composer-container").getAttribute('zakeke-currency');
	var zakekeCulture=document.getElementById("zakeke-composer-container").getAttribute('zakeke-culture').replace('_', '-');
	var zakekeModelCode=document.getElementById("zakeke-composer-container").getAttribute('zakeke-model-code');
	var zakekeQty=document.getElementById("zakeke-composer-container").getAttribute('zakeke-qty');
	var zakekeCustomer=document.getElementById("zakeke-composer-container").getAttribute('zakeke-customer');
	var zakekeGuest=document.getElementById("zakeke-composer-container").getAttribute('zakeke-guest');
	var zakekeAttributes=JSON.parse(document.getElementById("zakeke-composer-container").getAttribute('zakeke-attributes'));
	var zakekeToken=document.getElementById("zakeke-composer-container").getAttribute('zakeke-token');
	var zakekeCartShowUrl=document.getElementById("zakeke-composer-container").getAttribute('zakeke-cart-show-url');
	var zakekeZakCartShowUrl=document.getElementById("zakeke-composer-container").getAttribute('zakeke-zak-cart-show-url');
	var zakekeTaxPolicy=parseInt(document.getElementById("zakeke-composer-container").getAttribute('zakeke-tax-policy'));
	var zakekeTaxRate=Number(document.getElementById("zakeke-composer-container").getAttribute('zakeke-tax-rate'));
	var zakekeCurrencyBase=document.getElementById("zakeke-composer-container").getAttribute('zakeke-currency-base');


	document.addEventListener("DOMContentLoaded", function(event) { 
		zakekeComposerFrame=document.getElementById("zakeke-composer-frame");
		zakekeComposerFrame.src=zakekeUrl+"/Configurator/index.html";
		
		launchZakeke();
	});


	function launchZakeke()
	{ 
		var conf = {
				name: zakekeProductName,					
				currency: zakekeCurrency,					
				culture: zakekeCulture,						
				modelCode: zakekeModelCode,				
				compositionId: "",
				qty: zakekeQty,						
				ecommerce: "ccloud",			
				guest: zakekeGuest,					
				attributes:	zakekeAttributes,			
				zakekeUrl: zakekeUrl+"/",				
				token: zakekeToken							
		};
		
		if(zakekeCustomer!=='0'){
			conf = {
				name: zakekeProductName,					
				currency: zakekeCurrency,					
				culture: zakekeCulture,						
				modelCode: zakekeModelCode,				
				compositionId: "",
				qty: zakekeQty,						
				ecommerce: "ccloud",
				customer: zakekeCustomer,								
				attributes:	zakekeAttributes,			
				zakekeUrl: zakekeUrl+"/",				
				token: zakekeToken							
			};
		}
		
		zakekeComposer(conf);
	}


	var zakekeComposer = function(config) {
		
		function initializeZakekeIframe () {
			var iframe=zakekeComposerFrame;
			
			zakekeSendIframeParamsInterval = setInterval(function () {
				var params=Object.assign({}, config);
				console.log("Send load to plugin");

				iframe.contentWindow.postMessage({
					type: "load",
					parameters: params
				}, '*');
				
			}, 500);
		}
		
		initializeZakekeIframe();
		window.addEventListener("message", messageCallback(), false);
	}

	var messageCallback=function()
	{
		var funct= function messageEventListener(event)
		{
			var zakUrl=zakekeUrl + "/";
			if (event.origin !== zakUrl.slice(0, -1)) {
				return;
			}

			if (event.data.zakekeMessageType === "AddToCart") {
				addItemCart(event.data);
			} else if (event.data.zakekeMessageType === "Price") {
				handlePriceRequest(event.data);
			} else if (event.data.zakekeMessageType === "Close") {
				//nop
			} else if (event.data.zakekeType === "loaded") {
				clearInterval(zakekeSendIframeParamsInterval);
			}
		}

		return funct;
	}

	var addItemCart=function(request) 
	{
		var compositionID=request.message.composition;
		var compositionPreview=request.message.preview;
		var preview=request.message.preview;
		var attributes=request.message.attributes;
		var quantity=parseInt(request.message.quantity);
		//-----------------------
		//Tot price of the customization in the SESSION CURRENCY
		var compositionPrice=zakekeCompositionPrice;
		//-----------------------
		
		var price=getUnitPrice(attributes);
		var zakOptions=getZakekeOptions(attributes);
		var callParameter=new AddCartOptions(price, compositionPrice, quantity, compositionID, compositionPreview, zakOptions);
		
		callCartShow(callParameter).then((resultObject)=>{
			if(resultObject.status=="OK"){
				console.log("OK - addCart SUCCESS");
				window.location.href = zakekeCartShowUrl;
			}
			else{
				console.log("ERROR: "+ resultObject.message);
			}
		});
	}

	var AddCartOptions=function(price, compositionPrice, quantity, compositionID, compositionPreview, zakOptions){
		this.productID=price[0].productID;
		this.quantity=quantity;
		this.compositionPrice=compositionPrice;
		
		this.compositionID=compositionID;
		this.compositionPreview=compositionPreview;
		this.zakOptions=zakOptions;
		
		this.customizationType=2;//--Configurator--
		this.platformType=1;//--SITEGENESIS--
	}

	var callCartShow=function(parameters){
		var service_url = zakekeZakCartShowUrl;
		
		return fetch(service_url, {method: "POST", body: JSON.stringify(parameters)})
			.then((response) => {
				var b=response;
				if(response.ok){
					return response.json();
				}
			}).then((result) => {
				return result;
			}).catch(ex=>console.error(ex.message));
	}

	//Get only ZAKEKE options (options defined in the backoffice)
	var getZakekeOptions=function(attributes){
		var zakInputOptions=attributes
		.filter(function(a){
			return isJsonString(a.attributeCode)==false;
		})
		.map(function(r, index){
			var attributeCode=r.attributeCode;
			var optionCode=r.optionCode;
			
			return {'optionID': attributeCode, 'valueID': optionCode};
		});
		
		
		return zakInputOptions;
	}
	
	//FROM: [{optionID: "color", valueID: "W"}, {optionID: "size", valueID: "S"}, ..]
	//TO:   {color: "W", size: "S", ..}
	var getObjectWithAttributefromArray=function(data){
	    var dataObject=data.map(function(current){
	      var optName=current.optionID;
	      var optValue=current.valueID;

	      var b={};
	      b[optName]=optValue;
	      return b;
	    }).reduce(function(prev, curr, index){
	      var key = (Object.keys(curr))[0];
	      var value=(Object.values(curr))[0];
	      
	      if(index===0){
	        prev={};
	      }
	      else{
	        prev[key]=value;
	      }

	      return prev;
	    });

	    return dataObject;
	}

	var getUnitPrice=function(attributes){
		var inputOptions=attributes.filter(function(a){
			return isJsonString(a.attributeCode);
		}).map(function(r, index){
			var attributeCode=JSON.parse(r.attributeCode);
			var optionCode=JSON.parse(r.optionCode);
			
			return {'optionID': attributeCode.id, 'valueID': optionCode.id};
		});
		
		var price=null;
		if(inputOptions.length==0){
			price=zakekeUnitPrices;
		}
		else{
			var inputOptionsData=getObjectWithAttributefromArray(inputOptions);
			
			var priceElement=zakekeUnitPrices.find(function(value){
				var equal=true;
				
				var optionsProducts=getObjectWithAttributefromArray(value.option);
				
				var keys=Object.keys(optionsProducts);
				for (var j=0; j<keys.length; j++){
				    var key=keys[j];
				    
				    if(optionsProducts[key]==inputOptionsData[key]){
				      equal=true;
				    }
				    else{
				      equal=false;
				      break;
				    }
				}

				return equal;
			});
			price=[priceElement];
		}
		
		return price;
	}

	var handlePriceRequest=function(request) 
	{
		var attributes=request.message.attributes;
		
		var quantity=request.message.quantity;
		//composition price for chosen product customization in the 'BASE currency' of the STORE (for all the quantity)
		var compositionPrice=request.message.compositionPrice;
		var price=getUnitPrice(attributes);
		
		//composition price for chosen product customization in the 'SESSION currency' of the STORE (for all the quantity) + taxes (only in GROSS PRICES => policy=0)
		var compositionPriceFinal=getCompositionPriceCurrentCurrency(compositionPrice);
		console.log("Composition price selected: ", compositionPrice);
		console.log("Quantity selected: ", quantity);
		console.log("Price selected: ", price[0].price);
		console.log("Tax rate=: "+ zakekeTaxRate);
		console.log("Tax policy=: "+ zakekeTaxPolicy);
		console.log("Composition price final: ", compositionPriceFinal);
		
		
		zakekeComposerFrame.contentWindow.postMessage({
			messageId: request.messageId,
			zakekeMessageType: "Price",
			message: price[0].price*quantity + compositionPriceFinal
		}, "*");
		
	}

	//Returns the compositioPrice of Zakeke product customization in the SESSION currency with taxes for all quantity
    //	-compositionPrice=compositionPrice of Zakeke product customization in the BASE currency without taxes for all the quantity
	var getCompositionPriceCurrentCurrency=function(compositionPrice){
		
		var compositionPriceConverted=0;
		var taxPolicy=zakekeTaxPolicy;
		var taxRate=zakekeTaxRate;
		var currency=zakekeCurrency; //session currency
		var currencyBase=zakekeCurrencyBase; //base currency=base currency for Store in configured Zakeke
		
		var valueRate=zakekeExchangeRates[currency];
		
		//NET PRICES
		if(taxPolicy==1){
			compositionPriceConverted=compositionPrice;
		}
		//GROSS PRICES
		else{
			//questo il valore memorizzato su ZAKEKE sempre NET TAXES. Devo aggiungere le tasse
			compositionPriceConverted=compositionPrice+(compositionPrice*taxRate/100);
		}
		
		compositionPriceConverted=compositionPriceConverted*valueRate;
		//Necessary for addCart event
		zakekeCompositionPrice=compositionPriceConverted;
		
		return compositionPriceConverted;
	}
	    
	   


	var isJsonString=function(str) {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
	}

})();




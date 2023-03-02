var TaxMgr = function(){
};

TaxMgr.getTaxRate = function(){
	return TAX_RATE;
};
TaxMgr.getTaxationPolicy = function(){
	return TAX_POLICY; //NET
};

TaxMgr.getTaxJurisdictionID = function(){};
TaxMgr.getDefaultTaxJurisdictionID = function(){};
TaxMgr.getDefaultTaxClassID = function(){};
TaxMgr.getTaxExemptTaxClassID = function(){};
TaxMgr.getCustomRateTaxClassID = function(){};

TaxMgr.prototype.taxRate=null;
TaxMgr.prototype.taxationPolicy=null;
TaxMgr.prototype.taxJurisdictionID=null;
TaxMgr.prototype.defaultTaxJurisdictionID=null;
TaxMgr.prototype.defaultTaxClassID=null;
TaxMgr.prototype.taxExemptTaxClassID=null;
TaxMgr.prototype.customRateTaxClassID=null;

module.exports = TaxMgr;
'use strict';

function getPatchProducts(designId){
    var patchProducts = [];
    var ZakServicesModel = require('*/cartridge/scripts/models/ZakServicesModel');
    var services = ZakServicesModel.get();
    var token = "";
    var result = services.getPatchProductZakekeApi(designId,token);
   

    if(result && result.variant){
        result.variant.sides.forEach(side => {
            side.areas.forEach(area => {
                area.items.forEach(item => {
                    if(!empty(item.code)){
                        patchProducts.push({
                            pid:item.code,
                            qty: 1
                        });
                    }
                });
            });
        });
    }

    return patchProducts;
}
module.exports = {
    getPatchProducts: getPatchProducts
};

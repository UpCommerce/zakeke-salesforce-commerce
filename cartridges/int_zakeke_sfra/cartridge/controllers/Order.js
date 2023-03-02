/* global empty */
/* eslint no-underscore-dangle:0 */
var base = module.superModule;
var server = require('server');

var ZakConfigModel = require('*/cartridge/scripts/models/ZakConfigModel');
server.extend(base);

server.append('Confirm', function (req, res, next) {
    var viewData = res.getViewData();
    var config = ZakConfigModel.get();
    var zakConf = config.zakekeConfig();
    viewData.zakekeShowPatchProduct = zakConf.ZAKEKE_ShowPatchProduct;
    res.setViewData(viewData);
    return next();
});


module.exports = server.exports();

'use strict';

var server = require('server');

var ZakConfigModel = require('*/cartridge/scripts/models/ZakConfigModel');

var page = module.superModule;
server.extend(page);

server.append('Show', function (req, res, next) {
    var viewData = res.getViewData();

    var zakConf = ZakConfigModel.get().zakekeConfig();
    var zakekeEnabled = zakConf.ZAKEKE_Enabled;

    viewData.zakeke = { isZakekeEnabled: zakekeEnabled };

    res.setViewData(viewData);
    next();
});


module.exports = server.exports();

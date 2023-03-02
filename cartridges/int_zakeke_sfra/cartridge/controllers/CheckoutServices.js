'use strict';

var server = require('server');

var page = module.superModule;
server.extend(page);


server.append('PlaceOrder', function (req, res, next) {
    if (res.viewData.error === false) {
        var OrderMgr = require('dw/order/OrderMgr');
        var orderID = res.viewData.orderID;
        var orderToken = res.viewData.orderToken;

        var order = OrderMgr.getOrder(orderID, orderToken);
        if (order) {
            dw.system.HookMgr.callHook('zak.orderClosed', 'orderClosed', order);
        }
    }

    next();
});


module.exports = server.exports();

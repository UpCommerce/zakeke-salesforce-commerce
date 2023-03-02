'use strict';

var Logger = require('dw/system/Logger');
var Status = require('dw/system/Status');
var Order = require('dw/order/Order');

var logger = Logger.getLogger('ZAKEKE', 'ZAKEKE');
var ZakOrderModel = require('*/cartridge/scripts/models/ZakOrderModel');

var ZakEmail = require('*/cartridge/scripts/services/ZakEmail');

/**
 * orderClosed
 *
 *
 * @param {Object} order - the order that was closed
 * @return {dw/system/Status} The status objec
 */
exports.orderClosed = function (order) {
    var stat = order.status.value;
    var orderID = order.getOrderNo();

    try {
        if (stat === Order.ORDER_STATUS_OPEN || stat === Order.ORDER_STATUS_NEW) {
            var zakOrderModel = ZakOrderModel.get(order);
            if (zakOrderModel.isZakekeOrder === true) {
                logger.info('zakOrderClosed.orderClosed Hook - Begin  - Info: OrderID={0}', orderID);

                zakOrderModel.insertZakekeNotificationRecord();
                zakOrderModel.insertNotesZakekeOptions();

                logger.info('zakOrderClosed.orderClosed Hook - OK - Info: OrderID={0}', orderID);
            }
        }
    } catch (e) {
        logger.error('zakOrderClosed.orderClosed Hook - Error={0} - Info: OrderID={1} ', e.message, orderID);
        ZakEmail.get().sendEmail('Error during orderClosed hook - orderId=' + orderID, e.message);
    }

    return new Status(Status.OK);
};


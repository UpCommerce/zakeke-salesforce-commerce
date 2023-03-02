/**
 * @module cartridge/scripts/jobs/zakOrderClosedJob
 *
 * This javascript file implements methods for the job thahas to be created in the BM
 * for notifying Zakeke service of the closed orders with customized items
 *
 */

'use strict';

var Logger = require('dw/system/Logger');
var Status = require('dw/system/Status');
var Order = require('dw/order/Order');
var OrderMgr = require('dw/order/OrderMgr');
var CustomObjectMgr = require('dw/object/CustomObjectMgr');

var logger = Logger.getLogger('ZAKEKE', 'ZAKEKE');

var zakGlobal = require('*/cartridge/scripts/zakGlobal');
var ZakOrderModel = require('*/cartridge/scripts/models/ZakOrderModel');
var ZakEmail = require('*/cartridge/scripts/services/ZakEmail');


/**
 * executeZakekeNotificationOrderClosedStep
 *
 * Job step to work on every 'zakOrderNotification' custom object record
 * @param {ZakOrderModel} orderZak order model associated to the 'zakOrderNotification' record
 * @return {number} resultFinale 0/1 0=OK-1=ERR
 */
var executeZakekeNotificationOrderClosedStep = function (orderZak) {
    var stat = orderZak.getStatus().value;
    var orderID = orderZak.getOrderID();
    var resultFinale = 0;

    try {
        if (stat === Order.ORDER_STATUS_OPEN || stat === Order.ORDER_STATUS_NEW) {
            if (orderZak.isZakekeOrder === true) {
                logger.info('zakOrderClosedJob.executeZakekeNotificationOrderClosedStep - Begin - Info: OrderID={0}', orderID);
                var result = orderZak.notifyZakekeOrderClosed();
                logger.info('zakOrderClosedJob.executeZakekeNotificationOrderClosedStep - End - Info: OrderID={0} Result={1} ', orderID, result);
            }
        }
    } catch (e) {
        resultFinale = 1;

        logger.error('zakOrderClosedJob.executeZakekeNotificationOrderClosedStep - Error={0} - Info: OrderID={1} ', e.message, orderID);
        ZakEmail.get().sendEmail('Error during executeZakekeNotificationOrderClosedStep job - orderId=' + orderID, e.message);
    }

    return resultFinale;
};

/**
 * execute
 *
 *  Job execute function to cycle over 'zakOrderNotifications' custom object records in order to notify Zakeke platform of closed orders
 *  @return {dw/system/Status} Status.OK if it's all OK
 */
var execute = function () {
    var result = 0;
    var resultTot = new Status(Status.OK);

    logger.info('zakOrderClosedJob.executeZakekeNotificationOrderClosed - Begin');

    var notificationsIterator = CustomObjectMgr.queryCustomObjects('zakOrderNotifications', 'custom.Status={0}', 'creationDate asc', zakGlobal.NOTIFICATION_STATUS.ADDED);
    while (notificationsIterator.hasNext()) {
        var notification = notificationsIterator.next();

        var orderID = notification.custom.OrderID;
        var order = OrderMgr.getOrder(orderID);
        if (!empty(order)) {
            var orderZak = ZakOrderModel.get(order);

            result = executeZakekeNotificationOrderClosedStep(orderZak);
            if (result === 1) {
                resultTot = new Status(Status.ERROR, 'ERROR JOB Zakeke-Notification', 'Error during Job Zakeke-Notification. Check Zakeke notification records and job logs.');
            }
        }
    }

    logger.info('zakOrderClosedJob.executeZakekeNotificationOrderClosed - End');
    return resultTot;
};


//---------------------
exports.executeZakekeNotificationOrderClosed = execute;


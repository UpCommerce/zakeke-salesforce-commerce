/**
* Module for zakeke ordering functionality
*
* @module models/ZakOrdermodel
*/

'use strict';


var OrderMgr = require('dw/order/OrderMgr');
var Transaction = require('dw/system/Transaction');

var ZakOrderNotificationModel = require('*/cartridge/scripts/models/ZakOrderNotificationModel');
var zakGlobal = require('*/cartridge/scripts/zakGlobal');
var ZakServicesModel = require('*/cartridge/scripts/models/ZakServicesModel');
var ZakOrderDtoModel = require('*/cartridge/scripts/models/ZakOrderDtoModel');


/**
 * Update the custom object 'zakOrderNotification'
 *
 * @param {ZakOrderModel} self The order model ZakOrderModel.
 * @param {string} status The status of the record.
 * @param {string} msg The msg of the record.
 */
function updateZakekeNotificationRecord(self, status, msg) {
    var param = new ZakOrderNotificationModel.ZakOrderNotificationParameters(self.getOrderID(), status, msg);

    self.notificationRecord = self.notificationRecord.updateRecord(param);
}


/**
 * Add a note to the order
 *
 * @param {dw.order.Order} order The order model ZakOrderModel.
 * @param {string} compositionId The compositionId of the customization.
 * @param {string} composition The composition of the customization.
 */
function addNote(order, compositionId, composition) {
    Transaction.wrap(function () {
        order.addNote(compositionId, composition);
    });
}


/**
 * Order helper providing enhanced order functionality
 *
 * @class module:models/ZakOrderModel
 * @param {dw.order.Order} obj The order object to enhance/wrap.
 */
var ZakOrderModel = function (obj) {
    this.zakekeOrderDTO = null;
    this.services = null;
    this.isZakekeOrder = false;
    this.notificationRecord = null;

    //-------------------------
    this.object = obj;
    //-------------------------

    this.services = ZakServicesModel.get();
    var order = ZakOrderDtoModel.get(this.object, this.services);
    this.zakekeOrderDTO = order.dto;
    this.isZakekeOrder = order.isZakekeOrder;
    var notifModel = ZakOrderNotificationModel.get(this.object.getOrderNo());
    if (!empty(notifModel)) {
        this.notificationRecord = notifModel;
    }
};


/**
 * getStatus
 *
 * Get the status of the order
 * @return {enumValue} status enum
*/
ZakOrderModel.prototype.getStatus = function () {
    return this.object.getStatus();
};


/**
 * getOrderID
 *
 * Get the orderID of the order
 * @return {string} status enum
 */
ZakOrderModel.prototype.getOrderID = function () {
    return this.object.getOrderNo();
};

/**
 * insertZakekeNotificationRecord
 *
 * Insert a new record of 'zakOrderNotification' custom object = notificationRecord
 */
ZakOrderModel.prototype.insertZakekeNotificationRecord = function () {
    var param = new ZakOrderNotificationModel.ZakOrderNotificationParameters(this.object.getOrderNo(), zakGlobal.NOTIFICATION_STATUS.ADDED, '');
    var recordCreated = ZakOrderNotificationModel.newRecord(param);

    this.notificationRecord = recordCreated;
};

/**
 * insertNotesZakekeOptions
 *
 * Insert a new note for each line item record that contains Zakeke customization
 */
ZakOrderModel.prototype.insertNotesZakekeOptions = function () {
    var order = this.object;
    var productLineItems = order.getAllProductLineItems().iterator();

    while (productLineItems.hasNext()) {
        var productLineItem = productLineItems.next();

        if (!empty(productLineItem.getCustom().ZAKEKE_CompositionID)) {
            var composition = productLineItem.getCustom().ZAKEKE_Composition;
            var compositionId = productLineItem.getCustom().ZAKEKE_CompositionID;

            addNote(order, compositionId, composition);
        }
    }
};


/**
 * notifyZakekeOrdeClosed
 *
 * Call Zakeke service to notify the closing of an order that contains Zakeke customization
 * @return {boolean} result of API call
 */
ZakOrderModel.prototype.notifyZakekeOrderClosed = function () {
    var result = false;

    var services = this.services;
    try {
        result = services.notifyZakekeOrderClosedApi(this.zakekeOrderDTO);
        updateZakekeNotificationRecord(this, zakGlobal.NOTIFICATION_STATUS.OK, '');
    } catch (e) {
        updateZakekeNotificationRecord(this, zakGlobal.NOTIFICATION_STATUS.ERR, e.message);
        throw e;
    }

    return result;
};


/**
* Gets a new instance of ZakOrderModel
*
* @param {dw.order.Order} parameter  Order instance or {string} orderID
* @returns {module:models/ZakOrderModel} the order model object
*/
ZakOrderModel.get = function (parameter) {
    var obj = null;

    if (typeof parameter === 'string') {
        obj = OrderMgr.getOrder(parameter);
    } else if (typeof parameter === 'object') {
        obj = parameter;
    }

    if (obj === null) {
        return null;
    }

    return new ZakOrderModel(obj);
};


/** The ZakOrderModel class */
module.exports = ZakOrderModel;


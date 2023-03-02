/**
* Module necessary for managing the insert/update operation for custom object 'zakOrderNotifications'
*
* @module models/ZakOrderNotificationModel
*/

'use strict';

var CustomObjectMgr = require('dw/object/CustomObjectMgr');
var zakGlobal = require('*/cartridge/scripts/zakGlobal');


/**
 * ZakOrderNotificationModel class
 *
 * @class module:models/ZakOrderNotificationModel
 * @param {Object} customObject Custom object 'zakOrderNotifications'
 */
var ZakOrderNotificationModel = function (customObject) {
    this.object = customObject;
};


/**
 * Update the instance of 'zakOrderNotifications' custom object
 *
 * @param {ZakOrderNotificationModel.ZakOrderNotificationParameters}  objNotif Parameter of zakOrderNotifications instance
 */
ZakOrderNotificationModel.prototype.updateRecord = function (objNotif) {
    var status = objNotif.status;

    if (status !== zakGlobal.NOTIFICATION_STATUS.OK && status !== zakGlobal.NOTIFICATION_STATUS.ERR) {
        throw new Error('Not valid value for status in ZakOrderNotificationModel.updateRecord');
    }

    var obj = this.object;// customObject
    require('dw/system/Transaction').wrap(function () {
        obj.custom.Status = objNotif.status;
        obj.custom.Message = objNotif.msg;
    });
};


/**
 * Gets a new instance of ZakOrderNotificationModel.
 *
 * @param {string} parameter of ID of 'zakOrderNotifications' or {Object} parameter of zakOrderNotifications instance
 * @returns {module:models/ZakOrderNotificationModel} A new ZakOrderNotificationModel instance.
 */
ZakOrderNotificationModel.get = function (parameter) {
    var obj = null;

    if (typeof parameter === 'string') {
        obj = CustomObjectMgr.getCustomObject('zakOrderNotifications', parameter);
    } else if (typeof parameter === 'object') {
        obj = parameter;
    }

    if (empty(obj)) {
        return null;
    }

    return new ZakOrderNotificationModel(obj);
};


/**
 * Create a new DB record of of zakOrderNotifications custom object.
 *
 * @param {ZakOrderNotificationModel.ZakOrderNotificationParameters} objNotif instance
 * @returns {module:models/ZakOrderNotificationModel} A new ZakOrderNotificationModel instance.
 */
ZakOrderNotificationModel.newRecord = function (objNotif) {
    var objectCreated = null;

    require('dw/system/Transaction').wrap(function () {
        objectCreated = CustomObjectMgr.createCustomObject('zakOrderNotifications', objNotif.orderID);

        objectCreated.custom.Status = zakGlobal.NOTIFICATION_STATUS.ADDED;
        objectCreated.custom.Message = objNotif.msg;
    });

    return ZakOrderNotificationModel.get(objectCreated);
};


/**
 * ZakOrderNotificationModel.ZakOrderNotificationParameters class for passing parameters to ZakOrderNotificationModel methods
 *
 * @class ZakOrderNotificationParameters
 * @param {number} orderID The orderID of order
 * @param {string} status zakGlobal.NOTIFICATION_STATUS
 * @param {string} msg The message
 */
ZakOrderNotificationModel.ZakOrderNotificationParameters = function (orderID, status, msg) {
    this.orderID = orderID;
    this.status = status;
    this.msg = msg;
};


/** The ZakOrderNotificationModel class */
module.exports = ZakOrderNotificationModel;


/*
	MOCK of ZakOrderDtoModel
*/

'use strict';

var zakGlobal=require('../zakGlobal');


var ZakOrderNotificationModel = function(customObject){
    this.object=customObject;
	
    this.updateRecord=function(objNotif){
		
	}
}


ZakOrderNotificationModel.get = function(parameter){
    var obj = null;
	
    if (typeof parameter === 'string') {
        obj = null;
    } else if (typeof parameter === 'object') {
        obj = parameter;
    }
    
    if (empty(obj)){
        return null;
    }
    
    return new ZakOrderNotificationModel(obj);
}


ZakOrderNotificationModel.newRecord=function(objNotif){
    var objectCreated=getCustomObject(objNotif);
	
    return ZakOrderNotificationModel.get(objectCreated);
}


ZakOrderNotificationModel.ZakOrderNotificationParameters=function(orderID, status, msg){
    this.orderID=orderID;
    this.status=status;
    this.msg=msg;
}

var getCustomObject=function(objNotif){
	let objectCreated={
		type: 'zakOrderNotifications', 
		custom: {Status: zakGlobal.NOTIFICATION_STATUS.ADDED, Message: objNotif.msg}, 
		getUUID: function(){return objNotif.orderID;}
	};
	
	return objectCreated;
}


/** The ZakOrderNotificationModel class */
module.exports = ZakOrderNotificationModel;





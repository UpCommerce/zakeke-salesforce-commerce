/*
	MOCK of dw.net.Email
*/
'use strict';


var Email=function(){	
}

Email.prototype.addTo= function(to){};
Email.prototype.setFrom= function(fr){};
Email.prototype.setSubject= function(subject){};
Email.prototype.setContent= function(msg){};
Email.prototype.send= function(){};

module.exports = Email;

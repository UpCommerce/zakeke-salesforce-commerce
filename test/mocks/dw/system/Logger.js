/*
	MOCK of dw.system.Logger
*/
'use strict';

var log={
	debug: function(msg){return ''},
	info: function(msg){return ''},
	error: function(msg){return ''},
	fatal: function(msg){return ''}
}


var Logger=function(){
	
}

Logger.getLogger= function(a, b){ return log; }

module.exports = Logger;
Transaction = function() {};

Transaction.prototype = new Object();

Transaction.begin = function() {};
Transaction.commit = function() {};
Transaction.rollback = function() {};

Transaction.wrap = function(callback) {
	callback();
};

module.exports = Transaction;
'use strict';

var zakekeProductLineItemDecorator = require('*/cartridge/models/productLineItem/decorators/zakekeProductLineItemDecorator');

var base = module.superModule;

/**
 * Decorate order.firstLineItem object with zakekeProductLineItemDecorator
 *
 * @param {dw.order.LineItemCtnr} lineItemContainer - Current users's basket
 * @param {Object} options options
 */
module.exports = function OrderModel(lineItemContainer, options) {
    base.call(this, lineItemContainer, options);

    if (lineItemContainer.allProductLineItems) {
        var firstLine = this.firstLineItem;
        if (firstLine) {
            var optionsNew = { lineItem: lineItemContainer.allProductLineItems[0] };

            zakekeProductLineItemDecorator(this.firstLineItem, null, optionsNew);
        }
    }
};

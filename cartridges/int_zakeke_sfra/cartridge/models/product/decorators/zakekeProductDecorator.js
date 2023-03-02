'use strict';

module.exports = function (product, apiProduct, options) {
    var isProductZakekeCustomizable = false;

    options.msg = '';// Future use for options

    if (!empty(apiProduct.getCustom())) {
        if (!empty(apiProduct.getCustom().ZAKEKE_is_customizable)) {
            isProductZakekeCustomizable = apiProduct.getCustom().ZAKEKE_is_customizable;
        }
    }

    Object.defineProperty(product, 'ZAKEKE_is_customizable', {
        enumerable: true,
        value: isProductZakekeCustomizable
    });
};

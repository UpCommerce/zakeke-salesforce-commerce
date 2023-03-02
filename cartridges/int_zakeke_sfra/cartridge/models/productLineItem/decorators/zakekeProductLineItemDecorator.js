'use strict';

module.exports = function (product, apiProduct, options) {
    var zakekeCompositionID = '';
    var zakekeCompositionPrice = 0;
    var zakekeCompositionPreview = '';
    var zakekeComposition = '';

    var lineItem = options.lineItem;

    if (!empty(lineItem.getCustom())) {
        if (!empty(lineItem.getCustom().ZAKEKE_CompositionID)) {
            zakekeCompositionID = lineItem.getCustom().ZAKEKE_CompositionID;
        }
    }

    if (!empty(zakekeCompositionID)) {
        zakekeCompositionPreview = lineItem.getCustom().ZAKEKE_CompositionPreview;
        zakekeCompositionPrice = lineItem.getCustom().ZAKEKE_CompositionPrice;
        zakekeComposition = lineItem.getCustom().ZAKEKE_Composition;
    }

    Object.defineProperty(product, 'ZAKEKE_CompositionID', {
        enumerable: true,
        value: zakekeCompositionID
    });
    Object.defineProperty(product, 'ZAKEKE_CompositionPreview', {
        enumerable: true,
        value: zakekeCompositionPreview
    });
    Object.defineProperty(product, 'ZAKEKE_CompositionPrice', {
        enumerable: true,
        value: zakekeCompositionPrice
    });
    Object.defineProperty(product, 'ZAKEKE_Composition', {
        enumerable: true,
        value: zakekeComposition
    });
    Object.defineProperty(product, 'ZAKEKE_PatchProducts', {
        enumerable: true,
        value: !empty(lineItem.getCustom().ZAKEKE_PatchProducts) ? lineItem.getCustom().ZAKEKE_PatchProducts : null
    });
    Object.defineProperty(product, 'ZAKEKE_IsPatchLineItem', {
        enumerable: true,
        value: lineItem.getCustom().ZAKEKE_IsPatchLineItem
    });
};

'use strict';

var base = require('base/product/base');

module.exports = {
    zakUpdateButton: function () {
        $('body').on('product:updateAddToCart', function (e, response) {
            var show = false;

            var prod = response.product;
            var ready = (prod.readyToOrder && prod.available);
            var validProductType = (prod.productType === 'variant' || prod.productType === 'standard');

            if (validProductType === true && ready === true) {
                if (prod.ZAKEKE_is_customizable) {
                    show = true;
                }
            }

            if (show) {
                var url = $('#zakUrl').val() + '?pid=' + prod.id;

                $('#zakDiv').html('<div id="zakButtonDiv" class="attribute col-8"><i class="fa fa-spinner fa-pulse fa-1x fa-fw"></i><span class="sr-only">Loading...</span></div>');

                // it isn't called if #zakDiv is undefined (if Zakeke not enabled)
                $('#zakDiv').load(url);
                $('#zakDiv').css('display', 'block');
            } else {
                $('#zakDiv').css('display', 'none');
            }
        });


        $('body').on('click', '#zak-button', function () {
            var url = $('#zak-button').attr('url-data');
            var quantity = base.getQuantitySelected();

            location.href = url + '&quantity=' + quantity;
        });
    }

};

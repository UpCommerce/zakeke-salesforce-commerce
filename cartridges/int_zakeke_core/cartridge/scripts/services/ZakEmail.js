'use strict';


var logger = require('dw/system/Logger').getLogger('ZAKEKE', 'ZAKEKE');
var ZakConfigModel = require('*/cartridge/scripts/models/ZakConfigModel');
var Mail = require('dw/net/Mail');


/**
 * Send email using dw/net/Mail object
 *
 * @param {string} to The email to send to
 * @param {string} from The email to receive from
 * @param {string} subject The subject field
 * @param {string} msg The The msg field
 */
var sendMail = function (to, from, subject, msg) {
    var mail = new Mail();
    mail.addTo(to);
    mail.setFrom(from);
    mail.setSubject(subject);
    // sets the content of the mail as plain string

    mail.setContent(msg);
    mail.send();
};


/**
 * ZakEmail class constructor
 *
 * @class ZakEmail
 * @param {Object} config Zakeke config object
 */
var ZakEmail = function (config) {
    if (empty(config)) {
        config = ZakConfigModel.get().zakekeConfig();
    }
    this.config = config;
};

ZakEmail.prototype.sendEmail = function (subject, msg) {
    var to = this.config.ZAKEKE_Email_To;
    var from = this.config.ZAKEKE_Email_From;

    sendMail(to, from, subject, msg);
    logger.info('Email inviata a=' + to + ' da=' + from);
};


/**
 * Get the ZakEmail object
 *
 * @returns {Object} The ZakEmail model
 */
ZakEmail.get = function () {
    return new ZakEmail();
};


/** The ZakEmail class */
module.exports = ZakEmail;

var Errors = require('../Errors/APIValidationError');
var config = require('../config/config.json');
var moment = require('moment');

module.exports = {

    validateDates: function (from_date, to_date) {

        var invalid_message = 'You must provide a valid date with YYYY-MM-DD format.';

        if (!moment(from_date, "YYYY-MM-DD", true).isValid()) {
            return Promise.reject(new Errors.APIValidationError('Error with the attribute form_date. ' + invalid_message));
        }

        if (!moment(to_date, "YYYY-MM-DD", true).isValid()) {
            return Promise.reject(new Errors.APIValidationError('Error with the attribute to_date. ' + invalid_message));
        }

        if (moment(from_date) > moment(to_date)) {
            return Promise.reject(new Errors.APIValidationError('Error attribute to_date must be greater than attribute from_date.'));
        }

        return Promise.resolve({ from_date: from_date, to_date: to_date });

    },

    validateInteger: function (value, attribute_name) {

        var parsed_value = Number(value);

        if (!Number.isInteger(parsed_value) || parsed_value <= 0) {
            return Promise.reject(new Errors.APIValidationError('Error with the attribute ' + attribute_name + '. You must provide an Integer with value greater than zero.'));
        }

        return Promise.resolve({ value: parsed_value });

    },

}
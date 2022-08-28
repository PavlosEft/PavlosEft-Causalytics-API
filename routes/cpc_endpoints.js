var express = require('express');
var router = express.Router();
var config = require('../config/config.json');
var Helpers = require('../Helpers/Validators');
var Errors = require('../Errors/index');
var moment = require('moment');
var { FB } = require('fb');


router.get('/get', function (req, res, next) {

  var time_increment = req.query.time_increment;
  var from_date = req.query.from_date;
  var to_date = req.query.to_date;
  var limit = config.limit;

  Promise.all([
    Helpers.validateDates(from_date, to_date),
    Helpers.validateInteger(time_increment, "time_increment")
  ])
    .then(result => {

      var fb_query_path = 'act_25064918/insights?fields=campaign_id,campaign_name,impressions,cpc&level=campaign&limit=' 
        + limit + '&time_increment='
        + result[1].value + '&time_range[since]=' 
        + result[0].from_date + '&time_range[until]=' 
        + result[0].to_date;

      FB.options({ version: 'v14.0' });
      FB.setAccessToken(config.access_token);

      return FB.api(fb_query_path, 'get');

    })
    .then(result => {

      var formated_data = [];

      grouped_by_campaign_id = {};

      result.data.forEach(row => {
        if (grouped_by_campaign_id[row.campaign_id]) {
          grouped_by_campaign_id[row.campaign_id].data.push(row);
        } else {
          grouped_by_campaign_id[row.campaign_id] = {
            name: row.campaign_name,
            data: [row]
          };
        }
      })

      var diff_days = moment(to_date).diff(moment(from_date), 'days')

      Object.values(grouped_by_campaign_id).forEach(row => {
        var tempData = [];
        for (var i = 0; i <= diff_days; i++) {
          tmp_date = moment(from_date).add(i, 'days').format('YYYY-MM-DD');
          date_index = row.data.map(r => r.date_start).indexOf(tmp_date);
          if (date_index > -1) {
            tempData.push(row.data[date_index].cpc);
          }
          else {
            tempData.push(null);
          }
        }
        formated_data.push({ label: row.name, data: tempData });
      });

      res.send(formated_data);

    })
    .catch(error => {

      Errors.handleError(error, res);

    });

});

module.exports = router;

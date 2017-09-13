"use strict";

var request = require('request');
var helper = require('./helper');
var config = {};
var authProfileAPI = '/orgProfile';

function utilityAPIs() {
  //common part here
}

utilityAPIs.prototype = {
  //configure application level data which will be used in authentication
  configure: function (options) {
    config = options;
  },

  getAuthProfile: function (token, next) {
    var options = helper.getCertificateConfiguration(config);

    options.url = config.serviceBaseUrl + authProfileAPI;
    options.method = 'GET';
    options.headers = {Authorization: 'Bearer ' + token};
    request(options, function (error, response, body) {
      if (error) {
        next({
          message: error.message ? error.message : "Could not get auth profile. Please contact the administrator for help.",
        }, null);
      }
      else if (response.statusCode !== 200) {
        next({message: body.error, statusCode: response.statusCode}, null);
      }
      else {
        next(null, body);
      }
    }.bind(this));
  },

  getAllAuthProfile: function (token, next) {
    var options = helper.getCertificateConfiguration(config);

    options.url = config.serviceBaseUrl + authProfileAPI + '?allOrgProfiles=true';
    options.method = 'GET';
    options.headers = {Authorization: 'Bearer ' + token};
    request(options, function (error, response, body) {
      if (error) {
        next({
          message: error.message ? error.message : "Could not get auth profile. Please contact the administrator for help.",
        }, null);
      }
      else if (response.statusCode !== 200) {
        next({message: body.error, statusCode: response.statusCode}, null);
      }
      else {
        next(null, body);
      }
    }.bind(this));
  }

};

exports.utilityAPIs = new utilityAPIs();
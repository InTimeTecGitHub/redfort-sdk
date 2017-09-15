"use strict";

var config = {};

var request = require('request');
var helper = require('./helper');

var getUserApi = '/users';
var enrollUserApi = '/signup';
var userUpdateApi = '/user';
var passwordResetApi = '/credential';

function userManager() {
  //common part here
}

userManager.prototype = {
  //configure application level data which will be used in authentication
  configure: function (options) {
    config = options;
  },

  getUsers: function (token, userData, next) {
    var options = helper.getCertificateConfiguration(config);
    options.url = config.serviceBaseUrl + ((userData && userData.userId) ? (getUserApi + '/' + userData.userId ) : getUserApi);
    options.method = 'GET';
    options.headers = {Authorization: 'Bearer ' + token};
    options.json = userData;

    request(options,
        function (error, response, body) {
          if (error) {
            next({
              message: error.message ? error.message : "Could not get the User(s). Please contact the administrator for help.",
            }, null);
          }
          else if (response.statusCode !== 200) {
            next({message: body.error, statusCode: response.statusCode}, null);
          }
          else {
            next(null, body);
          }
        }

            .bind(this)
    )
    ;
  },

  enrollUser: function (token, userData, next) {
    var options = helper.getCertificateConfiguration(config);
    options.url = config.serviceBaseUrl + enrollUserApi;
    options.method = 'POST';
    options.headers = {Authorization: 'Bearer ' + token};
    options.json = userData;

    request(options, function (error, response, body) {
      if (error) {
        next({
          message: error.message ? error.message : "Could not enrol User. Please contact the administrator for help.",
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

  updateUser: function (token, userData, next) {

    var options = helper.getCertificateConfiguration(config);
    options.url = config.serviceBaseUrl + userUpdateApi;
    options.method = 'PUT';
    options.headers = {Authorization: 'Bearer ' + token};
    options.json = userData;

    request(options, function (error, response, body) {
      if (error) {
        next({
          message: error.message ? error.message : "Could not update User. Please contact the administrator for help.",
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

  changePassword: function (token, userData, next) {
    var options = helper.getCertificateConfiguration(config);
    options.url = config.serviceBaseUrl + passwordResetApi;
    options.method = 'PUT';
    options.headers = {Authorization: 'Bearer ' + token};
    options.json = userData;

    request(options, function (error, response, body) {
      if (error) {
        next({
          message: error.message ? error.message : "Could not reset user password. Please contact the administrator for help.",
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

exports.userManager = new userManager();



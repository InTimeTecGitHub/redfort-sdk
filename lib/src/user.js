"use strict";

var config = {};

var request = require('request');

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
    request({
      url: config.serviceBaseUrl + ((userData && userData.userId) ? (getUserApi + '/' + userData.userId ): getUserApi),
      method: 'GET',
      headers: {Authorization: 'Bearer ' + token},
      json : userData
    }, function (error, response, body) {
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
    }.bind(this));
  },
  
  enrollUser: function (token, userData, next) {
    request({
      url: config.serviceBaseUrl + enrollUserApi,
      method: 'POST',
      headers: {Authorization: 'Bearer ' + token},
      json: userData
    }, function (error, response, body) {
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
    request({
      url: config.serviceBaseUrl + userUpdateApi,
      method: 'PUT',
      headers: {Authorization: 'Bearer ' + token},
      json: userData
    }, function (error, response, body) {
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
    request({
      url: config.serviceBaseUrl + passwordResetApi,
      method: 'PUT',
      headers: {Authorization: 'Bearer ' + token},
      json: userData
    }, function (error, response, body) {
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

exports.userManager= new userManager();



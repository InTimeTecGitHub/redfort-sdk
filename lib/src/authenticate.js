var organizationId, applicationId;
var jwt = require('jsonwebtoken');
var request = require('request');

var configuration = {};
var redFortLoginApi = '/signin/';

const expressJwt = require('express-jwt');

//constructor of Authentication file to pre initialize data for authenticate
function Authentication() {
//common functionality
}

function cleanPayload(payload) {
  delete payload.aud;
  delete payload.iss ;
  delete payload.exp;
  delete payload.iat;
  return payload;
}

Authentication.prototype = {
  //configure application level data which will be used in authentication
  configure: function (options) {
    configuration = options;
  },

  //authenticate and generate token for user
  authenticate: function (req, res, next) {
    request({
      url: configuration.serviceBaseUrl + redFortLoginApi,
      method: 'POST',
      timeout: 5000,
      json: {username: req.body.username, password: req.body.password}
    }, function (error, response, body) {
      if (error) {
        next({
          message: error.message ? error.message : "Could not authenticate the User.Please contact the administrator for help.",
        }, null);
      }
      else if (response.statusCode !== 200) {
        next({message: body.error, statusCode: response.statusCode}, null);
      }
      else {
        var resData = body.data;
        resData.token = this.generateToken(body.data);
        next(null, resData);
      }
    }.bind(this));
  },

    generateToken: function (user) {
        return jwt.sign(user, configuration[user.orgName].secret, {
            audience: configuration[user.orgName].audience,
            issuer: configuration[user.orgName].issuer,
            expiresIn: configuration[user.orgName].expireTime
        });
    },

    verify: function (options) {
        var generateToken = this.generateToken;

        function secretCallBack(req, payload, done) {
            if (payload) {
                payload= cleanPayload(payload);
                req.headers['x-token'] = generateToken(payload);
                payload.secret = configuration[payload.orgName].secret;
                options.secret(req, payload, done);
            }
            else {
                done(null, new Error('unrecognized or missing secret'));
            }
        }

        return expressJwt({secret: secretCallBack});
    }
};

/**
 * Expose `Authentication`.
 */
//module.exports = Authentication;
exports.Authentication = new Authentication();


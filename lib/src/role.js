var config = {};
var request = require('request');
var roles = '/roles';
var userRoles = '/userRoles';
var userRole = '/userRole';

function Role() {
  //common part
}

Role.prototype = {
  configure: function (options) {
    config = options;
  },
  /***
   * Get the roles of Organization and also can get the roles permissions based on roleName
   * @param token
   * @param request object which consider object
   * @param next   callback
   */

  getRoles: function (token, requestData, next) {
    var options = getCertificateConfiguration();
    if (requestData && requestData.tenant) {
      options.url = config.serviceBaseUrl + roles + '?tenant=' + requestData.tenant;
    } else if (requestData.roleName) {
      options.url = config.serviceBaseUrl + roles + '?roleName=' + requestData.roleName;
    } else {
      options.url = config.serviceBaseUrl + roles;
    }
    options.method = 'GET';
    options.headers = {Authorization: 'Bearer ' + token};

    request(options, function (error, response, body) {
      if (error) {
        next({
          message: error.message ? error.message : "Could not get roles. Please contact the administrator for help."
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
  /***
   * Get user role and there associated permissions
   * @param token
   * @param requestData
   * @param next
   */
  getUserRole: function (token, requestData, next) {
    var options = getCertificateConfiguration();
    if (requestData.roleName && requestData.orgId) {
      options.url = config.serviceBaseUrl + userRoles + '?roleName=' + requestData.roleName + '&orgId=' + requestData.orgId;
    } else if (requestData.userId) {
      options.url = config.serviceBaseUrl + userRoles + '?userName=' + requestData.userId;
    }
    options.method = 'GET';
    options.headers = {Authorization: 'Bearer ' + token};

    request(options, function (error, response, body) {
      if (error) {
        next({
          message: error.message ? error.message : "Could not get User roles. Please contact the administrator for help."
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

  /***
   * Add User Role into DB
   * @param token
   * @param requestData contains userName and roleName
   * @param next
   */
  userRole: function (token, requestData, next) {
    var options = getCertificateConfiguration();
    options.url = config.serviceBaseUrl + userRole;
    options.method = 'POST';
    options.headers = {Authorization: 'Bearer ' + token};
    options.json = requestData;

    request(options, function (error, response, body) {
      if (error) {
        next({
          message: error.message ? error.message : "Could not get User roles. Please contact the administrator for help."
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

  /****
   * Remove user role and there associated permission
   * @param token
   * @param requestData {"userName":"support.portico@intimetec.com","roleName":"Admin"}
   * @param next
   */
  revokeUserRole: function (token, requestData, next) {
    var options = getCertificateConfiguration();
    options.url = config.serviceBaseUrl + userRole;
    options.method = 'DELETE';
    options.headers = {Authorization: 'Bearer ' + token};
    options.json = requestData;

    request(options, function (error, response, body) {
      if (error) {
        next({
          message: error.message ? error.message : "Could not delete User roles. Please contact the administrator for help."
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


function getCertificateConfiguration() {
  var options = {};
  if (config.requestOptions) {
    if (config.requestOptions.hasOwnProperty('rejectUnauthorized')) {
      options.rejectUnauthorized = config.requestOptions.rejectUnauthorized;
    }

    if (config.requestOptions.cert) {
      options.cert = config.requestOptions.cert;
    }
  }

  return options;
}

exports.Role = new Role();
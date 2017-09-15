var config = {};
var request = require('request');
var userResourceApi = '/userResource';
var resourcesApi = '/resource';
var checkAccessAPI = '/checkAccess';
var grantAPI = '/grantAccess';
var revokeAPI = "/revokeAccess";

function authorize() {
  //common part
}

authorize.prototype = {
  configure: function (options) {
    config = options;
  },

  revokeAccess: function (token, revokeData, next) {
    var options = getCertificateConfiguration();

    options.url = config.serviceBaseUrl + revokeAPI;
    options.method = 'POST';
    options.headers = {Authorization: 'Bearer ' + token};
    options.json = revokeData;

    request(options, function (error, response, body) {
      if (error) {
        next({
          message: error.message ? error.message : "Could not revoke access. Please contact the administrator for help.",
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

  /**
   * provide
   * @param token
   * @param data
   * @param next
   */
  getAllResourcesOfUser: function (token, data, next) {
    var options = getCertificateConfiguration();
    options.url = config.serviceBaseUrl + userResourceApi + "/" + data.userId;
    options.method = "GET";
    options.headers = {Authorization: 'Bearer ' + token};

    request(options, function (error, response, body) {
      if (error) {
        next({
          message: error.message ? error.message : "Could not get resources of user. Please contact the administrator for help.",
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

  getResourceDataByResourceId: function (token, data, next) {
    var options = getCertificateConfiguration();
    options.url = config.serviceBaseUrl + resourcesApi + "/" + data.resourceId;
    options.method = 'GET';
    options.headers = {Authorization: 'Bearer ' + token};
    request(options, function (error, response, body) {
      if (error) {
        next({
          message: error.message ? error.message : "Could not get resource. Please contact the administrator for help.",
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

  /**
   *{ userId: '', resourceType: '', resourceObjectId: 'this is optional', permission: 'own' }
   * @param accessData
   */
  checkAccess: function (token, accessData, next) {
    var options = getCertificateConfiguration();
    options.url = config.serviceBaseUrl + checkAccessAPI;
    options.method = 'POST';
    options.headers = {Authorization: 'Bearer ' + token};
    options.json = accessData;

    request(options, function (error, response, body) {
      if (error) {
        next({
          message: error.message ? error.message : "Could not check access. Please contact the administrator for help.",
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
  /**
   * [{userId/groupId/roleId: '', resourceClass: '', resourceObjectId: '', permissions: ['own', 'edit', 'view']}]
   * @param grantData
   */
  grantAccess: function (token, grantData, next) {

    var options = getCertificateConfiguration();

    if (grantData && grantData.length > 0) {
      var formattedData = formatAccessData("allow", grantData);

      options.url = config.serviceBaseUrl + grantAPI;
      options.method = 'POST';
      options.headers = {Authorization: 'Bearer ' + token};
      options.json = formattedData;

      request(options, function (error, response, body) {
        if (error) {
          next({
            message: error.message ? error.message : "Could not grant access. Please contact the administrator for help.",
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
    else {
      next({message: "There is nothing on which access need to be granted"}, null);
    }
  }
};

function formatAccessData(accessType, accessData) {
  var formattedData = [];
  for (var index = 0; index < accessData.length; index++) {
    var pos = -1;
    if (accessData[index]["userId"] || accessData[index]["groupId"] || accessData[index]["roleId"]) {
      if (accessData[index]["userId"]) {
        pos = getElementByPrincipalId("user", formattedData, accessData[index]["userId"]);
        if (pos < 0) {
          formattedData.push({"Permission": accessType, "Principal": [{"user": accessData[index]["userId"]}]});
          pos = formattedData.length - 1;
        }
      }
      else if (accessData[index]["groupId"]) {
        pos = getElementByPrincipalId("group", formattedData, accessData[index]["groupId"]);
        if (pos < 0) {
          formattedData.push({
            "Permission": accessType, "Principal": [{"group": accessData[index]["groupId"]}]
          });
          pos = formattedData.length - 1;
        }
      }
      else if (grantData[index]["roleId"]) {
        pos = getElementByPrincipalId("role", formattedData, accessData[index]["roleId"]);
        if (pos < 0) {
          formattedData.push({
            "Permission": accessType, "Principal": [{"role": accessData[index]["roleId"]}]
          });
          pos = formattedData.length - 1;
        }
      }

      if (!formattedData[pos]["Operation"]) {
        formattedData[pos]["Operation"] = [];
      }
      if (!formattedData[pos]["Resource"]) {
        formattedData[pos]["Resource"] = [];
      }

      formattedData[pos]["Operation"].push({
        "resourceType": accessData[index]["resourceClass"],
        "action": accessData[index].permissions
      });
      formattedData[pos]["Resource"].push({
        "resourceType": accessData[index]["resourceClass"],
        "resourceId": accessData[index]["resourceObjectId"]
      });
    }
  }

  return formattedData;
}

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

function getElementByPrincipalId(PrincipalType, data, id) {
  for (var index = 0; index < data.length; index++) {
    for (var jndex = 0; jndex < data[index].Principal.length; jndex++) {
      if (data[index].Principal[jndex][PrincipalType] && data[index].Principal[jndex][PrincipalType] == id) {
        return index;
      }
    }
  }
  return -1;
}

exports.authorize = new authorize();
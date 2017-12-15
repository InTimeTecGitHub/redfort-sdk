/**
 * Module dependencies.
 */
var config = {};
var authentication = require('./src/authenticate').Authentication;
var user = require('./src/user').userManager;
var authorize = require('./src/authorize').authorize;
var utilityApis = require('./src/utilityAPIs').utilityAPIs;
var roles = require('./src/role').Role;


function RedfortSdk() {
//common part here
}

RedfortSdk.prototype = {
  configure: function (options) {
    config = options;
    authentication.configure(config);
    user.configure(config);
    authorize.configure(config);
    utilityApis.configure(config);
    roles.configure(config);
  },

  auth: authentication,
  userManager: user,
  authorize: authorize,
  utilityAPIs: utilityApis,
  roles: roles
};


/**
 * Export default singleton.
 * @api public
 */
exports = module.exports = new RedfortSdk;



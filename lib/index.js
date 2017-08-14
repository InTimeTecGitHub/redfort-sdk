/**
 * Module dependencies.
 */
var config = {};
var authentication = require('./src/authenticate').Authentication;
var user = require('./src/user').userManager;
var authorize = require('./src/authorize').authorize;
var utilityApis = require('./src/utilityAPIs').utilityAPIs;


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
    },

    auth: authentication,
    userManager: user,
    authorize: authorize,
    utilityAPIs: utilityApis
};


/**
 * Export default singleton.
 * @api public
 */
exports = module.exports = new RedfortSdk;



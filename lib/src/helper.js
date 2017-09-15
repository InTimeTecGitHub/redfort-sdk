exports.getCertificateConfiguration = function getCertificateConfiguration(config) {
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
};
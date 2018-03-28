var exec = require('child_process').exec;
var util = require('util');
var env = require('./env');

var escapeShell = function(cmd) {
    return '"'+cmd.replace(/(["\s'$`\\])/g,'\\$1')+'"';
};

function connectToWifi(config, ap, callback) {
  // Default to timeout of 10s; can be overriden by config.timeout
  var timeoutStr = "-w ";
  timeoutStr += (typeof(config.timeout) == "number") ? config.timeout : 10;

  var commandStr = "nmcli "+timeoutStr+" device wifi connect '" + ap.ssid + "'" +
      " password " + "'" + ap.password + "'" ;

  if (config.iface) {
      commandStr = commandStr + " ifname " + config.iface;
  }

  console.log('connectToWifi - '+commandStr);

    // commandStr = escapeShell(commandStr);

  exec(commandStr, env, function(err, resp) {
      callback && callback(err);
  });
}


module.exports = function (config) {

    return function(ap, callback) {
      if (callback) {
        connectToWifi(config, ap, callback);
      } else {
        return new Promise(function (resolve, reject) {
          connectToWifi(config, ap, function (err) {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          })
        });
      }
    }
}

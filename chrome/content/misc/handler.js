/* Handler */

var EXPORTED_SYMBOLS = ["papayaHandler"];
Components.utils.import("resource://sxEdit/namespaces.jsm");
Components.utils.import("resource://xmpp4moz/xmpp.jsm");

var papayaHandler = {
  roster : function (aObject) {},
};


const Cc = Components.classes;
const Co = Components.constructor;
const Ci = Components.interfaces;
const Cu = Components.utils;
const Cr = Components.results;

var utils = {
  restart : function() {
    Cc["@mozilla.org/toolkit/app-startup;1"]
      .getService(Ci.nsIAppStartup)
      .quit(Ci.nsIAppStartup.eForceQuit | Ci.nsIAppStartup.eRestart);
  },

  quit : function(aForceQuit) {
    var appStartup = Cc['@mozilla.org/toolkit/app-startup;1']
                        .getService(Components.interfaces.nsIAppStartup);
    var quitSeverity = aForceQuit ? Components.interfaces.nsIAppStartup.eForceQuit :
                                    Components.interfaces.nsIAppStartup.eAttemptQuit;
    appStartup.quit(quitSeverity);
  },
};

/* TOOLS */

// XXX Unicity control fails : need to find a safest way for generating random ID (timestamp based ?)
function randomString(length) {
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  var string = '';
  for (var i=0; i<length; i++) {
     var rnum = Math.floor(Math.random() * chars.length);
     string += chars.substring(rnum,rnum+1);
  }

  return string;
}


function trace(message, sender) {
  if (!sender)
    sender = "sxEdit";
  var CONSOLE_SERVICE = Components.classes['@mozilla.org/consoleservice;1']
                                  .getService(Components.interfaces.nsIConsoleService);
  try {
    CONSOLE_SERVICE.logStringMessage(sender + ": " + message);
  } catch(e) {}
}

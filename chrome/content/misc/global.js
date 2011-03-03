/* Globals */

Components.utils.import("resource://sxEdit/namespaces.jsm");

var gDialog = {};
var gSxe    = {};
var gShowTimestamps = false;
var gLastSender = "";
var chatHistory = [];
var chatHistoryIndex = 0;
var prefs 	= null;

function Startup() {

  /* Get preferences */
  prefs = Components.classes["@mozilla.org/preferences-service;1"]
                    .getService(Components.interfaces.nsIPrefService);
  prefs = prefs.getBranch("xmpp.account.sxedit.")

  /* Sidebar */
  gDialog.upDownButton    = document.getElementById("upDownButton");
  gDialog.shareButton     = document.getElementById("shareButton");
  gDialog.progressMetter  = document.getElementById("progressMetter");
  gDialog.treeButton      = document.getElementById("treeButton");
  gDialog.optionsButton   = document.getElementById("optionsButton");

  gDialog.peopleList    = document.getElementById("peopleList");
  gDialog.chat          = document.getElementById("chat");
  gDialog.chatInput     = document.getElementById("chatInput");
  gDialog.chatInputSend = document.getElementById("chatInputSend");

  gShowTimestamps 		= prefs.getBoolPref("timestamp");
  
  /* Sxe engine */
  gSxe.room             = prefs.getCharPref("muc");
  gSxe.initiator        = "";
  gSxe.sessionInit      = "";
  gSxe.jingleInit       = "";

}

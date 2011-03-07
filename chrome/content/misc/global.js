/* Globals */

Components.utils.import("resource://sxEdit/namespaces.jsm");

var gPrefs   = null; // User preferences
var gChannel = null; // XMPP channel
var gSXE     = {};   // SXE engine
var gMUC     = {};   // Multi-User Chat
var gDialog  = {};   // UI elements

function Startup() {

  // Get preferences
  gPrefs = Components.classes["@mozilla.org/preferences-service;1"]
                     .getService(Components.interfaces.nsIPrefService);
  gPrefs = gPrefs.getBranch("xmpp.account.sxedit.")

  // Sidebar elements
  gDialog.upDownButton   = document.getElementById("upDownButton");
  gDialog.shareButton    = document.getElementById("shareButton");
  gDialog.progressMetter = document.getElementById("progressMetter");
  gDialog.treeButton     = document.getElementById("treeButton");
  gDialog.optionsButton  = document.getElementById("optionsButton");

  gDialog.peopleList     = document.getElementById("peopleList");
  gDialog.timestampsItem = document.getElementById("timestampsItem");
  gDialog.chat           = document.getElementById("chat");
  gDialog.chatInput      = document.getElementById("chatInput");
  gDialog.chatInputSend  = document.getElementById("chatInputSend");

  // Multi-User Chat
  gMUC.showTimestamps = gPrefs.getBoolPref("timestamp");
  gMUC.lastSender     = "";
  gMUC.history        = [];
  gMUC.historyIndex   = 0;

  // SXE engine
  gSXE.room           = gPrefs.getCharPref("muc");
  gSXE.initiator      = "";
  gSXE.sessionInit    = "";
  gSXE.jingleInit     = "";

}

/* Globals */

Components.utils.import("resource://sxEdit/namespaces.jsm");

var gDialog = {};
var gSxe    = {};
var needTimestamp = false;
var chatHistory = [];
var chatHistoryIndex = 0;

function Startup() {

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

  /* Sxe engine */
  gSxe.room             = "sxe@conference.papaya.im";
  gSxe.initiator        = "";
  gSxe.sessionInit      = "";
  gSxe.jingleInit       = "";

}

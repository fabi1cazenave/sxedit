Components.utils.import('resource://xmpp4moz/utils.jsm');

function setPwd(password) {
  var address = document.getElementById('textbox-address').value;
  setPassword(address, password);
};

function getPwd() {
  var textbox = document.getElementById('textbox-password');
  var address = document.getElementById('textbox-address').value;
  var password = getPassword(address);
  if (password) {
    textbox.value = password;
  }
};

function updateOptions() {
  window.opener.gSxe.room = window.opener.prefs.getCharPref("muc");
  window.opener.gShowTimestamps = window.opener.prefs.getBoolPref("timestamp");
  
  var menuitem = window.opener.document.getElementById("itemTimestamps");
  var chatBody = window.opener.gDialog.chat.contentDocument.body;
  if(window.opener.gShowTimestamps){
    window.opener.showTimestamps(menuitem, chatBody);
  }else{
    window.opener.removeTimestamps(menuitem, chatBody);
  }
};

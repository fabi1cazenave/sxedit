/**
  * GUI HANDLE
  **/

function sendChat() {

  // what we send to whom ?
  var toSend = gDialog.chatInput.value;
  var sendTo = gSXE.room;

  // constructs the XMPP message
  var msg =   <message to={sendTo} type='groupchat'>
                  <body>{toSend}</body>
              </message>;

  // sends the message
  XMPP.accounts.forEach(function(account) { XMPP.send(account, msg); });
}


// XXX Separer MVC

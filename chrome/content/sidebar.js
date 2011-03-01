/* TOOLBAR ACTIONS */

// connect Button
function xmppUpDown() {
  XMPP.accounts.forEach(function(account) {
    // if the connection is up
    if (XMPP.isUp(account)) {
      // closes the connection
      XMPP.down(account);

      // cleans the listboxes
      cleanBoxes();

      // changes gui
      gDialog.upDownButton.setAttribute("state", "down");
      gDialog.upDownButton.setAttribute("tooltiptext", "Connect");
      gDialog.shareButton.setAttribute("state", "disabled");
      gDialog.shareButton.setAttribute("disabled", "true");
      gDialog.peopleList.setAttribute("disabled", "true");
      //gDialog.chat.setAttribute("disabled", "true");
      gDialog.chatInput.disabled = true;
      gDialog.chatInputSend.disabled = true;

      // writes a msg in the chat view
      addMessageToChat("** Disconnected from XMPP network");
    }

    else {
      // ups the user Jabber account
      XMPP.up(account, function() {
        // creates the XMPP communication channel
        channels();

        // cleans the listboxes
        cleanBoxes();

        // changes gui
        gDialog.upDownButton.setAttribute("state", "up");
        gDialog.upDownButton.setAttribute("tooltiptext", "Disconnect");
        gDialog.shareButton.setAttribute("state", "on");
        gDialog.shareButton.setAttribute("disabled", "false");
        gDialog.peopleList.setAttribute("disabled", "false");
        //gDialog.chat.setAttribute("disabled", "false");
        gDialog.chatInput.disabled = false;
        gDialog.chatInputSend.disabled = false;

        // writes a msg in the chat view
        addMessageToChat("** Connected to XMPP network");

        // joins the Room
        var sendTo = gSxe.room + "/" + account.jid;
        var stanza = <presence to={sendTo} />;
        XMPP.accounts.forEach(function(account) { XMPP.send(account, stanza); });

        // writes a msg in the chat view
        // var line = document.createElement("listitem");
        // var what = "** ROOM ("+gSxe.room+") joined";
        // line.setAttribute("label", what);
        // gDialog.chat.appendChild(line);
        // gDialog.chat.ensureElementIsVisible(line);
      });
    }
  });
}

function addMessageToChat(mess) {
  var needScroll = true;
  // if(gDialog.chat.contentDocument.body.scrollTop == gDialog.chat.contentDocument.body.scrollHeight) {
    // needScroll = true;
  // }
  var line = gDialog.chat.contentDocument.createElement("p");

  var msg = gDialog.chat.contentDocument.createElement("span");
  msg.textContent = mess;

  var d = new Date();
  var timestamp = gDialog.chat.contentDocument.createElement("span");
  timestamp.setAttribute( "name", "timestamp" );
  timestamp.className = "hTimestamp";
  timestamp.textContent = "[" + checkTime(d.getHours()) + ":" + checkTime(d.getMinutes()) + "] ";

  line.appendChild(timestamp);
  line.appendChild(msg);
  gDialog.chat.contentDocument.body.appendChild(line);

  if (needScroll) {
    gDialog.chat.contentDocument.body.scrollTop = gDialog.chat.contentDocument.body.scrollHeight;
  }
}

function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}


/* Fields cleaners */
function cleanBoxes() {
  while (gDialog.peopleList.hasChildNodes()) {
    gDialog.peopleList.removeChild(gDialog.peopleList.firstChild);
  }

  while (gDialog.chat.hasChildNodes()) {
    gDialog.chat.removeChild(gDialog.chat.firstChild);
  }
}

function manageTimestamp() {
  needTimestamp = !needTimestamp;
  if(needTimestamp) {
    var stamps = gDialog.chat.contentDocument.getElementsByName("timestamp");
    for(i=0; i<stamps.length; i++) {
      stamps[i].className = "vTimestamp";
    }
  } else {
    var stamps = gDialog.chat.contentDocument.getElementsByName("timestamp");
    for(i=0; i<stamps.length; i++) {
      stamps[i].className = "hTimestamp";
    }
  }
}

function reset() {
  gDialog.chatInput.value = '';
}



/* Toolbar menupopup */

function aboutconfigWindow() {
  window.openDialog(
  'about:config',
  "",
  "chrome,menubar,extra-chrome,toolbar,dialog=no,resizable"
  );
};

function xmppconsoleWindow(){
  window.openDialog(
  "chrome://xmppdev/content/console.xul",
  "",
  "chrome,menubar,extra-chrome,toolbar,dialog=no,resizable");
};

function optionsWindow(){
  window.openDialog(
  "chrome://sxEdit/content/options/options.xul",
  "Preferences",
  "chrome,menubar,extra-chrome,toolbar,dialog=no,resizable"
  );
};

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
  var chatContent = gDialog.chat.contentDocument;
  var needScroll = isScrolledToBottom();

  // create message paragraph
  var line = chatContent.createElement("p");
  var msg  = chatContent.createElement("span");
  msg.textContent = mess;

  // create timestamp span
  function checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }
  var d = new Date();
  var timestamp = chatContent.createElement("span");
  timestamp.className = "timestamp";
  timestamp.textContent = "[" + checkTime(d.getHours()) + ":" + checkTime(d.getMinutes()) + "] ";

  // append full message to the chat page
  line.appendChild(timestamp);
  line.appendChild(msg);
  chatContent.body.appendChild(line);

  if (needScroll) {
    scrollToBottom();
  }
}

// toggle timestamps in the chat box
function toggleTimestamps(menuitem) {
  var chatBody = gDialog.chat.contentDocument.body;
  gShowTimestamps = !gShowTimestamps;

  if (gShowTimestamps) {
    var needScroll = isScrolledToBottom();
    chatBody.className = "showTimestamp";
    menuitem.setAttribute("checked", "true");
    if (needScroll) {
      scrollToBottom();
    }
  } else {
    chatBody.className = "";
    menuitem.removeAttribute("checked");
  }
}

// scroll chat box to bottom
function scrollToBottom() {
  var chatPage = gDialog.chat.contentDocument.lastChild; // <html> element
  chatPage.scrollTop = chatPage.scrollHeight;
}
function isScrolledToBottom() {
  var needScroll = false;
  var chatPage = gDialog.chat.contentDocument.lastChild; // <html> element
  var before = chatPage.scrollTop;
  chatPage.scrollTop = chatPage.scrollHeight;
  if (chatPage.scrollTop == before) {
    needScroll = true;
  } else {
    chatPage.scrollTop = before;
  }
  return needScroll;
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

function reset() {
  gDialog.chatInput.value = '';
}

/* Toolbar menupopup */

function aboutConfigWindow() {
  window.openDialog(
    'about:config',
    "",
    "chrome,menubar,extra-chrome,toolbar,dialog=no,resizable"
  );
};

function xmppConsoleWindow(){
  window.openDialog(
    "chrome://xmppdev/content/console.xul",
    "",
    "chrome,menubar,extra-chrome,toolbar,dialog=no,resizable"
  );
};

function optionsWindow(){
  window.openDialog(
    "chrome://sxEdit/content/options/options.xul",
    "Preferences",
    "chrome,menubar,extra-chrome,toolbar,dialog=no,resizable"
  );
};

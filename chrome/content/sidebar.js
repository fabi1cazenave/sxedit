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
      addMessageToChat("*", "Disconnected from XMPP network");
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
        addMessageToChat("*", "Connected to XMPP network");

        // joins the Room
        var sendTo = gSXE.room + "/" + account.jid;
        var stanza = <presence to={sendTo} />;
        XMPP.accounts.forEach(function(account) { XMPP.send(account, stanza); });

        // writes a msg in the chat view
        // var line = document.createElement("listitem");
        // var what = "** ROOM ("+gSXE.room+") joined";
        // line.setAttribute("label", what);
        // gDialog.chat.appendChild(line);
        // gDialog.chat.ensureElementIsVisible(line);

        if (gMUC.showTimestamps) {
          var chatBody = gDialog.chat.contentDocument.body;
          var menuitem = document.getElementById("itemTimestamps");
          showTimestamps(menuitem, chatBody);
        }
      });
    }
  });
}

function addMessageToChat(who, mess, stamp) {
  var chatContent = gDialog.chat.contentDocument;
  var needScroll = isScrolledToBottom();

  // create message paragraph
  var line = chatContent.createElement("p");
  line.className = who;
  line.addEventListener("mouseover", manageHighLight, false);

  // create sender span
  var sender = chatContent.createElement("span");
  if (gMUC.lastSender != who || gMUC.lastSender.length == 0) {
    sender.className = "sender";
    sender.textContent = who;
    gMUC.lastSender = who;
  }

  // create message span
  var message = chatContent.createElement("span");
  message.className = "message";
  message.textContent = mess;

  // create timestamp span
  if (!stamp) {
    function twoDigits(i) {
      return (i < 10) ? "0" + i : i;
    }
    var d = new Date();
    stamp = twoDigits(d.getHours()) + ":" + twoDigits(d.getMinutes());
  }
  var timestamp = chatContent.createElement("span");
  timestamp.className = "timestamp";
  timestamp.textContent = stamp;

  // append full message to the chat page
  line.appendChild(sender);
  line.appendChild(timestamp);
  line.appendChild(message);
  chatContent.body.appendChild(line);

  if (needScroll) {
    scrollToBottom();
  }
}

// toggle timestamps in the chat box
function toggleTimestamps(menuitem) {
  var chatBody = gDialog.chat.contentDocument.body;
  gMUC.showTimestamps = !gMUC.showTimestamps;
  gPrefs.setBoolPref("timestamp", gMUC.showTimestamps);

  if (gMUC.showTimestamps) {
    showTimestamps(menuitem, chatBody);
  } else {
    hideTimestamps(menuitem, chatBody);
  }
}
function showTimestamps(menuitem, chatBody) {
  var needScroll = isScrolledToBottom();
  chatBody.className = "showTimestamps";
  menuitem.setAttribute("checked", "true");
  if (needScroll) {
    scrollToBottom();
  }
}
function hideTimestamps(menuitem, chatBody) {
  chatBody.className = "";
  menuitem.removeAttribute("checked");
}

// XXX
function manageHighLight() {
  var lines = gDialog.chat.contentDocument.getElementsByTagName("p");
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].className == this.className) {
      lines[i].style.backgroundColor = "#DBFFD6";
    } else {
      lines[i].style.backgroundColor = "white";
    }
  }
}
function clearHighLight() {
  var lines = gDialog.chat.contentDocument.getElementsByTagName("p");
  for (var i = 0; i < lines.length; i++) {
    lines[i].style.backgroundColor = "white";
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

function manageSendChat() {
  if (gDialog.chatInput.value != '') {
    sendChat();
    gMUC.history.push(gDialog.chatInput.value);
    gMUC.historyIndex = gMUC.history.length;
    reset();
  }
}

function manageKey(event) {
  if (event.keyCode == 13) { // return key
    manageSendChat();
  } else if (event.keyCode == 38) { // up key
    if (gMUC.historyIndex > 0) {
      if (gDialog.chatInput.value != '' && gMUC.historyIndex == gMUC.history.length) {
        gMUC.history.push(gDialog.chatInput.value);
      }
      gMUC.historyIndex--;
      gDialog.chatInput.value = gMUC.history[gMUC.historyIndex];
    }
  } else if (event.keyCode == 40) { // down key
    if (gMUC.historyIndex < gMUC.history.length) {
      gMUC.historyIndex++;
      if (gMUC.historyIndex == gMUC.history.length) {
        gDialog.chatInput.value = '';
      } else {
        gDialog.chatInput.value = gMUC.history[gMUC.historyIndex];
      }
    }
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

function xmppOptionsWindow(){
  window.openDialog(
    "chrome://sxEdit/content/options/options.xul",
    "Preferences",
    "chrome,menubar,extra-chrome,toolbar,dialog=no,resizable"
  );
};

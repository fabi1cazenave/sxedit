/**
  * STANZAS
  **/

// creates and returns a Presence message, over the SXE protocol
function sxePresence (from, session) {
  default xml namespace = ns_sxe ;                                            // set the namespace
  var sxe = <sxe session={session}/>;                                         // the sxe message
  return _presence(from, null, null, sxe);                                    // returns complete stanza
}

// creates and returns a Session Connection message
function sxeSessionConnection (from, dest, session) {
  default xml namespace = ns_sxe;                                             // set the namespace
  var sxe =   <sxe id='e' session={session}>
                  <connect/>
              </sxe>;                                                         // sxe message          
  return _message(from, dest, sxe);                                           // returns complete stanza
}

// creates and returns the sxe message for any ACK message
function sxeAck (id, from, dest) {
  return _iq(from, dest, id, 'result', null);
}

/**
  * TODO: detect modifications in the main window
  */

var gCurrentNode = null; // DOM node being edited
var gCurrentHTML = "";   // innerHTML of the current node
var gCurrentSxeID = "";  // sxeID of the current node
var gLockTimeOutID = null;

function sxeSendModifiedNode(node) {
  // TODO: send modifications of gCurrentNode over SXE
  if (node) {
    trace(node.innerHTML);
    if(node.nodeName.toLowerCase() == 'body') {
      return;
    }

    // Send modifications
    if(node.hasAttribute('sxeid')) {
      var locker = node.getAttribute('locker');
      
      // If you are not the locker, you don't send the modifications added to the node
      XMPP.accounts.forEach(function(account) {
        if(locker != account.jid)
          return;
      });
    
      var target = node.getAttribute('sxeid');
      var version = 0;
      var chdata = node.innerHTML;
      var sxeSetElement = getSXESetElement (target, version, chdata, node);
      // sends the msg
      XMPP.accounts.forEach(function(account) {
        for(var i = 0; i < gDialog.peopleList.itemCount; i++) {
          var user = gDialog.peopleList.getItemAtIndex(i).getAttribute("label");
          if(user != account.jid) {
            var msg = sxeEdit(account.jid, user, "sxesession", sxeSetElement);
            XMPP.send(account, msg);
            trace(msg);
          }
        }
      });
      
    // Send new node
    }else {
      var sxeID = randomString(10);
      node.setAttribute('sxeid', sxeID);
      var version = '0';
      var pweight = '0';
      var parent = node.parentNode.getAttribute('sxeid');
      var name = node.nodeName;
      var ns = 'namespace';
      
      XMPP.accounts.forEach(function(account) {
        var editor = window.top.document.getElementById('content-frame').contentDocument;
        var elem = editor.querySelector('[locker="' + account.jid + '"]');
        node.setAttribute("locker", account.jid);
        node.setAttribute("style", "border: 5px groove " + gPrefs.getCharPref("color") + ";padding:1px;");
      });
      var sxeElement = getSXEElement (node, sxeID, "element", version, parent, pweight, ns, name);
      
      // sends the msg
      XMPP.accounts.forEach(function(account) {
        for(var i = 0; i < gDialog.peopleList.itemCount; i++) {
          var user = gDialog.peopleList.getItemAtIndex(i).getAttribute("label");
          if(user != account.jid) {
            var msg = sxeEdit(account.jid, user, "sxesession", sxeElement);
            XMPP.send(account, msg);
            trace(msg);
          }
        }
      });
    }
  }
}

var editor = window.top.document.getElementById('content-frame');
editor.onkeypress = function(event) {
  var focusNode = window.top.gLastFocusNode;
  if (focusNode) {
    if(focusNode.hasAttribute('locker')) {
      var locker = focusNode.getAttribute('locker');
      // If the node doesn't belong to me, I can't insert stuffs in it
      XMPP.accounts.forEach(function(account) {
        if(locker != account.jid) {
          event.stopPropagation ();
          event.preventDefault();
        }
      });
    }
  }
};

window.setInterval(function() {
  var focusNode = window.top.gLastFocusNode;
  if (!focusNode) {
    // document not ready yet
    gCurrentNode = null;
    gCurrentHTML = "";
    gCurrentSxeID = "";
    return;
  } 
  
  var inBody = false;
  
  // We don't bother with body element at the moment, but we remove the locker of another element if we get out of it
  if(focusNode.nodeName.toLowerCase() == 'body') {
    
    /*if(gCurrentNode && gCurrentNode.nodeName.toLowerCase() != 'body') {
      gCurrentNode.removeAttribute('locker');
      sxeSendModifiedNode(gCurrentNode);
      gCurrentNode = focusNode;
    }*/
    inBody = true;
  }
  
  var notMyNode = false;
  
  // First, we see if a locker has been set
  if(focusNode.hasAttribute('locker')) {
    var locker = focusNode.getAttribute('locker');
    // If the node doesn't belong to me, I quit
    XMPP.accounts.forEach(function(account) {
      if(locker != account.jid) {
        // gCurrentNode = focusNode;
        // gCurrentHTML = focusNode.innerHTML;
        // gCurrentSxeID = "";
        notMyNode = true;
      }
    });
    
  }else if(!inBody) {
    XMPP.accounts.forEach(function(account) {
      focusNode.setAttribute("locker", account.jid);
      focusNode.setAttribute("style", "border: 5px groove " + gPrefs.getCharPref("color") + ";padding:1px;");
    });
    // gLockTimeOutID = window.setTimeout(function() {
      // gCurrentNode.removeAttribute('locker');
      // sxeSendModifiedNode(gCurrentNode);
    // }, 30000);
    sxeSendModifiedNode(focusNode);
  }
  
  if(notMyNode) {
    if(gCurrentNode) {
      var locker = gCurrentNode.getAttribute('locker');
      XMPP.accounts.forEach(function(account) {
        if(locker == account.jid) {
          gCurrentNode.removeAttribute('locker');
          gCurrentNode.removeAttribute('style');
          sxeSendModifiedNode(gCurrentNode);
        }
      });
      gCurrentNode = null;
      gCurrentHTML = "";
      gCurrentSxeID = "";
    }
    return;
  } else if (!gCurrentNode) {
    // first focus
    gCurrentNode = focusNode;
    gCurrentHTML = focusNode.innerHTML;
    gCurrentSxeID = focusNode.getAttribute('sxeid');
  }
  else {
    if (gCurrentHTML != gCurrentNode.innerHTML) {
      // node has been modified
      // XXX this doesn't check attributes
      sxeSendModifiedNode(gCurrentNode);
      // if(gLockTimeOutID) {
        // window.clearTimeout(gLockTimeOutID);
      // }
      // gLockTimeOutID = window.setTimeout(function() {
        // gCurrentNode.removeAttribute('locker');
        // sxeSendModifiedNode(gCurrentNode);
      // }, 30000);
    }
    if(gCurrentSxeID != focusNode.getAttribute('sxeid')) {
      gCurrentNode.removeAttribute('locker');
      gCurrentNode.removeAttribute('style');
      sxeSendModifiedNode(gCurrentNode);
    }
    
    gCurrentNode = focusNode;
    gCurrentHTML = focusNode.innerHTML;
    gCurrentSxeID = focusNode.getAttribute('sxeid');
  }
}, 500);


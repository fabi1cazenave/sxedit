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

function sxeSendModifiedNode(node) {
  // TODO: send modifications of gCurrentNode over SXE
  if (node) trace(node.innerHTML);
}

window.setInterval(function() {
  var focusNode = window.top.gLastFocusNode;
  if (!focusNode) {
    // document not ready yet
    gCurrentNode = null;
    gCurrentHTML = "";
  }
  else if (!gCurrentNode) {
    // first focus
    gCurrentNode = focusNode;
    gCurrentHTML = focusNode.innerHTML;
  }
  else {
    if (gCurrentHTML != gCurrentNode.innerHTML) {
      // node has been modified
      // XXX this doesn't check attributes
      sxeSendModifiedNode(gCurrentNode);
    }
    gCurrentNode = focusNode;
    gCurrentHTML = focusNode.innerHTML;
  }
}, 1000);


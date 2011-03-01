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

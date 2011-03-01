/**
  * STANZAS
  **/

// creates and returns a Service Discovery request
function sxeServiceDiscoRequest (id, from, dest) {
  default xml namespace = ns_disco_info;                                      // set the namespace
  var sxe =   <query />;
  return _iq(from, dest, id, 'get', sxe);                                     // returns the complete stanza
}

// creates and returns a Service Discovery Request answer
function sxeServiceDiscoResponse (id, from, dest) {
  default xml namespace = ns_disco_info;                                      // set the namespace
  var sxe =   <query>
                <identity category='client' type='pc'/>
                <feature var={ns_sxe} />
                <feature var={ns_jingle_trans_sxe} />
              </query>;
  return _iq (from, dest, id, 'result', sxe);                                 // returns the complete stanza
}

/**
  * GUI HANDLE
  **/

function share() {
  var who = gSxe.room +'/'+gDialog.peopleList.getSelectedItem(0).getAttribute("label");
  gSxe.sessionInit = randomString(5);
  gSxe.jingleInit  = randomString(6);

  XMPP.accounts.forEach(function(account) {
    XMPP.send(
      account,
      sxeSessionInitiate(gSxe.sessionInit, account.jid, who, gSxe.jingleInit, 'current-document name', gSxe.room),
      function(reply) {
        gDialog.shareButton.setAttribute("state", "waiting");
      }
    );
  });
}


/**
  * STANZAS
  **/

// creates and returns the SXE message corresponding to a Session Initiation msg
function sxeSessionInitiate (id, from, dest, jingle, name, host) {
  default xml namespace = ns_jingle;                                          // <description> namespace
  var d = <description />;
  default xml namespace = ns_jingle_trans_sxe;                                // <transport> namespace
  var t = <transport>
              <host>{host}</host>
          </transport>;
  default xml namespace = ns_jingle;                                          // <jingle> namespace
  var j = <jingle action='session-initiate' initiator={from} sid={jingle}>
              <content creator='initiator' name={name}>
                  {d}
                  {t}
              </content>
          </jingle>;
  return _iq(from, dest, id, 'set', j);                                       // returns the complete stanza
}

// creates and returns the SXE message corresponding to a Session Acceptance msg
function sxeSessionAcceptance (id, from, dest, jingle, name, host) {
  default xml namespace = ns_jingle;                                          // <description> namespace
  var d = <description />;
  default xml namespace = ns_jingle_trans_sxe;                                // <transport> namespace
  var t = <transport>
              <host>{host}</host>
          </transport>;
  default xml namespace = ns_jingle;                                          // <jingle> namespace
  var j = <jingle action='session-accept' host={host} initiator={dest} sid={jingle}>
              <content creator='initiator' name={name}>
                  {d}
                  {t}
              </content>
          </jingle>;
  return _iq(from, dest, id, 'set', j);                                       // returns the complete stanza
}

// creates and returns the SXE message corresponding to a Session Refusal msg
function sxeSessionRefusal (id, from, dest, jingle, host) {
  default xml namespace = ns_jingle;                                          // set the namespace
  var j = <jingle action='session-terminate' host={host} initiator={dest} sid={jingle}>
              <reason>
                  <decline />
              </reason>
          </jingle>;
  return _iq(from, dest, id, 'set', j);                                       // returns the complete stanza
}


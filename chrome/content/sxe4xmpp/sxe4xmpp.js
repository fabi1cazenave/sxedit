/* SXE 4 XMPP (see documentation at : http://xmpp.org/extensions/inbox/sxe.html) */

/** ----------------------------------------------------------------------------
*   XMPP CHANNELS AND EVENTS
*  ----------------------------------------------------------------------------
*/

/* CREATE THE COMMUNICATION CHANNEL AND REACTS TO XMPP STANZAS */
function channels() {
  var channel = XMPP.createChannel(
    <query xmlns={ns_disco_info}>
      <feature var={ns_xhtml_im}/>
      <feature var={ns_pubsub_event}/>
      <feature var={ns_geoloc}/>
      <feature var={ns_geoloc_notify}/>
      <feature var={ns_nick}/>
      <feature var={ns_nick_notify}/>
    </query>
  );

  /* SXE MESSAGES */

  // filters groupchat messages
  channel.on(
    function (ev) (
      ev.name == 'message' &&
      ev.dir == 'in' &&
      ev.xml..@type == 'groupchat'
    ),
    function (message) {
      var who   = message.stanza.@from.split("/")[1];
      var stamp = message.stanza..*::delay.@stamp; // XXX tweak namespaces.jsm instead
      var time  = null;
      if (stamp && !(/^\s*$/).test(stamp)) { // ISO 8601 format: "2011-03-03T21:53:46Z"
        time = stamp.slice(11, 16);
      }
      addMessageToChat(who, message.stanza.body, time);
    }
  );

  // filters jingle IQ
  channel.on(
    function (ev) (
      ev.name == 'iq' &&
      ev.dir == 'in' &&
      ev.xml..*::jingle.length() > 0
    ),
    function (iq) {
      if (iq.stanza.@type == 'error')
        dump('Error stanza received:\n' + iq.stanza);
      else {
        var id       = iq.stanza.@id;
        var sender   = iq.stanza.@from;
        var jingleId = iq.stanza..*::jingle.@sid;
        var action   = iq.stanza..*::jingle.@action;
        var who      = iq.stanza..*::jingle.@initiator;
        var what     = iq.stanza..*::jingle..*::content.@name;

        // The party always acks an IQ reception
        XMPP.accounts.forEach(function(account) {
          XMPP.send(account, sxeAck(id, account.jid, sender));
        });

        // Invitation received
        if (action == 'session-initiate') {
          var who   = iq.stanza..*::jingle.@initiator;
          var what  = iq.stanza..*::jingle..*::content.@name;
          var where = iq.stanza..*::jingle..*::content..*::transport..*::host;
          var choice = confirm(
            'SXE invitation.\n FROM::' + sender + 
            '\n DOCUMENT::' + what + 
            '\n ROOM::' + where + 
            '\n\nAccept and proceed session connection ?'
          );

          // The party accepts or refuses the invitation
          XMPP.accounts.forEach(function(account) {
            XMPP.send(
              account,
              choice ? sxeSessionAcceptance(randomString(10), account.jid, sender, jingleId, what, where) :
              sxeSessionRefusal(randomString(10), account.jid, sender, jingleId, where)
            );

            // If the party accepts the invitation, it sends a ServiceDisco stanza...
            if (choice) {
              XMPP.send(
                account,
                sxeServiceDiscoRequest('disco', account.jid, sender),
                function(reply) {
                  // XXX If the ServiceDisco Response is compliant...*/
                  dump('Party: DiscoInfo answer received:\n' + reply);

                  // The party sends a SessionConnection msg
                  XMPP.send(
                    account,
                    sxeSessionConnection (account.jid, sender, jingleId)
                  );
                }
              );
            }

          });
        }

        // The initiator understands the contact accepts the invitation
        else if (action == 'session-accept') {
          gDialog.shareButton.setAttribute("state", "done");
          dump('Initiator: Session Accepted\n' + iq.stanza);
        }

        // The initiator understands the contact refuses/closes the invitation
        else if (action == 'session-terminate') {
          gDialog.shareButton.setAttribute("state", "on");
          dump('Initiator: Session Refused\n' + iq.stanza);
        }
      }
    }
  );


  // filters ServiceDisco messages
  channel.on(
    function (ev) (
      ev.name == 'iq' &&
      ev.dir == 'in' &&
      (ev.xml..ns_disco_info::query).length() > 0
    ),
    function (iq) {
      var id     = iq.stanza.@id;
      var sender = iq.stanza.@from;

      // stanza is empty, that's a request
      if ((iq.stanza..ns_disco_info::query..*).length() == 0) {
        dump('Initiator: DiscoInfo request received\n' + iq.stanza);
        XMPP.accounts.forEach(function(account) {
          XMPP.send(account,sxeServiceDiscoResponse (id, account.jid, sender));
        });
      }
    }
  );


  // filters SXE messages
  channel.on(
    function (ev) (
      ev.name == 'message' &&
      ev.dir == 'in' &&
      (ev.xml..ns_sxe::sxe).length() > 0
    ),
    function (message) {
      var sender  = message.stanza.@from;
      var session = message.stanza.ns_sxe::sxe.@session;

      // <connect /> request is received, we send a <state-offer />
      if ((message.stanza.ns_sxe::sxe.ns_sxe::connect).length() == 1) {
        dump("Initiator : Connect received\n" + message.stanza);
        XMPP.accounts.forEach(function(account) {
          XMPP.send(
            account,
            sxeStateOffer(account.jid, sender, session)
          );
        });
      }

      // <state-offer />  received, we send an <accept-state />
      else if ((message.stanza.ns_sxe::sxe.ns_sxe::stateoffer).length() == 1) {
        dump("Party : StateOffer received\n" + message.stanza);
        XMPP.accounts.forEach(function(account) {
          XMPP.send(
            account,
            sxeStateOfferAccept(account.jid, sender, session)
          );
        });
        gDialog.progressMetter.setAttribute('hidden', 'false');
      }

      // <accept-state /> request is received, we send document state
      else if ((message.stanza.ns_sxe::sxe.ns_sxe::acceptstate).length() == 1) {
        dump("Initiator : AcceptState received\n" + message.stanza);
        XMPP.accounts.forEach(function(account) {
          dump("Sending document:\n" + sxeDocumentState(account.jid, sender, "sxe", window.top.GetCurrentEditor().document, "lastsender", "lastID"));
          XMPP.send(
            account,
            sxeDocumentState(account.jid, sender, "sxe", window.top.GetCurrentEditor().document, "lastsender", "lastID")
          )
        });
      }

      // <state />  received
      else if ((message.stanza.ns_sxe::sxe.ns_sxe::state).length() == 1) {
        gDialog.progressMetter.setAttribute('mode', 'determined');
        gDialog.progressMetter.setAttribute('value', '90');
        dump('Party: State received!\n' + message.stanza);
        window.top.GetCurrentEditor().rebuildDocumentFromSource(sxeUnmap(message.stanza..*::state));
        gDialog.progressMetter.setAttribute('value', '100');
      }
      
      // other received
      else if ((message.stanza.ns_sxe::sxe).length() == 1) {
        // Parse new nodes
        for (var i = 0; i < (message.stanza..*::new).length(); i++) {
          var node = (message.stanza..*::new)[i];
          var rid = node.@rid;
          var type = node.@type;
          var parent = node.@parent;
          //var pweight = node.@primary-weight;
          var name = node.@name;
          
          // TODO : manage body changes differently
          if(name.toLowerCase() == "body") continue;
          
          var editor = window.top.document.getElementById('content-frame').contentDocument;
          
          // Creating new element
          if(type == 'element') {
            var elem = editor.createElement(name);
            elem.setAttribute('sxeid', rid);
            var parentNode = editor.querySelector('[sxeid=' + parent + ']');
            parentNode.appendChild(elem);
          }
          
          // Creating new attribute
          else if(type == 'attr') {
            var elem = editor.querySelector('[sxeid=' + parent + ']');
            var chdata = node.@chdata;
            elem.setAttribute(name, chdata);
          }
          
          // Creating new text
          else if(type == 'text') {
            var elem = editor.querySelector('[sxeid=' + parent + ']');
            var chdata = node.@chdata;
            elem.innerHTML(chdata);
          }
        }
        
        // Parse set nodes
        for (var i = 0; i < (message.stanza..*::set).length(); i++) {
          var node = (message.stanza..*::set)[i];
          var target = node.@target;
          var chdata = node.@chdata;
               
          var editor = window.top.document.getElementById('content-frame').contentDocument;
          
          var elem = editor.querySelector('[sxeid=' + target + ']');
          
          // If we don't find a name, it means we receive the content of an element
          if((node.@name).length() == 0) {
            elem.innerHTML = chdata;
            
            // We remove locker attribute. It will be created again if needed
            elem.removeAttribute('locker');
            elem.removeAttribute('style');
          }
          
          // Else, we receive an attribute
          else {
            elem.setAttribute(node.@name, chdata);
          }
          
          trace(chdata);
        }
        
        // TODO
        // Parse remove nodes
        
      }
    }
  );


  // Get the in-MUC contacts
  channel.on(
    function(ev) (
      ev.name == 'presence' &&
      ev.dir == 'in' &&
      ev.xml.ns_roster::query != null
    ),
    function(presence) {
      if (presence.stanza.@from.split("/")[0] == gSXE.room) {
        var cl = gDialog.peopleList;
        if (presence.stanza.@type == 'unavailable') {
          if (cl.hasChildNodes()) {
            var children = cl.childNodes;
            for (var i = 0; i < children.length; i++) {
              var line = children[i];
              if (line.getAttribute("label") == presence.stanza.@from.split("/")[1]) {
                cl.removeItemAt(i);
              }
            }
          }
        }
        else {
          var contact = document.createElement("listitem");
          contact.setAttribute("label", presence.stanza.@from.split("/")[1]);
          cl.appendChild(contact);
        }
      }
    }
  );

  // remember the XMPP channel has been initialized
  gChannel = channel;
};



/** ----------------------------------------------------------------------------
*   BASIC XMPP MESSAGES
*  ----------------------------------------------------------------------------
*/

// returns an IQ stanza
function _iq(from, to, id, type, content) {

  // set the stanza namespace
  default xml namespace = ns_iq;

  // returns the complete IQ stanza
  return  <iq from={from} to={to} id={id} type={type}>
            {content}
          </iq>;
}

// returns a MESSAGE stanza
function _message(from, to, content) {

  // set the stanza namespace
  default xml namespace = ns_msg;

  // returns the complete MESSAGE stanza
  return  <message from={from} to={to}>
            {content}
          </message>;
}

// returns a PRESENCE stanza
function _presence(from, to, type) {

  // set the stanza namespace
  default xml namespace = ns_presence;

  // returns the complete PRESENCE stanza
  return  <presence from={from} to={to} type={type} />;

}


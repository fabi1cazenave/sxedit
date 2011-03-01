var EXPORTED_SYMBOLS = ["XMPPGet","XMPPSet","XMPPContact","XMPPSend"];

Components.utils.import("resource://papaya/namespaces.jsm");

var XMPPSet = {
  presence : function (aShow, aStatus) {
    return  <presence>
              <show>{aShow}</show>
              <status>{aStatus}</status>
            </presence>;
  },
  vCard : function (aVCard) {
    return  <iq type='set'>
              {aVCard}
            </iq>;
  }
};

var XMPPSend = {
  chat : function (aTo, aMessage) {
    return  <message to={aTo} type="chat">
              <body>{aMessage}</body>
            </message>;
  },
};

var XMPPGet = {
  vCard : function (aTo) {
    return <iq to={aTo} type='get'><vCard xmlns={ns_vcard}/></iq>;
  },
};

var XMPPContact = {
  add : function (aJID) {
    return  <iq type="set">
              <query xmlns={ns_roster}>
                <item jid={aJID}/>
              </query>
            </iq>;
  },
  subscribe : function (aTo) {
    return '<presence to="'+aTo+'" type="subscribe"/>';
  },
  subscribed : function (aTo) {
    return '<presence to="'+aTo+'" type="subscribed"/>';
  },
  unsubscribed : function (aTo) {
    return '<presence to="'+aTo+'" type="unsubscribed"/>';
  }
};

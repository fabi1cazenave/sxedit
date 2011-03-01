var EXPORTED_SYMBOLS = ["XMPPChannel"];
Components.utils.import("resource://sxEdit/namespaces.jsm");
Components.utils.import("resource://xmpp4moz/xmpp.jsm");

var XMPPChannel = {
  create : function (aFeatures) {
    var query = 
      <query xmlns={ns_disco_info}>
      </query>; 
      
    for (x in aFeatures) {
      var child = <feature>{aFeatures[x]}</feature>;
      query.appendChild(child);
    }

    channel = XMPP.createChannel(query);
    //roster
    channel.on(
      function(ev) (ev.name == 'iq' &&
                    ev.dir == 'in' &&
                    ev.xml.ns_roster::query != null),
      function(iq) {
        for each(var item in iq.stanza..ns_roster::item) {
          roster.add(
            item.@jid.toString(),
            item.@name.toString() || item.@jid.toString(),
            item.@subscription.toString(),
            true
          );
        }
      }
    );
  },
};

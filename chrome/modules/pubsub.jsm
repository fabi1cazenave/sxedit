var EXPORTED_SYMBOLS = ["pubsub"]

Components.utils.import('resource://papaya/namespaces.jsm');

var pubsub = {
  stanza : function (aFrom, aType, aXmlns, aPiece) {
     return <iq type={aType}><pubsub xmlns={aXmlns}>{aPiece}</pubsub></iq>;
  },

  subscribe : function (aFrom, aTo, aNode) {
    var subscribe = <subscribe node={aNode} jid={aFrom}/>;
    return this.stanza(aFrom, aTo, "set", ns_pubsub, subscribe);
  },

  publish : function(aFrom, aNode, aItem) {
    var aPiece =  <publish node={aNode}>
                    {aItem}
                  </publish>;
    return this.stanza(aFrom, "set", ns_pubsub, aPiece);
  },
  
  unsubscribe : function (aFrom, aTo, aNode) {
    var aPiece = <unsubscribe node={aNode} jid={aFrom}/>;
    return this.stanza(aFrom, aTo, "set", ns_pubsub, aPiece);
  },

  getItem : function (aFrom, aTo, aNode, aId) {
    var aPiece =  <items node={aNode}>
                    <item id={aId}/>
                  </items>;
    return this.stanza(aFrom, aTo, "get", ns_pubsub, aPiece);
  },
  
  create : function (aFrom, aTo, aNode) {
    var aPiece =  <create node={aNode}/>;
    return this.stanza(aFrom, aTo, "set", ns_pubsub, aPiece);
  },
  
  deleteNode : function (aFrom, aTo, aNode) {
    var aPiece = <delete node={aNode}/>;
    return this.stanza(aFrom, aTo, "set", ns_pubsub, aPiece);
  },

  configureRequest : function(aFrom, aTo, aNode) {
    var aPiece = <configure node={aNode}/>;
    return this.stanza(aFrom, aTo, "get", ns_pubsub_owner, aPiece);
  },
  
  configure : function(aFrom, aTo, aNode, aConfig) {
    var aPiece =  <configure node={aNode}>
                    {aConfig}
                  </configure>;
    return this.stanza(aFrom, aTo, "set", ns_pubsub_owner, aPiece);
  },

  getAffilitations : function(aFrom, aTo, aNode) {
    var aPiece = <affilitations node={aNode}/>;
    return this.stanza(aFrom, aTo, "get", ns_pubsub, aPiece);
  },
  
  setAffiliations : function(aFrom, aTo, aNode, aAffiliation) {
    var aPiece =  <affiliations node={node}>
                    {aAffiliation}
                  </affiliations>;
    return this.stanza(aFrom, aTo, "set", ns_pubsub_owner, aPiece);
  },

  retract : function(aFrom, aTo, aNode, aId) {
    var aPiece = <retract node={aNode}><item id={aId}/></retract>;
    return this.stanza(aFrom, aTo, "set", ns_pubsub, aPiece);
  },

  purge : function(aFrom, aTo, aNode) {
    var aPiece = <purge node={aNode}/>;
    return this.stanza(aFrom, aTo, "set", ns_pubsub_owner, aPiece);
  }
};

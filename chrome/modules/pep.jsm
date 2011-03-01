var EXPORTED_SYMBOLS = ["PEP", "XMPPgeoloc", "XMPPnick", "XMPPavatar"]

Components.utils.import("resource://papaya/namespaces.jsm");
Components.utils.import("resource://papaya/pubsub.jsm");
var PEP = {
  publish : function(aFrom, aNode, aItem){
    return pubsub.publish(aFrom, aNode, aItem);
  },
  stop : function(aFrom, aType, aNode) {
    var aItem = <item>
                  <{aType} xmlns={aXmlns}/>.
                </item>;
    return PEP.publish(aFrom, aNode, aItem);
  },
  subscribe : function(aFrom, aTo, aNode) {
    return pubsub.subscribe(aFrom, aTo, aNode);
  }
};

var XMPPnick = {
  publish : function(aFrom, aNick) {
    var aItem = <item>
                  <nick xmlns={ns_nick}>{aNick}</nick>
                </item>;
    return PEP.publish(aFrom, ns_nick, aItem);
  },
  stop : function(aFrom) {
    PEP.stop(aFrom, "nick", ns_nick);
  }
};

var XMPPgeoloc = {
  publish : function(aFrom, aLocation) {
    var aItem = <item>
                  <geoloc/>
                </item>;
    for (item in aLocation) {
      var child = <{item}>{aLocation[item]}</{item}>;
      aItem.geoloc.appendChild(child);
    }
    return PEP.publish(aFrom, ns_geoloc, aItem);
  },
  stop : function(aFrom) {
    PEP.stop(aFrom, "geoloc", ns_geoloc);
  }
};

var mood = {
  publish : function(aFrom, aText, aMood) {
    var aItem = <item>
                  <mood xmlns={ns_mood}>
                    <{aMood}/>
                    <text>{aText}</text>
                  </mood>
                </item>;
    PEP.publish(aFrom, ns_mood, aItem);
  },
  stop : function(aFrom) {
    PEP.stop(aFrom, "mood", ns_mood);
  }
};

var tune = {
  publish : function(aFrom, aTune) {
    var aTune = {artist: "toto", rating: "8"};
    var aItem = <item>
                  <tune xmlns={ns_tune}/>
                </item>;
    for each (var item in aTune) {
      //~ var child = <{item.name}>{item}</{item.name};
      //~ aItem..tune.appendChild(child);
    }
    PEP.publish(aFrom, ns_tune, aItem);
  },
  stop : function(aFrom) {
    PEP.stop(aFrom, "tune", ns_tune);
  }
};

var activity = {
  publish : function(aFrom, aActivity, aLang) {
    var aItem = <item>
                  <activity xmlns={ns_activity}>
                    <{aActivity[0]}>
                      <{aActivity[1]}/>
                    </{aActivity[0]}>
                    <text xml:lang={aLang}>{aActivity[2]}</text>
                  </activity>
                </item>;
    PEP.publish(aFrom, ns_activity, aItem);
  },
  stop : function(aFrom) {
    PEP.stop(aFrom, "activity", ns_activity);
  }
};

var XMPPavatar = {
  //~ publishData : function(aFrom, aAvatarData, aId) {
    //~ var aItem = <item id={aId}>
                  //~ <data xmlns={ns_avatar_data}>
                    //~ {aAvatar.data}
                  //~ </data>
                //~ </item>;
    //~ PEP.publish(aFrom, ns_avatar_data, aItem);
  //~ },

  publishMetadata : function(aFrom, aURL) {
    var aItem = <item>
                  <metadata>
                    <info url={aURL}/>
                  </metadata>
                </item>;
    return PEP.publish(aFrom, ns_avatar_metadata, aItem);
  },
  stop : function(aFrom) {
    PEP.stop(aFrom, "metadata", ns_avatar_metadata);
  }
}

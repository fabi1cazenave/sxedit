var EXPORTED_SYMBOLS = [];

var ns_activity                 = 'http://jabber.org/protocol/activity';
var ns_activity_notify          = 'http://jabber.org/protocol/activity+notify';
var ns_caps                     = 'http://jabber.org/protocol/caps';
var ns_chatstates               = 'http://jabber.org/protocol/chatstates';
var ns_disco_info               = 'http://jabber.org/protocol/disco#info';
var ns_geoloc                   = 'http://jabber.org/protocol/geoloc';
var ns_geoloc_notify            = 'http://jabber.org/protocol/geoloc+notify';
var ns_http_auth                = 'http://jabber.org/protocol/http-auth';
var ns_mood                     = 'http://jabber.org/protocol/mood';
var ns_mood_notify              = 'http://jabber.org/protocol/mood+notify';
var ns_muc                      = 'http://jabber.org/protocol/muc';
var ns_muc_user                 = 'http://jabber.org/protocol/muc#user';
var ns_nick                     = 'http://jabber.org/protocol/nick';
var ns_nick_notify              = 'http://jabber.org/protocol/nick+notify';
var ns_pubsub                   = 'http://jabber.org/protocol/pubsub';
var ns_pubsub_event             = 'http://jabber.org/protocol/pubsub#event';
var ns_tune                     = 'http://jabber.org/protocol/tune';
var ns_tune_notify              = 'http://jabber.org/protocol/tune+notify';
var ns_xhtml_im                 = 'http://jabber.org/protocol/xhtml-im';

var ns_x4m                      = 'http://hyperstruct.net/xmpp4moz/protocol/internal';
var ns_x4m_in                   = 'http://hyperstruct.net/xmpp4moz/protocol/internal';
var ns_x4m_ext                  = 'http://hyperstruct.net/xmpp4moz/protocol/external';

var ns_xul                      = 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul';

var ns_xml                      = 'http://www.w3.org/XML/1998/namespace';
var ns_xhtml                    = 'http://www.w3.org/1999/xhtml';

var ns_auth                     = 'jabber:iq:auth';
var ns_private                  = 'jabber:iq:private';
var ns_register                 = 'jabber:iq:register';
var ns_roster                   = 'jabber:iq:roster';

var ns_delay                    = 'jabber:x:delay';
var ns_event                    = 'jabber:x:event';

var ns_bookmarks                = 'storage:bookmarks';

var ns_sasl                     = 'urn:ietf:params:xml:ns:xmpp-sasl';
var ns_session                  = 'urn:ietf:params:xml:ns:xmpp-session';
var ns_stanzas                  = 'urn:ietf:params:xml:ns:xmpp-stanzas';
var ns_stream                   = 'urn:ietf:params:xml:ns:xmpp-streams';
var ns_tls                      = 'urn:ietf:params:xml:ns:xmpp-tls';

var ns_avatar_data              = 'urn:xmpp:avatar:data';
var ns_avatar_metadata          = 'urn:xmpp:avatar:metadata';
var ns_avatar_metadata_notify   = 'urn:xmpp:avatar:metadata+notify';

var ns_jingle                   = 'urn:xmpp:tmp:jingle';
var ns_jingle_apps_xhtml        = 'urn:xmpp:tmp:jingle:apps:xhtml';

var ns_jingle_trans_sxe         = 'urn:xmpp:tmp:jingle:transports:sxe';
var ns_sxe                      = 'urn:xmpp:tmp:sxe';

var ns_vcard                    = 'vcard-temp';
var ns_vcard_update             = 'vcard-temp:x:update';

var ns_iq                       = 'xmpp:iq';
var ns_msg                      = 'xmpp:message';
var ns_presence                 = 'xmpp:presence';

for (var name in this) {
  if (name.match(/^ns_/)) {
    dump(name + "\n");
    EXPORTED_SYMBOLS.push(name);
  }
}

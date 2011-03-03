// startup UI
// xxx replace this with "chrome://editor/content/editor.xul" when using with KompoZer
//pref("toolkit.defaultChromeURI", "chrome://papaya/content/papaya.xul");
pref("toolkit.defaultChromeURI", "chrome://editor/content/editor.xul");

// general prefs
pref("browser.preferences.animateFadeIn",     true);
pref("extensions.dss.enabled",                false);
pref("extensions.dss.switchPending",          false);
pref("extensions.getMoreExtensionsURL",       "chrome://mozapps/locale/extensions/extensions.properties");
pref("extensions.getMoreThemesURL",           "chrome://mozapps/locale/extensions/extensions.properties");
pref("extensions.ignoreMTimeChanges",         false);
pref("extensions.logging.enabled",            false);
pref("extensions.update.enabled",             true);
pref("extensions.update.interval",            86400);
pref("extensions.update.url",                 "chrome://mozapps/locale/extensions/extensions.properties");
pref("xpinstall.dialog.confirm",              "chrome://mozapps/content/xpinstall/xpinstallConfirm.xul");
pref("xpinstall.dialog.progress.chrome",      "chrome://mozapps/content/extensions/extensions.xul?type=extensions");
pref("xpinstall.dialog.progress.skin",        "chrome://mozapps/content/extensions/extensions.xul?type=themes");
pref("xpinstall.dialog.progress.type.chrome", "Extension:Manager-extensions");
pref("xpinstall.dialog.progress.type.skin",   "Extension:Manager-themes");
pref("general.skins.selectedSkin",            "default");

// debug
pref("browser.dom.window.dump.enabled",       true);
pref("dom.report_all_js_exceptions",          true);
pref("extensions.logging.enabled",            true);
pref("javascript.options.showInConsole",      true);
pref("javascript.options.strict",             true);
pref("nglayout.debug.disable",                true);
pref("nglayout.debug.disable_xul_cache",      true);
pref("nglayout.debug.disable_xul_fastload",   true);

// xmpp4moz
pref("signon.SignonFileName",                 "signons.txt");
pref("signon.debug",                          true);
pref("signon.expireMasterPassword",           false);
pref("signon.rememberSignons",                true);

// sxEdit
pref("xmpp.account.sxedit.connectionPort",     5222);
pref("xmpp.account.sxedit.connectionSecurity", 0);
pref("xmpp.account.sxedit.resource",           "kompozer");
pref("xmpp.account.sxedit.autoLogin",          true);
pref("xmpp.account.sxedit.timestamp",          false);


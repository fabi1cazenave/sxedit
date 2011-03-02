/**
  * GUI HANDLE
  **/

function synchronize() {
  // what we send to whom ?
  var who = gSxe.room + "/" + gDialog.peopleList.getSelectedItem(0).getAttribute("label");
  var docRoot = window.top.GetCurrentEditor().document;

  // sends the msg
  XMPP.accounts.forEach(function(account) {
    var msg = sxeDocumentState(account.jid, who, "sxesession", docRoot, "lastsender", "lastID");
    dump(msg, "sxEdit");
    XMPP.send(account, msg)
  });
}



/**
  * STANZAS
  **/

// creates and returns the sxe message for offering the last document state
function sxeStateOffer (from, dest, session) {

  default xml namespace = ns_jingle_apps_xhtml;
  var desc = <description />;

  default xml namespace = ns_sxe;                                             // <sxe> namespace
  var sxe =   <sxe session={session} id='f'>
                  <stateoffer>
                  {desc}
                  </stateoffer>
              </sxe>;
  return _message(from, dest, sxe);                                           // returns complete stanza
}

// creates and returns the sxe message saying that we accept the last document state
function sxeStateOfferAccept (from, dest, session) {
  default xml namespace = ns_sxe;                                             // set the namespace
  var sxe =   <sxe session={session} id='g'>
                  <acceptstate/>
              </sxe>;                                                         // constructs SXE message
  return _message(from, dest, sxe);                                           // returns complete stanza
}

// creates and returns the sxe message with the current document state
function sxeDocumentState (from, dest, session, documentSnapshot, lastSender, lastID) {
  var prolog = sxeExtractProlog(documentSnapshot);                            // extracts document information
  var mapping = sxeMap('R', documentSnapshot);                                // extracts the mapping following SXE protocol
  default xml namespace = ns_sxe;                                             // set the namespace
  var sxe =   <sxe session={session} id='id'>
                  <state>
                  <document-begin prolog={prolog} />
                          {mapping}
                  <document-end last-sender={lastSender} last-id={lastID} />
                  </state>
              </sxe>;                                                         // constructs SXE message
  return _message(from, dest, sxe);                                           // returns complete stanza
}

// creates and returns the sxe message with the last edit
function sxeEdit (from, dest, session, edit) {
  default xml namespace = ns_sxe;                                             // set the namespace
  var sxe =   <sxe session={session} id='4'>
                  {edit}
              </sxe>;                                                         // constructs the sxe message
  return _message(from, dest, sxe);                                           // returns complete stanza
}




/** ----------------------------------------------------------------------------
 *      ENGINE (mapping/unmapping)
 *  ----------------------------------------------------------------------------
 */

// returns the document's prolog
function sxeExtractProlog(document) {
  return document.doctype;
}

// returns the document's mapping in XML (RECURSIVE)
function sxeMap(parent, node) {

  // checks if the node exists and has child
  if (!node || !node.hasChildNodes())
    return <null_or_empty/>;

  var xml = new XML();

  // for each child...
  for (var i=0; i<node.childNodes.length; i++) {
    var cn = node.childNodes[i];                                            // the current child node
    var rid = randomString(10);                                             // a random ID
    var ns = 'namespace';                                                   // node namespace
    var version = '0';                                                      // node version
    var pweight = '0';                                                      // node weight
    switch (cn.nodeType) {

        // type == element
        case 1 :
          var element = cn;
          var name = cn.nodeName;
          var type = 'element';
          xml += getSXEElement(element, rid, type, version, parent, pweight, ns, name);
          break;

        // type == text
        case 3 :
          var value = cn.nodeValue;
          var type = 'text';
          xml += getSXEText(rid, type, version, parent, pweight, value);
          break;

        // type == processing instruction
        case 7 :
          var target = cn.target;
          var data = cn.data;
          var type = 'processinginstruction';
          xml += getSXEProcessingInstruction(rid, type, version, parent, pweight, target, data);
          break;

        // type == comment
        case 8 :
          var value = cn.nodeValue;
          var type = 'comment';
          xml += getSXEText(rid, type, version, parent, pweight, value);
          break;

        // type == doctype
        case 10 :
          xml += <doctype />;
          break;

        default:
          xml += <case_not_found />;
          break;
    }

    if (cn.hasChildNodes())
      xml += sxeMap(rid,cn);
  }
  return xml;
}

function getSXEElement (element, rid, type, version, parent, pweight, ns, name) {
  var xml = new XML();
  xml = <new rid={rid}
                  type={type}
                  version={version}
                  parent={parent}
                  primary-weight={pweight}
                  ns={ns}
                  name={name} />;

  // adds eventual attributes
  if (element.hasAttributes()) {
    var attrib = element.attributes;
    for (var i=0; i < attrib.length; i++) {
      xml += getSXEAttribute(randomString(10), 'attr', version, rid, pweight, ns, attrib[i].name, attrib[i].value);
    }
  }

  return xml;
}

function getSXEAttribute(rid, type, version, parent, pweight, ns, name, value) {
  return <new rid={rid}
                  type={type}
                  version={version}
                  parent={parent}
                  primary-weight={pweight}
                  ns={ns}
                  name={name}
                  chdata={value} />;
}

function getSXEText (rid, type, version, parent, pweight, value) {
  return <new rid={rid}
                  type={type}
                  version={version}
                  parent={parent}
                  primary-weight={pweight}
                  chdata={value} />;
}

function getSXEProcessingInstruction (rid, type, version, parent, pweight, pitarget, pidata) {
  return <new rid={rid}
                  type={type}
                  version={version}
                  parent={parent}
                  primary-weight={pweight}
                  pitarget={pitarget}
                  pidata={pidata}  />;
}

function sxeUnmap(mapping) {
  // XML configs (Global XML Object, Namespace...)
  XML.ignoreComments = false;                                                 // allows comments
  XML.ignoreProcessingInstructions = false;                                   // allows pi
  var SXEns = new Namespace(ns_sxe);                          // xml namespace

  // gets the GUID of the root node
  var rootRid = mapping..SXEns::new.(@parent == 'R' && @type == 'element').@rid;

  // constructs the XML object
  var doc = new XML();
  doc = sxeUnmapNodes(mapping, 'R');
  return doc.toXMLString();
}

function sxeUnmapNodes (mapping, rid) {
  // xml object
  var xml = new XML();

  // namespace
  var SXEns = new Namespace(ns_sxe);

  // gets the list of element child nodes, if any
  var list = mapping..SXEns::new.(@parent == rid);

  // build the sub-structure with children elements (recursive)
  for each (var child in list)  {

    // elements : works
    if (child.@type == 'element') {
      var element = <{child.@name}>{sxeUnmapNodes(mapping, child.@rid)}</{child.@name}>;

      // attributes : works
      var attribs = mapping..SXEns::new.(@parent == child.@rid && @type == 'attr');
      for each (var attrib in attribs)
        element.@[attrib.@name] = attrib.@chdata;
      xml += element;
    }

    // text : works
    else if (child.@type == 'text')
      xml += child.@chdata;

    // comments : works
    else if (child.@type == 'comment') {
      var comment = new XML('<!--' + child.@chdata.toString() + '-->');
      xml += comment;
    }

    // pi : does not work atm
    else if (child.@type == 'processinginstruction')
      xml += <pi>{child.@pitarget} : {child.@pidata}</pi>;
  }

  // returns xml object
  return xml;
}

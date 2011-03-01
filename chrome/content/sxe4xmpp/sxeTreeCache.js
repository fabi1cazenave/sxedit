/**
  * GUI HANDLE
  **/

function makeTree() {
    var docRoot = window.top.GetCurrentEditor().document;
    dump(sxeTreeCache(docRoot.childNodes[1]));
    dump(sxeMap('R', docRoot));
}


/** ----------------------------------------------------------------------------
 *      ENGINE (mapping/unmapping)
 *  ----------------------------------------------------------------------------
 */

// returns the document's mapping in XML (RECURSIVE)
function sxeTreeCache(node) {

  // checks if the node exists and has child
  if (!node)
    return <null_or_empty />;

  var xml = new XML();
  var rid = randomString(10);

  switch (node.nodeType) {

    // type == element
    case 1:
      xml = <element rid={rid} name={node.nodeName} />;

      // adds eventual attributes
      if (node.hasAttributes()) {
        var attrib = node.attributes;
        for (var i=0; i < attrib.length; i++) {
          xml.element += <attribute rid={randomString(10)} name={attrib[i].name} value={attrib[i].value} />;
        }
      }

      // adds eventual children
      if (node.hasChildNodes()) {
        for (var j=0; j < node.childNodes.length; j++) {
          xml.element += sxeTreeCache(node.childNodes[j]);
        }
      }
      break;

    // type == text
    case 3:
      // checker si y'a pas que : &#xA; &#x9; " "
      xml += <text rid={rid} value={node.nodeValue} />;
      break;

    // type == processing instruction
    case 7 :
      xml += <pi rid={rid} target={node.target} data={node.data} />;
      break;

    // type == comment
    case 8 :
      xml += <comment rid={rid} value={node.nodeValue} />;
      break;

    // type == doctype
    case 10 :
      xml += <doctype />;
      break;

    // default
    default:
      xml += <case_not_found />;
      break;
  }

  return xml;
}


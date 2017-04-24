import reactAttributes from '../constants/reactAttributes';
function getElementAttributes(namedNodeMap){
  const attributes = {}
  if(!namedNodeMap){
    return attributes;
  }
  const excludeAttr = ["style", "contentEditable"]
  for (var i = 0; i < namedNodeMap.length; i++) {
    if(!excludeAttr.includes(namedNodeMap[i].name) &&
        reactAttributes[namedNodeMap[i].name]){
      attributes[reactAttributes[namedNodeMap[i].name]] = namedNodeMap[i].value;
    }
  }
  return attributes;
}
module.exports = getElementAttributes

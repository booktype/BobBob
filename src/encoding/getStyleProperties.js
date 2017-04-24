function getStyleProperties(cssDeclaration){
  const attributes = {}
  if(!cssDeclaration){
    return Map({})
  }
  const defaultValues = ['inherit', 'initial', '0px']
  for (var i = 0; i < cssDeclaration.length; i++) {
    if(defaultValues.indexOf(cssDeclaration[cssDeclaration[i]])==-1){
      attributes[cssDeclaration[i]
                  .replace(
                    /-([a-z])/g,
                    function (g) {
                      return g[1].toUpperCase();
                    })
                ] = cssDeclaration[cssDeclaration[i]]
    }
  }
  return attributes
}

module.exports = getStyleProperties;

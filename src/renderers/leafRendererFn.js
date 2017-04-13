import React from 'react';

export default function leafRendererFn(props) {
  const {block} = props;
  let {text} = props;

  // If the leaf is at the end of its block and ends in a soft newline, append
  // an extra line feed character. Browsers collapse trailing newline
  // characters, which leaves the cursor in the wrong place after a
  // shift+enter. The extra character repairs
  if (text.endsWith('\n') && props.isLast) {
    text += '\n';
  }

  const {customStyleMap, customStyleFn, offsetKey, styleSet} = props;

  let mergedStyles = {};
  let styleMapEntry = {}
  let Element = styleSet.reduce((MappedElement, styleName) => {
    if (styleName.includes("__")) {
      styleMapEntry = {
        style: customStyleFn(styleName, block)
      }
    }else if(styleName.includes("_")){
      const [styleGroup, styleType] = styleName.split("_")
      styleMapEntry = customStyleMap[styleGroup][styleType];
    }else{
      styleMapEntry = customStyleMap[styleName];
    }
    const { style, ...element} = styleMapEntry
    if (
      style !== undefined &&
      mergedStyles.textDecoration !== style.textDecoration
    ) {
      // .trim() is necessary for IE9/10/11 and Edge
      mergedStyles.textDecoration =
        [mergedStyles.textDecoration, style.textDecoration].join(' ').trim();
    }
    if( element.tag !== undefined ){
      const attributes = element.attributes || {}
      return (props)=>(
        <element.tag style={style} {...attributes}>
          {MappedElement(props)}
        </element.tag>
      )
    }else{
      mergedStyles = Object.assign(mergedStyles, style)
      return MappedElement
    }
  }, props=><span {...props}/>);



  class CustomLeaf extends React.Component {
    render(){
      return (
        <Element
          data-offset-key={offsetKey}
          style={mergedStyles}>
          {this.props.children}
        </Element>
        )
    }
  }

  return CustomLeaf
}

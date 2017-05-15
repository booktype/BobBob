/*
  This format adheres to the v0 ASP spec.
*/
import {startsWith} from '../compat'
import {CharacterMetadata, ContentBlock, genKey} from 'draft-js';
import Immutable from 'immutable';
import DefaultDraftBlockRenderMap from '../../../immutables/DefaultDraftBlockRenderMap';
import reactAttributes from '../../../constants/reactAttributes';
import DraftMetaInstance from 'draft-js/lib/DraftMetaInstance';
var inlineElements = {
  "span": "DEFAULT",
  "b": "BOLD",
  "fontWeight__bold": "BOLD",
  "fontWeight__bolder": "BOLD",
  "code": "CODE",
  "tt": "TELETYPE",
  "em": "EMPHASIS",
  "strong": "STRONG",
  "samp": "SAMP",
  "var": "VAR",
  "q": "QUOTATION",
  "sub": "SUB",
  "sup": "SUP",
  "i": "ITALIC",
  "fontStyle__italic": "ITALIC",
  "strike": "STRIKETHROUGH",
  "u": "UNDERLINE",
  "br": "BREAK",
}

var metaElements = {
  "a": "LINK",
  "img": "IMAGE"
}
var metaKey = 0
function formatText(styledText, text="", characterList=Immutable.List(), metaMap=Immutable.OrderedMap(), parentStyles=[], parentMeta=null,depth=0){
  for(let style of styledText){
    if(style.attributes && style.attributes.constructor === Array){
      style.attributes = formatAttributes(style.attributes)
    }
    parentStyles=parentStyles.slice(0,depth+1)
    if(depth==0){
      parentMeta=Immutable.Map()
    }
    if(style.content){
      text += style.content
      for(var i in style.content.split("")){
        characterList = characterList.withMutations((list)=>{
          list.push(
            new CharacterMetadata({
              meta: parentMeta,
              style: Immutable.OrderedSet([...parentStyles])
            })
          )
        })
      }
      // parentStyles = []
    }else{
      if(metaElements[style.tagName]){
        metaMap = metaMap.set(`${metaMap.size+1}`,new DraftMetaInstance({
          type: metaElements[style.tagName],
          data: {attributes: style.attributes}
        }))
        parentMeta = parentMeta.set(metaElements[style.tagName],`${metaMap.size+1}`)
      }else{
        if(!parentStyles.includes(inlineElements[style.tagName])){
          parentStyles.push(inlineElements[style.tagName])
        }
        if(style.attributes){
          // style.attributes = formatAttributes(style.attributes)
          for(var prop in style.attributes.style){
            var cssName = `${prop}__${style.attributes.style[prop]}`
            var styleName = inlineElements[cssName] || cssName
            if(!parentStyles.includes(styleName))
            parentStyles.push(styleName)
          }
        }
      }
      if(!style.children && !style.content){
        text = text +""
        characterList = characterList.withMutations((list)=>{
          list.push(new CharacterMetadata({
            meta: parentMeta,
            style: Immutable.OrderedSet(inlineElements[style.tagName])
          }))
        })

      }
      const data = formatText(style.children, text,characterList, metaMap, parentStyles, parentMeta, depth+1)
      characterList = data.characterList
      text = data.text
      metaMap = data.metaMap
    }
  }
  return {text, characterList, metaMap}
}

export default function format(nodes, options, parents, blocks, entities=Immutable.OrderedMap()) {
  nodes = nodes.map(node => {
    const type = capitialize(node.type)
    if (type === 'Element') {
      const tagName = node.tagName.toLowerCase()
      if(!DefaultDraftBlockRenderMap.get(tagName)){
        tagName = "div"
      }
      const attributes = formatAttributes(node.attributes)
      const style = attributes.style
      delete attributes.style
      node.text = node.text || ""
      characterList = Immutable.List(node.text.split("").map(()=>{
        return new CharacterMetadata({
          meta: Immutable.Map(),
          style: Immutable.OrderedSet()
        })
      }))
      node.text = node.text || ""
      blocks.push(new ContentBlock({
        key: genKey(),
        type: tagName,
        depth: parents.length,
        text: node.text,
        characterList: Immutable.List(node.text.split("").map(()=>{
          return new CharacterMetadata({meta: Immutable.Map(),
            style: Immutable.OrderedSet()})})),
        data: Immutable.Map({
          attributes,
          style
        })
      }))
      var children = []
      var text = []
      for (var idx in node.children) {
        var child = node.children[idx]
        if (child.type === "text"){
          if(child.content.match(/\S/)){
            text.push(child)
          }
        } else if(inlineElements[child.tagName] || metaElements[child.tagName]) {
          child.attributes = formatAttributes(child.attributes)
          text.push(child)
        } else{
          if (text.length) {
            var {text: alltext , characterList} = formatText(text)
            children.push({tagName: "div", attributes: [], type: "element", text: alltext, characterList})
            text = []
          }
          children.push(child)
        }
      }
      if(text.length){
        // children.push({tagName: "div", attributes: [], type: "element", text})
        var {text: alltext, characterList, metaMap} = formatText(text, "", Immutable.List(), entities)
        blocks[blocks.length-1] = blocks[blocks.length-1].set("text", alltext).set("characterList", characterList )
        // blocks[blocks.length-1].characterList = characterList
        entities = metaMap

      }
      if (children.length) {
        const arr = format(children, options, parents.concat([node.tagName]), blocks , entities)
        children = arr[0];
        blocks = arr[1].blocks
        entities = arr[1].metaMap
      }else{
        if(!blocks[blocks.length-1].getText()){
          let {text: alltext, characterList, metaMap} = formatText(text, "", Immutable.List(), entities)
          blocks[blocks.length-1] = blocks[blocks.length-1].set("text",alltext).set("characterList",characterList)

        }
      }

      // delete attributes.style
      return {
        type: tagName,
        depth: parents.length,
        parents,
        text,
        data: Immutable.Map({
          attributes,
        }),
        children
      }
    }else{

      if(node.content.match(/\S/)){
        blocks.push(new ContentBlock({
          key: genKey(),
          type: "div",
          depth: parents.length,
          text: node.content,
          characterList: Immutable.List(node.content.split("").map((char)=>{
            return new CharacterMetadata({meta:Immutable.Map(), style: Immutable.OrderedSet()})
          })),
          data: Immutable.Map({
            attributes:{},
            style:{}
          })
        }))

      }
      // blocks[blocks.length-1].text = node.content
    }

    return {type, depth: parents.length, content: node.content}
  })
  return [nodes, {metaMap:entities, blocks}]
}

export function capitialize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function camelCase(str) {
  return str.split('-').reduce((str, word) => {
    return str + word.charAt(0).toUpperCase() + word.slice(1)
  })
}

export function castValue(str) {
  if (typeof str !== 'string')
    return str
  if (str === '')
    return str
  const num = +str
  if (!isNaN(num))
    return num
  return str
}

export function unquote(str) {
  const car = str.charAt(0)
  const end = str.length - 1
  const isQuoteStart = car === '"' || car === "'"
  if (isQuoteStart && car === str.charAt(end)) {
    return str.slice(1, end)
  }
  return str
}

export function splitHead(str, sep) {
  const idx = str.indexOf(sep)
  if (idx === -1)
    return [str]
  return [
    str.slice(0, idx),
    str.slice(idx + sep.length)
  ]
}

export function formatAttributes(attributes) {
  return attributes.reduce((attrs, pair) => {
    let [key,
      value] = splitHead(pair.trim(), '=')
    value = value
      ? unquote(value)
      : key
    if(!reactAttributes[key]){
      return attrs
    }
    if (key === 'class') {
      attrs.className = value.split(' ')
    } else if (key === 'style') {
      attrs.style = formatStyles(value)
    } else if (startsWith(key, 'data-')) {
      attrs.dataset = attrs.dataset || {}
      const prop = camelCase(key.slice(5))
      attrs.dataset[prop] = castValue(value)
    } else {
      attrs[camelCase(key)] = castValue(value)
    }
    return attrs
  }, {})
}

export function formatStyles(str) {
  return str.trim().split(';').map(rule => rule.trim().split(':')).reduce((styles, keyValue) => {
    const [rawKey,
      rawValue] = keyValue
    if (rawValue) {
      const key = camelCase(rawKey.trim())
      const value = castValue(rawValue.trim())
      styles[key] = value
    }
    return styles
  }, {})
}

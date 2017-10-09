import ContentBlock from 'draft-js/lib/ContentBlock';
import {OrderedMap, OrderedSet, List, Map} from 'immutable'
import {genKey} from 'draft-js';


function createEntry(element, entity, entityKey, content) {
  var children = element.parentElement.querySelectorAll("*")
  for (var child of children) {
    child.dataset.depth = child.parentElement.dataset.depth + " "
    let key = genKey()
    if (child.dataset.text) {
      console.log(entity.getData())
      content.blockMap = content.blockMap.set(key, new ContentBlock({
        key,
        text: entity.getData().text || "",
        characterList: entity.getData().characterList || List(),
        depth: child.dataset.depth.length,
        type: child.tagName.toLowerCase(),
        data: Map({
          entity: entityKey
        })
      }))
    } else {
      content.blockMap = content.blockMap.set(key, new ContentBlock({
        key,
        depth: child.dataset.depth.length,
        type: child.tagName.toLowerCase(),
        text: "",
        characterList: List(),
        data: Map()
      }))
    }
  }
  return content

}

function convertTemplatetoContentBlocks(html, entities) {
  var body = new DOMParser().parseFromString(html, 'text/html').body
  var children = body.querySelectorAll("*")
  var content = {
    entityMap: OrderedMap(),
    blockMap: OrderedMap()
  }
  var entry = null
  for (let child of children) {
    if (child.parentElement.tagName === "BODY") {
      child.dataset.depth = ""
    } else {
      child.dataset.depth = child.parentElement.dataset.depth + " "
    }

    if (child.dataset.entry) {
      entry = child
      break;
    } else {
      var key = genKey()
      content.blockMap = content.blockMap.set(key, new ContentBlock({
        key,
        type: child.tagName.toLowerCase(),
        text: "",
        characterList: List(),
        depth: child.dataset.depth.length,
        data: Map({
          attributes: {},
          style: {}
        })
      }))
    }
  }
  console.log(entities)
  entities.forEach((entity, key) => {
    console.log(entity, key)
    content = createEntry(entry, entity, key, content)
  })
  console.log(content)
  return content

}

export default convertTemplatetoContentBlocks;

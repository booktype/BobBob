import {Map, List, OrderedMap, OrderedSet} from 'immutable';
import ContentState from 'draft-js/lib/ContentState';
import ContentBlock from 'draft-js/lib/ContentBlock';
import EntityInstance from 'draft-js/lib/DraftEntityInstance';
import CharacterMetadata from 'draft-js/lib/CharacterMetadata';
function convertRawToDraftState(rawState){
  let blockMap = []
  let entityMap = []
  console.time("convertRawToDraftState")
  for(let i in rawState.blockMap){
    let block = rawState.blockMap[i]
    blockMap.push(
      [
        block.key,
        new ContentBlock({
          key: block.key,
          type: block.type,
          text: block.text,
          depth: block.depth,
          characterList: List(block.characterList.map((char)=>{
            return new CharacterMetadata({
              style: OrderedSet(char.style),
              entity: char.entity
            })
          })),
          data: Map(block.data)
        })
      ]
    )
  }
  for (let i in rawState.entityMap){
    let entity = rawState.entityMap[i]
    let entityKey = Number(i) + 1
    entityMap.push([
      entityKey.toString(),
      new EntityInstance(entity)
    ])
  }
  const cs = new ContentState({
    blockMap: OrderedMap(blockMap),
    entityMap: OrderedMap(entityMap)
  })
  console.timeEnd("convertRawToDraftState")
  return cs
}
export default convertRawToDraftState;

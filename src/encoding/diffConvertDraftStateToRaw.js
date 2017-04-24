import schema from '../constants/schema'
function diffConvertFromDraftStateToRaw(
  previousContentState,
  contentState
){
  console.time('diffConvertFromDraftStateToRaw')
  var entityStorageKey = 0;
  var entityStorageMap = {};
  var rawBlocks = [];
  console.time('diffjson')
  const currentBlockMap = contentState.getBlockMap()
  const previousBlockMap = previousContentState.getBlockMap()
  const currentEntityMap = contentState.getEntityMap()
  const previousEntityMap = previousContentState.getEntityMap()
  const diff = {
    blockMap: {},
    entityMap: {}
  }
  if(currentBlockMap!==previousBlockMap){
    let start = 0
    previousBlockMap.takeUntil((block, blockKey)=>{
      if(currentBlockMap._map.get(blockKey) === start
         && currentBlockMap.get(blockKey)===block){
        start++
        return false
      }
        return true
    })
    let end = 0
    const reversedCurrentBlockMap = currentBlockMap.reverse()
    previousBlockMap.reverse().takeUntil((block, blockKey)=>{
      if(reversedCurrentBlockMap._map.get(blockKey) === end &&
         reversedCurrentBlockMap.get(blockKey) === block
       ){
         end++
         return false
       }
       return true
    })
    const currentEnd = currentBlockMap.size - end
    const previousEnd = previousBlockMap.size - end

    const currentBlocks = currentBlockMap.slice(start,currentEnd)
    // .toArray().map(block=>block.toJSON())
    // const previousBlocks = previousBlockMap.slice(start, previousEnd)
    // // .toArray().map(block=>block.toJSON())
    // currentBlocks.forEach(block=>{
    //   const previous = previousBlockMap.get(block.getKey())
    //   if(previous){
    //     let index = 0
    //     const previousCharList = previous.getCharacterList()
    //     console.debug({
    //       text: diffWordsWithSpace(previous.getText(),block.getText()),
    //       type: diffWords( previous.getType(), block.getType()),
    //       // characterList: previous.getCharacterList().reduce((list, char)=>{
    //       //   if(blockCharList.get())
    //       //   list.push()
    //       // },[]), .toJSON()),
    //       data: diffJson(previous.getData(), block.getData())
    //     })
    //   }
    // })
    // // .map((block)=>{return block.toJSON()})
    // // console.debug(jsondiffpatch.diff(previousBlocks, currentBlocks))
    // console.time("encode")
    // const encoded = schema.blockMapSchema.encode(
    //   currentBlocks.toArray().map(block=>{
    //     const data = block.getData()
    //     return {
    //       type: block.getType(),
    //       depth: block.getDepth(),
    //       text: block.getText(),
    //       characterList: block.getCharacterList().toJSON(),
    //       data: JSON.stringify(data)
    //     }
    //   }))
    // console.timeEnd("encode")
    //
    // console.time("decode")
    // const decoded = schema.blockMapSchema.decode(encoded)
    // console.timeEnd("decode")
    //
    // console.timeEnd('diffjson')
    // console.log(encoded,decoded)
    diff['blockMap'] = {
      start,
      end:previousEnd,
      diffs:currentBlocks.toArray().map(block=>block.toJSON())
    }
  }
  if(currentEntityMap!=previousEntityMap){
    let start = 0
    previousEntityMap.takeUntil((entity, entityKey)=>{
      if(currentEntityMap._map.get(entityKey) === start
         && currentEntityMap.get(entityKey)===entity){
        start++
        return false
      }
        return true
    })
    let end = 0
    const reversedCurrentEntityMap = currentEntityMap.reverse()
    previousEntityMap.reverse().takeUntil((entity, entityKey)=>{
      if(reversedCurrentEntityMap._map.get(entityKey) === end &&
         reversedCurrentEntityMap.get(entityKey) === entity
       ){
         end++
         return false
       }
       return true
    })
    const currentEnd = currentEntityMap.size - end
    const previousEnd = previousEntityMap.size - end
    const diffs = currentEntityMap.slice(start,currentEnd).toArray().map(entity=>entity.toJSON())

    // .map((entity)=>{return entity.toJSON()})
    diff['entityMap'] = {
      start,
      end:previousEnd,
      diffs
    }
  }

  console.timeEnd('diffConvertFromDraftStateToRaw')

  return diff;
}
export default diffConvertFromDraftStateToRaw;

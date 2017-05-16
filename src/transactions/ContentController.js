import {ContentBlock, BlockMapBuilder, genKey, SelectionState, Modifier} from "draft-js"
import CharacterMetadata from "draft-js/lib/CharacterMetadata";
import DraftEntityInstance from "draft-js/lib/DraftEntityInstance";
import {Map} from 'immutable';
class ContentController {
  constructor(editorState){
    this.editorState = editorState
    this.currentContent = editorState.getCurrentContent()
    this.blocksArray = this.currentContent.getBlocksAsArray()
    this.selection = editorState.getSelection()
    this.currentBlock = this.currentContent.getBlockForKey(this.selection.getAnchorKey())
    this.currentDepth = this.currentBlock.getDepth()
    this.currentInlineStyle = editorState.getCurrentInlineStyle()
    this.index = this.blocksArray.findIndex((block)=>{
      return block.getKey()===this.selection.getFocusKey()
    })
  }
  toggleBlockInBlock=(type)=>{
    const head = this.blocksArray.slice(0, this.index+1)
    const tail = this.blocksArray.slice(this.index+1)
    
    const newBlock = new ContentBlock({
      key: genKey(),
      type,
      depth:this.currentDepth+1,
      text: this.currentBlock.getText(),
      characterList: this.currentBlock.getCharacterList()
    })
    this.currentBlock = this.currentBlock.merge({
      text: "",
      characterList: []
    })
    this.blocksArray = head.concat([this.currentBlock, newBlock]).concat(tail)
    return this
  }
  appendChild = (type, text="")=>{
    const head = this.blocksArray.slice(0, this.index+1)
    const tail = this.blocksArray.slice(this.index-2)
    this.currentBlock = new ContentBlock({
      key: genKey(),
      type,
      text,
      depth:this.currentDepth+1,
    })
    this.blocksArray =  head.concat([this.currentBlock]).concat(tail)
    this.index++
    this.currentDepth++
    return this
  }
  getChildIndex = () => {
    const head = this.blocksArray.slice(0, this.index+1)
    const type = this.currentBlock.getType()
    const index = head.reverse().findIndex((block)=>{
      return block.getType()=== type
    }) + 1
    console.log(type, index )
  }
  queryAndAppend=(query, type, at_index)=>{
    const head = this.blocksArray.slice(0, this.index+1)
    const tail = this.blocksArray.slice(this.index+1)
    // console.log(this.blocksArray,head, tail)
    // console.log(this.currentBlock.getType())
    console.log(at_index)

    let last_insert = -1
    for (let i=0;i<tail.length;i++){
      let block = tail[i]
      let insert = -1
      if(block.getType() === query){
        if(!at_index){
          tail.splice(i-1,0,
            new ContentBlock({
              key: genKey(),
              type,
              depth:block.getDepth()+1,
            })
          )
          last_insert = i
          i++
        }else{
          insert = i+at_index
        }
        if(i==insert){
          tail.splice(i-1,0,
            new ContentBlock({
              key: genKey(),
              type,
              depth:block.getDepth()+1,
            })
          )
          last_insert = i
          i++
        }
      }
      if(block.getDepth()===this.currentDepth){
        break
      }
    }
    this.blocksArray = head.concat(tail)
    this.index = head.length+last_insert
    this.currentBlock = this.blocksArray[this.index]
    this.currentDepth = this.currentBlock.getDepth()

    return this

  }
  select = (index) => {

  }
  appendChildren = (type, size)=>{
    const head = this.blocksArray.slice(0, this.index+1)
    const tail = this.blocksArray.slice(this.index-2)
    const fragment = []
    let block;
    for(let i=0; i<size;i++){
      console.log(block)
      block = new ContentBlock({
        key: genKey(),
        type,
        depth:this.currentDepth+1,
      })
      this.blocksArray.splice(
        this.index,
        0,
        block
       )
       this.index++
    }
    this.currentDepth++
    this.currentBlock = block
    return this
  }
  createEntity = (type, mutability="MUTABLE", data={})=>{

    const entityMap = this.currentContent.getEntityMap()
    const lastKey = entityMap.keySeq().last()
    let key
    if(lastKey){
      key = `${Number(lastKey)+1}`
    }else{
      key = "1"
    }
    console.log(key)
    const newEntityMap = entityMap.set(
                            key,
                            new DraftEntityInstance({
                              type,
                              mutability,
                              data
                            })
                          )
    this.currentContent = this.currentContent.set(
      "entityMap",
      newEntityMap
    )
    return key
  }
  insertCharacterAtSelectionEndWithEntity = (char,entityKey) => {
    this.currentContent = Modifier.insertText(this.currentContent, this.selection,char, null, entityKey, null)

    // const head = this.blocksArray.slice(0, this.index)
    // const tail = this.blocksArray.slice(this.index+1)
    // const charList = this.currentBlock.getCharacterList()
    // const text = this.currentBlock.getText()
    // const focusOffset = this.selection.getFocusOffset()
    // const anchorOffset = this.selection.getAnchorOffset()
    // const offset = focusOffset>anchorOffset?focusOffset:anchorOffset
    // const headCharList = charList.slice(0,offset)
    // const tailCharList = charList.slice(offset)
    // const headText = text.slice(0,offset)
    // const tailText = text.slice(offset)
    // this.blocksArray = head.concat(
    //   this.currentBlock.merge({
    //     characterList: headCharList.concat([new CharacterMetadata(
    //       {
    //         entity: entityKey,
    //       }
    //     )]).concat(tailCharList),
    //     text: headText.concat(char).concat(tailText)
    //   })
    // ).concat(tail)
  }
  insertElementAfter = (type)=>{
    const head = this.blocksArray.slice(0, this.index+1)
    const tail = this.blocksArray.slice(this.index-2)
    this.currentBlock = new ContentBlock({
      key: genKey(),
      type,
      depth:this.currentDepth,
    })
    this.blocksArray =  head.concat([this.currentBlock]).concat(tail)
    this.index++
    return this
  }
  insertElementBefore = (type)=>{
    const head = this.blocksArray.slice(0, this.index)
    const tail = this.blocksArray.slice(this.index-1)
    this.currentBlock = new ContentBlock({
      key: genKey(),
      type,
      depth:this.currentDepth,
    })
    this.blocksArray =  head.concat([this.currentBlock]).concat(tail)
    this.index++
    return this
  }
  toggleBlockType = (type) => {

  }
  countChildren = ()=>{
    const tail = this.blocksArray.slice(this.index+1)
    let counter = 0
    for (let block of tail){
      if(block.getDepth() === this.currentDepth+1){
        counter++
      }
      if(block.getDepth()===this.currentDepth){
        break
      }
    }
    return counter
  }

  queryParent = (type)=>{
    const head = this.blocksArray.slice(0, this.index)
    const diffIndex = head.reverse().findIndex((block)=>{
      return block.getType()===type
    })
    this.index = this.index - diffIndex -1
    this.currentBlock = this.blocksArray[this.index]
    this.currentDepth = this.currentBlock.getDepth()

    console.log(this.blocksArray)
    console.log(this.index, this.blocksArray.length)
    return this
  }
  setStyleAttr = (attr, value) => {
    this.blocksArray = Modifier.mergeBlockData(
      this.currentContent,
      this.selection,
      new Map({
        style:{
          [attr]: value
        }
      })
    ).getBlocksAsArray()
    return this
  }

  getCurrentContent = () =>{
    return this.currentContent
    const lastKey = this.currentBlock.getKey()
    console.log(this.currentContent)
    const selectionState = new SelectionState({
      anchorKey: lastKey,
      anchorOffset: 1,
      focusOffset: 1,
      focusKey: lastKey,
      isBackward: false,
      hasFocus: true
    })
    return this.currentContent.merge({
      blockMap: BlockMapBuilder.createFromArray(this.blocksArray),
      selectionBefore: selectionState,
      selectionAfter: selectionState
    })

  }

}

export default ContentController

import {
    ContentBlock,
    EditorState,
    genKey,
    SelectionState,
    Modifier,
    BlockMapBuilder,
    CharacterMetadata
} from "draft-js"
import {OrderedMap,List,Repeat, Map} from 'immutable';


class ChainModifier {
  constructor(editorState){
    this.currentContent = editorState.getCurrentContent()
    this.selection = editorState.getSelection()
    this.editorState = editorState
    this.updateEditorState(this.currentContent)
  }
  queryAndAppend = (query, type, at_index) => {
    this.currentContent.getBlockMap()
    const head = this.blocksArray.slice(0, this.index+1)
    const tail = this.blocksArray.slice(this.index+1)

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
  appendChild = (type, text="") => {
    console.log(this.selection.toJSON())
    return this.appendChildren(type, 1, text)
  }
  appendChildren = (type, size, text="") => {
    const currentBlock = this.currentContent.getBlockForKey(this.selection.getFocusKey())
    let newBlockMap = [
      currentBlock
    ]
    let newKey;
    const charData = CharacterMetadata.create({});
    for(let i=0; i<size;i++){
      newKey = genKey()
      newBlockMap.push(
        new ContentBlock({
          key: newKey,
          type,
          depth:currentBlock.getDepth()+1,
          text,
          characterList: List(Repeat(charData, text.length))
        })
      )
      console.log(newBlockMap)
      console.log(newKey)
    }
    newBlockMap = BlockMapBuilder.createFromArray(newBlockMap)
    console.log(newBlockMap)
    const withFragment = Modifier.replaceWithFragment(
      this.currentContent,
      this.selection.merge({
        focusOffset: currentBlock.getText().length-1,
        anchorOffset: 0
      }),
      newBlockMap
    )
    this.updateEditorState(withFragment, new SelectionState(
      {focusOffset: 0, anchorOffset: 0, anchorKey: newKey, focusKey: newKey}
    ))
    return this
  }
  createEntity = (type, mutability="MUTABLE", data={}) => {
    const withEntity = Modifier.createEntity(
      this.currentContent,
      type,
      mutability,
      data
    )
    this.updateEditorState(withEntity)
    return this.currentContent.getLastCreatedEntityKey()
  }
  insertCharacterAtSelectionEndWithEntity = (char, entityKey) => {
    const withEntity = Modifier.insertText(
      this.currentContent,
      this.selection,
      char,
      null,
      entityKey,
      null
    )
    this.updateEditorState(withEntity)
    return this
  }
  insertElementAfter = (type) => {
    const currentBlock = this.currentContent.getBlockForKey(this.selection.getFocusKey())
    const newBlockKey = genKey()
    const withNewBlock = Modifier.splitBlock(
      this.currentContent,
      this.selection.merge({
        anchorOffset: currentBlock.getText().length,
        focusOffset: currentBlock.getText().length
      }),
      newBlockKey
    )
    const newSelection = this.selection.merge({
      focusKey: newBlockKey,
      anchorKey: newBlockKey,
      anchorOffset: 0,
      focusOffset: 0
    })
    const withType = Modifier.setBlockType(
      withNewBlock,
      newSelection,
      type
    )
    const adjustedDepth = Modifier.adjustBlockDepth(
      withType,
      newSelection,
      currentBlock.getDepth(),
      100
    )
    const withoutData = Modifier.setBlockData(
      adjustedDepth,
      newSelection,
      new Map({})
    )
    this.updateEditorState(withoutData, newSelection)
    return this
  }
  insertElementBefore = (type)=>{
    const blockBefore = this.currentContent.getBlockBefore(
      this.selection.getFocusKey()
    )
    const currentBlock = this.currentContent.getBlockForKey(
      this.selection.getFocusKey()
    )
    const newBlockKey = genKey()
    const withNewBlock = Modifier.splitBlock(
      this.currentContent,
      this.selection.merge({
        anchorOffset: blockBefore.getText().length,
        focusOffset: blockBefore.getText().length,
        anchorKey: blockBefore.getKey(),
        focusKey: blockBefore.getKey()
      }),
      newBlockKey
    )
    const newSelection = this.selection.merge({
      focusKey: newBlockKey,
      anchorKey: newBlockKey,
      anchorOffset: 0,
      focusOffset: 0
    })
    const withType = Modifier.setBlockType(
      withNewBlock,
      this.selection,
      type
    )
    const adjustedDepth = Modifier.adjustBlockDepth(
      withType,
      newSelection,
      currentBlock.getDepth(),
      100
    )
    const withoutData = Modifier.setBlockData(
      adjustedDepth,
      this.selection,
      new Map({})
    )
    this.updateEditorState(withoutData, newSelection)
    return this
  }
  toggleBlockInBlock = (type)=>{
    const newBlockKey = genKey()
    const currentBlock = this.currentContent.getBlockForKey(this.selection.getFocusKey())
    const withNewBlock = Modifier.splitBlock(
      this.currentContent,
      this.selection.merge({
        anchorOffset: 0,
        focusOffset: 0
      }),
      newBlockKey
    )
    const newSelection = this.selection.merge({
      focusKey: newBlockKey,
      anchorKey: newBlockKey
    })
    const withType = Modifier.setBlockType(
      withNewBlock,
      newSelection,
      type
    )
    const adjustedDepth = Modifier.adjustBlockDepth(
      withType,
      newSelection,
      currentBlock.getDepth()+1,
      100
    )
    const withoutData = Modifier.setBlockData(
      adjustedDepth,
      newSelection,
      new Map({})
    )
    this.updateEditorState(withoutData, newSelection)
    return this
  }
  setStyleAttr = (attr, value) => {
    const withStyle = Modifier.mergeBlockData(
      this.currentContent,
      this.selection,
      new Map({
        style:{
          [attr]: value
        }
      })
    )
    this.updateEditorState(withStyle)
    return this
  }
  updateEditorState = (currentContent, selection) => {
    this.editorState = EditorState.set(this.editorState, {
      currentContent,
      selection: selection || this.selection
    })
    this.currentContent = currentContent
    this.selection = selection || this.selection
    this.blocksArray = currentContent.getBlocksAsArray()
    this.currentBlock = this.currentContent.getBlockForKey(this.selection.getAnchorKey())
    this.currentDepth = this.currentBlock.getDepth()
    this.currentInlineStyle = this.editorState.getCurrentInlineStyle()
    this.index = this.blocksArray.findIndex((block)=>{
      return block.getKey()===this.selection.getFocusKey()
    })
  }
  getCurrentContent = () => {
    return this.currentContent
  }
}
export default ChainModifier

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
  getChildIndex = () => {
    const head = this.blocksArray.slice(0, this.index+1)
    const type = this.currentBlock.getType()
    const index = head.reverse().findIndex((block)=>{
      return block.getType()=== type
    }) + 1
    console.log(type, index )
  }
  queryParent = (type)=>{
    const head = this.blocksArray.slice(0, this.index)
    const block = head.reverse().find((block)=>{
      return block.getType()===type
    })

    const selection = new SelectionState({
      focusKey: block.getKey(),
      anchorKey: block.getKey(),
      focusOffset:0,
      anchorOffset:0,
    })
    this.updateEditorState(this.currentContent, selection)
    return this
  }
  queryAndAppend = (query, type, at_index) => {
    this.currentContent.getBlockMap()
    const head = this.blocksArray.slice(0, this.index+1)
    const tail = this.blocksArray.slice(this.index+1)
    let selection;
    let last_insert = -1
    for (let i=0;i<tail.length;i++){
      let block = tail[i]
      let insert = -1
      if(block.getType() === query){
        if(!at_index){
          console.log(tail[i-1])
          selection = new SelectionState({
            focusKey:tail[i].getKey(),
            anchorKey:tail[i].getKey(),
            focusOffset:0,
            anchorOffset:0
          })
          this.updateEditorState(this.currentContent, selection)
          this.appendChild(type)
          // tail.splice(i-1,0,
          //   new ContentBlock({
          //     key: genKey(),
          //     type,
          //     depth:block.getDepth()+1,
          //   })
          // )
          last_insert = i
          i++
        }else{
          insert = i+at_index
        }
        if(i==insert){

          selection = new SelectionState({
            focusKey:tail[i].getKey(),
            anchorKey:tail[i].getKey(),
            focusOffset:0,
            anchorOffset:0
          })
          this.updateEditorState(this.currentContent, selection)
          this.appendChild(type)
          // tail.splice(i-1,0,
          //   new ContentBlock({
          //     key: genKey(),
          //     type,
          //     depth:block.getDepth()+1,
          //   })
          // )
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
  appendChild = (type, text=" ") => {
    return this.appendChildren(type, 1, text)
  }
  appendChildren = (type, size, text=" ") => {
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
    }
    newBlockMap = BlockMapBuilder.createFromArray(newBlockMap)
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
    const charData = CharacterMetadata.create({});
    const newBlockKey = genKey()
    const newBlock = new ContentBlock({
      key: newBlockKey,
      type,
      depth: this.currentBlock.getDepth(),
      text:" ",
      characterList: List([charData])
    })
    const newBlockMap = BlockMapBuilder.createFromArray(
      [
        this.currentBlock,
        newBlock,
      ]
    )
    const withNewBlock = Modifier.replaceWithFragment(
      this.currentContent,
      this.selection.merge({
        focusOffset: this.currentBlock.getText().length,
        anchorOffset: 0
      }),
      newBlockMap
    )

    const newSelection = this.selection.merge({
      focusKey: newBlockKey,
      anchorKey: newBlockKey,
      anchorOffset: 0,
      focusOffset: 0
    })
    console.log(withNewBlock.getBlocksAsArray(), this.currentContent.getBlocksAsArray())
    this.updateEditorState(withNewBlock, newSelection)
    return this
  }
  insertElementBefore = (type)=>{
    const previousBlock = this.currentContent.getBlockBefore(this.selection.getFocusKey())
    const charData = CharacterMetadata.create({});
    const newBlockKey = genKey()
    const newBlock = new ContentBlock({
      key: newBlockKey,
      type,
      depth: this.currentBlock.getDepth(),
      text:" ",
      characterList: List([charData])
    })
    const newBlockMap = BlockMapBuilder.createFromArray(
      [
        previousBlock,
        newBlock,
      ]
    )
    const withNewBlock = Modifier.replaceWithFragment(
      this.currentContent,
      new SelectionState({
        focusOffset: previousBlock.getText().length,
        anchorOffset: 0,
        anchorKey: previousBlock.getKey(),
        focusKey: previousBlock.getKey()
      }),
      newBlockMap
    )

    const newSelection = this.selection.merge({
      focusKey: newBlockKey,
      anchorKey: newBlockKey,
      anchorOffset: 0,
      focusOffset: 0
    })
    console.log(withNewBlock.getBlocksAsArray(), this.currentContent.getBlocksAsArray())
    this.updateEditorState(withNewBlock, newSelection)
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

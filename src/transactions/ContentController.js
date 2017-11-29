import {
  ContentBlock,
  EditorState,
  genKey,
  SelectionState,
  Modifier,
  BlockMapBuilder,
  CharacterMetadata,
  RichUtils
} from "draft-js";
import {List, Repeat, Map} from 'immutable';


class ContentController {
  constructor(editorState) {

    this.currentContent = editorState.getCurrentContent();
    this.selection = editorState.getSelection();
    this.editorState = editorState;
    this.updateEditorState(this.currentContent);
  }
  defaultHandleKeyCommand = (command) => {
    const newEditorState = RichUtils.handleKeyCommand(this.editorState, command);
    if (newEditorState) {
      this.updateEditorState(newEditorState.getCurrentContent());
    }
    return this;
  }
  isSelectionAtEndOfBlock = () => {
    return this.selection.getAnchorOffset() === this.currentBlock.getText().length;
  }
  isSelectionAtStartOfBlock = () => {
    return this.selection.getFocusOffset() === 0;
  }
  isBlockEmpty = () => {
    return this.currentBlock.getText().length === 0;
  }
  selectNextBlock = () => {
    const nextBlockKey = this.currentContent.getKeyAfter(this.selection.getFocusKey());

    this.selection = new SelectionState({
      anchorKey: nextBlockKey,
      anchorOffset: 0,
      focusKey: nextBlockKey,
      focusOffset: 0,
      hasFocus: true
    });
    this.updateEditorState(this.currentContent, this.selection);
    return this;
  }
  getSelectedText = () => {
    return this.currentBlock.getText()
      .slice(this.selection.getAnchorOffset(), this.selection.getFocusOffset());
  }
  splitBlock = () => {
    const withSplittedBlock = Modifier.splitBlock(this.currentContent, this.selection);
    this.updateEditorState(withSplittedBlock);
    return this;
  }
  countChildren = () => {
    const tail = this.blocksArray.slice(this.index + 1);
    let counter = 0;
    for (let block of tail) {
      if (block.getDepth() === this.currentDepth + 1) {
        counter++;
      }
      if (block.getDepth() === this.currentDepth) {
        break;
      }
    }
    return counter;
  }
  getCurrentMetaData = (styleType) => {
    const metaKey = this.editorState.getCurrentMeta().get(styleType);
    if (metaKey) {
      return this.currentContent.getMeta(metaKey).getData();
    }
    return false;
  }
  getCurrentMetaKey = (styleType) => {
    const metaKey = this.editorState.getCurrentMeta().get(styleType);
    if (metaKey) {
      return metaKey;
    }
    return false;
  }

  replaceStyleMetaData = (styleType, data) => {
    const metaKey = this.editorState.getCurrentMeta().get(styleType);
    const changedContent = Modifier.mergeMetaData(this.currentContent, metaKey, data);
    this.updateEditorState(changedContent);
    return this;
  }
  insertEntity = (type, data) => {
    const contentWithEntity = this.currentContent.createEntity(
      type,
      "IMMUTABLE",
      data
    );
    const entityKey = contentWithEntity.getLastCreatedEntityKey();
    this.updateEditorState(contentWithEntity);
    this.insertCharacterAtSelectionEndWithEntity(" ", entityKey);
    return this;
  }
  getChildIndex = () => {
    const currentDepth = this.currentBlock.getDepth();
    const parentBlock = this.location.find(block => block.getDepth() === currentDepth - 1);
    return this.currentContent.getBlockMap()
      .skipUntil(block => parentBlock === block)
      .takeUntil(block => this.currentBlock === block)
      .count(block => currentDepth === block.getDepth());
  }
  queryParent = (type) => {
    const block = this.location.reverse().find(block => block.getType() === type);
    this.location.reverse();
    if (!block) {
      return false;
    }
    const selection = new SelectionState({
      focusKey: block.getKey(),
      anchorKey: block.getKey(),
      focusOffset: 0,
      anchorOffset: 0,
    });
    this.updateEditorState(this.currentContent, selection);
    return this;
  }
  removeElement = () => {
    let lastBlock = this.currentContent.getBlockMap()
      .skipUntil(block => block === this.currentBlock)
      .find(block => block.getDepth() <= this.currentBlock.getDepth() && block !== this.currentBlock);
    if (!lastBlock) {
      lastBlock = this.currentContent.getLastBlock();
    } else {
      lastBlock = this.currentContent.getBlockBefore(lastBlock.getKey());
    }
    const previousBlock = this.currentContent.getBlockBefore(this.currentBlock.getKey());
    const newContent = Modifier.removeRange(
      this.currentContent,
      this.selection.merge({
        anchorKey: previousBlock.getKey(),
        anchorOffset: previousBlock.getText().length,
        focusKey: lastBlock.getKey(),
        focusOffset: lastBlock.getText().length
      }),
      "backward"
    );
    this.updateEditorState(newContent, new SelectionState({
      anchorKey: previousBlock.getKey(),
      anchorOffset: 0,
      focusKey: previousBlock.getKey(),
      focusOffset: 0
    }));
    return this;
  }
  queryAndRemove = (query, type, at_index) => {
    let counter = -1;
    let selection;
    const afterKey = this.currentContent.getKeyAfter(this.currentBlock.getKey());
    this.currentContent
      .getBlockMap()
      .skipUntil(block => block.getKey() === afterKey)
      .takeUntil(block => block.getDepth() === this.currentBlock.getDepth())
      .filter(block => block.getDepth() <= this.currentBlock.getDepth() + 2)
      .forEach((block, key) => {
        if (block.getType() === query) {
          counter = -1;
        }
        if (counter === at_index) {
          selection = new SelectionState({
            focusKey: block.getKey(),
            anchorKey: block.getKey(),
            focusOffset: 0,
            anchorOffset: 0
          });
          this.updateEditorState(this.currentContent, selection);
          this.removeElement();
        }
        counter++;
      });
    return this;
  }
  queryAndSelect = (query, minDepth = 0) => {
    const currentBlockKey = this.currentBlock.getKey();
    const queriedBlock = this.currentContent
      .getBlockMap()
      .skipUntil(block => block.getKey() === currentBlockKey)
      .takeUntil(block => block.getDepth() === minDepth)
      .find(block => block.getType() === query && block.getKey()!==this.currentBlock.getKey());
    if ( queriedBlock ) {
      const newSelection = new SelectionState({
        focusKey: queriedBlock.getKey(),
        anchorKey: queriedBlock.getKey(),
        hasFocus: true
      });
      this.updateEditorState(this.currentContent, newSelection);
    }
    return this;
    
  }
  queryAndAppend = (query, type, at_index = 0) => {
    let counter = -1;
    let selection;
    const afterKey = this.currentContent.getKeyAfter(this.currentBlock.getKey());
    this.currentContent
      .getBlockMap()
      .skipUntil(block => block.getKey() === afterKey)
      .takeUntil(block => block.getDepth() === this.currentBlock.getDepth())
      .filter(block => block.getDepth() <= this.currentBlock.getDepth() + 2)
      .forEach((block, key) => {
        if (block.getType() === query) {
          counter = -1;
        }
        if (counter === at_index) {
          selection = new SelectionState({
            focusKey: block.getKey(),
            anchorKey: block.getKey(),
            focusOffset: 0,
            anchorOffset: 0
          });
          this.updateEditorState(this.currentContent, selection);
          this.insertElementAfter(type);
        }
        counter++;
      });
    return this;

  }
  appendChild = (type, text = "") => {
    return this.appendChildren(type, 1, text);
  }
  appendChildren = (type, size, text = "") => {
    const currentBlock = this.currentContent.getBlockForKey(this.selection.getFocusKey());
    let newBlockMap = [
      currentBlock
    ];
    let newKey;
    const charData = CharacterMetadata.create({});
    for (let i = 0; i < size; i++) {
      newKey = genKey();
      newBlockMap.push(
        new ContentBlock({
          key: newKey,
          type,
          depth: currentBlock.getDepth() + 1,
          text,
          characterList: List(Repeat(charData, text.length))
        })
      );
    }
    newBlockMap = BlockMapBuilder.createFromArray(newBlockMap);
    const withFragment = Modifier.replaceWithFragment(
      this.currentContent,
      this.selection.merge({
        focusOffset: currentBlock.getText().length - 1,
        anchorOffset: 0
      }),
      newBlockMap
    );
    this.updateEditorState(withFragment, new SelectionState(
      {focusOffset: 0, anchorOffset: 0, anchorKey: newKey, focusKey: newKey}
    ));
    return this;
  }
  createEntity = (type, mutability = "MUTABLE", data = {}) => {
    const withEntity = Modifier.createEntity(
      this.currentContent,
      type,
      mutability,
      data
    );
    this.updateEditorState(withEntity);
    return this.currentContent.getLastCreatedEntityKey();
  }
  insertCharacterAtSelectionEndWithEntity = (char, entityKey) => {
    const withEntity = Modifier.insertText(
      this.currentContent,
      this.selection,
      char,
      null,
      entityKey,
      null
    );
    this.updateEditorState(withEntity);
    return this;
  }
  insertElementAfter = (type) => {
    const charData = CharacterMetadata.create({});
    const newBlockKey = genKey();
    const newBlock = new ContentBlock({
      key: newBlockKey,
      type,
      depth: this.currentBlock.getDepth(),
      text: "",
      characterList: List([charData])
    });
    let inBlock = false;
    let lastNestedBlock = this.currentContent.getBlockMap().find(block => {
      if (inBlock && block.getDepth() <= this.currentBlock.getDepth()) {
        return true;
      }
      if (this.currentBlock.getKey() === block.getKey()) {
        inBlock = true;
      }
      return false;
    });
    if (!lastNestedBlock) {
      lastNestedBlock = this.currentBlock;
    } else {
      lastNestedBlock = this.currentContent.getBlockBefore(lastNestedBlock.getKey());
    }
    const newBlockMap = BlockMapBuilder.createFromArray(
      [
        lastNestedBlock,
        newBlock,
      ]
    );
    const withNewBlock = Modifier.replaceWithFragment(
      this.currentContent,
      this.selection.merge({
        focusKey: lastNestedBlock.getKey(),
        anchorKey: lastNestedBlock.getKey(),
        focusOffset: lastNestedBlock.getText().length,
        anchorOffset: 0
      }),
      newBlockMap
    );

    const newSelection = this.selection.merge({
      focusKey: newBlockKey,
      anchorKey: newBlockKey,
      anchorOffset: 0,
      focusOffset: 0
    });
    this.updateEditorState(withNewBlock, newSelection);
    return this;
  }
  insertElementBefore = (type) => {
    const previousBlock = this.currentContent.getBlockBefore(this.selection.getFocusKey());
    const charData = CharacterMetadata.create({});
    const newBlockKey = genKey();
    const newBlock = new ContentBlock({
      key: newBlockKey,
      type,
      depth: this.currentBlock.getDepth(),
      text: "",
      characterList: List([charData])
    });
    const newBlockMap = BlockMapBuilder.createFromArray(
      [
        previousBlock,
        newBlock,
      ]
    );
    const withNewBlock = Modifier.replaceWithFragment(
      this.currentContent,
      new SelectionState({
        focusOffset: previousBlock.getText().length,
        anchorOffset: 0,
        anchorKey: previousBlock.getKey(),
        focusKey: previousBlock.getKey()
      }),
      newBlockMap
    );

    const newSelection = this.selection.merge({
      focusKey: newBlockKey,
      anchorKey: newBlockKey,
      anchorOffset: 0,
      focusOffset: 0
    });
    this.updateEditorState(withNewBlock, newSelection);
    return this;
  }
  toggleBlockType = (type) => {
    const withToggledBlock = Modifier.setBlockType(
      this.currentContent, 
      this.selection, 
      type
    );
    this.updateEditorState(withToggledBlock);
    return this;
  }
  toggleBlockInBlock = (type) => {
    const newBlockKey = genKey();
    const currentBlock = this.currentContent.getBlockForKey(this.selection.getFocusKey());
    const withNewBlock = Modifier.splitBlock(
      this.currentContent,
      this.selection.merge({
        anchorOffset: 0,
        focusOffset: 0
      }),
      newBlockKey
    );
    const newSelection = this.selection.merge({
      focusKey: newBlockKey,
      anchorKey: newBlockKey
    });
    const withType = Modifier.setBlockType(
      withNewBlock,
      newSelection,
      type
    );
    const adjustedDepth = Modifier.adjustBlockDepth(
      withType,
      newSelection,
      currentBlock.getDepth() + 1,
      100
    );
    const withoutData = Modifier.setBlockData(
      adjustedDepth,
      newSelection,
      new Map({})
    );
    this.updateEditorState(withoutData, newSelection);
    return this;
  }
  setStyleAttr = (attr, value) => {
    let style = this.currentBlock.getData().get("style") || {};

    style = {...style, [attr]: value};
    const withStyle = Modifier.mergeBlockData(
      this.currentContent,
      this.selection,
      new Map({
        style
      })
    );
    this.updateEditorState(withStyle);
    return this;
  }
  setAttr = (attr, value) => {
    const attributes = this.currentBlock.getData().get("attributes") || {};
    attributes[attr] = value;
    const withAttr = Modifier.mergeBlockData(
      this.currentContent,
      this.selection,
      new Map({
        attributes
      })
    );
    this.updateEditorState(withAttr);
    return this;
  }
  getStyleType = (styleType) => {
    return this.currentInlineStyle.find((style) => style.startsWith(styleType));
  }
  updateEditorState = (currentContent, selection) => {
    this.editorState = EditorState.push(this.editorState,
      currentContent,
      'insert-fragment'
     );
    if (selection) {
      this.editorState = EditorState.forceSelection(this.editorState, selection);
    }
    this.currentContent = currentContent;
    this.selection = selection || this.selection;
    this.blockKey = this.selection.getFocusKey();
    let reachedRoot = false;
    this.location = this
      .currentContent
      .getBlockMap()
      .reverse()
      .skipUntil((block) => block.getKey() === this.blockKey)
      .takeUntil(block => {
        if (reachedRoot) {
          return reachedRoot;
        }
        if (block.getDepth() === 0) {
          reachedRoot = true;
          return false;
        }
        return reachedRoot;
      })
      .reduce((tree, block) => {
        if (!tree[block.getDepth()]) {
          tree[block.getDepth()] = block;
        }
        return tree;
      }, []);
    this.blocksArray = currentContent.getBlocksAsArray();
    this.currentBlock = this.currentContent.getBlockForKey(this.selection.getAnchorKey());
    this.currentDepth = this.currentBlock.getDepth();
    this.currentInlineStyle = this.editorState.getCurrentInlineStyle();
    this.index = this.blocksArray.findIndex((block) => {
      return block.getKey() === this.selection.getFocusKey();
    });
  }
  getCurrentContent = () => {
    return this.currentContent;
  }
}


export default ContentController;

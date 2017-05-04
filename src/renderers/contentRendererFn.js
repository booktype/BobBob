import React from 'react';
import {EditorBlock} from 'draft-js';
import nullthrows from 'fbjs/lib/nullthrows';
import invariant from 'fbjs/lib/nullthrows';
import DraftOffsetKey from 'draft-js/lib/DraftOffsetKey';
export default function contentRendererFn(props){
  const {
    blockRenderMap,
    blockRendererFn,
    contentRendererFn,
    leafRendererFn,
    customStyleMap,
    customStyleFn,
    editorState,
  } = props;
  const content = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const forceSelection = editorState.mustForceSelection();
  const decorator = editorState.getDecorator();
  const directionMap = nullthrows(editorState.getDirectionMap());

  const blocksAsArray = content.getBlocksAsArray();
  const processedBlocks = [];
  let currentDepth = null;
  let lastWrapperTemplate = null;

  for (let ii = 0; ii < blocksAsArray.length; ii++) {
    const block = blocksAsArray[ii];
    const key = block.getKey();
    const blockType = block.getType();

    const customRenderer = blockRendererFn(block);
    let CustomComponent, customProps, customEditable;
    if (customRenderer) {
      CustomComponent = customRenderer.component;
      customProps = customRenderer.props;
      customEditable = customRenderer.editable;
    }

    const {textDirectionality} = props;
    const direction = textDirectionality
      ? textDirectionality
      : directionMap.get(key);
    const offsetKey = DraftOffsetKey.encode(key, 0, 0);
    const componentProps = {
      contentState: content,
      block,
      blockProps: customProps,
      customStyleMap,
      customStyleFn,
      leafRendererFn,
      decorator,
      direction,
      forceSelection,
      key,
      offsetKey,
      selection,
      tree: editorState.getBlockTree(key),
    };

    const configForType = blockRenderMap.get(blockType);
    const wrapperTemplate = configForType.wrapper;

    const Element = (
      configForType.element ||
      blockRenderMap.get('unstyled').element
    );
    const voidElement = configForType.void
    const depth = block.getDepth();
    let className = props.blockStyleFn(block);

    // // List items are special snowflakes, since we handle nesting and
    // // counters manually.
    // if (Element === 'li') {
    //   const shouldResetCount = (
    //     lastWrapperTemplate !== wrapperTemplate ||
    //     currentDepth === null ||
    //     depth > currentDepth
    //   );
    //   className = joinClasses(
    //     className,
    //     getListItemClasses(blockType, depth, shouldResetCount, direction),
    //   );
    // }

    const Component = CustomComponent || EditorBlock;
    let childProps = {
      className,
      'data-block': true,
      'data-editor': props.editorKey,
      'data-offset-key': offsetKey,
      key,
    };
    if (customEditable !== undefined) {
      childProps = {
        ...childProps,
        contentEditable: customEditable,
        suppressContentEditableWarning: true,
      };
    }

    const child = React.createElement(
      Element,
      childProps,
      <Component {...componentProps} />,
    );

    const data = block.getData().toJSON()
    const attributes = data.attributes || {}
    if(attributes.dataset){
      for(var prop in attributes.dataset){
        attributes[`data-${prop}`] = attributes.dataset[prop]
      }
      delete attributes.dataset
    }
    if(attributes.className && attributes.className.constructor === Array){
      attributes.className = attributes.className.join(" ")
    }
    const style = data.style || {}
    processedBlocks.push({
      block: child,
      wrapperTemplate,
      key,
      depth,
      voidElement,
      offsetKey,
      attributes,
      style
    });

    if (wrapperTemplate) {
      currentDepth = block.getDepth();
    } else {
      currentDepth = null;
    }
    lastWrapperTemplate = wrapperTemplate;
  }

  // Group contiguous runs of blocks that have the same wrapperTemplate

  function nestBlocks(blocks, depth){
    const outputBlocks = []
    return blocks.reduce((acc,item)=>{
      if(item.depth==depth){
        acc.push([item])
      }else if(item.depth> depth){
        acc[acc.length-1].push(item)
      }
      return acc
    },[]).map((block)=>{
      const currentBlock = block[0]
      if(block.length!=1){
        currentBlock.children = nestBlocks(block.slice(1), block[1].depth)
      }
      return currentBlock
    })
  }

  var createChildren = function(node) {
    if(!node.children){
      return node.block.props.children
    }
    return node.children.map(createElement);
  };

  var createElement = function(node) {
    if (!node || !node.block) {
      return false;
    }
    if(node.voidElement){
      return React.cloneElement(node.block, {
        key: node.key + '-wrap',
        'data-offset-key': node.offsetKey,
        ...node.attributes,
        style: node.style,
      } , null);
    }
    return React.cloneElement(node.block, {
      key: node.key + '-wrap',
      'data-offset-key': node.offsetKey,
      ...node.attributes,
      style: node.style,
      } , createChildren(node));
  };
  const blocks = nestBlocks(processedBlocks,0)
  const outputBlocks = blocks.map((block)=>{
    return createElement(block)
  })
  return outputBlocks
}

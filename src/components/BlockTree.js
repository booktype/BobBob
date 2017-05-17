import React from 'react';

import {Step, Stepper, StepLabel} from 'material-ui/Stepper';
import ArrowForwardIcon from 'material-ui/svg-icons/navigation/arrow-forward';
import WarningIcon from 'material-ui/svg-icons/alert/warning';
class BlockTree extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      location: []
    }
  }
  componentWillReceiveProps(nextProps){
    this.blockKey = nextProps.controller.selection.getFocusKey()
    let reachedRoot = false
    const location = nextProps
     .controller
     .currentContent
     .getBlockMap()
     .reverse()
     .skipUntil((block)=>block.getKey()===this.blockKey)
     .takeUntil(block=>{
       if(reachedRoot){
         return reachedRoot
       }
       if(block.getDepth()===0){
         reachedRoot = true
         return false
       }
       return reachedRoot
     })
     .reduce((tree, block)=>{
       if(!tree[block.getDepth()]){
         tree[block.getDepth()] = block
       }
       return tree
     },[])
     this.setState({location})

  }
  render() {
    return (
      <Stepper style={{justifyContent: "initial"}} connector={< ArrowForwardIcon />}>
        {this.state.location.map(block=>(
          <Step key={block.getKey()}>
            <StepLabel
              >{block.getType()}</StepLabel>
            </Step>
        ))}
      </Stepper>
    )
  }
}

export default BlockTree

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

     this.setState({location:nextProps.controller.location})

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

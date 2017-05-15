import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import client from '../../feathers'


export default class CreateCollection extends React.Component {
  state = {
    open: false,
    finished: false,
    stepIndex: 0,
    title: "",
    description: "",
    licence: "ARR",
    image: ""
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };
  handleSubmit = (e) => {
    const {title, description, licence, image} = this.state
    if(this.state.title){
      client.service('collections').create({ title, description, licence, image }).then((res) => {
        console.log(res)
      });
    }
    this.handleClose()
    e.preventDefault()
  };
  handleNext = () => {
    const {stepIndex} = this.state;
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 4,
    });
  };

  handlePrev = () => {
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1});
    }
  };

  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return <TextField
                onChange={(e)=>{this.setState({title: e.target.value})}}
                value={this.state.title}
                floatingLabelText="What is the title of the collection"
              />;
      case 1:
        return <TextField
                onChange={(e)=>{this.setState({description: e.target.value})}}
                value={this.state.description}
                floatingLabelText="What is the description of the collection"
                multiLine={true}
              />;
      case 2:
        return <SelectField
          floatingLabelText="Choose licence"
          value={this.state.licence}
          onChange={(e,i,value)=>{this.setState({licence: value})}}
        >
          <MenuItem value={"ARR"} primaryText="© - All Rights Reserved" />
          <MenuItem value={"CC BY"} primaryText="Creative Commons Attribution" />
          <MenuItem value={"CC BY-ND"} primaryText="Creative Commons Attribution-NoDerivs" />
          <MenuItem value={"CC BY-NC"} primaryText="Creative Commons Attribution-NonCommercial" />
          <MenuItem value={"CC BY-NC-ND"} primaryText="Creative Commons Attribution-NonCommercial-NoDerivs" />
        </SelectField>;
      case 3:
        return <TextField
                onChange={(e)=>{this.setState({image: e.target.value})}}
                value={this.state.image}
                floatingLabelText="Add a link to an image of the collection"
              />;
    }
  }
  render() {
    const {finished, stepIndex} = this.state;
    const contentStyle = {margin: '0 16px'};
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleSubmit}
      />,
    ];

    return (
      <div>
        <RaisedButton label="Create Collection" onTouchTap={this.handleOpen} />
        <Dialog
          title="Dialog With Actions"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <div style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
          <Stepper activeStep={stepIndex}>
            <Step>
              <StepLabel>Title</StepLabel>
            </Step>
            <Step>
              <StepLabel>Description</StepLabel>
            </Step>
            <Step>
              <StepLabel>Licence</StepLabel>
            </Step>
            <Step>
              <StepLabel>Image</StepLabel>
            </Step>
          </Stepper>
          <div style={contentStyle}>
            {finished ? (
              <p>
                <a
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    this.setState({stepIndex: 0, finished: false});
                  }}
                >
                  Click here
                </a> to reset the example.
              </p>
            ) : (
              <div>
                {this.getStepContent(stepIndex)}
                <div style={{marginTop: 12}}>
                  <FlatButton
                    label="Back"
                    disabled={stepIndex === 0}
                    onTouchTap={this.handlePrev}
                    style={{marginRight: 12}}
                  />
                  <RaisedButton
                    label={stepIndex === 3 ? 'Finish' : 'Next'}
                    primary={true}
                    onTouchTap={this.handleNext}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        </Dialog>
      </div>
    );
  }
}

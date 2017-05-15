import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import TextField from 'material-ui/TextField';
import client from '../../feathers';

class Login extends Component {
  static muiName = 'FlatButton';
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }
  handleEmailChange=(e)=>{
    this.setState({
      email: e.target.value
    })
  }
  handlePasswordChange=(e)=>{
    this.setState({
      password: e.target.value
    })
  }
  login=()=> {
    const { email, password } = this.state;
    console.log(email,password)
    return client.authenticate({
      strategy: 'local',
      email, password
    }).catch(error => this.setState({ error }));
  }

  signup=()=> {
    const { email, password } = this.state;

    return client.service('users')
      .create({ email, password })
      .then(() => this.login());
  }

  handleTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  }
  render() {
    return (
      <div>
        <FlatButton onTouchTap={this.handleTouchTap} {...this.props} label="Login" />
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.handleRequestClose}
          >
            <TextField
              floatingLabelText="Email"
              onChange={this.handleEmailChange}
            />
            <TextField
              floatingLabelText="Password"
              onChange={this.handlePasswordChange}
            />
            <FlatButton label="Login" onTouchTap={this.login}/>
            <FlatButton label="SignUp" onTouchTap={this.signup}/>
           </Popover>
      </div>
    );
  }
}

export default Login;

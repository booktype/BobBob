import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import Logged from '../Logged';
import Login from '../Login';
import {  Redirect } from 'react-router';
import client from '../../feathers';




class LandingPage extends Component {
  constructor(props) {
    super(props);
    console.log(props)
    this.state = {};
    client.authenticate().catch(() => this.setState({ login: null }));

  }

  componentDidMount() {
    // const messages = client.service('messages');
    // const users = client.service('users');
    // const ot = client.service('ot');
    // Try to authenticate with the JWT stored in localStorage
    client.authenticate().catch(() => this.setState({ login: null }));

    // On successfull login
    client.on('authenticated', login => {
      this.setState({ login });
      console.log(login)
    });

    // On logout reset all all local state (which will then show the login screen)
    client.on('logout', () => this.setState({
      login: null,
    }));

    // Add new messages to the message list
    // messages.on('created', message => this.setState({
    //   messages: this.state.messages.concat(message)
    // }));
    //
    // // Add new users to the user list
    // users.on('created', user => this.setState({
    //   users: this.state.users.concat(user)
    // }));
  }
  render(){
    return (
      <div>
        <AppBar
          title="BobBob"
          iconElementLeft={<IconButton><NavigationClose /></IconButton>}
          iconElementRight={this.state.login ? <Logged /> : <Login />}
        />
        {this.state.login ? <Redirect to={this.props.location.pathname || "/collections"} />:null}
      </div>
    )
  }
}

export default LandingPage


import React from 'react';
import Immutable from 'immutable';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import IconButton from 'material-ui/IconButton';
import AutoComplete from 'material-ui/AutoComplete';
import TocList from './Toc';
import { Redirect } from 'react-router-dom';
import client from '../../feathers'

export default class Collection extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      collection_id: this.props.match.params.collection,
      collection: {
        toc: []
      },
      open: false,
      newDocument: "",
      userSearchResults: [],
    }
    this.collectionsService = client.service('collections')
  }
  componentDidMount() {

    const documentsService = client.service('documents')
    // Try to authenticate with the JWT stored in localStorage
    client.authenticate().then(login=>{
      this.collectionsService.get(this.state.collection_id).then(collection=>{
        this.setState({collection})
      })
    }).catch(() => this.setState({ login: null }));

  }
  handleTitleChange = (e)=>{
    this.setState({newDocument: e.target.value})
  }
  _handleOpen = () => {
    this.setState({open: true, createType: "Document"});
  }
  _handleOpenSection = () => {
    this.setState({open: true, createType: "Section"});
  }


  _handleClose = () => {
    this.setState({open: false});
  }


  createDocument = (e) => {
    if(this.state.newDocument){
      client.service("documents").create({
        title: this.state.newDocument,
        collection_id: this.state.collection_id,
        type: this.state.createType
      }).then((doc)=>{
        const newToc = this.state.collection.toc.concat([{title: doc.title, _id: doc._id, type: doc.type}])
        this.collectionsService.patch(this.state.collection_id, {toc: newToc}).then((collection)=>{
          this.setState({collection})
        })
      })
    }
    this.setState({newDocument: "", createType: "", open: false})
    e.preventDefault()
  }
  editTocItem = (item) => {
    if(item.type === "Document"){
      this.props.history.push(`${this.props.location.pathname}/documents/${item._id}`,{})
    }else{
      console.log("edirSection")
    }
  }
  removeTocItem = (item) =>{
    let found = false
    console.log(this.state.collection.toc)
    const newToc = this.state.collection.toc.reduce((changedToc, tocItem)=>{
      if(tocItem._id === item._id){
        found = true
        if(tocItem.children.length){
          console.log(tocItem)
          changedToc = changedToc.concat(tocItem.children)
        }
        return changedToc
      }
      if(tocItem.children.length && !found){
        const itemIndex = tocItem.children.findIndex((i)=>{return i._id === item._id})
        if(itemIndex!=-1){
          tocItem.children.splice(itemIndex, 1)
          found = true
        }
      }
      changedToc.push(tocItem)
      return changedToc
    },[])
    this.collectionsService
      .patch(this.state.collection_id, {toc: newToc})
      .then((collection)=>{
        this.setState({collection})
      })

  }
  renderTocItem = ({item}) => {
    return (
      <span>
        <FlatButton
          label={`${item.type} - ${item.title}`}
          onClick={()=>{
          }}
        />
        <IconButton
          onTouchTap={
            ()=>this.editTocItem(item)}
            >
          <EditIcon color="black" />
        </IconButton>
        <IconButton
           onTouchTap={
             ()=>this.removeTocItem(item)}
        >
          <DeleteIcon color="black" />
        </IconButton>
      </span>
    )
  }
  changeTocItemPosition = (items, changedItem) => {
    this.collectionsService.patch(this.state.collection_id, {
      toc: items
    }).then((collection)=>{
      this.setState({collection})
    })
  }
  searchUser = (query)=>{
    client.service("users").find({
      query: {
        email: query,
        $select: ["email", "_id"]
      }}).then(users=>{
        this.setState({userSearchResults: users.data.map(user=>{
          return {text: user.email, value: user._id}
        })})
      })
  }
  addCollaborator = ({text, value}) => {
    client.service("collections")
      .patch(
        this.state.collection_id,
        {
          collaborators: this.state.collection.collaborators.concat(value)
        }
      )
  }
  render(){
    return (
      <div>
        <RaisedButton
          label="Create Document"
          labelPosition="before"
          containerElement="label"
          onClick={this._handleOpen}
        />
        <RaisedButton
          label="Create Section"
          labelPosition="before"
          containerElement="label"
          onClick={this._handleOpenSection}
        />
        <AutoComplete
          hintText="Search Users"
          floatingLabelText="Add a Collaborator"
          dataSource={this.state.userSearchResults}
          onUpdateInput={this.searchUser}
          onNewRequest={this.addCollaborator}
        />
        <TocList
          group={"0"}
          items={this.state.collection.toc}
          renderItem={this.renderTocItem}
          onChange={this.changeTocItemPosition}
        />
        <Dialog
          title={this.state.createType}
          actions={[
            <FlatButton
              label="Cancel"
              primary={true}
              onTouchTap={this._handleClose}
            />,
            <FlatButton
              label="Submit"
              primary={true}
              keyboardFocused={true}
              onTouchTap={this.createDocument}
            />,
          ]}
          modal={false}
          open={this.state.open}
          onRequestClose={this._handleClose}
          >
            <TextField
              hintText="Title"
              onChange={this.handleTitleChange}
            />
          </Dialog>
      </div>

    )
  }
}

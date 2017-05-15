import React, { Component } from 'react';

import {GridList, GridTile} from 'material-ui/GridList';
import Subheader from 'material-ui/Subheader';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import IconButton from 'material-ui/IconButton';
import CreateCollection from './CreateCollection';
import {Link} from 'react-router-dom'
import client from '../../feathers'
const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: "70%",
    height: "100%",
    overflowY: 'auto',
  },
};
class CollectionList extends Component {
  constructor(props){
    super(props)
    this.state = {
      collections: []
    }
    this.collectionsService = client.service('collections')
  }
  componentDidMount(){
    // Try to authenticate with the JWT stored in localStorage
    client.authenticate().then(login=>{
      // On successfull login
      this.collectionsService.find({
        query: {
          $sort: { createdAt: -1 },
          $limit: 25
        }
      }).then(collections=>{
        console.log(collections)
        this.setState({collections: collections.data})
      })
      this.collectionsService.on('created', this.onCreated);
      this.collectionsService.on('removed', this.onRemoved);
      this.collectionsService.on('updated', this.onUpdated);
      this.collectionsService.on('patched', this.onPatched);
    }).catch(() => this.setState({ login: null }));

  }
  onCreated=(collection)=>{
    this.setState({
      collections: [collection].concat(this.state.collections)
    })
  }
  onRemoved = (newCollection)=>{
    this.setState({
      collections: this.state.collections.filter(collection=>{
        return collection._id!=newCollection._id
      })
    })
  }
  onUpdated = (newCollection)=>{
    this.setState({
      collections: this.state.collections.map(collection=>{
        return collection._id===newCollection._id?newCollection:collection
      })
    })
  }
  onPatched = (newCollection)=>{
    this.setState({
      collections: this.state.collections.map(collection=>{
        return collection._id===newCollection._id?newCollection:collection
      })
    })
  }
  removeCollection = (collection_id)=>{
    this.collectionsService.remove(collection_id)
  }
  componentWillUnmount(){
    this.collectionsService.removeListener('created', this.onCreated)
    this.collectionsService.removeListener('updated', this.onUpdated)
    this.collectionsService.removeListener('patched', this.onPatched)
    this.collectionsService.removeListener('removed', this.onRemoved)
  }
  render(){
    return (
      <div>
        <CreateCollection />
        <div style={styles.root}>
    <GridList
      cellHeight={180}
      style={styles.gridList}
    >
      <Subheader>Collections</Subheader>
      {this.state.collections.map((collection, idx) => (
        <GridTile
          key={idx}
          title={<Link to={`/collections/${collection._id}`}>{collection.title}</Link>}
          subtitle={<span>by <b>{collection.user.email}</b></span>}
          actionIcon={<IconButton onTouchTap={()=>this.removeCollection(collection._id)}><DeleteIcon color="white" /></IconButton>}
        >
          <img src={collection.image} />
        </GridTile>
      ))}
    </GridList>
  </div>
      </div>
    )
  }
}

export default CollectionList

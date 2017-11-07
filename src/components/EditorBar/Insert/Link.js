import React from 'react';
import IconButton from '../../IconButton';
import Popover from 'material-ui/Popover';
import LinkIcon from '../../../icons/link';
import LinkOffIcon from '../../../icons/linkOff';
import TextField from 'material-ui/TextField';
import {RichUtils} from 'draft-js'
export default class LinkButton extends React.PureComponent {
  constructor(props){
    super(props)
    this.state = {
      open: false,
      url: ""
    };
  }

  handleTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };
  handleUrlChange = (e, url) => {
    this.setState({
      url
    })
  }
  componentWillReceiveProps(nextProps){
    const data = nextProps.controller.getCurrentMetaData("LINK")
    if(data && data.attributes && data.attributes.href){
      this.setState({url: data.attributes.href})
    }else if(this.state.url){
      this.setState({url: ""})
    }
  }
  removeLink = () => {
    this.props.onChange(
      RichUtils.toggleInlineStyleWithMeta(
        this.props.controller.editorState,
        "LINK",
        {
        }
      )
    );
  }
  handleUrlSubmit = () => {
    this.handleRequestClose()
    let href;
    if(!this.state.url.startsWith("http://") && !this.state.url.startsWith("https://")){
      href = `http://${this.state.url}`
    }else{
      href = this.state.url
    }
    if(this.props.controller.currentInlineStyle.has("LINK")){
      this.props.onChange(
        this.props.controller.replaceStyleMetaData(
          "LINK",
          {
            attributes: {
              href
            }
          }
        ).editorState
      )
    }else{
      this.props.onChange(
        RichUtils.toggleInlineStyleWithMeta(
          this.props.controller.editorState,
          "LINK",
          {
            attributes: {
              href
            }
          }
        )
      );
    }
  }
  render(){
    return (
      <div style={{display:'inline-block'}}>
        <IconButton
          onTouchTap={this.handleTouchTap}
          label={"Insert Link"}
        >
          <LinkIcon color={this.state.url?"orange":null}/>
        </IconButton>
        <IconButton
          onTouchTap={this.removeLink}
          disabled={!this.state.url}
          style={{height: "24px"}}
          iconStyle={{width: "24px", height: "24px"}}
          label={"Remove Link"}
        >
          <LinkOffIcon color={this.state.url?"orange":null}/>
        </IconButton>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.handleRequestClose}
          style={{overflowY: "hidden"}}
        >
          <div>
            <TextField
              hintText="Url"
              floatingLabelText="Type Link and hit Enter"
              type="url"
              value={this.state.url}
              onChange={this.handleUrlChange}
              // eslint-disable-next-line
              onKeyPress={(e)=>{e.key==="Enter"?this.handleUrlSubmit():null}}
            />
          </div>
        </Popover>
      </div>
    );
  }
}

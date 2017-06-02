import React from 'react';
import IconButton from 'material-ui/IconButton';
import Popover from 'material-ui/Popover';
import ImageIcon from '../../../icons/imageArea';
import TextField from 'material-ui/TextField';
import Upload from 'material-ui-upload/Upload';
import {RichUtils} from 'draft-js'
import client from '../../../feathers'
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
  handlePictureChange = (e, src) => {
    this.setState({
      src
    })
  }
  componentWillReceiveProps(nextProps){
    const data = nextProps.controller.getCurrentMetaData("IMAGE")
    if(data && data.attributes && data.attributes.src){
      this.setState({src: data.attributes.src})
    }else if(this.state.src){
      this.setState({src: ""})
    }
  }
  onFileLoad = (e)=>{
    console.log(e.target.result)
    this.setState({src: e.target.result})

    client.service("/upload").create({uri: e.target.result}).then((res)=>{
      console.log(res)
    })
    this.handlePictureSubmit()
  }
  handlePictureSubmit = () => {
    this.handleRequestClose()
    if(this.props.controller.currentInlineStyle.has("LINK")){
      this.props.onChange(
        this.props.controller.replaceStyleMetaData(
          "IMAGE",
          {
            attributes: {
              src: this.state.src
            }
          }
        ).editorState
      )
    }else{
      this.props.onChange(
        this.props.controller.insertEntity(
          "IMAGE",
          {
              width: "100%",
              height: "100%",
              src: this.state.src
          }
        ).editorState
      );
    }
  }
  render(){
    return (
      <div>
        <IconButton
          onTouchTap={this.handleTouchTap}
          style={{height: "48px"}}
          iconStyle={{width: "48px", height: "48px"}}
          label={"Insert Image"}
        >
          <ImageIcon color={this.state.url?"orange":null}/>
        </IconButton>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.handleRequestClose}
          style={{overflowY: "hidden"}}
        >
          <div >
            <TextField
              hintText="Url"
              floatingLabelText="Insert Image URL and hit Enter"
              type="url"
              value={this.state.src}
              onChange={this.handlePictureChange}
              onKeyPress={(e)=>{e.key==="Enter"?this.handlePictureSubmit():null}}
            />
            <p>OR</p>
              <Upload label="Upload Picture"
                // fileTypeRegex={/\.(gif|jpg|jpeg|tiff|png)$/i}
                onFileLoad={this.onFileLoad}/>
          </div>
        </Popover>
      </div>
    );
  }
}

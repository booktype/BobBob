import React from 'react';
import IconButton from '../../IconButton';
import Popover from 'material-ui/Popover';
import ImageIcon from '../../../icons/imageArea';
import TextField from 'material-ui/TextField';
import Upload from 'material-ui-upload/Upload';
export default class LinkButton extends React.PureComponent {
  constructor(props){
    super(props)
    this.state = {
      open: false,
      url: "",
      images: []

    };

  }

  handleTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault();
    if(window.booktype){
      window.booktype.sendToCurrentBook(
        {'command': 'attachments_list'},
        (data) => {
          console.log(data)
          this.setState({images: data.attachments})
        }
      );

    }
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

    // client.service("/upload").create({uri: e.target.result}).then((res)=>{
    //   console.log(res)
    // })
    this.handlePictureSubmit()
  }
  handlePictureSubmit = () => {
    this.handleRequestClose()
    console.log(this.state.src)
    if(this.props.controller.currentInlineStyle.has("IMAGE")){
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
        this.props.controller
         .insertElementAfter("div")
         .setAttr("className", "group_img")
         .appendChild("div")
         .setAttr("className", "image bk-image-editor")
         .insertEntity(
          "IMAGE",
          {
              width: "100%",
              height: "100%",
              src: this.state.src
          }
        )
        // .queryParent("div").queryParent("div")
        //  .appendChild("div")
        //  .setAttr("className", "caption_small")
         .editorState
      );
    }
  }
  render(){
    return (
      <div style={{display:'inline-block'}}>
        <IconButton
          onTouchTap={this.handleTouchTap}
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
          {this.state.images.map(image=>{
            return <img key={image.preview} src={image.preview} alt={''}></img>
          })}
          <div >
            <TextField
              hintText="Url"
              floatingLabelText="Insert Image URL and hit Enter"
              type="url"
              value={this.state.src}
              onChange={this.handlePictureChange}
              // eslint-disable-next-line
              onKeyPress={(e)=>{e.key==="Enter"?this.handlePictureSubmit():null}}
            />
            <p>OR</p>
              <Upload label="Upload Picture"
                fileTypeRegex={/\.(gif|jpg|jpeg|png)$/i}
                onFileLoad={this.onFileLoad}/>
          </div>
        </Popover>
      </div>
    );
  }
}

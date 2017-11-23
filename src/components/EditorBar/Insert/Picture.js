import React from 'react';
import IconButton from '../../IconButton';
import Popover from '../../Popover';
import ImageIcon from '../../../icons/imageArea';
import TextField from '../../TextField';


export default class LinkButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      url: "",
      images: []

    };

  }

  handleTouchTap = (event) => {
    // if (window.booktype) {
    //   window.booktype.sendToCurrentBook(
    //     {'command': 'attachments_list'},
    //     (data) => {
    //       console.log(data);
    //       this.setState({images: data.attachments});
    //     }
    //   );

    // }
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
    });
  }

  componentWillReceiveProps(nextProps) {
    const data = nextProps.controller.getCurrentMetaData("IMAGE");
    if (data && data.attributes && data.attributes.src) {
      this.setState({src: data.attributes.src});
    } else if (this.state.src) {
      this.setState({src: ""});
    }
  }

  onFileLoad = (e) => {
    this.setState({src: e.target.result});

    this.handlePictureSubmit();
  }
  handlePictureSubmit = () => {
    this.handleRequestClose();
    if (this.props.controller.currentInlineStyle.has("IMAGE")) {
      this.props.onChange(
        this.props.controller.replaceStyleMetaData(
          "IMAGE",
          {
            attributes: {
              src: this.state.src
            }
          }
        ).editorState
      );
    } else {
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

  render() {
    return (
      <div style={{display: 'inline-block'}}>
        <Popover
          open={this.state.open}
          onRequestClose={this.handleRequestClose}
          icon={
            <IconButton
              onTouchTap={this.handleTouchTap}
              label={"Insert Image"}
            >
              <ImageIcon color={this.state.url ? "orange" : null} />
            </IconButton>
          }
        >
          <div>
            <TextField
              inputRef={(el) => { this.input = el; }}
              hintText="Url"
              label="Insert Image URL and hit Enter"
              type="url"
              value={this.state.src}
              onChange={this.handlePictureChange}
              onKeyPress={(e) => {
                // eslint-disable-next-line
                e.key === "Enter" ? this.handlePictureSubmit() : null;
              }}
            />
          </div>
        </Popover>
      </div>
    );
  }
}

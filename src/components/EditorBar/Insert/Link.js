import React from 'react';
import IconButton from '../../IconButton';
import Popover from '../../Popover';
import LinkIcon from '../../../icons/link';
import LinkOffIcon from '../../../icons/linkOff';
import TextField from '../../TextField';
import { RichUtils } from 'draft-js';


export default class LinkButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      url: ""
    };
  }

  handleTouchTap = (event) => {
    this.setState({
      open: true,
    });
  };

  handleRequestClose = (e) => {
    this.setState({
      open: false,
    });
  };
  handleUrlChange = (url) => {
    this.setState({
      url
    });
  }

  componentWillReceiveProps(nextProps) {
    const data = nextProps.controller.getCurrentMetaData("LINK");
    if (data && data.attributes && data.attributes.href) {
      this.setState({ url: data.attributes.href });
    } else if (this.state.url) {
      this.setState({ url: "" });
    }
  }

  removeLink = () => {
    this.props.onChange(
      RichUtils.toggleInlineStyleWithMeta(
        this.props.controller.editorState,
        "LINK",
        {}
      )
    );
  }
  handleUrlSubmit = () => {
    this.handleRequestClose();
    let href;
    if (!this.state.url.startsWith("http://") && !this.state.url.startsWith("https://")) {
      href = `http://${this.state.url}`;
    } else {
      href = this.state.url;
    }
    if (this.props.controller.currentInlineStyle.has("LINK")) {
      this.props.onChange(
        this.props.controller.replaceStyleMetaData(
          "LINK",
          {
            attributes: {
              href
            }
          }
        ).editorState
      );
    } else {
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

  render() {
    return (
      <div style={{ display: 'inline-block' }}>
        <Popover
          open={this.state.open}
          onRequestClose={this.handleRequestClose}
          icon={
            <IconButton
              onTouchTap={this.handleTouchTap}
              label={"Insert Link"}
            >
              <LinkIcon color={this.state.url ? "orange" : null} />
            </IconButton>
          }
        >
          <div>
            <TextField
              inputRef={(el)=>{this.input = el;}}
              hintText="Url"
              label="Type Link and hit Enter"
              type="url"
              value={this.state.url}
              onChange={this.handleUrlChange}
              onKeyPress={(e) => {
                // eslint-disable-next-line
                e.key === "Enter" ? this.handleUrlSubmit() : null;
              }}
            />
          </div>
        </Popover>
        <IconButton
          onTouchTap={this.removeLink}
          disabled={!this.state.url}
          iconStyle={{ width: "24px", height: "24px" }}
          label={"Remove Link"}
        >
          <LinkOffIcon color={this.state.url ? "orange" : null} />
        </IconButton>

      </div>
    );
  }
}

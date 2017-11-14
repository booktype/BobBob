import React from 'react';
import Form from "react-jsonschema-form";
import Tooltip from './Tooltip';


class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = (e) => {
      e.preventDefault();
      if (this.props.inputs) {
        this.setState({
          showForm: true
        });
        this.props.setReadOnly(true);
      } else {
        this.props.onToggle(this.props.style);

      }
    };
    this.state = {
      showForm: false
    };

  }

  render() {
    let className = 'RichEditor-styleButton';
    if (this.props.active) {
      className += ' RichEditor-activeButton';
    }

    return (
      <div className={className}>
        <span ref={"button"} onMouseDown={this.onToggle}>
          {this.props.label}
        </span>
        <Tooltip active={this.state.showForm} position="bottom" arrow="center"
                 parentEl={this.refs.button}
        >
          {this.props.inputs ?
            <Form
              schema={{"type": "object", "properties": this.props.inputs}}
              uiSchema={this.props.inputs}
              onSubmit={(data) => {
                this.setState({showForm: false});
                this.props.setReadOnly(false);
                this.props.onToggle(this.props.style, data.formData);
              }
              }
              formData={this.props.data}
            />
            : null}
        </Tooltip>
      </div>
    );
  }
}


export default StyleButton;

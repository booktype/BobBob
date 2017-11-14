import React from 'react';
import SelectField, {Option} from '../../SelectField';
import {RichUtils} from 'draft-js';


const styles = {
  customWidth: {
    width: 70,
  },
};

export default class FontSizePicker extends React.PureComponent {
  constructor(props) {
    super(props);
    this.availableSizes = ['8px', '9px', '10px', '11px', '12px', '14px', '16px', '18px', '20px', '24px', '26px', '28px', '36px', '48px', '72px'];
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.fontSize !== this.props.fontSize) {
      return true;
    }
    return false;
  }

  handleSizeChange = (size) => {
    if (this.props.fontSize) {
      this.props.onChange(
        RichUtils.toggleInlineStyle(
          RichUtils.toggleInlineStyle(
            this.props.controller.editorState,
            `fontSize__${this.props.fontSize}`,
          ),
          `fontSize__${size}`,
        )
      );
    } else {
      this.props.onChange(
        RichUtils.toggleInlineStyle(
          this.props.controller.editorState,
          `fontSize__${size}`,
        )
      );
    }
  }

  render() {
    return (
      <SelectField
        label="Size"
        value={this.props.fontSize || '16px'}
        onChange={(value) => this.handleSizeChange(value)}
        style={styles.customWidth}
      >
        {this.availableSizes.map(size => {
            return (
              <Option key={size} value={`${size}`} primaryText={`${size}`}/>
            );
          }
        )}
      </SelectField>
    );
  }
}

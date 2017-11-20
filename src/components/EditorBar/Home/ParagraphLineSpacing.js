import React from 'react';
import LineSpacing from '../../../icons/formatLineSpacing';
import SelectField, { Option } from '../../SelectField';


export default class ParagraphLineSpacing extends React.PureComponent {

  shouldComponentUpdate(nextProps) {
    if (nextProps.lineHeight && nextProps.lineHeight === this.props.lineHeight) {
      return false;
    }
    return true;
  }

  handleChange = (lineHeight) => {
    this.props.controller.setStyleAttr("lineHeight", lineHeight);
    this.props.onChange(this.props.controller.editorState);
  };


  render() {
    return (
      <SelectField
        label={'Line Spacing'}
        value={this.props.lineHeight || 1}
        onChange={this.handleChange}
        hint={'Choose line spacing'}
        icon={<LineSpacing />}
      >
        {[1, 1.15, 1.5, 2, 2.5, 3].map(lh => {
          return (
            <Option
              key={lh}
              value={lh}
              label={lh}
            />
          );
        })}
      </SelectField>
    );
  }
}

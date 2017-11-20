import React from 'react';
import {RichUtils} from 'draft-js';
import SelectField, {Option} from '../../SelectField';


export default class ParagraphStyles extends React.PureComponent {

  constructor(props) {
    super(props);

    this.availableStyles = [
      {
        element: 'unstyled',
        label: 'Unstyled'
      }, {
        element: 'h1',
        label: 'Title'
      }, {
        element: 'h2',
        label: 'Subtitle'
      }, {
        element: 'h3',
        label: 'Heading 3'
      }, {
        element: 'h4',
        label: 'Heading 4'
      }, {
        element: 'h5',
        label: 'Heading 5'
      }, {
        element: 'h6',
        label: 'Heading 6'
      }, {
        element: 'blockquote',
        label: 'Blockquote'
      }, {
        element: 'pre',
        label: 'Preformatted'
      }
    ];
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.style !== this.props.style) {
      return true;
    }
    return false;
  }

  toggleStyle = (style) => {
    this.props.onChange(
      RichUtils.toggleBlockType(this.props.controller.editorState, style)
    );
  }

  render() {
    return (
      <SelectField
        label={"Styles"}
        value={this.props.style}
        onChange={(value) => this.toggleStyle(value)}
        hint={'Choose style'}
        >
        {this.availableStyles.map(style => {
          return (
            <Option
              key={style.element}
              className={`el-${style.element}`}
              value={style.element}
              label={style.label}
            />
          );
        })
        }
      </SelectField>
    );
  }
}

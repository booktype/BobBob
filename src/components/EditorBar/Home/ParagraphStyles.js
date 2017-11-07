import React from 'react';
import {RichUtils} from 'draft-js';

export default class ParagraphStyles extends React.PureComponent {

  constructor(props) {
    super(props);

    this.availableStyles = [
      { element: 'p', label: 'Unstyled' },
      { element: 'h1', label: 'Title'},
      { element: 'h2', label: 'Subtitle' },
      { element: 'h3', label: 'Heading 3' },
      { element: 'h4', label: 'Heading 4' },
      { element: 'h5', label: 'Heading 5' },
      { element: 'h6', label: 'Heading 6' },
      { element: 'blockquote', label: 'Blockquote' },
      { element: 'pre', label: 'Preformatted' }
    ]
  }
  shouldComponentUpdate(nextProps){
    if(nextProps.style !== this.props.style){
      return true
    }
    return false
  }
  toggleStyle = (style) => {
    this.props.onChange(
      RichUtils.toggleBlockType(
        this.props.controller.editorState,
        style,
      )
    );
  }

  render() {
    return (
      <div style={{display: "inline-block"}}>
        <label style={{display: 'block'}} htmlFor={'styles'}>Styles</label>
        <select
          id={'styles'}
          name={'styles'}
          value={this.props.style || "p"}
          onChange={(e)=>{e.preventDefault();this.toggleStyle(e.target.value)}}
        >
          {this.availableStyles.map(style=>{
            return (
              <option key={style.element} className={style.element} value={style.element}>
                {style.label}
              </option>
            )
          }
        )}
        </select>
      </div>
    )
  }
}

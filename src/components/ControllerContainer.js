import React from 'react';
// import EntityStyleControls from './EntityStyleControls';
import FontColorPicker from './EditorBar/Home/FontColorPicker';
import HighlightColorPicker from './EditorBar/Home/HighlightColorPicker';
import FontSizePicker from './EditorBar/Home/FontSizePicker';
import FontPicker from './EditorBar/Home/FontPicker';
import FontStyle from './EditorBar/Home/FontStyle';
import UnorderedList from './EditorBar/Home/UnorderedList';
import OrderedList from './EditorBar/Home/OrderedList';
import Indent from './EditorBar/Home/Indent';
import ParagraphAlign from './EditorBar/Home/ParagraphAlign';
import TextDirection from './EditorBar/Home/TextDirection';
import LineSpacing from './EditorBar/Home/ParagraphLineSpacing';
import ParagraphStyles from './EditorBar/Home/ParagraphStyles';
import TablePicker from './EditorBar/Insert/Table';
import LinkForm from './EditorBar/Insert/Link';
import HorizontalLine from './EditorBar/Insert/HorizontalLine';
import PictureForm from './EditorBar/Insert/Picture';
import CommentButton from './EditorBar/Insert/Comment';
import TableTab from './EditorBar/Table/Layout';

import Tabs from './Tabs/Tabs';
import Tab from './Tabs/Tab';


class ControllerContainer extends React.PureComponent {

  onChange = (editorState) => {
    this.props.onChange(editorState);
  }

  shouldComponentUpdate(nextProps) {
    if (
      JSON.stringify(nextProps.inlineStyles) === JSON.stringify(this.props.inlineStyles) &&
      JSON.stringify(nextProps.blockStyle) === JSON.stringify(this.props.blockStyle) &&
      JSON.stringify(nextProps.blockTree) === JSON.stringify(this.props.blockTree)
    ) {
      return false;
    }
    return true;
  }

  render() {
    return (
      <div style={{zoom: 0.70}}>
        <Tabs>
          <Tab label={"Home"}>
            <FontPicker fontFamily={this.props.inlineStyles.fontFamily} controller={this.props.controller} onChange={this.onChange}/>
            <FontSizePicker fontSize={this.props.inlineStyles.fontSize} controller={this.props.controller} onChange={this.onChange}/>
            <FontColorPicker color={this.props.inlineStyles.color} controller={this.props.controller} onChange={this.onChange}/>
            <HighlightColorPicker backgroundColor={this.props.inlineStyles.backgroundColor} controller={this.props.controller} onChange={this.onChange}/>
            <FontStyle styles={this.props.inlineStyles} controller={this.props.controller} onChange={this.onChange}/>
            <ParagraphAlign textAlign={this.props.blockStyle.style.textAlign} controller={this.props.controller} onChange={this.onChange}/>
            <Indent marginLeft={this.props.blockStyle.style.marginLeft} controller={this.props.controller} onChange={this.onChange}/>
            <OrderedList ol={this.props.blockTree['ol']} controller={this.props.controller} onChange={this.onChange}/>
            <UnorderedList ul={this.props.blockTree['ul']} controller={this.props.controller} onChange={this.onChange}/>
            <TextDirection direction={this.props.blockStyle.style.direction} controller={this.props.controller} onChange={this.onChange}/>
            <ParagraphStyles style={this.props.blockStyle.type} controller={this.props.controller} onChange={this.onChange}/>
            <LineSpacing lineHeight={this.props.blockStyle.style.lineHeight} controller={this.props.controller} onChange={this.onChange}/>
          </Tab>
          <Tab label={"Insert"}>
            <TablePicker controller={this.props.controller} onChange={this.onChange}/>
            <HorizontalLine controller={this.props.controller} onChange={this.onChange}/>
            <LinkForm controller={this.props.controller} onChange={this.onChange}/>
            <PictureForm controller={this.props.controller} onChange={this.onChange}/>
            <CommentButton controller={this.props.controller} onChange={this.onChange}/>
          </Tab>
          {this.props.blockTree['table'] ?
            <Tab label="Table Layout">
              <TableTab controller={this.props.controller} onChange={this.onChange}/>
            </Tab>
            : null}
        </Tabs>
      </div>
    );
  }
}


export default ControllerContainer;

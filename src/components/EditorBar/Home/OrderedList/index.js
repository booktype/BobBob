import React from 'react';
import IconButton from '../../../IconButton';
import SelectField, { Option } from '../../../SelectField';
import FormatListNumbers from '../../../../icons/formatListNumbers';
import DecimalIcon from './decimal.png';
import LowerGreekIcon from './lower-greek.png';
import LowerLatinIcon from './lower-latin.png';
import UpperLatinIcon from './upper-latin.png';
import LowerRomanIcon from './lower-roman.png';
import UpperRomanIcon from './upper-roman.png';

const optionStyle = {
  height: 70
};
export default class OrderedList extends React.PureComponent {

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.ol === this.props.ol) {
      return false;
    }
    return true;
  }
  handleToggleList=(listStyleType)=>{
    if (this.props.ol) {
      this.props.onChange(
        this.props.controller.queryParent('ol')
        .setStyleAttr("listStyleType", listStyleType)
        .editorState
      );
    } else if (this.props.ul) {
        this.props.onChange(
          this.props.controller.queryParent('ul')
          .toggleBlockType('ol')
          .setStyleAttr("listStyleType", listStyleType)
          .editorState
        );
    } else {
      this.props.onChange(
        this.props.controller.insertElementBefore("ol")
        .setStyleAttr("listStyleType", listStyleType)
        .selectNextBlock()
        .toggleBlockType('li')
        .adjustBlockDepth(1)
        .editorState
      );
    }
  }
  render() {
    return (
      <div style={{display: "inline-block"}}>
        <span style={{display: "flex"}}>
          <IconButton
            onTouchTap={()=>this.handleToggleList("decimal")}
            tooltip="Bulleted List"
          >
            <FormatListNumbers color={this.props.ol?"orange":null} />
          </IconButton>
          <SelectField
            value={this.props.ol && this.props.ol.listStyleType} 
            onChange={this.handleToggleList}
            style={{width: 90}}
          >
            <Option value={'decimal'} label={'Decimal'} style={optionStyle}>
              <img src={DecimalIcon} alt={'Decimal list style type'} />
            </Option>
            <Option value={'lower-greek'} label={'Lower greek'} style={optionStyle}>
              <img src={LowerGreekIcon} alt={'Lower greek list style type'} />
            </Option>
            <Option value={'lower-latin'} label={'Lower latin'} style={optionStyle}>
              <img src={LowerLatinIcon} alt={'Lower latin list style type'} />
            </Option>
            <Option value={'upper-latin'} label={'Upper latin'} style={optionStyle}>
              <img src={UpperLatinIcon} alt={'Upper latin list style type'} />
            </Option>
            <Option value={'lower-roman'} label={'Lower roman '} style={optionStyle}>
              <img src={LowerRomanIcon} alt={'Lower roman list style type'} />
            </Option>
            <Option value={'upper-roman'} label={'Upper roman'} style={optionStyle}>
              <img src={UpperRomanIcon} alt={'Upper roman list style type'} />
            </Option>
          </SelectField>
        </span>

      </div>
    );
  }
}

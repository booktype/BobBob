import React from 'react';
import IconButton from '../../../IconButton';
import SelectField, {Option} from '../../../SelectField';
import FormatListBulletedType from '../../../../icons/formatListBulleted';
import DiscIcon from './disc.png';
import CircleIcon from './circle.png';
import SquareIcon from './square.png';

const optionStyle = {
  height: 70
};

export default class UnorderedList extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.open !== this.state.open) {
      return true;
    }
    if (nextProps.ul === this.props.ul) {
      return false;
    }
    return true;
  }
  handleToggleList=(listStyleType)=>{
    if (this.props.ul) {
      this.props.onChange(
        this.props.controller.queryParent('ul')
        .setStyleAttr("listStyleType", listStyleType)
        .editorState
      );
    } else {
      this.props.onChange(
        this.props.controller.insertElementAfter("ul")
        .setStyleAttr("listStyleType", listStyleType)
        .appendChild("li").editorState
      );
    }
  }

  render() {
    return (
      <div style={{display: "inline-block"}}>
        <span style={{display: "flex"}}>
          <IconButton
            onTouchTap={()=>this.handleToggleList("disc")}
            tooltip="Bulleted List">
            <FormatListBulletedType
              color={this.props.ul?"orange":null}
            />
          </IconButton>
          <SelectField
            value={this.props.ul && this.props.ul.listStyleType}
            onChange={this.handleToggleList}
            style={{ width: 90 }}
          >
            <Option value={'disc'} label={'Disc'} style={optionStyle}>
              <img src={DiscIcon} alt={'Disc list style type'} />
            </Option>
            <Option value={'circle'} label={'Circle'} style={optionStyle}>
              <img src={CircleIcon} alt={'Circle list style type'} />
            </Option>
            <Option value={'square'} label={'Square'} style={optionStyle}>
              <img src={SquareIcon} alt={'Square list style type'} />
            </Option>
          </SelectField>

        </span>
      </div>
    );
  }
}

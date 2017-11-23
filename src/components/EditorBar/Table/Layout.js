import React from 'react';
import IconButton from '../../IconButton';
import TableEdit from '../../../icons/tableEdit';
import TableIcon from '../../../icons/table';
import TableColumnRemove from '../../../icons/tableColumnRemove';
import TableRowRemove from '../../../icons/tableRowRemove';
import TableRowPlusBefore from '../../../icons/tableRowPlusBefore';
import TableRowPlusAfter from '../../../icons/tableRowPlusAfter';
import TableColumnPlusBefore from '../../../icons/tableColumnPlusBefore';
import TableColumnPlusAfter from '../../../icons/tableColumnPlusAfter';


const styles = {
  inline: {
    display: 'inline-block'
  }
};

export default class TableLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps(nextProps) {
  }

  addAltText = (alttext) => {
  }
  deleteTable = () => {
    this.props.onChange(this.props.controller.queryParent("table").removeElement().editorState);
  }
  deleteRow = () => {
    this.props.onChange(this.props.controller.queryParent("tr").removeElement().editorState);
  }
  deleteColumn = () => {
    let at_index = this.props.controller.getChildIndex();
    this.props.onChange(this.props.controller.queryParent("tbody").queryAndRemove("tr", "td", at_index).editorState);
  }
  insertRowAbove = () => {
    const columns = this.props.controller.queryParent("tr").countChildren();
    this.props.onChange(this.props.controller.insertElementBefore("tr").appendChildren("td", columns).editorState);

  }
  insertRowBelow = () => {
    const columns = this.props.controller.queryParent("tr").countChildren();
    this.props.onChange(this.props.controller.insertElementAfter("tr").appendChildren("td", columns).editorState);

  }
  insertColumnLeft = () => {
    let at_index = this.props.controller.getChildIndex();
    if (at_index) {
      at_index -= 1;
    }
    this.props.onChange(this.props.controller.queryParent("tbody").queryAndAppend("tr", "td", at_index).editorState);
  }
  insertColumnRight = () => {
    const at_index = this.props.controller.getChildIndex();
    this.props.onChange(this.props.controller.queryParent("tbody").queryAndAppend("tr", "td", at_index).editorState);

  }
  alignCell = (position) => {
  }

  render() {
    return (
      <div>
        <div style={styles.inline}>
          <IconButton tooltip={"Insert Alternative Text"}>
            <TableEdit/>
          </IconButton>
        </div>
        <div style={styles.inline}>
          <IconButton tooltip={"Delete Table"} onTouchTap={this.deleteTable}>
            <TableIcon color={"red"}/>
          </IconButton>
        </div>
        <div style={styles.inline}>

          <IconButton tooltip={"Delete Column"} onTouchTap={this.deleteColumn}>
            <TableColumnRemove/>
          </IconButton>
        </div>
        <div style={styles.inline}>
          <IconButton tooltip={"Delete Row"} onTouchTap={this.deleteRow}>
            <TableRowRemove/>
          </IconButton>
        </div>
        <div style={styles.inline}>
          <IconButton tooltip={"Insert Row Above"} onTouchTap={this.insertRowAbove}>
            <TableRowPlusBefore/>
          </IconButton>
        </div>
        <div style={styles.inline}>
          <IconButton tooltip={"Insert Row Below"} onTouchTap={this.insertRowBelow}>
            <TableRowPlusAfter/>
          </IconButton>
        </div>
        <div style={styles.inline}>
          <IconButton tooltip={"Insert Column Left"} onTouchTap={this.insertColumnLeft}>
            <TableColumnPlusBefore/>
          </IconButton>
        </div>
        <div style={styles.inline}>
          <IconButton tooltip={"Insert Column Right"} onTouchTap={this.insertColumnRight}>
            <TableColumnPlusAfter/>
          </IconButton>
        </div>
      </div>
    );
  }
}

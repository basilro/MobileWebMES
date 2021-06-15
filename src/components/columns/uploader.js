import React from 'react';
import DataGrid, {
  Column,
  Paging,
  Scrolling,
  Selection,
  FilterRow
} from 'devextreme-react/data-grid';
import {DropDownBox} from 'devextreme-react';

const dropDownOptions = { width: 500 };

export default class DropDownGrid extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      currentValue: props.data.value
    };
    this.onSelectionChanged = this.onSelectionChanged.bind(this);
    
   this.contentRender = this.contentRender.bind(this);
   this.dropDownBoxRef = React.createRef();
  }

  contentRender() {
    return (
      <DataGrid
        dataSource={this.props.data.column.lookup.dataSource}
        remoteOperations={true}
        keyExpr="menu_id"
        height={250}
        selectedRowKeys={[this.state.currentValue]}
        hoverStateEnabled={true}
        onSelectionChanged={this.onSelectionChanged}
        focusedRowEnabled={true}
        defaultFocusedRowKey={this.state.currentValue}
      >
        <FilterRow visible={true} />
        <Column dataField="menu_id" />
        <Column dataField="menu_nm" />
        <Paging enabled={true} pageSize={10} />
        <Scrolling mode="virtual" />
        <Selection mode="single" />
      </DataGrid>
    );
  }

  onSelectionChanged(selectionChangedArgs) {
    this.setState({ currentValue: selectionChangedArgs.selectedRowKeys[0] });
    this.props.data.setValue(this.state.currentValue);
    if(selectionChangedArgs.selectedRowKeys.length > 0) {
      this.dropDownBoxRef.current.instance.close();
    }
  }

  render() {
    return (
      <DropDownBox
        ref={this.dropDownBoxRef}
        dropDownOptions={dropDownOptions}
        dataSource={this.props.data.column.lookup.dataSource}
        value={this.state.currentValue}
        displayExpr="menu_nm"
        valueExpr="menu_id"
        contentRender={this.contentRender}>
      </DropDownBox>
    );
  }
}
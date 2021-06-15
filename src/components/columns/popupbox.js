import React from 'react';
import DataGrid, {
  Column,
  Paging,
  Scrolling,
  Selection,
  Button
} from 'devextreme-react/data-grid';
import {Popup} from 'devextreme-react/popup';
import { TextBox } from 'devextreme-react';

const dropDownOptions = { width: 500 };

export default class popupbox extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      currentValue: props.data.value,
      isParentClick : false
    };

    this.onSelectionChanged = this.onSelectionChanged.bind(this);
    this.contentRender = this.contentRender.bind(this);
    this.dropDownBoxRef = React.createRef();
    this.onClick = this.onClick.bind(this);
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
    const {isParentClick} = this.state;
    return (
        <div class="dx-dropdowneditor-overlay">
          <Button onClick={this.onClick} text="테스트" >버튼</Button>
        </div>
    );
  }

  onClick(e){
      console.log('onclick');
    this.setState({isParentClick : !this.state.isParentClick});
  }
}
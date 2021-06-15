import React from 'react';
import { getdata } from '../../utils/util';
import DataGrid, { Column } from 'devextreme-react/data-grid';
import { DateBox, Button, TextBox, ScrollView, Popup } from 'devextreme-react';
import moment from 'moment';
import { withRouter } from 'react-router-dom'

class MB1013 extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pageName: 'MB1013',
      data: [],
      detailInfo: {
        reqNo: "",
        kittingNo: "",
        remark: ""
      }
    }

    this.controllers = [];
  }

  componentDidCatch(err, errorInfo) {
    console.error(err);
    console.error(errorInfo);
    this.setState(() => ({ err, errorInfo }));
  }

  render() {

    return (
      <React.Fragment>
        <Popup
          width="90%"
          height="90%"
          closeOnOutsideClick={true}
          showCloseButton={true}
          visible={this.props.visible}
          title={"요청조회"}
          onHiding={() => { this.resetPopupData(); this.props.hide(); }}
        >
          <ScrollView>
            <div className="dx-fieldset">
              <div className="dx-field">
                <div className="dx-field-label">
                  날짜
                </div>
                <div className="dx-field-value">
                  <DateBox
                    width={130}
                    defaultValue={new Date()}
                    displayFormat="yyyy-MM-dd"
                    pickerType="rollers"
                    onInitialized={this.onInitialized}
                  />
                </div>
                <div className="dx-field-value">
                  <Button
                    text="찾기"
                    onClick={this.onClickSearchBtn}
                  />
                </div>
              </div>
              <div className="dx-field">
                <div className="dx-field-label">
                  이동요청번호
                </div>
                <TextBox
                  className="dx-field-value"
                  readOnly={true}
                  onInitialized={this.onInitialized}
                  value={this.state.detailInfo.reqNo}
                />
              </div>
              <div className="dx-field">
                <div className="dx-field-label">
                  KITTING번호
                </div>
                <TextBox
                  className="dx-field-value"
                  readOnly={true}
                  onInitialized={this.onInitialized}
                  value={this.state.detailInfo.kittingNo}
                />
              </div>
              <div className="dx-field">
                <div className="dx-field-label">
                  비고
                </div>
                <TextBox
                  className="dx-field-value"
                  readOnly={true}
                  onInitialized={this.onInitialized}
                  value={this.state.detailInfo.remark}
                />
              </div>
              <div className="dx-field">
                <ScrollView
                  height={160}
                >
                  <DataGrid
                    dataSource={this.state.data}
                    noDataText="표시할 데이터가 없습니다."
                    columnAutoWidth={true}
                    showBorders={true}
                    focusedRowEnabled={true}
                    keyExpr="NO"
                    onRowClick={this.onRowClickDtg}
                  >
                    <Column
                      dataField="REQ_NO"
                      caption="이동요청번호"
                    />
                    <Column
                      dataField="REMARK"
                      caption="비고"
                    />
                  </DataGrid>
                </ScrollView>
              </div>
              <div className="dx-field">
                <Button
                  className="dx-field-value"
                  width="50%"
                  text="선택"
                  onClick={this.onClickSelectBtn}
                />
                <Button
                  className="dx-field-value"
                  width="50%"
                  text="닫기"
                  onClick={() => { this.resetPopupData(); this.props.hide(); }}
                />
              </div>
            </div>
          </ScrollView>
        </Popup>
      </React.Fragment >
    );
  }

  getdataCallback = (data, date) => {
    if (data.length === 0) {
      this.resetPopupData();
      alert(date + "은 데이터가 없습니다.");
    }
    else {
      this.setState({ data: data });
    }
  }

  onInitialized = (e) => {
    this.controllers.push(e.component);
  }

  onClickSearchBtn = () => {
    const date = moment(this.controllers[0].option("value")).format('YYYY-MM-DD');
    getdata('/page/Get/' + this.state.pageName + '/', date, this.getdataCallback);
  }

  onRowClickDtg = (e) => {
    this.setState({
      detailInfo: {
        reqNo: e.data["REQ_NO"],
        kittingNo: e.data["KITTING_NO"],
        remark: e.data["REMARK"]
      }
    });
  }

  onClickSelectBtn = () => {
    if (this.state.detailInfo.kittingNo === "") {
      alert("KITTING번호가 선택되지 않았습니다.");
    }
    else {
      this.props.hide();
      this.props.kittingNoChange(this.state.detailInfo.kittingNo);
      this.resetPopupData();
    }
  }

  resetPopupData = () => {
    for (let a of this.controllers) {
      if (a.NAME === "dxTextBox") {
        a.reset();
      }
    }

    this.setState({ data: [] });

    this.setState({
      detailInfo: {
        reqNo: "",
        kittingNo: "",
        remark: ""
      }
    })
  }
};

export default withRouter(MB1013);
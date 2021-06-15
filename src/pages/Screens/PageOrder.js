import React from 'react';
import '../../utils/common.css';
import { getdata, postdata } from '../../utils/util';
import { PopupInfo, Field } from '../../utils/model'
import { ToastsContainer, ToastsStore } from 'react-toasts'
import DataGrid, { Column } from 'devextreme-react/data-grid';
import { withRouter } from 'react-router-dom';
import { ScrollView, Button, TextBox } from 'devextreme-react';
import PopupComp from './PopupOrder'
import PopupForm from './MB1011'

class PageOrder extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      userId: window.localStorage.getItem('id'),
      pageName: this.props.location.pathname.replace('/', ''),
      data: [],
      insheetNo: "",
      detailInfo: {
        itemName: "",
        insheetQty: "",
        scanQty: ""
      },
      cancelBtn: {
        text: "취소",
        type: "danger",
        mode: false
      },
      popupInfo: null,
      popupVisible: false
    }
    
    this.controllers = [];
  }

  componentDidMount() {
    this.popupInit();
  }

  popupInit = () => {
    const view = [
      [
        new Field('label', 'div', '', '', false, '거래명세서번호', null, null),
        new Field('value', 'TextBox', 'INSHEET_NO', '', true, '', null, null)
      ],
      [
        new Field('label', 'div', '', '', false, '공급처', null, null),
        new Field('value', 'TextBox', 'BP_NM', '', true, '', null, null)
      ],
      [
        new Field('label', 'div', '', '', false, '명세서 수', null, null),
        new Field('value', 'TextBox', 'INSHEET_QTY', '', true, '', null, null)
      ]
    ];
    const column = [];
    column.push(
      <Column
        key="1"
        dataField="INSHEET_NO"
        caption="거래명세서번호"
      />
    );
    column.push(
      <Column
        key="2"
        dataField="INSHEET_QTY"
        caption="명세서 수"
      />
    )
    let info = new PopupInfo('명세서조회', "INSHEET_NO", view, column);
    this.setState({ popupInfo: info });
  }

  render() {

    return (
      <React.Fragment>
        <div className="dx-fieldset">
          <div className="dx-field">
            <TextBox
              className="dx-field-label"
              width="60%"
              placeholder="거래명세서번호"
              showClearButton={true}
              onInitialized={this.onInitialized}
              onEnterKey={this.onEnterKeyInsheetTxt}
            />
            <Button
              className="dx-field-value"
              width="40%"
              text="거래명세서조회"
              onClick={this.onClickInsheetQueryBtn}
            />
          </div>
          <div className="dx-field">
            <div className="dx-field-label">
              품목
            </div>
            <TextBox
              className="dx-field-value"
              readOnly={true}
              onInitialized={this.onInitialized}
              value={this.state.detailInfo.itemName}
            />
          </div>
          <div className="dx-field">
            <div className="dx-field-label">
              거래명세서 수
            </div>
            <TextBox
              className="dx-field-value"
              readOnly={true}
              onInitialized={this.onInitialized}
              value={this.state.detailInfo.insheetQty}
            />
          </div>
          {/* <div className="dx-field">
            <div className="dx-field-label">
              스캔 수
            </div>
            <TextBox
              className="dx-field-value"
              readOnly={true}
              onInitialized={this.onInitialized}
              value={this.state.detailInfo.scanQty}
            />
          </div> */}
          <div className="dx-field">
            <ScrollView
              height={170}
            >
              <DataGrid
                dataSource={this.state.data}
                noDataText="표시할 데이터가 없습니다."
                showBorders={true}
                focusedRowEnabled={true}
                keyExpr="ITEM_NM"
                onInitialized={this.onInitialized}
                onRowClick={this.onRowClickDtg}
              >
                <Column
                  dataField="ITEM_NM"
                  caption="품명"
                  width="50%"
                />
                <Column
                  dataField="INSHEET_QTY"
                  caption="명세서 수"
                  width="25%"
                />
                <Column
                  dataField="LOT_QTY"
                  caption="스캔 수"
                  width="25%"
                />
              </DataGrid>
            </ScrollView>
          </div>
          <div className="dx-field">
            <TextBox
              className="dx-field-label"
              width="70%"
              placeholder="LOTNO"
              showClearButton={true}
              onInitialized={this.onInitialized}
              onEnterKey={this.onEnterKeyLotNoTxt}
            />
            <Button
              className="dx-field-value"
              width="30%"
              text={this.state.cancelBtn.text}
              type={this.state.cancelBtn.type}
              onClick={this.onClickCancelBtn}
            />
          </div>
          <div className="dx-field">
            <Button
              className="dx-field-value"
              width="50%"
              text="초기화"
              onClick={this.onClickClearBtn}
            />
            <Button
              className="dx-field-value"
              width="50%"
              text="입고처리"
              onClick={this.onClickEnrollBtn}
            />
          </div>
        </div>
        {(this.state.popupInfo === null) ? null :
          <PopupComp
            visible={this.state.popupVisible}
            hide={this.onHidingPopup}
            KeyNoChange={this.insheetNoChange}
            info={this.state.popupInfo}
            path={'MB1011'}
          />
        }
        <ToastsContainer store={ToastsStore} />
      </React.Fragment>
    );
  }

  getdataCallback = (data, insheetNo) => {
    if (data.length === 0) {
      this.onClickClearBtn();
      ToastsStore.error("거래명세서번호를 찾을 수 없습니다.");
    }
    else {
      this.setState({ insheetNo: insheetNo });
      this.setState({ data: data });

      this.controllers[4].focus();
    }
  }

  postdataCallback = (result, type) => {
    if (result['ALERT']) {
      ToastsStore.error(result['ALERT']);
    }
    else {
      getdata('/page/Get/' + this.state.pageName + '/', this.state.insheetNo, this.getdataCallback);
      
      if(type === "S2") {
        ToastsStore.success("입고처리가 완료되었습니다.");
      }
    }
  }

  onInitialized = (e) => {
    this.controllers.push(e.component);
  }

  onEnterKeyInsheetTxt = (e) => {
    getdata('/page/Get/' + this.state.pageName + '/', e.component.option("value"), this.getdataCallback);
  }

  onClickInsheetQueryBtn = () => {
    this.setState({ popupVisible: true });
  }

  onRowClickDtg = (e) => {
    this.setState({
      detailInfo: {
        itemName: e.data["ITEM_CD"],
        insheetQty: e.data["INSHEET_QTY"],
        scanQty: e.data["LOT_QTY"]
      }
    })
  }

  onEnterKeyLotNoTxt = (e) => {
    if (this.state.insheetNo === "") {
      this.controllers[0].focus();
      e.component.reset();
      ToastsStore.warning("거래명세서번호 입력이 선행되어야합니다.");
    }
    else {
      let value = {};
      value.page = this.state.pageName;
      value.insheetNo = this.state.insheetNo;
      value.lotNo = e.component.option("value");

      if (this.state.cancelBtn.mode) {
        value.type = "D";
      }
      else {
        value.type = "S";
        value.userId = this.state.userId;
      }
      postdata("/page/Save", value, this.postdataCallback)
    }
    e.component.reset();
  }

  onClickCancelBtn = () => {
    if (this.state.cancelBtn.mode) {
      this.setState({
        cancelBtn: {
          text: "취소",
          type: "danger",
          mode: false
        }
      })
    }
    else {
      this.setState({
        cancelBtn: {
          text: "재시작",
          type: "success",
          mode: true
        }
      })
    }
  }

  onClickClearBtn = () => {
    for (let a of this.controllers) {
      if (a.NAME === "dxTextBox") {
        a.reset();
      }
    }

    this.setState({ insheetNo: "" });
    this.setState({ data: [] });

    this.setState({
      detailInfo: {
        itemName: "",
        insheetQty: "",
        scanQty: ""
      }
    })

    this.setState({
      cancelBtn: {
        text: "취소",
        type: "danger",
        mode: false
      }
    })
  }

  onClickEnrollBtn = () => {
    if (this.state.insheetNo === "") {
      ToastsStore.warning("Kitting번호가 조회되어야 합니다.");
      this.controllers[0].focus();
    }
    else {
      let value = {};
      value.page = this.state.pageName;
      value.type = "S2";
      value.reqNo = this.state.insheetNo;
      value.userId = this.state.userId;

      postdata("/page/Save", value, this.postdataCallback);
    }
  }

  onHidingPopup = () => {
    this.setState({ popupVisible: false });
  }

  insheetNoChange = (insheetNo) => {
    this.setState({ insheetNo: insheetNo });
    this.controllers[0].option("value", insheetNo);
    this.controllers[4].focus();
    getdata('/page/Get/' + this.state.pageName + '/', insheetNo, this.getdataCallback);
  }
};

export default withRouter(PageOrder);
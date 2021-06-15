import React from 'react';
import '../../utils/common.css';
import { getdata, postdata } from '../../utils/util';
import { PopupInfo, Field } from '../../utils/model'
import { ToastsContainer, ToastsStore } from 'react-toasts'
import DataGrid, { Column } from 'devextreme-react/data-grid';
import { withRouter } from 'react-router-dom';
import { ScrollView, Button, TextBox } from 'devextreme-react';
import moment from 'moment';
import PopupComp from './PopupOrder'
import PopupForm from './MB1014'

class MB1004 extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      userId: window.localStorage.getItem('id'),
      pageName: this.props.location.pathname.replace('/', ''),
      data: [],
      dnNo: "",
      detailInfo: {
        deliveryDate: "",
        custName: "",
        storehouseName: ""
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

    this.success = require("../../sound/navigation_selection-complete-celebration.wav");
    this.fail = require("../../sound/alert_error-01.wav");
    this.error = require("../../sound/alert_error-03.wav");
    this.click = require("../../sound/click.wav");

    this.audio = new Audio();
  }

  successSound() {
    this.audio.src = this.success;
    this.audio.play();
  }

  failSound() {
    this.audio.src = this.fail;
    this.audio.play();
  }

  errorSound() {
    this.audio.src = this.error;
    this.audio.play();
  }

  clickSound() {
    this.audio.src = this.click;
    this.audio.volume = 1;
    this.audio.play();
  }

  componentDidMount() {
    this.popupInit();
  }

  popupInit = () => {
    const view = [
      [
        new Field('label', 'div', '', '', false, '출하번호', null, null),
        new Field('value', 'TextBox', 'DN_NO', '', true, '', null, null)
      ],
      [
        new Field('label', 'div', '', '', false, '창고', null, null),
        new Field('value', 'TextBox', 'SL_NM', '', true, '', null, null)
      ],
      [
        new Field('label', 'div', '', '', false, '요청 수', null, null),
        new Field('value', 'TextBox', 'REQ_QTY', '', true, '', null, null)
      ]
    ];
    const column = [];
    column.push(
      <Column
        key="1"
        dataField="DN_NO"
        caption="출하번호"
      />
    );
    column.push(
      <Column
        key="2"
        dataField="REQ_QTY"
        caption="요청 수"
      />
    )
    let info = new PopupInfo('출하번호조회', "DN_NO", view, column);
    this.setState({ popupInfo: info });
  }

  render() {

    return (
      <React.Fragment>
        <div className="dx-fieldset">
          <div className="dx-field">
            <TextBox
              className="dx-field-label"
              width="65%"
              placeholder="출하번호"
              showClearButton={true}
              onInitialized={this.onInitialized}
              onEnterKey={this.onEnterKeyDeliveryNoteTxt}
            />
            <Button
              className="dx-field-value"
              width="35%"
              text="출하번호조회"
              onClick={() => { this.onClickDeliveryNoteQueryBtn(); this.clickSound(); }}
            />
          </div>
          <div className="dx-field">
            <div className="dx-field-label">
              납기일
            </div>
            <TextBox
              className="dx-field-value"
              readOnly={true}
              onInitialized={this.onInitialized}
              value={this.state.detailInfo.deliveryDate}
            />
          </div>
          <div className="dx-field">
            <div className="dx-field-label">
              거래처
            </div>
            <TextBox
              className="dx-field-value"
              readOnly={true}
              onInitialized={this.onInitialized}
              value={this.state.detailInfo.custName}
            />
          </div>
          {/* <div className="dx-field">
            <div className="dx-field-label">
              창고
            </div>
            <TextBox
              className="dx-field-value"
              readOnly={true}
              onInitialized={this.onInitialized}
              value={this.state.detailInfo.storehouseName}
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
                onRowClick={(e) => { this.onRowClickDtg(e); this.clickSound(); }}
              >
                <Column
                  dataField="ITEM_NM"
                  caption="품명"
                  width="55%"
                />
                <Column
                  dataField="REQ_QTY"
                  caption="요청 수"
                  width="22.5%"
                />
                <Column
                  dataField="LOT_QTY"
                  caption="스캔 수"
                  width="22.5%"
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
              onClick={() => { this.onClickCancelBtn(); this.clickSound(); }}
            />
          </div>
          <div className="dx-field">
            <Button
              className="dx-field-value"
              width="50%"
              text="초기화"
              onClick={() => { this.onClickClearBtn(); this.clickSound(); }}
            />
            <Button
              className="dx-field-value"
              width="50%"
              text="출고처리"
              onClick={() => { this.onClickEnrollBtn(); }}
            />
          </div>
        </div>
        {(this.state.popupInfo === null) ? null :
          <PopupComp
            visible={this.state.popupVisible}
            hide={this.onHidingPopup}
            KeyNoChange={this.dnNoChange}
            info={this.state.popupInfo}
            path={'MB1014'}
          />
        }
        <ToastsContainer store={ToastsStore} />
        {/* <PopupForm visible={this.state.popupVisible} hide={this.onHidingPopup} dnNoChange={this.dnNoChange} /> */}
      </React.Fragment>
    );
  }

  getdataCallback = (data, dnNo) => {
    if (data.length === 0) {
      this.onClickClearBtn();
      ToastsStore.error("출하번호를 찾을 수 없습니다.");
      this.failSound();
    }
    else {
      this.setState({ dnNo: dnNo });
      this.setState({ data: data });

      this.successSound();

      this.controllers[4].focus();
    }
  }

  postdataCallback = (result, type) => {
    if (result['ALERT']) {
      ToastsStore.error(result['ALERT']);
      this.failSound();
    }
    else {
      getdata('/page/Get/' + this.state.pageName + '/', this.state.dnNo, this.getdataCallback);
      
      if(type === "C") {
        ToastsStore.success("출고처리가 완료되었습니다.");
        this.successSound();
      }
    }
  }

  onInitialized = (e) => {
    this.controllers.push(e.component);
  }

  onEnterKeyDeliveryNoteTxt = (e) => {
    getdata('/page/Get/' + this.state.pageName + '/', e.component.option("value"), this.getdataCallback);
  }

  onClickDeliveryNoteQueryBtn = () => {
    this.setState({ popupVisible: true });
  }

  onRowClickDtg = (e) => {
    const str = e.data["DLVY_DT"].split(" ");
    this.setState({
      detailInfo: {
        deliveryDate: str[0],
        custName: e.data["BP_NM"],
        storehouseName: e.data["SL_NM"]
      }
    })
  }

  onEnterKeyLotNoTxt = (e) => {
    if (this.state.dnNo === "") {
      this.controllers[0].focus();
      e.component.reset();
      ToastsStore.warning("출하번호 입력이 선행되어야합니다.");
      this.errorSound();
    }
    else {
      let value = {};
      value.page = this.state.pageName;
      value.dnNo = this.state.dnNo;
      value.lotNo = e.component.option("value");

      if (this.state.cancelBtn.mode) {
        value.type = "D";
      }
      else {
        value.type = "I";
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

    this.setState({ dnNo: "" });
    this.setState({ data: [] });

    this.setState({
      detailInfo: {
        deliveryDate: "",
        custName: "",
        storehouseName: ""
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
    if (this.state.dnNo === "") {
      ToastsStore.warning("출하번호가 조회되어야 합니다.");
      this.errorSound();
      this.controllers[0].focus();
    }
    else {
      let value = {};
      value.page = this.state.pageName;
      value.type = "C";
      value.dnNo = this.state.dnNo;
      value.userId = this.state.userId;

      postdata("/page/Save", value, this.postdataCallback);
    }
  }

  onHidingPopup = () => {
    this.setState({ popupVisible: false });
  }

  dnNoChange = (dnNo) => {
    this.setState({ dnNo: dnNo });
    this.controllers[0].option("value", dnNo);
    this.controllers[4].focus();
    getdata('/page/Get/' + this.state.pageName + '/', dnNo, this.getdataCallback);
  }
};

export default withRouter(MB1004);
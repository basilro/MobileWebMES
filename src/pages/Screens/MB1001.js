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

class MB1001 extends React.Component {
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
              onClick={() => { this.onClickInsheetQueryBtn(); this.clickSound(); }}
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
                onRowClick={(e) => { this.onRowClickDtg(e); this.clickSound(); }}
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
              text="입고처리"
              onClick={() => { this.onClickEnrollBtn(); }}
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
      this.failSound();
    }
    else {
      this.setState({ insheetNo: insheetNo });
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
      getdata('/page/Get/' + this.state.pageName + '/', this.state.insheetNo, this.getdataCallback);
      
      if(type === "S2") {
        ToastsStore.success("입고처리가 완료되었습니다.");
        this.successSound();
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
      this.errorSound();
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
      this.errorSound();
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

export default withRouter(MB1001);

// import React from 'react';
// import '../../utils/common.css'
// import DataGrid, {
//   Column,
// } from 'devextreme-react/data-grid';
// import { formatMessage } from 'devextreme/localization';
// import { Button, TextBox } from 'devextreme-react';
// import PopupComp from './PopupOrder'
// import { withRouter } from 'react-router-dom'
// import {PopupInfo, Field} from '../../utils/model'
// import {FieldCtrl} from '../../utils/Library'

// class MB1001 extends React.Component {
//   //초기화
//   constructor(props) {
//     super(props)
//     this.state = {
//       userId: this.props.userInfo.id,
//       data: [],
//       popupVisible : false,
//       order : '',
//       lot : '',
//       detatilInfo : this.detailInfo,
//       popupInfo : null,
//       popupValue : [],
//       LotState : true
//     }
//     this.now = new Date();
//     this.scanRef = React.createRef();
//     this.subScanRef = React.createRef();
//   }

//   bottomInfo = [
//     new Field('value','Button','','',false,'입고',null,this.OnSave),
//     new Field('value','Button','','',false,'스캔',null,this.ScanFocused),
//     new Field('value','Button','','',false,'초기화',null,this.AllClear)
//   ]

//   detailInfo = [
//     [
//       new Field('label','','','',false,'품목',null,null),
//       new Field('value','textBox','ITEM_CD','',true,'',null,null)
//     ],
//     [
//       new Field('label','','','',false,'거래명세서수량',null,null),
//       new Field('value','textBox','INSHEET_QTY','',true,'',null,null)
//     ],
//     [
//       new Field('label','','','',false,'스캔수량',null,null),
//       new Field('value','textBox','LOT_QTY','',true,'',null,null)
//     ]
//   ]

//   componentWillMount(){
//     this.popupInit();
//   }

//   popupInit = () =>{
//     const view = [
//       [
//         new Field('label','','','',false,'거래명세번호',null,null),
//         new Field('value','textBox','INSHEET_NO','',true,'',null,null)
//       ],
//       [
//         new Field('label','','','',false,'품목',null,null),
//         new Field('value','textBox','ITEM_CD','',true,'',null,null)
//       ],
//       [
//         new Field('label','','','',false,'수량',null,null),
//         new Field('value','textBox','INSHEET_QTY','',true,'',null,null)
//       ]
//     ]
//     let info = new PopupInfo('거래명세조회', '일자', 'INSHEET_NO', view);
//     this.setState({popupValue : view});
//     this.setState({popupInfo : info});
//   }

//   render() {
//     const detailComp = this.state.detatilInfo.map((info, i) => (
//       <FieldCtrl info = {info} key={i}/>
//     ));

//     return (
//       <React.Fragment>
//         <div className={'dx-card'}>

//           <div className="dx-fieldset">
//             <div className="dx-field">
//               <div className="dx-field-value">
//                 <TextBox 
//                   value={this.state.order} 
//                   ref={this.scanRef} 
//                   onKeyPress={this.OrderSearch}
//                 />
//               </div>
//               <div className="dx-field-value">
//                 <Button
//                   text="거래명세조회"
//                   onClick={this.OrderClick}
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="dx-fieldset">
//             {detailComp}
//           </div>

//           <DataGrid
//             className={'dx-card wide-card'}
//             dataSource={this.state.data}
//             showBorders={true}
//             columnAutoWidth={true}
//             keyExpr={'user_cd'}
//             allowColumnResizing={true}
//           >
//           </DataGrid>

//           <div className="dx-fieldset">
//             <div className="dx-field">
//               <div className="dx-field-value">
//                 <TextBox value={this.state.lot} ref={this.subScanRef} />
//               </div>
//               <div className="dx-field-value">
//                 <Button
//                   text={this.state.LotState ? '취소' : '재시작'}
//                   onClick={this.LotStateChange}
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="dx-fieldset">
//             <FieldCtrl info = {this.bottomInfo}/>
//           </div>

//           {
//             (this.state.popupInfo === null) ? null : <PopupComp 
//                                                         Hide={this.PopupHide} 
//                                                         visible={this.state.popupVisible} 
//                                                         orderChange={this.OrderNoChanged} 
//                                                         info={this.state.popupInfo} 
//                                                         focusedChanaged={this.RowFocusedChanged} 
//                                                         path = {'MB1014'}
//                                                       />
//           }
//         </div>
//       </React.Fragment>
//     );
//   }

//   ScanFocused = () => {

//   }

//   AllClear = () => {

//   }

//   OnSave = (e) => {

//   }

//   //order 스캔
//   OrderSearch = (e) => {

//   }

//   //lot 스캔상태 변경
//   LotStateChange = (e) => {
//     this.setState({ LotState: !this.state.LotState })
//   }

//   //지시조회 클릭시 팝업 표시
//   OrderClick = (e) => {
//     this.setState({ popupVisible: true });
//   }

//   //팝업 숨기기
//   PopupHide = () => {
//     this.setState({ popupVisible: false });
//     this.state.popupValue.map((value, i) => {
//       value.value = ''
//     });
//   }

//   //지시번호 변경
//   OrderNoChanged = () => {
//     this.setState({ order: this.state.popupValue[0].value });
//     this.scanRef.current.instance.focus();
//     this.state.popupValue.forEach((value) =>{
//       value.value = ''
//     });
//     /*
//     this.state.popupValue.map((value, i) => {
//       value.value = ''
//     });
//     */
//   }

  // //팝업 로우선택변경
  // RowFocusedChanged = (data) => {
  //   let value = this.state.popupValue;
  //   this.state.popupValue.map((value, i) => {
  //     value.value = data[i];
  //   });
  //   /*
  //   value[0].value = data['DN_NO']
  //   value[1].value = data['SL_CD']
  //   value[2].value = data['REQ_QTY']
  //   */
  //   this.setState({popupValue : value});
  // }
// };

// export default withRouter(MB1001);
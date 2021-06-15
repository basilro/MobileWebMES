import React from 'react';
import '../../utils/common.css'
import DataGrid, {
  Column,
} from 'devextreme-react/data-grid';
import { formatMessage } from 'devextreme/localization';
import { Button, TextBox } from 'devextreme-react';
import PopupComp from './PopupOrder'
import { withRouter } from 'react-router-dom'
import {PopupInfo, Field} from '../../utils/model'
import {FieldCtrl} from '../../utils/Library'

class MB1005 extends React.Component {
  //초기화
  constructor(props) {
    super(props)
    this.state = {
      userId: this.props.userInfo.id,
      data: [],
      popupVisible : false,
      order : '',
      lot : '',
      detatilInfo : this.detailInfo,
      popupInfo : null,
      popupValue : [],
      LotState : true
    }
    this.now = new Date();
    this.scanRef = React.createRef();
    this.subScanRef = React.createRef();
  }

  bottomInfo = [
    new Field('value','Button','','',false,'입고',null,this.OnSave),
    new Field('value','Button','','',false,'스캔',null,this.ScanFocused),
    new Field('value','Button','','',false,'초기화',null,this.AllClear)
  ]

  detailInfo = [
    [
      new Field('label','','','',false,'품목',null,null),
      new Field('value','TextBox','ITEM_CD','',true,'',null,null)
    ],
    [
      new Field('label','','','',false,'거래명세서수량',null,null),
      new Field('value','TextBox','INSHEET_QTY','',true,'',null,null)
    ],
    [
      new Field('label','','','',false,'스캔수량',null,null),
      new Field('value','TextBox','LOT_QTY','',true,'',null,null)
    ]
  ]

  componentDidMount() {
    this.popupInit();
  }

  popupInit = () =>{
    const view = [
      [
        new Field('label','div','','',false,'거래명세번호',null,null),
        new Field('value','TextBox','INSHEET_NO','',true,'',null,null)
      ],
      [
        new Field('label','div','','',false,'품목',null,null),
        new Field('value','TextBox','ITEM_CD','',true,'',null,null)
      ],
      [
        new Field('label','div','','',false,'수량',null,null),
        new Field('value','TextBox','INSHEET_QTY','',true,'',null,null)
      ]
    ]
    let info = new PopupInfo('거래명세조회', view);
    this.setState({popupValue : view});
    this.setState({popupInfo : info});
  }

  render() {
    const detailComp = this.state.detatilInfo.map((info, i) => (
      <FieldCtrl info = {info} key={i}/>
    ));

    return (
      <React.Fragment>
        <div className={'dx-card'}>

          <div className="dx-fieldset">
            <div className="dx-field">
              <div className="dx-field-value">
                <TextBox 
                  value={this.state.order} 
                  ref={this.scanRef} 
                  onKeyPress={this.OrderSearch}
                />
              </div>
              <div className="dx-field-value">
                <Button
                  text="거래명세조회"
                  onClick={this.OrderClick}
                />
              </div>
            </div>
          </div>

          <div className="dx-fieldset">
            {detailComp}
          </div>

          <DataGrid
            className={'dx-card wide-card'}
            dataSource={this.state.data}
            showBorders={true}
            columnAutoWidth={true}
            keyExpr={'user_cd'}
            allowColumnResizing={true}
          >
          </DataGrid>

          <div className="dx-fieldset">
            <div className="dx-field">
              <div className="dx-field-value">
                <TextBox value={this.state.lot} ref={this.subScanRef} />
              </div>
              <div className="dx-field-value">
                <Button
                  text={this.state.LotState ? '취소' : '재시작'}
                  onClick={this.LotStateChange}
                />
              </div>
            </div>
          </div>

          <div className="dx-fieldset">
            <FieldCtrl info = {this.bottomInfo}/>
          </div>

          {
            (this.state.popupInfo === null) ? null : <PopupComp 
                                                        Hide={this.PopupHide} 
                                                        visible={this.state.popupVisible} 
                                                        orderChange={this.OrderNoChanged} 
                                                        info={this.state.popupInfo} 
                                                        focusedChanaged={this.RowFocusedChanged} 
                                                        path = {'MB1014'}
                                                      />
          }
        </div>
      </React.Fragment>
    );
  }

  ScanFocused = () => {

  }

  AllClear = () => {

  }

  OnSave = (e) => {

  }

  //order 스캔
  OrderSearch = (e) => {

  }

  //lot 스캔상태 변경
  LotStateChange = (e) => {
    this.setState({ LotState: !this.state.LotState })
  }

  //지시조회 클릭시 팝업 표시
  OrderClick = (e) => {
    this.setState({ popupVisible: true });
  }

  //팝업 숨기기
  PopupHide = () => {
    this.setState({ popupVisible: false });
    this.state.popupValue.map((value, i) => {
      value.value = ''
    });
  }

  //지시번호 변경
  OrderNoChanged = () => {
    this.setState({ order: this.state.popupValue[0].value });
    this.scanRef.current.instance.focus();
    this.state.popupValue.forEach((value) =>{
      value.value = ''
    });
    /*
    this.state.popupValue.map((value, i) => {
      value.value = ''
    });
    */
  }

  //팝업 로우선택변경
  RowFocusedChanged = (data) => {
    let value = this.state.popupValue;
    this.state.popupValue.map((value, i) => {
      value.value = data[i];
    });
    /*
    value[0].value = data['DN_NO']
    value[1].value = data['SL_CD']
    value[2].value = data['REQ_QTY']
    */
    this.setState({popupValue : value});
  }
};

export default withRouter(MB1005);

// import React from 'react';
// import '../../utils/common.css'
// import DataGrid, {
//   Column,
//   FilterRow,
//   Lookup,
//   Editing,
//   RequiredRule
// } from 'devextreme-react/data-grid';
// import Toolbar, { Item } from 'devextreme-react/toolbar';
// import { Template } from 'devextreme-react/core/template';
// import Form, { SimpleItem } from 'devextreme-react/form'
// import { FileUploader } from 'devextreme-react';
// import { selection, auth, colCountByScreen } from '../../CommonData'
// import { formatMessage } from 'devextreme/localization';
// import { withRouter } from 'react-router-dom'

// class MB1005 extends React.Component {
//   //초기화
//   constructor(props) {
//     super(props)
//     this.state = {
//       address: window.localStorage.getItem('sv_address'),
//       userid: window.localStorage.getItem('id'),
//       data: []
//     }
//     this.postSend = this.postSend.bind(this);
//   }

//   componentDidCatch(err, errorInfo) {
//     console.error(err);
//     console.error(errorInfo);
//     this.setState(() => ({ err, errorInfo }));
//   }

//   //데이터 로드
//   async getdata(param) {
//     const response = await fetch(this.state.address + "/User/Get/" + param
//       , { headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Access-Control-Allow-Origin': '*' } });
//     //console.log(response);
//     const data = await response.json();
//     console.log(data);
//     this.setState({ data: data });
//   }

//   //파일업로드 템플릿
//   Template_upload(cellData) {
//     const data = cellData.data;
//     data['user_id'] = this.state.userid;
//     return (
//       <FileUploader accept={'image/*'} uploadUrl={this.state.address + "/File/Upload?data=" + JSON.stringify(data)}
//         //업로드 완료 처리
//         onUploaded={e => {
//           const res = eval("(" + e.request.response + ")");
//           cellData.setValue(res['FILE_CODE']);
//         }} />
//     );
//   }

//   render() {
//     return (
//       <React.Fragment>
//         <div className={'dx-card responsive-paddings'}>
//         </div>
//         <DataGrid
//           className={'dx-card wide-card'}
//           dataSource={this.state.data}
//           showBorders={true}
//           columnAutoWidth={true}
//           keyExpr={'user_cd'}
//           onEditingStart={this.onEditingStart}
//           onInitNewRow={this.onInitNewRow}
//           onRowUpdated={this.onUpdated}
//           onRowInserted={this.onInserted}
//           onRowRemoved={this.onRemoved}
//           allowColumnResizing={true}
//         //columnHidingEnabled={true} //컬럼 감출껀지 여부
//         >
//           <FilterRow visible={true} />
//           <Editing mode='row'
//             allowAdding={true}
//             allowUpdating={true}
//             allowDeleting={true}
//           />

//           <Template name={'template_upload'} render={this.Template_upload} />
//         </DataGrid>
//       </React.Fragment>
//     );
//   }

//   lookup() {
//     return (
//       <Lookup
//         dataSource={formatMessage('selectOption')}
//         valueExpr={'value'}
//         displayExpr={'name'}
//       />
//     )
//   }

//   //수정
//   onUpdated(e) {
//     this.postSend("/User/Update", e.data);
//   }

//   //추가
//   onInserted(e) {
//     this.postSend("/User/Add", e.data);
//   }

//   //삭제
//   onRemoved(e) {
//     this.postSend("/User/Delete", e.data);
//   }

//   //post전송
//   postSend(urlPath, data) {
//     data['user_id'] = this.state.userid
//     console.log(data);
//     fetch(this.state.address + urlPath
//       , {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
//         body: JSON.stringify(data)
//       })
//       .then(res => res.json())
//       .then(result => {
//         console.log(result);
//         if (result['result'] === 'true') {
//           this.getdata(JSON.stringify(this.form.option("formData")));
//         } else {
//           alert(result['msg']);
//         }
//       });
//   }
// };

// export default withRouter(MB1005);
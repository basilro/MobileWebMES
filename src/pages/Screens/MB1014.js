import React from 'react';
import DataGrid, {Column} from 'devextreme-react/data-grid';
import { formatMessage } from 'devextreme/localization';
import { DateBox, Button, TextBox, ScrollView, Popup } from 'devextreme-react';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { getdata } from '../../utils/util';

class MB1014 extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      now: new Date(),
      dn_no: '',
      sl_Cd: '',
      req_qty: '',
      adbb: ''
    }
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
          closeOnOutsideClick={true}
          showCloseButton={true}
          showTitle={true}
          visible={this.props.visible}
          onHiding={this.onHide}
          title={'지시조회'}
        >
          <ScrollView width='100%' height='100%'>
            <div className={'dx-card'}>
              <div className="dx-fieldset">
                <div className="dx-field">
                  <div className="dx-field-label">
                    날짜
                  </div>
                  <div className="dx-field-value">
                    <DateBox defaultValue={this.state.now}
                      value = {this.state.now}
                      onValueChanged={this.onValueChanged}
                      displayFormat="yyyy-MM-d"
                      pickerType="rollers" />
                  </div>
                  <div className="dx-field-value">
                    <Button
                      text="찾기"
                      onClick={this.onSearchClcik}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="dx-fieldset">
              <div className="dx-field">
                <div className="dx-field-label">출하번호</div>
                <div className="dx-field-value">
                  <TextBox
                    value={this.state.dn_no}
                    readOnly={true}
                  />
                </div>
              </div>
              <div className="dx-field">
                <div className="dx-field-label">창고</div>
                <div className="dx-field-value">
                  <TextBox
                    value={this.state.sl_Cd}
                    readOnly={true}
                  />
                </div>
              </div>
              <div className="dx-field">
                <div className="dx-field-label">요청수량</div>
                <div className="dx-field-value">
                  <TextBox
                    value={this.state.req_qty}
                    readOnly={true}
                  />
                </div>
              </div>
            </div>
            <DataGrid
              className={'dx-card wide-card'}
              dataSource={this.state.data}
              showBorders={true}
              columnAutoWidth={true}
              keyExpr={'DN_NO'}
              allowColumnResizing={true}
              onFocusedRowChanged = {this.onRowClick}
              focusedRowEnabled={true}
            >
            </DataGrid>
            <div className={'dx-card'} style={{/*position:'absolute',bottom:50,left:0,right:0*/ }}>
              <div className="dx-fieldset">
                <div className="dx-field">
                  <div className="dx-field-label">
                    <Button
                      text="선택"
                      width="100%"
                      onClick={this.onSelect}
                    />
                  </div>
                </div>
              </div>
            </div>
            
          </ScrollView>
        </Popup>
      </React.Fragment>
    );
  }
  
  //초기화
  AllClear = () => {
    this.setState({ 
      data: [],
      now: new Date(),
      dn_no: '',
      sl_Cd: '',
      req_qty: '',
      adbb: ''
    })
  }

  //팝업 숨기기
  onHide = (e) => {
    this.AllClear();
    this.props.Hide();
  }

  //날짜변경시 발생
  onValueChanged = (e) => {
    this.setState({ now: e.value })
  }

  //선택 클릭
  onSelect = (e) => {
    if (this.state.dn_no === '') {
      alert("지시가 선택되지 않았습니다.");
      return;
    }
    this.props.orderChange(this.state.dn_no);
    this.AllClear();
    this.props.Hide();
  }

  //찾기 클릭시 발생
  onSearchClcik = (e) => {
    const date = moment(this.state.now).format('YYYY-MM-DD');
    // console.log(moment(this.state.now).format('YYYY-MM-DD'));
    //this.getdata(date);
    getdata('/page/Get/MB1014/', date).then(
      result => {
        this.setState({data : result});
      }
    );
  }

  //그리드 행선택
  onRowClick = (e) => {
    //console.log(e);
    this.setState({
      dn_no: e.row.data['DN_NO'],
      sl_Cd: e.row.data['SL_CD'],
      req_qty: e.row.data['REQ_QTY']
    })
  }

};

export default withRouter(MB1014);

// import React from 'react';
// import '../../utils/common.css'
// import DataGrid, {
//   Column,
//   FilterRow,
//   Lookup,
//   Editing,
//   RequiredRule
// } from 'devextreme-react/data-grid';
// import Toolbar, {Item} from 'devextreme-react/toolbar';
// import { Template } from 'devextreme-react/core/template';
// import Form, {SimpleItem} from 'devextreme-react/form'
// import {FileUploader} from 'devextreme-react';
// import {selection, auth, colCountByScreen} from '../../CommonData'
// import { formatMessage } from 'devextreme/localization';

// import ColorBox from 'devextreme-react/color-box';
// import NumberBox from 'devextreme-react/number-box';
// import SelectBox from 'devextreme-react/select-box';
// import Switch from 'devextreme-react/switch';
// import { DateBox, Button, TextBox } from 'devextreme-react';
// import BarcodeReader from 'react-barcode-reader'
// import moment from 'moment';
// import PopupForm from './MB1014'
// import { withRouter } from 'react-router-dom'


// class MB1004 extends React.Component {
//   //초기화
//   constructor(props){
//     super(props)
//     this.state = {
//         address : window.localStorage.getItem('sv_address'),
//         userid : window.localStorage.getItem('id'),
//         data : [],
//         result: '',
//         popupVisible : false,
//         dlvy_dt: '',
//         sl_nm: '',
//         bp_nm: '',
//         dn_no: '',
//         lot_no : '',
//         btnNM : true
//     }
//     this.now = new Date();
//     this.postSend = this.postSend.bind(this);
//     this.textRef = React.createRef();
//     this.scanRef = React.createRef();
//   }

//   componentDidCatch(err, errorInfo){
//     console.error(err);
//     console.error(errorInfo);
//     this.setState(() => ({err, errorInfo}));
//   }




 

//   render() {
//     return (
//       <React.Fragment>
//         <div className={'dx-card'}>
//           <div className="dx-fieldset">
//             <div className="dx-field">
            
//               <div className="dx-field-value">
//              <TextBox
//              value={this.state.dn_no}
//              onValueChanged = {this.onValueChanged}
//              ref={this.textRef} 
//             />
//               </div>

//               <div className="dx-field-value">
//                 <Button                                
//                   text = "지시조회"
//                   onClick={this.OrderClick}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="dx-fieldset">
//           <div className="dx-field">
//             <div className="dx-field-label">납기일</div>
//             <div className="dx-field-value">
//               <TextBox
//                 value={this.state.dlvy_dt}
//                 maxLength={30}
//                 height={20}
//                 valueChangeEvent="keyup"
//                 readOnly={true}
//               />
//             </div>
//           </div>
//           <div className="dx-field">
//             <div className="dx-field-label">거래처</div>
//             <div className="dx-field-value">
//               <TextBox
//                 value={this.state.bp_nm}
//                 maxLength={30}
//                 height={20}
//                 valueChangeEvent="keyup"
//                 readOnly={true}
//               />
//             </div>
//           </div>
//           <div className="dx-field">
//             <div className="dx-field-label">창고명</div>
//             <div className="dx-field-value">
//               <TextBox
//                 value={this.state.sl_nm}
//                 maxLength={30}
//                 height={20}
//                 valueChangeEvent="keyup"
//                 readOnly={true}
//               />
//             </div>
//           </div>
          
          
//         </div>
//         <DataGrid
//           className={'dx-card wide-card'}
//           dataSource={this.state.data}
//           showBorders={true}
//           columnAutoWidth={true}
//           keyExpr={'DN_NO'}
//           allowColumnResizing={true}
//           onRowClick={this.onRowClick}
//           focusedRowEnabled={true}

//         >

//             <Column         
//             dataField={'ITEM_NM'}
//             caption={'품명'}
//             width={220}
//           /> 
//           <Column         
//             dataField={'REQ_QTY'}
//             caption={'출하요청수량'}
//             width={100}
//           />
//             <Column         
//             dataField={'LOT_QTY'}
//             caption={'스캔수량'}
//             width={80}
//           /> 
//           <Column         
//             dataField={'GI_QTY'}
//             caption={'출고수량'}
//             width={80}
//           /> 
           
          
//         </DataGrid>
        
//         <div className={'dx-card'}>
//           <div className="dx-fieldset">
//             <div className="dx-field">
 
//               <div className="dx-field-value">
//               <TextBox
              
//               value={this.state.lot_no}
//               onValueChanged = {this.onLotValueChanged}
//               ref={this.scanRef} 
//               width={300}
//               >
//               </TextBox>
         
//               </div>
 
//               <div className="dx-field-value">
//                 <Button
//                   text={this.state.btnNM ? '취소' : '재시작'}
//                   onClick = {this.onChangeClcik}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>        
//         <div className={'dx-card'}>
//           <div className="dx-fieldset">
//             <div className="dx-field">
        
//                 <Button
//                   text = "출고"
//                   onClick = {this.onSave}
//                 />
//               <div className="dx-field-value">
//                 <Button
//                   text = "스캔"
//                   onClick = {this.onScanClick}
//                 />
//               </div>
//               <div className="dx-field-value">
//                 <Button
//                   text = "초기화"
//                   onClick = {this.onResetClcik}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         <PopupForm Hide={this.PopupHide} visible={this.state.popupVisible} orderChange={this.OrderNoChanged}/>
//       </React.Fragment>
//     );
//   }

//   //텍스트 변경
//   onValueChanged = (e) => {
//     this.setState({dn_no : e.value})
//     if(this.state.dn_no != ''){
//         const date = this.state.dn_no
//         this.getdata(date);   
//     }

 
//   }

//   onLotValueChanged = (e) => {
//     this.setState({lot_no : e.value})
//     if(this.state.data !=''){
//       if(this.state.lot_no != '' && this.state.btnNM == true){
//           const dn_date = this.state.dn_no
//           this.postSend('I');
//           this.setState({lot_no: ''})
//           this.getdata(dn_date);    
//       }
//       else if (this.state.lot_no != '' && this.state.btnNM == false){
//         this.postSend('D');
//         this.setState({lot_no: ''})
//         const dn_date = this.state.dn_no
//         this.getdata(dn_date);    
//       }
//     }
//     else {
//       alert('출고번호를 입력하세요');
//       this.setState({lot_no: ''})
//       this.textRef.current.instance.focus();
//     }
//   }

//     //완료
//     onSave = (e) =>{
//           if(this.state.data !=''){
//             this.postSend('C');
//             const date = this.state.dn_no
//             this.getdata(date)
            

//           }
//           else {
//             alert('출고번호를 입력하세요');
//             this.setState({lot_no: ''})
//             this.textRef.current.instance.focus();
//           }        
//     }

//     onChangeClcik = (e) =>{
//     this.setState({ btnNM: !this.state.btnNM })
//     this.scanRef.current.instance.focus();   
//     }

//     onScanClick = (e) => {
//       this.scanRef.current.instance.focus();
//     }
 
//     onResetClcik = (e) =>{
//       this.AllClear();
//       this.textRef.current.instance.focus();
//     }



//     //지시조회 클릭시 팝업 표시
//     OrderClick = (e) =>{
//       this.setState({popupVisible : true});
//     }

//     //팝업 숨기기
//     PopupHide = () =>{
//       this.setState({popupVisible : false});
//     }

//     //지시번호 변경
//     OrderNoChanged = (orderNo) => {
//       this.setState({dn_no : orderNo});
//       this.scanRef.current.instance.focus();
//       if(this.state.dn_no != ''){
//         const date = this.state.dn_no
//         this.getdata(date);
//      }
//     }


//   //get 전송
//   async getdata(param){
//     const pagename = this.props.location.pathname.replace('/','');
//     const response = await fetch(this.state.address + "/page/Get/" + pagename + "/" + param
//                           ,{headers:{'Content-Type':'application/x-www-form-urlencoded', 'Access-Control-Allow-Origin': '*'}});
//     //console.log(response);
//     const data = await response.json();
//     console.log(data);
//     this.setState({ data: data});

//     if(data.length == 0){
//           alert('입력한 출고번호는 없는 번호입니다.')
//           this.AllClear();
//          }

//   }


//   //post전송
//   postSend(type){
//     let data = new Object();
//     data.page = this.props.location.pathname.replace('/','');
//     data.type = type;
//     data.dn_no = this.state.dn_no;
//     data.lot = this.state.lot_no;
//     data.userid = window.localStorage.getItem('id')
//     console.log(data);
//     fetch(this.state.address + "/page/Save"
//             ,{method:'POST',
//             headers:{'Content-Type':'application/json', 'Access-Control-Allow-Origin': '*'},
//             body:JSON.stringify(data)})
//           .then(res => res.json())
//           .then(result=>{
//             console.log(result);
//             if(result['end']){
//               this.AllClear();
//               alert(result['end'])
//             }            
//             else{
//               alert(result['msg'] );
//              // alert(result['msg']);
//             }
//           });
//   }



//   AllClear = () =>{
//     this.setState({
//       dn_no : '',
//       bp_nm :'',
//       sl_nm :'',
//       dlvy_dt : '',
//       lot_no : '',
//       data: []
//     })
//   }



//   onRowClick = (e) =>{
//     console.log(e);
//     this.setState({
//       bp_nm : e.data['BP_NM'],
//       sl_nm : e.data['SL_NM'],
//       dlvy_dt : e.data['DLVY_DT']
//     })
//   }
// };

// export default withRouter(MB1004);

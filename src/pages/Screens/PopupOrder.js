import React from 'react';
import { getdata } from '../../utils/util';
import { ToastsContainer, ToastsStore } from 'react-toasts'
import DataGrid, { Column } from 'devextreme-react/data-grid';
import { DateBox, Button, ScrollView, Popup } from 'devextreme-react';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { FieldCtrl } from '../../utils/Library'

class PopupOrder extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      key: "",
      info: this.props.info
    }

    this.controllers = {};

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

  componentDidCatch(err, errorInfo) {
    console.error(err);
    console.error(errorInfo);
    this.setState(() => ({ err, errorInfo }));
  }

  render() {
    const viewComp = this.state.info.view.map((view, i) => (
      <FieldCtrl
        key={i}
        info={view}
      />
    ));
    const columns = this.state.info.column;

    // const columns = this.state.info.view.map((view, i) => (
    //   <Column
    //     key={i}
    //     dataField={view[1].key}
    //     caption={view[0].text}
    //   />
    // ));

    return (
      <React.Fragment>
        <Popup
          width="90%"
          height="90%"
          closeOnOutsideClick={true}
          showTitle={false}
          visible={this.props.visible}
          onHiding={() => { this.resetPopupData(); this.props.hide(); }}
        >
          <ScrollView>
            <div className="dx-fieldset">
              <div className="dx-field">
                <DateBox
                  className="dx-field-label"
                  width="70%"
                  defaultValue={new Date()}
                  displayFormat="yyyy-MM-dd"
                  pickerType="rollers"
                  onInitialized={(e) => this.onInitialized(e, "DateBox")}
                />
                <Button
                  className="dx-field-value"
                  width="30%"
                  text="찾기"
                  onClick={this.onClickSearchBtn}
                />
              </div>
              {viewComp}
              <div className="dx-field">
                <ScrollView
                  height={150}
                >
                  <DataGrid
                    dataSource={this.state.data}
                    noDataText="표시할 데이터가 없습니다."
                    showBorders={true}
                    columnAutoWidth={true}
                    focusedRowEnabled={true}
                    keyExpr={this.state.info.key}
                    onRowClick={(e) => { this.onRowClickDtg(e); this.clickSound(); }}
                  >
                    {columns}
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
                  onClick={() => { this.resetPopupData(); this.props.hide(); this.clickSound(); }}
                />
              </div>
            </div>
          </ScrollView>
        </Popup>
        <ToastsContainer store={ToastsStore} />
      </React.Fragment>
    );
  }

  getdataCallback = (data, date) => {
    if (data.length === 0) {
      this.resetPopupData();
      ToastsStore.error(date + "은 데이터가 없습니다.");
      this.failSound();
    }
    else {
      this.setState({ data: data });
      this.successSound();
    }
  }

  onInitialized = (e, key) => {
    this.controllers[key] = e.component;
  }

  onClickSearchBtn = () => {
    const date = moment(this.controllers["DateBox"].option("value")).format('YYYY-MM-DD');
    getdata('/page/Get/' + this.props.path + '/', date, this.getdataCallback)
  }

  onRowClickDtg = (e) => {
    const data = this.state.info.view;
    data.map(item => {
      item.map(items => {
        if (items.fieldType === "value") {
          items.text = e.data[items.key];
          if (items.key === this.state.info.key) {
            this.setState({ key: e.data[items.key] });
          }
        }
      })
    });

    this.setState({
      info: {
        ...this.state.info,
        view: data
      }
    })
  }

  onClickSelectBtn = () => {
    if (this.state.key === "") {
      ToastsStore.warning(this.state.info.key + "이 선택되지 않았습니다.");
      this.errorSound();
    }
    else {
      this.props.hide();
      this.props.KeyNoChange(this.state.key);
      this.resetPopupData();
    }
  }

  resetPopupData = () => {
    const data = this.state.info.view;
    data.map(item => {
      item.map(items => {
        if (items.fieldType === "value") {
          items.text = "";
        }
      })
    });

    this.setState({
      info: {
        ...this.state.info,
        view: data
      }
    })
    this.setState({ key: "" });
    this.setState({ data: [] });
  }
};

export default withRouter(PopupOrder);

// class PopupOrder extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       data: [],
//       now: new Date(),
//       info: this.props.info
//     }
//   }

//   componentDidCatch(err, errorInfo) {
//     console.error(err);
//     console.error(errorInfo);
//     this.setState(() => ({ err, errorInfo }));
//   }

//   render() {
//     const viewComp = this.state.info.view.map((view, i) => (
//       <FieldCtrl info={view} key={i} />
//     ));

//     return (
//       <React.Fragment>
//         <Popup
//           width="90%"
//           height="90%"
//           closeOnOutsideClick={true}
//           showCloseButton={true}
//           visible={this.props.visible}
//           title={this.state.info.title}
//           onHiding={this.onHide}
//         >
//           <ScrollView>
//             <div className="dx-fieldset">
//               <div className="dx-field">
//                 <div className="dx-field-label">
//                   날짜
//                 </div>
//                 <div className="dx-field-value">
//                   <DateBox
//                     width={130}
//                     defaultValue={new Date()}
//                     onValueChanged={this.onValueChanged}
//                     displayFormat="yyyy-MM-dd"
//                     pickerType="rollers" />
//                 </div>
//                 <div className="dx-field-value">
//                   <Button
//                     text="찾기"
//                     onClick={this.test}
//                   />
//                 </div>
//               </div>
//               {viewComp}
//               <div className="dx-field">
//                 <ScrollView
//                   height={160}
//                 >
//                   <DataGrid
//                     className={'dx-card wide-card'}
//                     dataSource={this.state.data}
//                     noDataText="표시할 데이터가 없습니다."
//                     showBorders={true}
//                     columnAutoWidth={true}
//                     keyExpr="NO"
//                     //onFocusedRowChanged={this.onRowClick}
//                     focusedRowEnabled={true}
//                     onRowClick={this.onRowClick}
//                   >
//                   </DataGrid>
//                 </ScrollView>
//               </div>
//               <div className="dx-field">
//                 <div className="dx-field-label">
//                   <Button
//                     text="선택"
//                     width="100%"
//                     onClick={this.onSelect}
//                   />
//                 </div>
//               </div>
//             </div>
//           </ScrollView>
//         </Popup>
//       </React.Fragment>
//     );
//   }
//   test = () => {
//     console.log(this.state.info.view);
//   }

//   //초기화
//   AllClear = () => {
//     this.setState({
//       data: [],
//       now: new Date(),
//       views: this.props.views
//     })
//   }

//   //팝업 숨기기
//   onHide = (e) => {
//     this.AllClear();
//     this.props.Hide();
//   }

//   //날짜변경시 발생
//   onValueChanged = (e) => {
//     this.setState({ now: e.value })
//   }

//   //선택 클릭
//   onSelect = (e) => {
//     if (this.state.info.view[0].value === '') {
//       alert("지시가 선택되지 않았습니다.");
//       return;
//     }
//     this.props.orderChange();
//     this.AllClear();
//     this.props.Hide();
//   }

//   //찾기 클릭시 발생
//   onSearchClcik = (e) => {
//     const date = moment(this.state.now).format('YYYY-MM-DD');
//     // console.log(moment(this.state.now).format('YYYY-MM-DD'));
//     //this.getdata(date);
//     getdata('/page/Get/' + this.props.path + '/', date).then(
//       result => {
//         console.log(result);
//         this.setState({ data: result });
//       }
//     );
//   }

//   //그리드 행선택
//   onRowClick = (e) => {
//     this.props.focusedChanaged(e.row.data);
//   }

// };

// export default withRouter(PopupOrder);
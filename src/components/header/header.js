import React from 'react';
import { withRouter } from 'react-router-dom'
import Toolbar, { Item } from 'devextreme-react/toolbar';
import Button from 'devextreme-react/button';
import UserPanel from '../user-panel/user-panel';
import './header.scss';
import { Template } from 'devextreme-react/core/template';

class header extends React.Component {
  constructor(props) {
    super(props)

    this.click = require("../../sound/click.wav");

    this.audio = new Audio();
  }

  clickSound() {
    this.audio.src = this.click;
    this.audio.volume = 1;
    this.audio.play();
  }

  render() {
    return(
      <header className={'header-component'}>
        <Toolbar className={'header-toolbar'} height={70}>
          {/*축소 확대버튼 */}
          <Item
            visible={this.props.menuToggleEnabled}
            location={'before'}
            widget={'dxButton'}
            cssClass={'menu-button'}
          >
            <Button icon="menu" stylingMode="text" onClick={() => { this.props.toggleMenu(); this.clickSound(); }} />
          </Item>
          {/*타이틀 */}
          <Item
            location={'before'}
            cssClass={'header-title'}
            text={this.props.title}
            visible={!!this.props.title}
          />
          {/*사용자 표시*/}
          <Item
            location={'after'}
            locateInMenu={'auto'}
            menuItemTemplate={'userPanelTemplate'}
          >
            <Button
              className={'user-button authorization'}
              width={130}
              height={35}
              stylingMode={'text'}
              onClick={() => { this.clickSound(); }}
            >
              <UserPanel menuItems={this.props.userMenuItems} menuMode={'context'} userInfo={this.props.userInfo} />
            </Button>
          </Item>
          <Item
            location={'after'}
          >
            <Button
              icon="home"
              onClick={() => { this.props.history.push("/home"); this.props.changeTitle("DNT MES"); this.props.controlSideMenuTreeViewGet().selectItem("MB1000"); this.clickSound(); }}
            />
          </Item>
          <Template name={'userPanelTemplate'}>
            <UserPanel menuItems={this.props.userMenuItems} menuMode={'list'} userInfo={this.props.userInfo} />
          </Template>
        </Toolbar>
      </header>
    );
  }
}

// const header = ({ menuToggleEnabled, title, toggleMenu, userMenuItems, userInfo, history, changeTitle, controlSideMenuTreeViewGet }) => (
  
//   <header className={'header-component'}>
//     <Toolbar className={'header-toolbar'} height={70}>
//       {/*축소 확대버튼 */}
//       <Item
//         visible={menuToggleEnabled}
//         location={'before'}
//         widget={'dxButton'}
//         cssClass={'menu-button'}
//       >
//         <Button icon="menu" stylingMode="text" onClick={toggleMenu} />
//       </Item>
//       {/*타이틀 */}
//       <Item
//         location={'before'}
//         cssClass={'header-title'}
//         text={title}
//         visible={!!title}
//       />
//       {/*사용자 표시*/}
//       <Item
//         location={'after'}
//         locateInMenu={'auto'} 
//         menuItemTemplate={'userPanelTemplate'}
//       >
//         <Button
//           className={'user-button authorization'}
//           width={130}
//           height={35}
//           stylingMode={'text'}
//         >
//           <UserPanel menuItems={userMenuItems} menuMode={'context'} userInfo={userInfo} />
//         </Button>
//       </Item>
//       <Item
//         location={'after'}
//       >
//         <Button
//           icon="home"
//           onClick={() => { history.push("/home"); changeTitle("D&T"); controlSideMenuTreeViewGet().selectItem("MB1000") }}
//         />
//       </Item>
//       <Template name={'userPanelTemplate'}>
//         <UserPanel menuItems={userMenuItems} menuMode={'list'} userInfo={userInfo} />
//       </Template>
//     </Toolbar>
//   </header>
// );

export default withRouter(header);
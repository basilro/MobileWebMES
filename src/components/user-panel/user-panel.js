import React from 'react';
import ContextMenu from 'devextreme-react/context-menu';
import List from 'devextreme-react/list';
import './user-panel.scss';

export default class UserPanel extends React.Component {
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
    const { menuMode, menuItems, userInfo } = this.props;
    
    return (
      <div className={'user-panel'}>
        <div className={'user-info'}>
          <div className={'user-name'}>{userInfo['username']}</div>
        </div>

        {menuMode === 'context' && (
          <ContextMenu
            items={menuItems}
            target={'.user-button'}
            showEvent={'dxclick'}
            width={130}
            position={{ my: 'top center', at: 'bottom center' }}
            cssClass={'user-menu'}
          />
        )}
        {menuMode === 'list' && (
          <List className={'dx-toolbar-menu-action'} items={menuItems} />
        )}
      </div>
    );
  }
}

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { Button } from 'devextreme-react';
import './home.scss';

class home extends Component {
  constructor(props) {
    super(props);

    const click = require("../../sound/click.wav");

    this.audio = new Audio(click);
  }

  play() {
    this.audio.volume = 1;
    this.audio.play();
  }

  render() {

    const buttonList = this.props.data.map((item, index) => {

      if (item.menu_nm === '메인화면')
        return null;
      else
        return (
          <Button
            key={index}
            className='buttons'
            text={item.menu_nm}
            type='default'
            stylingMode='contained'
            onClick={() => { this.props.history.push(item.path); this.props.changeTitle(item.menu_nm); this.props.controlSideMenuTreeViewGet().selectItem(item.path); this.play(); }}
          />
        )
      }
    )

    return (
      <div className={'content-block'}>
        <div className={'dx-card responsive-paddings'}>
          <div className='menu-title'>
            DNT MES
          </div>
          <div className='button'>
            {buttonList}
          </div>
        </div>
      </div>
    )
  }
}
export default withRouter(home);
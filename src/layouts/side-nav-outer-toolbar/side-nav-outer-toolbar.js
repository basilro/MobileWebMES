import Drawer from 'devextreme-react/drawer';
import ScrollView from 'devextreme-react/scroll-view';
import React from 'react';
import { withRouter } from 'react-router';
import { Header, SideNavigationMenu, Footer } from '../../components';
import routes from '../../app-routes';
import './side-nav-outer-toolbar.scss';
import { sizes, subscribe, unsubscribe } from '../../utils/media-query';
import { Template } from 'devextreme-react/core/template';
import { menuPreInitPatch } from '../../utils/patches';
import { formatMessage } from 'devextreme/localization';
import { Redirect, Route, Switch } from 'react-router-dom';

class SideNavOuterToolbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      menuOpened: sizes()['screen-large'],
      temporaryMenuOpened: false,
      ...this.drawerConfig
    };

    this.menuPatch = menuPreInitPatch(this);
    //사용자툴바를 클릭했을때 보여지는 메뉴정보
    this.userMenuItems = [
      {
        text: formatMessage('logout'),
        icon: 'runner',
        onClick: this.props.logout
      }
    ];

    this.click = require("../../sound/click.wav");

    this.audio = new Audio();
  }

  clickSound() {
    this.audio.src = this.click;
    this.audio.volume = 1;
    this.audio.play();
  }

  render() {
    const { menuData, location } = this.props;
    const {
      menuOpened,
      menuMode,
      shaderEnabled,
      menuRevealMode,
      minMenuSize
    } = this.state;

    //메인화면 title은 'DNT MES'로
    const returnTitle = () => {
      if (this.props.title === '메인화면')
        return 'DNT MES';
      else
        return this.props.title;
    }

    return (
      <div className={'side-nav-outer-toolbar'}>
        {/*상위 툴바*/}
        <Header
          className={'layout-header'}
          menuToggleEnabled
          userMenuItems={this.userMenuItems}
          userInfo={this.props.userInfo}
          selectLang={this.props.selectLang}
          toggleMenu={() =>
            this.setState({ menuOpened: !this.state.menuOpened })
          }
          title={returnTitle()}
          locale={this.props.locale}
          changeTitle={this.props.changeTitle}
          controlSideMenuTreeViewGet={this.props.controlSideMenuTreeViewGet}
        />
        <Drawer
          className={'layout-body' + this.menuPatch.cssClass}
          position={'before'}
          closeOnOutsideClick={this.closeDrawer}
          openedStateMode={menuMode}
          revealMode={menuRevealMode}
          minSize={minMenuSize}
          maxSize={150}
          shading={shaderEnabled}
          opened={menuOpened}
          template={'menu'}
        >
          <ScrollView className={'with-footer'}>
            <div className={'content'}>
              <Switch>
                {routes.map((item) =>
                  <Route
                    exact
                    key={item.path}
                    path={item.path}
                    render={() => {
                      if (item.path === '/home')
                        return <item.component data={this.props.menuData} changeTitle={this.props.changeTitle} controlSideMenuTreeViewGet={this.props.controlSideMenuTreeViewGet} />
                      else
                        return <item.component userInfo={this.props.userInfo} />
                    }}
                  />
                )}
                <Redirect to={'/home'} />
              </Switch>
            </div>
            <div className={'content-block'}>
              <Footer>
                {formatMessage('footer')}
              </Footer>
            </div>
          </ScrollView>
          <Template name={'menu'}>
            <SideNavigationMenu
              items={menuData}
              compactMode={!menuOpened}
              selectedItem={location.pathname}
              className={'dx-swatch-additional'}
              selectedItemChanged={(e) => { this.navigationChanged(e); this.clickSound(); }}
              openMenu={this.navigationClick}
              onMenuReady={this.menuPatch.onReady}
              controlSideMenuTreeViewSet={this.props.controlSideMenuTreeViewSet}
            />
          </Template>
        </Drawer>
      </div>
    );
  }

  componentDidMount() {
    subscribe(this.updateDrawer);
  }

  componentWillUnmount() {
    unsubscribe(this.updateDrawer);
  }

  closeDrawer = () => {
    if (!this.state.shaderEnabled) {
      return false;
    }

    this.setState({ menuOpened: false });
    return true;
  }

  updateDrawer = () => {
    this.setState({ ...this.drawerConfig });
  };

  get drawerConfig() {
    const isXSmall = sizes()['screen-x-small'];
    const isLarge = sizes()['screen-large'];

    return {
      menuMode: isLarge ? 'shrink' : 'overlap',
      menuRevealMode: isXSmall ? 'slide' : 'expand',
      minMenuSize: isXSmall ? 0 : 60,
      shaderEnabled: !isLarge
    };
  }

  get hideMenuAfterNavigation() {
    const { menuMode, temporaryMenuOpened } = this.state;
    return menuMode === 'overlap' || temporaryMenuOpened;
  }

  //메뉴선택 변경
  navigationChanged = event => {
    const path = event.itemData.path;
    const pointerEvent = event.event;

    // title 바꾸기
    this.props.changeTitle(event.itemData.menu_nm);

    if (path && this.state.menuOpened) {
      if (event.node.selected) {
        pointerEvent.preventDefault();
      } else {
        this.props.history.push(path);
      }

      if (this.hideMenuAfterNavigation) {
        this.setState({
          menuOpened: false,
          temporaryMenuOpened: false
        });
        pointerEvent.stopPropagation();
      }
    } else {
      pointerEvent.preventDefault();
    }
  }

  navigationClick = () => {
    this.setState(({ menuOpened }) => {
      return !menuOpened
        ? {
          temporaryMenuOpened: true,
          menuOpened: true
        }
        : {};
    });
  };
}

export default withRouter(SideNavOuterToolbar);

import 'devextreme/dist/css/dx.common.css';
import './themes/generated/theme.base.css';
import './themes/generated/theme.additional.css';
import React, { Component } from 'react';
import { HashRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import './App.scss';
import './dx-styles.scss';
import { LoginForm } from './components';
import {
  SideNavOuterToolbar as SideNavBarLayout,
  SingleCard
} from './layouts';
import { sizes, subscribe, unsubscribe } from './utils/media-query';
import localizer from './localization'
import { locale, loadMessages, formatMessage } from 'devextreme/localization';

const LoginContainer = ({ logIn, title, rememberCheck }) => <LoginForm onLoginClick={logIn} title={title} onRememberCheck={rememberCheck} />;

//로그인 페이지
const NotAuthPage = (props) => (
  <SingleCard>
    <Switch>
      <Route 
        exact
        path="/"
        render={() => <LoginContainer {...props} />} />
      <Redirect path="*" to="/" />
    </Switch>
  </SingleCard>
);

//메인화면 페이지
const AuthPage = (props) => (
  <SideNavBarLayout {...props} />
);

class App extends Component {
  constructor(props) {
    super(props);
    
    //window.localStorage.setItem('sv_address','https://localhost:44381'); //개발
    //window.localStorage.setItem('sv_address','http://192.168.0.6:7777'); //내부
    window.localStorage.setItem('sv_address','http://mes.dntinc.co.kr:8002'); //디앤티
    
    this.state = {
      address : window.localStorage.getItem('sv_address'),
      loggedIn: false,
      screenSizeClass: this.getScreenSizeClass(),
      UserInfo: null,
      navigation: [],
      locale: this.getLocale(),
      title: "DNT MES",
      remember: false,
      treeView: {}
    }

    this.initGlobalize();
    this.changeLocale = this.changeLocale.bind(this);
    locale(this.state.locale);
  }

  componentDidMount() {
    //주소표시줄 감추기위한
    window.addEventListener("load",function(){
      setTimeout(function(){
        window.scrollTo(0,1);
      }, 0)
    })

    const id = window.localStorage.getItem('id')
    if (id) {
      const data = window.localStorage.getItem('userdata');
      this.logIn(JSON.parse(data));
    }

    subscribe(this.screenSizeChanged);
  }

  componentWillUnmount() {
    unsubscribe(this.screenSizeChanged); 

  }

  render() {
    const { loggedIn } = this.state;

    return (
        <div className={`app ${this.state.screenSizeClass}`}>
          <Router>
            {loggedIn ? <AuthPage menuData={this.state.navigation} userInfo={this.state.UserInfo} selectLang={this.changeLocale}
              locale={this.state.locale} title={this.state.title} logout={this.logOut} changeTitle={this.changeTitle}
              controlSideMenuTreeViewSet={this.controlSideMenuTreeViewSet} controlSideMenuTreeViewGet={this.controlSideMenuTreeViewGet} />
              : <NotAuthPage logIn={this.logIn} title={this.state.title} rememberCheck={this.rememberCheck} />}
          </Router>
        </div>
    );
  }

  async menuData() {
    const userdata = this.state.UserInfo;
    //console.log(this.state.address);
    const response = await fetch(this.state.address + "/menu/MenuList/" + userdata['userid'], {headers:{'Content-Type':'application/x-www-form-urlencoded', 
    'Access-Control-Allow-Origin': '*'}});
    const data = await response.json();
    this.setState({ navigation: data });
  }

  //화면크기 가져오기
  getScreenSizeClass() {
    const screenSizes = sizes();
    return Object.keys(screenSizes).filter(cl => screenSizes[cl]).join(' ');
  }

  //크기변경
  screenSizeChanged = () => {
    this.setState({
      screenSizeClass: this.getScreenSizeClass()
    });
  }

  //로그인
  logIn = (data) => {
    if (!window.localStorage.getItem('id') && this.state.remember) {
      window.localStorage.setItem('id', data['userid']);
      window.localStorage.setItem('userdata', JSON.stringify(data));
    }
    this.setState({ UserInfo: data }, () => {
      this.menuData();
    });

    this.loginStatus(true);
  };

  //로그인기억 체크
  rememberCheck = () => {
    let _remember = this.state.remember;

    if (_remember === true)
      _remember = false;
    else
      _remember = true;

    this.setState({ remember: _remember })
  };

  //타이틀변경
  changeTitle = (_title) => {
    this.setState({ title: _title });
  }

  //로그인상태변환
  loginStatus = (bool) => {
    this.setState({ loggedIn: bool });
  }

  //로그아웃
  logOut = () => {
    this.setState({ title: "DNT MES"});
    this.setState({ remember: false });
    this.loginStatus(false);
    window.localStorage.clear();
  };

  //언어설정
  initGlobalize() {
    loadMessages(localizer.getCommon());
    loadMessages(localizer.getDictionary());
    loadMessages(localizer.getView());
  }

  getLocale() {
    const locale = window.localStorage.getItem('locale');
    return locale != null ? locale : 'ko';
  }

  setLocale(locale) {
    window.localStorage.setItem('locale', locale);
  }

  changeLocale(e) {
    this.setState({
      locale: e.value
    });
    this.setLocale(e.value);
    document.location.reload();
  }

  //SideMenuTreeView 저장된 객체 사용
  controlSideMenuTreeViewGet = () => {
    return this.state.treeView;
  }

  //SideMenuTreeView 객체 저장
  controlSideMenuTreeViewSet = (treeView) => {
    this.setState({ treeView: treeView });
  }
}

export default App;

import React from 'react';
import TextBox from 'devextreme-react/text-box';
import ValidationGroup from 'devextreme-react/validation-group';
import Validator, { RequiredRule } from 'devextreme-react/validator';
import Button from 'devextreme-react/button';
import CheckBox from 'devextreme-react/check-box';
import './login-form.scss';
import './../../utils/util'
import { postdata } from './../../utils/util';
//import appInfo from '../../app-info';

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      address : window.localStorage.getItem('sv_address'),
      login: '',
      password: ''
    };

    this.txtpwd = React.createRef();
    this.onLoginClick = this.onLoginClick.bind(this);
    this.onRememberCheck = this.onRememberCheck.bind(this);
  }

  render() {
    const { login, password } = this.state;
    return (
      <ValidationGroup>
        <div className={'login-header'}>
          <div className={'title'}>{this.props.title}</div>
          <div>Sign In to your account</div>
        </div>
        <div className={'dx-field'}>
          <TextBox
            id={'id'}
            value={login}
            onValueChanged={this.loginChanged}
            placeholder={'Login'}
            width={'100%'}
          >
            <Validator>
              <RequiredRule message={'Login is required'} />
            </Validator>
          </TextBox>
        </div>
        <div className={'dx-field'}>
          <TextBox
            id={'pwd'}
            mode={'password'}
            value={password}
            onValueChanged={this.passwordChanged}
            placeholder={'Password'}
            width={'100%'}
            ref={this.txtpwd}
          >
            <Validator>
              <RequiredRule message={'Password is required'} />
            </Validator>
          </TextBox>
        </div>
        <div className={'dx-field'}>
          <CheckBox
            defaultValue={false}
            onValueChanged={this.onRememberCheck}
            text={'Remember me'} />
        </div>
        <div className={'dx-field'}>
          <Button
            type={'default'}
            text={'Login'}
            onClick={this.onLoginClick}
            width={'100%'}
          />
        </div>
      </ValidationGroup>
    );
  }

  loginChanged = e => {
    this.setState({ login: e.value });
  };

  passwordChanged = e => {
    this.setState({ password: e.value });
  };

  onRememberCheck = () => {
    this.props.onRememberCheck();
  }

  onLoginClick = args => {
    if (!args.validationGroup.validate().isValid) {
      return;
    }
    //console.log(this.state)
    const { login, password } = this.state;
    let userinfo = {
      'user_id': login,
      'user_pw': password
    }

    // const result = postdata('/Login/check',userinfo)
    // console.log(result);

    fetch(this.state.address + '/Login/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(userinfo)
    })
    .then((response) => response.json())
    .then((data) => {
      //console.log(data);
      if (data.isLogin) {
        this.props.onLoginClick(data);
      } else {
        alert(data.msg);
        this.txtpwd.current.instance.focus();
      }
    });

    args.validationGroup.reset();
  };
}

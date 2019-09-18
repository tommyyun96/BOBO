import React, { Component } from 'react'
import { fire, getFireDB, pushMultipleDB, pushDB, setDB, deleteDB, download_picture} from '../config/fire.js';
import {Redirect} from 'react-router';
import {Button} from 'react-materialize'
import photo from './BOBO_logo.jpeg'
import {Textarea, TextInput} from 'react-materialize';

import "../css/login.css"
import Table from 'react-materialize/lib/Table';
import "../config/ID"
import { LOGIN_ID, setLoginId, getLoginId, setLoginName, getLoginName, logout } from '../config/ID';


export class LogIn extends Component {

  userList = null;

  state={
      redirect:false,
      target:"Loading...",
      url: "",
      mount:true,
      id : '',
      pw : '',
      login_error: false
  }

  constructor(props) 
  {
    super(props);
    logout();
    getFireDB('/User').then(
      result => {
        this.userList = result.val();
      }
    )
  }


  handleIdChange = e=> {
    this.setState({id: e.target.value});
  }

  handlePwChange = e=> {
    this.setState({pw: e.target.value});
  }

  tryLogin = () => {
    var typed_id = this.state.id;
    var typed_pw = this.state.pw;
    for(var key in this.userList)
    {
      var user = this.userList[key];
      if('login_id' in user)
      {
        if(user['login_id'] == typed_id && user['pw'] == typed_pw)
        {
          this.loginSuccess(user['id'], user['name']);
          return;
        }
      }
    }
    this.setState({login_error: true});
  }

  loginSuccess = (id, name) => {
    setLoginId(id);
    setLoginName(name);
    this.setState({target:'/studentList/',
                    redirect:true});
  }

  render() {
      if(this.state.redirect)
          return (<Redirect to={this.state.target}></Redirect>);
      return (
        <div style={{height: '100%', width: '100%', display: 'table', textAlign: 'center'}}>
          <div align='center' style={{display: "table-cell", verticalAlign:'middle'}}>
            <img src={photo} alt="photo" width='150px' height='150px' style={{}}></img>
            <Textarea placeholder="ID" style={{width: "60%"}}
                onChange={this.handleIdChange} value={this.state.id} />

            <TextInput password placeholder="*****" style={{width: "60%"}}
                onChange={this.handlePwChange} value={this.state.pw} />
                
            {this.state.login_error? <div style={{width: '60%', textAlign:'left', fontSize:'12px',
                                                  color:'darkred', lineHeight:'13px', letterSpacing:'1px'}}>
                                      <span>Wrong id or pw.</span>
                                      <br/>
                                      <span>Try sample (ID: test, PW: 1234)</span>
                                    </div> 
                                : <span></span>}
            <Button id='login-button' onClick={this.tryLogin}>LogIn!</Button>
          </div>
        </div>
      );
  }
}

export default LogIn
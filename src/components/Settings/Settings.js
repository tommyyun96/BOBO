import React, { Component } from 'react'
import '../../css/Settings/Setting.css'
import Topbar from '../Topbar';
import Demographic from '../Students/Demographic'
import { fire, getFireDB, pushMultipleDB, pushDB, setDB, deleteDB, download_picture} from '../../config/fire';
import { getLoginId } from '../../config/ID';
import {Link} from 'react-router-dom'
import {Checkbox, Icon, Button} from 'react-materialize'

export class Settings extends Component {
  userList = null;

  state={
    loaded: false,
    Notes: [],
    Class: "Loading...",
    Age: "Loading...",
    Tel: "Loading...",
    url: "",
    mount:true
  }

  getUserInfo(id) {
    for(var key in this.userList) {
      var args = this.userList[key];
      if(args['id']==id) {
        return args;
      }
    }
  }

  constructor(props) 
  {
    super(props);
    getFireDB('/User').then(
      result => {
        this.userList = result.val();
        var args = this.getUserInfo(getLoginId());
        this.setState({...this.state, Name:args['name'], Class:args['class'], Age:args['age'], Tel: args['tel']});
        download_picture(args['picture'], this);
      }
    )
  }


  render() {
    return (
      <div className="content InstructorsNoteContent" style={{textAlign: "center"}}>
        <div>
          <Topbar name="My Page" showBack={false}></Topbar>
        </div>
        <div className="NoteContainer">
          <hr style = {{width: "100%", border:'none', backgroundColor:'darkgray', height:'2px'}}/>
          <Demographic Name={this.state.Name} Age={this.state.Age} Tel={this.state.Tel} Class={this.state.Class} ImageURL={this.state.url}/>
          <hr style = {{width: "100%", border:'none', backgroundColor:'darkgray', height:'2px'}}/>
          <div className="ButtonContainer">
            <Link to={"/donation"}>
              <Button className="Button">Update profile</Button>
            </Link>
            <Link to={"/"}>
              <Button className="Button">Logout</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

export default Settings

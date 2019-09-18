import React, { Component } from 'react'
import Topbar from '../Topbar';
import '../../css/Students/StudentProfile.css'
import '../../css/Students/InstructorsNote.css'
import {Redirect} from 'react-router';
import Demographic from './Demographic'
import {Textarea} from 'react-materialize';
import {Link} from 'react-router-dom';
import {Button} from 'react-materialize'
import '../../css/Common.css'
import { fire, getFireDB, pushMultipleDB, pushDB, setDB, deleteDB, updateChild, download_picture} from '../../config/fire';
import { getLoginId } from '../../config/ID';

export class InstructorsNoteAddModify extends Component {

  state = {
    textcontent : "",
    loaded: false,
    Class: "Loading...",
    Age: "Loading...",
    Tel: "Loading...",
    url: "",
    mount:true
  }


  constructor(props) 
  {
    super(props);
    getFireDB('/User').then(
      result => {
        var userList = result.val();
        var args;
        for(var key in userList) {
          args = userList[key];
          if(args['id']==this.props.match.params.student_id) {
            break;
          }
        }
        console.log(args);
        this.setState({...this.state, Name:args['name'], Class:args['class'], Age:args['age'], Tel: args['tel']});
        download_picture(args['picture'], this);
      }
    )
    getFireDB('/Note/'+this.props.match.params.student_id+'/'+getLoginId()).then(
      result => {
        console.log(result.val());
        this.setState({textcontent: result.val(), loaded: true})
      }
    )
  }

  handlecontentChange = e=> {
    this.setState({textcontent: e.target.value});
  }

  confirm = ()=> {
    if(this.state.textcontent == null || this.state.textcontent.length!=0)
    {
      updateChild('/Note/'+this.props.match.params.student_id, getLoginId(), this.state.textcontent);
      return;
    }
    else
    {
      deleteDB('/Note/'+this.props.match.params.student_id+'/'+getLoginId());
    }
  }

  render() {
    return (
    <div style = {{width:"100%"}} className="content InstructorsNoteContent">
        <div>
            <Topbar name="Instructor's Note" showBack={true} 
                  backTo = {"/BOBO/#/studentProfile/instructorsNote/"+
                                this.props.match.params.student_id}></Topbar>
        </div>
        <div className="NoteContainer">
          <hr style = {{width: "100%", border:'none', backgroundColor:'darkgray', height:'2px'}}/>
          <Demographic Name={this.state.Name} Age={this.state.Age} Tel={this.state.Tel} Class={this.state.Class} ImageURL={this.state.url}/>
          <hr style = {{width: "100%", border:'none', backgroundColor:'darkgray', height:'2px'}}/>
          {this.state.loaded?
            <div>
              <div style={{width: "100%", display: "table", textAlign:"center"}}>
                <Textarea placeholder="Write note on this student" style={{width: "90%", display: "table-cell"}}
                  onChange={this.handlecontentChange} value={this.state.textcontent} />
              </div>
              <Link to={"/studentProfile/instructorsNote/"+
                          this.props.match.params.student_id}>
                <Button className="CommonButton" style={{marginLeft: "20px"}} >
                  Cancel
                </Button>
                <Button className="CommonButton" style={{marginRight: "20px", float:"right"}} onClick={this.confirm}>
                  Confirm
                </Button>
              </Link>
            </div> : (<div  style={{textAlign:"center", fontSize:"20px", fontWeight:"bold"}}>Loading...</div>)
          }
        </div>
    </div>
    );
  }
}

export default InstructorsNoteAddModify
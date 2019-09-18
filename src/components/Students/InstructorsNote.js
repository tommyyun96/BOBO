import React, { Component } from 'react'
import Topbar from '../Topbar';
import '../../css/Students/StudentProfile.css'
import '../../css/Students/InstructorsNote.css'
import {Redirect} from 'react-router';
import Demographic from './Demographic'
import Popup from 'reactjs-popup'
import {Checkbox, Icon, Button} from 'react-materialize'
import {Link} from 'react-router-dom'
import '../../css/Common.css'
import { fire, getFireDB, pushMultipleDB, pushDB, setDB, deleteDB, download_picture} from '../../config/fire';
import { ENGINE_METHOD_NONE } from 'constants';
import { getLoginId } from '../../config/ID';

class DeletePopup extends Component {

  state={
    checked:false,
    open:false
  }

  check =(event)=> {
    this.setState({checked: !this.state.checked});
  }

  deleteNote = () => {
    console.log('/Note/'+this.props.student_id+'/'+getLoginId());
    deleteDB('/Note/'+this.props.student_id+'/'+getLoginId());
    window.location.reload();
  }

  closing = () => {
    this.setState({checked: false})
  }

  /*<Icon className="menu-icon" medium='true'>delete_forever</Icon>*/
  render() {
    return (
      <Popup contentStyle={{width: '80%'}} trigger={<div style={{display:"inline-block"}}><Icon className="InstructorNoteIcon" small={true}>delete_forever</Icon></div>} 
                position="top right" onClose={this.closing}>
        { close => (
          <div className="NoteDeleteContainer">
              <span className="NoteDeleteTitle">
                  Delete Note
              </span>
              <br/>
                <Checkbox className = "NoteDeleteCheckbox" onChange={this.check} label="" value=""/>
              <span className="NoteDeleteWarningText">I hereby understand that I </span>
              <span className="NoteDeleteWarningTextImportant">cannot recover</span>
              <span className="NoteDeleteWarningText"> the deleted note.</span>
              <br/>
              <br/>
                <button className="close pinkcancelbutton" onClick={close}>
                    No
                </button>
              {this.state.checked? (
                <button className="close pinkcancelbutton" style={{float:"right"}} onClick={this.deleteNote}>
                    Yes
                </button>
              ) : null}
          </div>)
        }
      </Popup>
    )
  }
}

class NamePopup extends Component {
  
  render() {
    return (
      <Popup contentStyle={{width: '50%'}} 
              trigger={<span className="NoteInstructor" style={{backgroundColor:'#fa807266'}}> {this.props.name}</span>} 
                position="top left" onClose={this.closing}>
        { close => ( 
            <div style={{fontWeight:'bold', lineHeight:'160%'}}>
              <span>{this.props.name}</span>
              <br></br>
              <span>Tel: <u><a href={"tel:"+this.props.tel}>{this.props.tel}</a></u></span> 
            </div>
          )
        }
      </Popup>
    )
  }
}

export class InstructorsNote extends Component {

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
        var args = this.getUserInfo(this.props.match.params.student_id);
        this.setState({...this.state, Name:args['name'], Class:args['class'], Age:args['age'], Tel: args['tel']});
        download_picture(args['picture'], this);
      }
    )
    this.setNotes();
  }

  setNotes = ()=>{
    getFireDB('/Note/'+this.props.match.params.student_id).then(
      result => {
        let notes = [];
        let notesRaw = result.val();
        for(var key in notesRaw) {
          notes.push({Instructor: key, Content: notesRaw[key]});
        }
        this.setState({Notes: notes, loaded:true});
      }
    )
  }

  renderNoteList = () => {
      if(this.state.loaded==false) {
        return (<div  style={{textAlign:"center", fontSize:"20px", fontWeight:"bold"}}>Loading...</div>)
      }

      var myNoteExists = false;
      var i =0;
      var noteList = this.state.Notes.map(_note => {
        if(_note.Instructor!==getLoginId())
        {
            var userInfo = this.getUserInfo(_note.Instructor);
            return <Note student_id={this.props.match.params.student_id} 
                          instructor_name={userInfo['name']} instructor_tel={userInfo['tel']}
                          content={_note.Content} key={i++}/>
        }
        else
        {
            myNoteExists = true;
            var userInfo = this.getUserInfo(_note.Instructor);
            return <MyNote instructor_name={userInfo['name']} student = {this.props.match.params.student_id} content={_note.Content} key={i++}/>
        }
      });

      if(!myNoteExists)
          noteList.push(
              <div className="AddButtonContainer" key = {i++}>
                <Link to={"/studentProfile/instructorsNoteAddModify/"+this.props.match.params.student_id}>
                  <Button className=" CommonButton">Add Note!</Button>
                </Link>
              </div>
          );
      return <div>{noteList}</div>;
  }

  render() {
      if(this.state.redirect)
          return (<Redirect to={this.state.target}></Redirect>);

      return (
      <div style = {{width:"100%"}} className="content InstructorsNoteContent">
          <div>
              <Topbar name="Instructor's Note" showBack={true} backTo = {"/BOBO/#/studentProfile/main/"+this.props.match.params.student_id}></Topbar>
          </div>
          <div className="NoteContainer">
            <hr style = {{width: "100%", border:'none', backgroundColor:'darkgray', height:'2px'}}/>
            <Demographic Name={this.state.Name} Age={this.state.Age} Tel={this.state.Tel} Class={this.state.Class} ImageURL={this.state.url}/>
            <hr style = {{width: "100%", border:'none', backgroundColor:'darkgray', height:'2px'}}/>
            {this.renderNoteList()}
          </div>
      </div>
      );
  }
}

class Note extends Component {
    render() {
        return (
            <div className="Note">
                <span className="NoteInstructor">{'• '}</span>
                <NamePopup id={getLoginId()} name={this.props.instructor_name} tel={this.props.instructor_tel}></NamePopup>
                <span className="NoteInstructor">{'\'s Note'}</span>
                <br/>
                <span className="NoteContent">&nbsp;&nbsp;&nbsp;{'- '+this.props.content}</span>
            </div>
        );
    }
}

class MyNote extends Component {
    render() {
        return (
            <div>
                <div className="Note">
                    <div className="MyNoteButtonContainer">
                      <Link to={"/studentProfile/instructorsNoteAddModify/"+this.props.student}>
                        <Icon className="InstructorNoteIcon" small={true}>edit</Icon>
                      </Link>
                      <DeletePopup student_id={this.props.student}/>
                    </div>
                    <span className="NoteInstructor">{'• My Note'}</span>
                    <br/>
                    <div style={{marginLeft:"20px"}}>
                      <span className="NoteContent">{'- '+this.props.content} </span>
                    </div>
                </div>
            </div>
        );
    }
}

export default InstructorsNote
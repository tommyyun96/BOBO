import React, { Component } from 'react'
import {Row, Col, Autocomplete, Chip,Button,TextInput,Icon, Textarea,Checkbox} from 'react-materialize';
import Topbar from "../Topbar";
import '../../css/ClassRecord.css';
import '../../css/Common.css';
import Popup from "reactjs-popup";
import {Link} from 'react-router-dom';
import { fire, getstorage, getFireDB,getFireDB_arr, pushDB,pushDB_wait, upload_file, upload_file2} from '../../config/fire';
import {Redirect} from 'react-router';
import * as firebase from 'firebase'
import { resolve } from 'url';

import {getLoginName, checkLogin} from '../../config/ID'



const PopupExample =  () => (
  <CancelPopup trigger={<Button className="pinkcancelbutton buttonleft" >Cancel</Button>} position="top left">
    {close => (
      <div>
        <p>Are you sure to cancel?<br></br><br></br></p>

          <Button className="close pinkcancelbutton" onClick={close}>No</Button>
          <Link to="/studentList/tommy11">
            <Button className="close pinkcancelbutton" style={{float:"right"}} onClick={ClassRecord.doneonClick}>
              Yes
            </Button>
          </Link>
      </div>
    )}
  </CancelPopup>
)



const INITIAL_STATE = {
  InstructorID:getLoginName(),
  // InstructorID:'teacher101',
  StudentID: '',
  Studentname: '',
  Text:'',
  file:null,
  student:[],
  autocomplete_student:[],
  autocompleteData: {Test:null, Test2:null},
  Users:[],
  Date:'',
  redirectTo: "",
  disabled: false,
  Hashtag:[],
  showmodifiy:false,
  photos:[],
  files:[],
  temparr:[],
  showpictures:false,
  fromprofile:false,

};

export class ClassRecord extends Component {
  constructor(props){
    super(props);
    fire();
    this.state={...INITIAL_STATE}
    this.setRef = ref => {
      this.file = ref;
    }
  }

  componentDidMount = () => {
    document.getElementById("inputcamera").value = "";
    document.getElementById("inputgallery").value = "";
    console.log("didmount")

    getFireDB_arr('User/',this,'autocomplete_student','type','parent');
    getFireDB()
    .then(res =>{
      let DB = res.val();
      var Users = [];
      for( var key in DB.User ) Users.push(DB.User[key]);
      var Parents = Users.filter(_mapElem => {
        return _mapElem.type == 'parent';
      }).map(_mapElem => {
        return _mapElem.name;
      });
      var autocompleteData = Parents.reduce( (_acc, _user) => {
        return {..._acc, [_user]:null};
      }, {});
      // this.setState({...this.state, Users, autocompleteData, showAutocomplete:true});
          
      if(window.location.hash.indexOf("?")!=-1)
      {
        var temparray=window.location.hash.split("?");
        for (var index in Users) 
        {
          
          if(Users[index].id===Number(temparray[1]))
          {

            this.setState({...this.state,InstructorID:getLoginName(), Text:"",Hashtag:[],photos:[], temparr:[],Users, autocompleteData, showAutocomplete:true, Studentname:Users[index].name,StudentID:Number(temparray[1]),fromprofile:true}, function() {

              this.renderChips();

            });
            var select_parent = document.getElementsByClassName("studentnameclass")[0];
            select_parent.value = Users[index].name;
          }
        }
      }
      else
      {
        this.setState({...this.state, InstructorID:getLoginName(),Text:"", Hashtag:[],photos:[],temparr:[],Users, autocompleteData, showAutocomplete:true});
      }
    });
            
  }
  

  
  handlenameChange = e =>
  {
    
    this.setState({...this.state, Studentname : e.target.value});
  }
  handlecontentChange = e =>
  {
    var Studentname = this.state.Studentname;
    this.setState({...this.state, Text : e.target.value},
      () => {
        // var select_parent = document.getElementById("studentname");
        var select_parent = document.getElementsByClassName("studentnameclass")[0];
      });



  }
  handlefileChange(e) {

  this.setState({...this.state, file:e.target.files, showpictures:true});
  }
  onAutocomplete = (_userName) => {
    var parent = this.state.Users.find(_user => _user.name === _userName);
    
    this.setState({...this.state, StudentID:parent.id,Studentname:_userName}, () => {
      var select_parent = document.getElementsByClassName("studentnameclass")[0];
      select_parent.value = _userName;
    });
  }

  onAutocompleteChange =  (e) => {
    this.setState({...this.state, Studentname : e.target.value});

  }

  renderChips = () => {
    if(this.state.fromprofile==true)
    {
      return <Chip 
      className="studentnameclass"
      placeholder="Enter name"
  
      ref={_input => this.inputElementname = _input}
      options={{
       data: [{tag: this.state.Studentname}],
      
      autocompleteOptions: 
      {
        data: this.state.autocompleteData, onAutocomplete:this.onAutocomplete,
        limit: Infinity,
        minLength: 1,
  
      },
      placeholder:"Enter name",
      secondaryPlaceholder:"+ name",
    }}
      value={this.state.Studentname}
      onChange={this.onAutocompleteChange}
      icon="search" s={12}/>
    }
    else
    {
      var _d = this;
      return                 <Chip 
      className="studentnameclass"
      placeholder="Enter name"
      ref={_input => this.inputElementname = _input}
      options={{     

      autocompleteOptions: 
      {
        data: this.state.autocompleteData, onAutocomplete:this.onAutocomplete,
        limit: Infinity,
        minLength: 1,
  
      },
      placeholder:"Enter name",
      secondaryPlaceholder:"+ name",
    }}
      value={this.state.Studentname}
      onChange={this.onAutocompleteChange}
      icon="search" s={12}/>
    }

  }

  
  renderPictures = () => {
    var fromfile = document.getElementById("inputcamera");
    var fromgallery = document.getElementById("inputgallery");
    var temparr = []
    if(fromfile.files!=null)
    {
      console.log("cmam")
      Array.prototype.forEach.call(fromfile.files, function(file) { 
        temparr.push(file);
        console.log(file)
      });

    }
    
    if(fromgallery.files!=null)
    {
      console.log("galll");
      Array.prototype.forEach.call(fromgallery.files, function(file) { 
        temparr.push(file);
        console.log(file);
      });

    }


    return temparr.map(file => {
      return <img className="UploadRecordImage" src={URL.createObjectURL(file)} alt="photo" border="3px"  align='center'></img>
    })

  }
  doneonClick = async () =>
  {
    var obj = {...this.state};
    var _this_ = this;
    var another = await new Promise((_res, _rej) => {
      new Promise(function(__res, __rej){
        var eval_table = document.getElementsByClassName("chip");
        __res(another);
      }).then(function(result){
          _res(result);
      })
    })
    if(document.getElementsByClassName("chip").length==0) {
      window.M.toast({
        html: "Please write students' name",
        displayLength: 3000
      });
      return;
    }
    
    if(obj.Text==""&&obj.file==null)
    {
      window.M.toast({
        html: "Please write content",
        displayLength: 3000
      });
      return;
    }


    
    var rawdate = new Date();
    var rawmonth = rawdate.getMonth() + 1;
    var datestring = String(rawdate.getFullYear()) +"/"+ String(rawmonth)+"/" + String(rawdate.getDate()) ;
    var dirname = rawdate.getTime();
    obj.Date = datestring
    
    delete obj.autocomplete_student;
    delete obj.redirectTo;
    // delete obj.Users;
    delete obj.showAutocomplete;
    delete obj.disabled;

    var regex = /(?:^|\s)(?:#)([a-zA-Zㄱ-ㅎ가-힣\d]+)/gm;
    var match;
    
    obj.Hashtag = [];

    while ((match = regex.exec(obj.Text))) {
        obj.Hashtag.push(match[1]);
    }



    var forwait = await new Promise((_resolve, _reject) => {
      var completed=0;
      var eval_table = document.getElementsByClassName("chip");
      Array.prototype.forEach.call(eval_table, function(name) { 
        
        obj.temparr.push(name.outerText);
      });
      
      if(obj.file)
      {
        var fromcamera = document.getElementById("inputcamera");
        var fromgallery = document.getElementById("inputgallery");
        
        
        window.M.toast({
          html: `<div> <span id="filenameupload"></span> Uploading... <span id="progress">0</span>% done</div>`,
          displayLength: 100000
        });
        
        Array.prototype.forEach.call(fromcamera.files, function(file) { 
          
          // let target = getstorage().ref('ClassRecords/'+dirname+'/');
          let target = getstorage().ref('ClassRecords/'+dirname+'/'+file.name);
          console.log(dirname);
          var uploadTask = target.put(file);
          uploadTask.on('state_changed', function(snapshot){
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            document.getElementById("filenameupload").innerHTML = file.name;
            document.getElementById("progress").innerHTML = Math.floor(progress);
            // console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                // console.log('Upload is paused');
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                // console.log('Upload is running');
                break;
            }
          }, function(error) {
            // Handle unsuccessful uploads
          }, function() {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
              obj.photos.push(downloadURL);
              new Promise(function(__resolve, __reject){
                completed++;
                __resolve(completed);
              }).then(function(result){
                if(result==fromcamera.files.length+fromgallery.files.length)
                {
                  console.log("resolve in cam",result,completed);
                  _resolve(forwait);
                }
              })
            });
        
          });
        });
        Array.prototype.forEach.call(fromgallery.files, function(file) { 

          // let target = getstorage().ref('ClassRecords/'+dirname+'/');
          let target = getstorage().ref('ClassRecords/'+dirname+'/'+file.name);
          var uploadTask = target.put(file);
          uploadTask.on('state_changed', function(snapshot){
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            document.getElementById("filenameupload").innerHTML = file.name;
            document.getElementById("progress").innerHTML = Math.floor(progress);
            // console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                // console.log('Upload is paused');
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                // console.log('Upload is running');
                break;
            }
          }, function(error) {
            // Handle unsuccessful uploads
          }, function() {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
              obj.photos.push(downloadURL);
              new Promise(function(__resolve, __reject){
                completed++;
                __resolve(completed);

              }).then(function(result){
                if(result==fromcamera.files.length+fromgallery.files.length)
                {
                  console.log("resolve in gall",result,completed);
                  _resolve(forwait);
                }
              })
            });
        
          });
        });
      }
      else
      {
        _resolve(forwait);
      }

      });
    delete obj.showmodifiy;
    delete obj.fromprofile;
    delete obj.showpictures;
    pushDB_wait("Record", obj, forwait, another)
    .then(_res => {
      window.M.Toast.dismissAll();
      this.inputElementcontent.value= "";
      this.inputElementname.value="";
      this.setState({...this.state,redirect: true, redirectTo: "/studentProfile/classRecord/"+obj.StudentID });
      // this.setState({...this.state,redirect: true, redirectTo: "/studentList/tommy11" });
    });



  }
  
  flipbool = () => {
    if(this.state.showAutocomplete)
      this.setState({...this.state, showAutocomplete:false});
    else
      this.setState({...this.state, showAutocomplete:true});
  }

  fileclick = () => {

    this.inputElementfile.click();      
    
  }
  galleryclick = () => {
    this.inputElementgallery.click();
  }
  cameraclick = () => {
    this.inputElementcamera.click();
  }

  
  render() {
    checkLogin();
    if(this.state.redirect)
    return <Redirect to={this.state.redirectTo}/>

    return (
        <div className="content">
          <Topbar name="Upload Class Record" showBack={false} backTo="/BOBO"/>    

          <Row id="parent-search-row">
          <Col s={12}>
            {this.state.showAutocomplete ? this.renderChips()
              //   <Chip 
              //   className="studentnameclass"
              //   placeholder="Enter name"

              //   ref={_input => this.inputElementname = _input}
              //   options={{
              //    data: this.state.fromprofile ? [{tag: this.state.Studentname}] : [{tag: '1'}] ,
                
              //   autocompleteOptions: 
              //   {
              //     data: this.state.autocompleteData, onAutocomplete:this.onAutocomplete,
              //     limit: Infinity,
              //     minLength: 1,

              //   },
              //   placeholder:"Enter name",
              //   secondaryPlaceholder:"+ name",
              // }}
              //   value={this.state.Studentname}
              //   onChange={this.onAutocompleteChange}
              //   icon="search" s={12}/>
                :<span></span>     
            }

          </Col>
        </Row>
        <div className="buttons">
          <form action="#" >
              {/* <div className="btn pinkbutton buttonleft" onClick={this.fileclick}>
                <input ref={_input => this.inputElementfile = _input}  id="inputfile" type="file" onChange={this.handlefileChange.bind(this)} multiple name="File"/>
                <label className="bigfont">File</label>
              </div>*/}           <div className="btn pinkbutton" onClick={this.galleryclick}> 
                <input ref={_input2 => this.inputElementgallery = _input2} type="file" accept="image/*"  onChange={this.handlefileChange.bind(this)} multiple id="inputcamera" capture="camera"/>
                <label className="bigfont">Camera</label>
              </div>           <div className="btn pinkbutton" onClick={this.cameraclick}>
                <input ref={_input3 => this.inputElementcamera = _input3} type="file" accept="image/*" onChange={this.handlefileChange.bind(this)} multiple id="inputgallery"/>
                <label className="bigfont">Gallery</label>
              </div>

              
            </form>
          </div>

        <div align='center'>
            { this.state.showpictures?

              this.renderPictures():<span></span>
              }
        </div>
          
          <div className="bottommargin">
            <Textarea placeholder="Write class records..
              #classs #amy"
              onChange={this.handlecontentChange}  ref={_input => this.inputElementcontent = _input} value={this.state.Text}/>
              <div className="row">
                <PopupExample/>
                <Button waves="light" onClick={this.doneonClick.bind(this)}
                  className="buttonright pinkcancelbutton">
                  Done
                </Button>
              </div>
            </div>
        </div>
    )
  }
}
export default ClassRecord;

class CancelPopup extends Component {
  state={
    checked:false,
    open:false
  }

  check =(event)=> {
    this.setState({checked: !this.state.checked});
  }


  closing = () => {
    this.setState({checked: false})
  }

  /*<Icon className="menu-icon" medium='true'>delete_forever</Icon>*/
  render() {
    return (
      <Popup contentStyle={{width: '40%'}} trigger={<Button className="pinkcancelbutton buttonleft" >Cancel</Button>}
                position="top left" onClose={this.closing}>
        { close => (
          <div className="NoteDeleteContainer">
              <br/>
                <Checkbox className = "NoteDeleteCheckbox" onChange={this.check} label="" value=""/>
              <span className="NoteDeleteWarningText"> Are you sure to cancel?</span>
              <br/>
              <br/>
                <button className="close pinkcancelbutton" onClick={close}>
                    No
                </button>
              {this.state.checked? (
                          <Link to="/studentList/tommy11">
                <button className="close pinkcancelbutton" style={{float:"right"}} onClick={ClassRecord.doneonClick}>
                    Yes
                </button></Link>
              ) : null}
          </div>)
        }
      </Popup>
    )
  }
}
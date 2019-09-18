import React from 'react';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';
import "materialize-css/dist/css/materialize.css"
import "materialize-css/dist/js/materialize.min.js"

import '../css/App.css'

import Menu from './Menu';
import StudentList from "./Students/StudentList";
import UploadClassRecord from "./UploadClassRecord/ClassRecord";
import NoticeBoard from "./Notices/BoardList";
import Settings from "./Settings/Settings";
import Board from './Notices/Board';
import AddBoard from "./Notices/AddBoard";
import Notice from './Notices/Notice';
import AddNotice from './Notices/AddNotice';
import StudentProfile from "./Students/StudentProfile";
import InstructorsNote from "./Students/InstructorsNote";
import ClassRecord from "./Students/ClassRecord";
import ClassRecordFiltered from "./Students/ClassRecordFiltered";
import EditClassRecord from "./Students/EditClassRecord";
import InstructorsNoteAddModify from './Students/InstructorsNoteAddModify';
import LogIn from './LogIn';
import Donation from './Donation';

import { fire} from '../config/fire';
function App() {
  fire();

  return (
    <Router>
      <div className="container">
        <Route path="/studentList/" component={StudentList}/>
        <Route path="/studentProfile/main/:student_id" component={StudentProfile}/>
        <Route path="/studentProfile/instructorsNote/:student_id" component={InstructorsNote}/>
        <Route path="/studentProfile/instructorsNoteAddModify/:student_id" component={InstructorsNoteAddModify}/>
        <Route path="/studentProfile/classRecord/:student_id" component={ClassRecord}/>
        <Route path="/studentProfile/classRecordFiltered/:student_id/:hash" component={ClassRecordFiltered}/>
        <Route path="/studentProfile/editClassRecord/:key" component={EditClassRecord}/>
        <Route path="/classRecord" component={UploadClassRecord}/>
        <Route exact path="/addBoard" component={AddBoard}/>
        <Route exact path="/board" component={NoticeBoard}/>
        <Route exact path="/board/:id/addNotice" component={AddNotice}/>
        <Route exact path="/board/:id" component={Board}/>
        <Route exact path="/board/:id/notice/:id" component={Notice}/>
        <Route exact path="/settings" component={Settings}/>
        <Route exact path="/donation" component={Donation}/>
        <Switch>
          <Route exact path="/" component={LogIn}/>
          <Route exact path="*" component={Menu}/>
        </Switch>
      </div>
    </Router>

  );
}

export default App;

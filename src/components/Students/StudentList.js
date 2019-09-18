import React, { Component } from 'react';
import { Redirect } from 'react-router';
import {Link} from 'react-router-dom'
import Popup from 'reactjs-popup'
import { Row, Col, Collection, CollectionItem, Autocomplete, Button, Dropdown, Select, Divider } from 'react-materialize';

import Topbar from "../Topbar";
//import StudentListItem from './StudentListItem';
//import ClassListItem from './ClassListItem';
import { fire, getFireDB_arr, getFireDB, download_picture, getPictureURL } from '../../config/fire'
import { getLoginName, getLoginId, checkLogin } from '../../config/ID'
import "../../css/Students/StudentList.css"
import photo from './basic.png'

export class StudentList extends Component {

  state = {
    Students: [],
    CurrentUser: {
      id: 1,
      name: "Juho Kim"
    },
    Users: [],
    autocompleteData: { Test: null, Test2: null },
    StudentFiltered: [],
    ClassTable: [],
    curr_instructor: this.props.match.params.instructor_id
  }

  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    getFireDB_arr('User/', this, 'Students', 'type', 'parent');
    
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
      this.setState({...this.state, Users, autocompleteData, showAutocomplete:true});
    });

    getFireDB('Class/').then (
      result => {
        this.setState({ ...this.state, ClassTable: result.val() });
      }
    )
  }

  onAutocomplete = (_studentName) => {

    var student = this.state.Users.find(_student => _student.name === _studentName)
    this.setState({ ...this.state, redirect: true, redirectTo: "/studentProfile/main/"+ student.id  });
  }

  onClassSelection = e => {
    var s = document.getElementById("selection")
    var selectedClass = s.options[s.selectedIndex].text
    var StudentFiltered = this.state.Students.filter(_student => {
      return _student.class === selectedClass
    })
    this.setState({ ...this.state, selectedClass, StudentFiltered, showSelectClass: true });
  }


  renderStudentList = () => {
    var studentLists = this.state.showSelectClass ? this.state.StudentFiltered : this.state.Students;
    studentLists.sort(function(_a, _b) {
      return _a.name > _b.name ? 1 : -1;
    });
    return studentLists.map(_student => {
      return <StudentListItem data={_student} instructor={this.state.curr_instructor} />
    });
  }

  renderStudentFilteredList = () => {
    return this.state.StudentFiltered.map(_student => {
      return <StudentListItem data={_student} instructor={this.state.curr_instructor} />
    });
  }

  renderClassList = () => {
    return this.state.ClassTable.map(_class => {
      return <ClassListItem data={_class}/>
    });
  }

  render() {
    checkLogin()
    if (this.state.redirect)
      return <Redirect to={this.state.redirectTo} />

    return (
      <div className='content student-list-content'>
        <div><Topbar id='class-record-topbar' name="Student List" /> </div>
        { /* search */}
        <Row id="student-list-search-row">
          <Col s={12}>
            {this.state.showAutocomplete ?
              <Autocomplete
                options={{ data: this.state.autocompleteData, onAutocomplete: this.onAutocomplete }}
                placeholder="Search by student name"
                icon="search"
                s={12} /> :
              <span></span>
            }
          </Col>
        </Row>

        {/* select class */}
        <Row id="select-class-row" style={{ alignItems: 'center' }}>
          <Col s={12}>
            <Select
              id='selection'
              onChange={this.onClassSelection}
              style={{ width: '100%' }}>
              <option value="" disabled selected>Select a class</option>
              {this.renderClassList()}
            </Select>
          </Col>
        </Row>

        {/* show student list */}
        <Row id="show-student-list-row">
          <Col className="showStudentList" s={12}>
            <Collection>
              {this.renderStudentList()}
            </Collection>
          </Col>
        </Row>
      </div>
    )
  }
}


class ClassListItem extends Component {
  render() {
    return (
      <option value={this.props.data}>
        {this.props.data}
      </option>
    )
  }
}


class StudentListItem extends Component {
  constructor(props){
    super(props);
  }
  
  render() {
    return (
      <CollectionItem className="student" href={"/BOBO/#/studentProfile/main/" +this.props.data.id}>
        <Row className="studentChild" style={{ marginTop: '0px', marginBotton: '0px', height: '70px' }}>
          {/* profile image */}
          <Col s={3} style={{ alignItems: 'center' }}>
            {/* <img className="profileImage" id="profile" src={purl} alt="photo" width='70px' height='70px'></img> */}
            <img className="profileImage" src={this.props.data.image_url} alt="photo" width='70px' height='70px'></img>
          </Col>
          {/* name and class */}
          <Col className="studentItem" s={9} >
            <div className="studentItemChild">
              <div className='studentName'>{this.props.data.name}</div>
              <br></br>
              {this.props.data.class}
            </div>
          </Col>
        </Row>
      </CollectionItem>
    )
  }
}


export default StudentList
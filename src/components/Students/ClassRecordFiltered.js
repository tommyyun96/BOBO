import React, { Component } from 'react'
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom'
import Popup from 'reactjs-popup'

import { Row, Col, Collection, CollectionItem, Button, Icon, Checkbox } from 'react-materialize';
import { fire, getFireDB, pushMultipleDB, pushDB, setDB, deleteDB, download_picture, getPictureURL } from '../../config/fire';
import Topbar from '../Topbar';
import Demographic from './Demographic'
import { getLoginName, getLoginId, checkLogin } from '../../config/ID'
//import RecordListItem from './RecordListItem';

import '../../css/Students/StudentProfile.css'
import "../../css/Students/ClassRecord.css"
import '../../css/Common.css'
import { type } from 'os';
import { tsConstructSignatureDeclaration } from '@babel/types';

export class ClassRecordFiltered extends Component {

  state = {
    validRecords: [],
    loaded: false,
    Name: "Loading...",
    Class: "Loading...",
    Age: "Loading...",
    Tel: "Loading...",
    url: "",
    records: [],
    mount:true,
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
        // console.log(args);
        this.setState({...this.state, Name:args['name'], Class:args['class'], Age:args['age'], Tel: args['tel']});
        download_picture(args['picture'], this);
      }
    )

    getFireDB('Record/').then (
      result => {
        let DB = result.val();
        var records = [];
        for( var _key in DB ) 
        {
          var map = DB[_key];
          map['key'] = _key;
          records.push(map);
        }
        records.sort(function(_a, _b) {
          return _a.date > _b.date ? 1 : -1;
        });
      var validRecords_tmp = records.filter(_mapElem => {
        return String(_mapElem.StudentID) === this.props.match.params.student_id && _mapElem.Hashtag != null;
      });
      var validRecords = validRecords_tmp.filter(_mapElem => {
        return _mapElem.Hashtag.indexOf(this.props.match.params.hash) != -1;
      })

        this.setState({ ...this.state, records : records ,Records: result.val(), validRecords });
      }
    )
  }


  renderRecordList = () => {
    var validRecords_tmp = this.state.records.filter(_mapElem => {

      return String(_mapElem.StudentID) === this.props.match.params.student_id && _mapElem.Hashtag != null; //
    });
    var validRecords = validRecords_tmp.filter(_mapElem => {
      return _mapElem.Hashtag.indexOf(this.props.match.params.hash) != -1;
    })

    return validRecords.map(_record => {
      if (_record.InstructorID === getLoginName() )
        return <MyRecordListItem data={_record} />
      else
        return <RecordListItem data={_record} />
    });
  }

  render() {
    checkLogin()
    if (this.state.redirect)
      return <Redirect to={this.state.redirectTo} />

    return (
      <div className='content class-record-content' style={{ width: "100%" }}>
        <div>
          <Topbar
            name="Class Record"
            showBack={true}
            backTo={"/BOBO/#/studentProfile/classRecord/" +this.props.match.params.student_id}
            showOptional={true}
            optionalComponent={<Button
              id="board-list-add-btn"
              node="a"
              floating small
              waves="light"
              icon="add"
              href={"/BOBO/#/classRecord/"+this.props.match.params.student_id} />}></Topbar>
        </div>

        <div className="show-record-list-row">
        <hr style = {{width: "100%", border:'none', backgroundColor:'darkgray', height:'2px'}}/>
        <Demographic Name={this.state.Name} Age={this.state.Age} Tel={this.state.Tel} Class={this.state.Class} ImageURL={this.state.url}/>
        <hr style = {{width: "100%", border:'none', backgroundColor:'darkgray', height:'2px'}}/>
        
        <div>
            <Collection >
              {this.renderRecordList()}
            </Collection>
        </div>
        </div>

      </div> //end class-record-content
    );
  }
}


class RecordListItem extends Component {
  state = {
    url: ''
  }

  renderHashtags = () => {
    // console.log("render hasH", this.props.data.Hashtag)
    if(this.props.data.Hashtag!=null)
      return this.props.data.Hashtag.map(_elem => {
        return <Hashtag data={_elem} student_id={this.props.data.StudentID} parent={this}/>
      })
  }

  renderPictures = () => {
    var tmparr = []
    for(var key in this.props.data)
    {
      if(key == 'photos')
      {
      for(var _url_key in this.props.data['photos'])
      {
        // console.log('url:', this.props.data['photos'][_url_key])
        tmparr.push(this.props.data['photos'][_url_key])
        // return <img className="RecordImage" src={this.props.data['photos'][_url_key]} alt="photo"  align='center'></img>
      }
      }
    }

    return tmparr.map(_url => {
      return <img className="RecordImage" src={_url} alt="photo"  align='center'></img>
    })
    }
 
  render() {

    return (
      <CollectionItem>
        <Row s={12}>
          <Col s={4} style={{ color: '#ad1457'/*pink darken-3*/ }}>{this.props.data.Date}</Col>
          <Col s={2}></Col>
          <Col s={6} className='who-wrote-col'>{"wrote by: " + this.props.data.InstructorID}</Col>
        </Row>
      
        <Row>
          <Col align='center'>
            {this.renderPictures()}
          </Col>
        </Row>

        <Row>
          <Col>
            {this.props.data.Text}
          </Col>
        </Row>
        {/* Hashtags */}
        <Row>
          <Col>
            {/* <Hashtags data={this.props.data.Hashtag} /> */}
            {this.renderHashtags()}
          </Col>
        </Row>
      </CollectionItem>
    )
  }
}

class MyRecordListItem extends Component {
  renderHashtags = () => {
    // console.log("MY render hasH", this.props.data.Hashtag)
    if(this.props.data.Hashtag!=null)
      return this.props.data.Hashtag.map(_elem => {
        return <Hashtag data={_elem} student_id={this.props.data.StudentID}/>
      })
  }

  renderPictures = () => {
    var tmparr = []
    for(var key in this.props.data)
    {
      if(key == 'photos')
      {
      for(var _url_key in this.props.data['photos'])
      {
        // console.log('url:', this.props.data['photos'][_url_key])
        tmparr.push(this.props.data['photos'][_url_key])
        // return <img className="RecordImage" src={this.props.data['photos'][_url_key]} alt="photo"  align='center'></img>
      }
      }
    }

    return tmparr.map(_url => {
      return <img className="RecordImage" src={_url} alt="photo"  align='center'></img>
    })
    }

  render() {

    return (
      <CollectionItem id='class-record-item'>
        <Row s={12}>
          <Col s={4} style={{ color: '#ad1457'/*pink darken-3*/ }}>{this.props.data.Date}</Col>
          <Col s={2}></Col>
          <Col s={6} className='who-wrote-col'>{"wrote by: " + this.props.data.InstructorID}</Col>
        </Row>
        <Row>
          <Col>
            {this.props.data.Text}
          </Col>
        </Row>
        <div align='center'>
          {this.renderPictures()}
        </div>
        {/* Hashtags and edit/delete buttons */}
        <Row s={12}>
          <Col s={8}>
            {/* <Hashtags data={this.props.data.Hashtag} /> */}
            {this.renderHashtags()}
          </Col>
          {/* delete buttons */}
          <Col s={4}><div align='right'>
            {/* <Link to={"/editClassRecord/" + this.props.data.key}>
              <Icon className="edit-record-icon" small='true'>edit</Icon>
            </Link> */}
            {/* <Icon small='true'>delete</Icon> */}
            <DeleteRecordPopup data={this.props.data}></DeleteRecordPopup>
          </div></Col>
        </Row>
      </CollectionItem>
    )
  }
}


class Hashtag extends Component {

  render() {
    return (
      <span id='hash-span'>
        {/* <option id = 'selectHash' onClick={this.onHashtagSelection}>{'#' + this.props.data + ' '}</option> */}
        <Link id = 'selectHash' to={"/studentProfile/classRecordFiltered/" +this.props.student_id +'/'+this.props.data}>
         {'#' + this.props.data + ' '}
        </Link>
      </span>
    );
  }
}




class DeleteRecordPopup extends Component {
  state = {
    checked: false,
    open: false
  }

  check = (event) => {
    this.setState({ checked: !this.state.checked });
  }

  deleteRecord = () => {
    console.log("deleeeeeeete:", this.props.data.key);
    deleteDB('/Record/' + this.props.data.key);
    window.location.reload();
  }

  closing = () => {
    this.setState({ checked: false })
  }

  /*<Icon className="menu-icon" medium='true'>delete_forever</Icon>*/
  render() {
    return (
      <Popup contentStyle={{ width: '60%' }} trigger={<div style={{ display: "inline-block" }}><Icon className="InstructorNoteIcon" small='true'>delete_forever</Icon></div>}
        position="top right" onClose={this.closing}>
        {close => (
          <div className="RecordDeleteContainer">
            <span className="RecordDeleteTitle">
              Delete Record
              </span>
            <br />
            <Checkbox className="RecordDeleteCheckbox" onChange={this.check} label="" value="" />
            <span className="RecordDeleteWarningText">I hereby understand that I </span>
            <span className="RecordDeleteWarningTextImportant">cannot recover</span>
            <span className="RecordDeleteWarningText"> the deleted record.</span>
            <br />
            <br />
            <button className="close pink-cancel-button" onClick={close}>
              No
                </button>
            {this.state.checked ? (
              <button className="close pink-cancel-button" style={{ float: "right" }} onClick={this.deleteRecord}>
                Yes
                </button>
            ) : null}
          </div>)
        }
      </Popup>
    )
  }
}


export default ClassRecordFiltered

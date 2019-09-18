import React, { Component } from 'react';
import Topbar from '../Topbar';
import {Button, Pagination, Row, Col, Collection} from 'react-materialize';
import NoticeListItem from './NoticeListItem';
import "../../css/Notices/Board.css";
import { fire, getFireDB} from '../../config/fire';
import { checkLogin } from '../../config/ID';

export class Board extends Component {
  state = {
    board: {
      name: ""
    },
    Notices: [],
    validNotices: [],
    displayNotices: [],
    redirect: false,
    redirectTo: "",
  }

  constructor(props) {
    super(props);
    fire();
  }

  getBoardId = () => {
    return this.props.match.params.id;
  }

  parseQuery = () => {
    var queryString = this.props.location.search;
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
  }

  componentDidMount = () => {
    // console.log(this.props);
    getFireDB()
    .then(_res => {
      let DB = _res.val();
      for(var key in DB.Board) {
        if( DB.Board[key].id == this.getBoardId() * 1 ) {
          this.state.board = DB.Board[key];
        }
      }

      var query = this.parseQuery();
      var page = query.page ? query.page * 1 : 1;
      var type = query.type ? query.type : "all";
      var notices = [];
      var questions = [];

      for(var key in DB.Question) questions.push(DB.Question[key]);
      for(var key in DB.Notice) {
        if(DB.Notice[key].boardId === this.getBoardId() * 1) {
          var questionCnt = 0;
          questions.forEach(_question => {
            if(_question.noticeId === DB.Notice[key].id) questionCnt++;
          });
          notices.push({...DB.Notice[key], questionCnt});
        }
      }
      notices.sort((_elem1, _elem2) => {
        return _elem2.id - _elem1.id;
      });

      var validNotices = notices.filter(_notice => {
        return _notice.persistent || new Date(_notice.expireDate) > new Date();
      })
      .filter(_notice=>(type==="all" || _notice.type===type));
  
      var end = Math.min(page*10, validNotices.length);
      var displayNotices = validNotices.slice((page-1) * 10, end);
      console.log(displayNotices);
  
      this.setState({...this.state,
        Notices: notices,
        validNotices,
        displayNotices,
        page,
        redirect: false});
    });
  }

  componentWillReceiveProps() {
    window.location.reload();
  }

  onPageSelect = (e) => {
    var queryString = "?page="+e;
    var query = this.parseQuery();
    for(let [key, value] of Object.entries(query)) {
      if(key === "page") continue;
      queryString += "&" + encodeURIComponent(key) + "=" + encodeURIComponent(value);
    }
    
    this.props.history.push(this.props.location.pathname + queryString);
    window.location.reload();
  }

  onTypeClick = (_type) => {
    var queryString = "?type="+_type;
    var query = this.parseQuery();
    for(let [key, value] of Object.entries(query)) {
      if(key === "type") continue;
      queryString += "&" + encodeURIComponent(key) + "=" + encodeURIComponent(value);
    }

    this.props.history.push(this.props.location.pathname + queryString);
    window.location.reload();
  }

  renderNoticeItems = () => {
    return this.state.displayNotices.map(_notice => {
      return <NoticeListItem
        pathname={this.props.location.pathname}
        data={_notice}
        onTypeClick={this.onTypeClick}/>
    });
  }

  render() {
    checkLogin();
    let isNotice = this.state.displayNotices.length !== 0;
    return (
      <div className="content">
        <Topbar
          name={this.state.board.name}
          showBack={true}
          backTo="/BOBO/#/board"
          showOptional={true}
          optionalComponent={<Button
                              id="board-list-add-btn"
                              node="a"
                              floating small
                              waves="light"
                              icon="add"
                              href={"/BOBO/#/board/" + this.getBoardId() + "/addNotice"}/>}/>
        
        <Row id="board-notice-list">
          {isNotice ?
          <Collection>
            {this.renderNoticeItems()}
          </Collection>
          : <div style={{backgroundColor: "rgb(239, 239, 239)"}} id="alert-msg">
            <span>There aren't any valid notices</span>
          </div>}
        </Row>
        <div id="board-pagination-row">
          {isNotice?
          <Pagination
            activePage={this.state.page}
            maxButtons={6}
            items={Math.ceil(this.state.validNotices.length / 10)}
            onSelect={this.onPageSelect}/>
            :
            <span></span>
          }
        </div>
      </div>
    )
  }
}

export default Board

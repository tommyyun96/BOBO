import React, { Component } from 'react';
import BoardListItem from "./BoardListItem";
import Topbar from "../Topbar";
import {Row, Col, Collection, Autocomplete, Button} from 'react-materialize';
import {Redirect} from 'react-router';
import { fire, getFireDB} from '../../config/fire';
import { getLoginId, getLoginName,checkLogin } from "../../config/ID";

import "../../css/Notices/BoardList.css";
import "../../css/Common.css";

export class NoticeBoard extends Component {
  state = {
    Boards: [],
    BoardUserMap: [],
    validBoards: [],
    autocompleteData: {Test:null, Test2:null},
    redirect: false,
    redirectTo: -1,
    CurrentUser: {
      id: getLoginId() * 1,
      name: getLoginName()
    }
  }

  constructor(props) {
    super(props);
    fire();
  }

  componentDidMount = () => {
    getFireDB()
    .then(res =>{
      console.log(res.val());
      let DB = res.val();
      var Boards = [];
      for( var key in DB.Board ) Boards.push(DB.Board[key]);
      
      var BoardUserMap = [];
      for( var key in DB.BoardUserMap) BoardUserMap.push(DB.BoardUserMap[key]);

      var validBoardIds = BoardUserMap.filter(_mapElem => {
        return _mapElem.userId === this.state.CurrentUser.id;
      }).map(_mapElem => {
        return _mapElem.boardId;
      });
  
      var validBoards = Boards.filter(_board => validBoardIds.indexOf(_board.id)>-1);
      var autocompleteData = validBoards.reduce( (_acc, _board) => {
        return {..._acc, [_board.name]:null};
      }, {});
      this.setState({...this.state, validBoards, autocompleteData, showAutocomplete:true});
    });
  }

  onAutocomplete = (_boardName) => {
    var board = this.state.validBoards.find(_board => _board.name === _boardName);
    this.setState({...this.state, redirect: true, redirectTo: "board/" + board.id});
  }

  renderBoardList = () => {
    return this.state.validBoards.map(_board => {
      return <BoardListItem data={_board}/>
    });
  }

  render() {
    checkLogin();

    if(this.state.redirect)
      return <Redirect to={this.state.redirectTo}/>

    return (
      <div className="content" id="board-list-content">
        <Topbar
          id="topbar-row"
          name="Notice Boards"
          showOptional={true}
          optionalComponent={<Button
                              id="board-list-add-btn"
                              node="a"
                              floating small
                              waves="light"
                              icon="add"
                              href={"/BOBO/#/addBoard"}/>}/>
        <Row id="board-list-search-row">
          <Col s={12}>
            {/* <TextInput id="notice-list-search" s={12} icon="search" placeholder="Search notice board name."/> */}
            {this.state.showAutocomplete ?
              <Autocomplete
                options={{data: this.state.autocompleteData, onAutocomplete:this.onAutocomplete}}
                placeholder="Search notice board name"
                icon="search" s={12}/> :
              <span></span>
            }
          </Col>
        </Row>
        <Row id="board-list-row">
          <Col s={12}>
            <Collection>{this.renderBoardList()}</Collection>
          </Col>
        </Row>
      </div>
    )
  }
}

export default NoticeBoard

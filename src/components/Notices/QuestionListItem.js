import React, { Component } from 'react'
import { Card, Button, Textarea, Badge, Col, Row } from 'react-materialize';

export class QuestionListItem extends Component {
  state = {
    showAnswerCard: false,
    showNewAnswer: false,
    newAnswer: "",
  }

  formatDate = (_date) => {
    _date = new Date(_date);
    var day = _date.getDate();
    var monthIndex = _date.getMonth();
    var year = _date.getFullYear();
    return year + "/" + (monthIndex + 1) + "/" + day;
  }

  onReplyBtnClick = (e) => {
    this.setState({...this.state, showAnswerCard: true});
  }

  onNewAnswerChange = (e) => {
    this.setState({...this.state, answerContent: e.target.value});
  }

  onNewAnswerBtnClick = (e) => {
    if(!this.state.answerContent) {
      window.M.toast({
        html: "Please write something to answer ㅠ.ㅠ",
        displayLength: 1000
      });
      return;
    }

    this.props.onAnswer({...this.props.data, answer: this.state.answerContent});
    this.setState({...this.state, showAnswerCard: false, showNewAnswer: true, newAnswer: this.state.answerContent});
  }

  renderQuestionHeader = () => {
    let className = "question-list-item-header ";
    className += !this.props.data.answer && this.state.newAnswer === "" ? "pink lighten-4" : "grey lighten-2";

    return (<div className={className}>
      <span className="name">Asked by <b>{this.props.data.userName}</b></span>
      <span className="date">at {this.formatDate(this.props.data.createDate)}</span>
      {this.props.data.answer === "" && this.state.newAnswer === "" && !this.state.showAnswerCard ?
      <Button flat waves="light" onClick={this.onReplyBtnClick} className="reply">
        <span className="reply-label">Reply</span> <i className="material-icons">reply</i>
      </Button> :
      !this.state.showAnswerCard ?
      <Badge className="resolved grey darken-1 white-text">Resolved</Badge>
      : <span></span>
      }
      
    </div>);
  }

  render() {
    let showAnswer = this.props.data.answer !== "" || this.state.showNewAnswer;

    return (
      <Row className="question-list-item-container">
        <Col s={12}>
          <Card className="white" header={this.renderQuestionHeader()}>
            <p>{this.props.data.content}</p>
            
            {this.state.showAnswerCard ? 
              <div>
                <Textarea
                  className="new-answer-content" placeholder="I think ..."
                  onChange={this.onNewAnswerChange}/>
                <Button className="red lighten-5 black-text new-answer-btn" onClick={this.onNewAnswerBtnClick}>Answer</Button>
              </div> : <span/>
            }

          </Card>
        </Col>
        {
          showAnswer ?
            (<div>
            <Col s={1}>
              <span className="material-icons reply-icon">subdirectory_arrow_right</span>
            </Col>
            <Col s={11}>
              <Card className={"grey lighten-2 answer-container " + (this.props.data.answer === "" ? "none" : "")}>
                <div><span className="answer-content">{this.props.data.answer}</span></div>
              </Card>
              {this.state.showNewAnswer ?
                <Card className="grey lighten-2 answer-container">
                  <div><span className="answer-content">{this.state.newAnswer}</span></div>
                </Card> : <span/>
              }
            </Col></div>) :
            <span></span>
        }
        
      </Row>
    )
  }
}

export default QuestionListItem

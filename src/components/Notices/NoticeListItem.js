import React, { Component } from 'react';
import {CollectionItem} from 'react-materialize';
import {Redirect} from 'react-router';

export class NoticeListItem extends Component {
  state = {
    redirect: false
  }

  onTypeClick = (e) => {
    this.props.onTypeClick(this.props.data.type);
  }

  onItemClick = (e) => {
    this.setState({redirect:true, redirectTo: this.props.pathname + "/notice/" + this.props.data.id});
  }

  formatDate = (_date) => {
    var _date = new Date(_date);
    var day = _date.getDate();
    var monthIndex = _date.getMonth();
    var year = _date.getFullYear();
    return year + "/" + (monthIndex + 1) + "/" + day;
  }

  renderTypeBadge = () => {
    //this.props.pathname + "/notice/" + this.props.data.id
    return (<div className="notice-list-item-type"
                onClick={this.onTypeClick}>
              {this.props.data.type[0].toUpperCase()}
            </div>);
  }

  render() {
    if(this.state.redirect)
      return <Redirect to={this.state.redirectTo}/>

    return (
      <CollectionItem>
        {this.renderTypeBadge()}
        <div style={{width:"90%", display:"inline-block"}} onClick={this.onItemClick}>
          <span className={this.props.data.important?"important" : "not-important"}></span>
          {this.props.data.name}
          <span className="notice-list-item-questions"><span>{this.props.data.questionCnt}</span></span>
          <span className="notice-list-item-expire">{
            this.props.data.persistent ?
            <span>Persistent</span> :
            <span>Will expire at {this.formatDate(this.props.data.expireDate)}</span>
          }</span>
        </div>
      </CollectionItem>
    )
  }
}

export default NoticeListItem

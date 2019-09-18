//no use

import React, { Component } from 'react';
import { CollectionItem, Color } from 'react-materialize';
import { Row, Col } from 'react-materialize'

//import Hashtag from './Hashtag';
import "../../css/Students/ClassRecord.css"

export class RecordListItem extends Component {
  render() {
    console.log(this.props.data)
    return (
      <CollectionItem>
        <Row>
          <Col style={{ color:'#ad1457'/*pink darken-3*/}}>{this.props.data.Date}</Col>
          <Col style={{ color: '#88024f' /* pink darken-4*/}}>{"wrote by: " +  this.props.data.Instructor}</Col>
        </Row>
        <Row>
          <Col>
            {this.props.data.Text}
          </Col>
        </Row>
        {/* Hashtags */}
        <Row>
          <Col>
            <Hashtag data={this.props.data.Hashtag} />
          </Col>
        </Row>
      </CollectionItem>
    )
  }
}

class Hashtag extends Component {
  render() {
    console.log('hashtag!', this.props.data)
    return (
      this.props.data.map(_elem => {
        return <Hash data={_elem} />
      })
    );
  }
}

class Hash extends Component {
  render() {
    return (
      <span>{'#' + this.props.data + ' '}</span>
    );
  }
}

export default RecordListItem

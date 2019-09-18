import React, { Component } from 'react';
import { CollectionItem, Color } from 'react-materialize';
import { Row, Col } from 'react-materialize'

import "../../css/Students/ClassRecord.css"

export class Hashtag extends Component {
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

export default Hashtag

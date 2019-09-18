import React, { Component } from 'react';
import { CollectionItem } from 'react-materialize';
import { Row, Col } from 'react-materialize'

//no use
export class ClassListItem extends Component {
  render() {
    return (
      <option value={this.props.data} onClick>
        {this.props.data}
      </option>
    )
  }
}

export default ClassListItem


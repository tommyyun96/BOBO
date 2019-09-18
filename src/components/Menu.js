import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { Icon } from 'react-materialize';
import {getLoginId} from '../config/ID'


import "../css/Menu.css";

export class Menu extends Component {
  render() {
    return (
      <div className="menu">
        <div className="menu-item"><Link to={"/studentList/"}>
          <Icon className="menu-icon" medium={true}>assignment_ind</Icon>
          </Link></div>
        <div className="menu-item"><Link to={"/classRecord/"}>
          <Icon className="menu-icon" medium={true}>add_box</Icon>
          </Link></div>
        <div className="menu-item"><Link to="/board">
          <Icon className="menu-icon" medium={true}>assignment</Icon>
          </Link></div>
        <div className="menu-item"><Link to="/settings">
          <Icon className="menu-icon" medium={true}>settings</Icon>
          </Link></div>
      </div>
    )
  }
}

export default Menu

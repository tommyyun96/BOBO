import React, { Component } from 'react'
import {Row, Col} from 'react-materialize';
import '../../css/Students/Demographic.css'

export class Demographic extends Component {

  render() {
      return (
          <div className="DemographicContainer">
              <Row className="DemographicRow" style={{paddingTop: '15px', paddingBottom: '15px'}}>
                  <Col className="DemographicCol" s={5}>
                      <div className="ProfileImage" alt="logo" style={{backgroundImage: 'url('+this.props.ImageURL+')'}}></div>
                  </Col>
                  <Col className="DemographicCol" s={7}>
                      <div className="ProfileTextWrapper">
                          <div className="ProfileText">
                              <span> Name: {this.props.Name}</span>
                              <br/>
                              <span>Class: {this.props.Class}</span>
                              <br/>
                              <span>Age: {this.props.Age}</span>
                              <br/>
                              <span>Tel: <u><a href={"tel:"+this.props.Tel}>{this.props.Tel}</a></u></span>
                          </div>
                      </div>
                  </Col>
              </Row>
          </div>
      )
  }
}

export default Demographic;
import React, { Component } from "react";

export default class HelpLink extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <div className="helpLinkWrapper">
        <ul className="helpLinkContent">
          <li className="packup"></li>
          <li className="twitter"></li>
          <li className="telegram"></li>
          <li className="help"></li>
          <li className="upTop"></li>
        </ul>
      </div>
    );
  }
}

import React, { Fragment } from "react";
import ApiClientData from "../../../services/dataApi";

class Accounts extends React.Component {
  constructor() {
    super();
    this.state = {
      sendTrxNumbers: [],
      sendTrxItems: [],
      receiveTrxNumbers: [],
      receiveTrxItems: [],
      freezeTrxNumbers: [],
      voteTrxNumbers: []
    };
  }
  componentDidMount() {
    this.getData();
  }

  async getData() {
    let sendTrxNumbers = await ApiClientData.getTop10Data({ type: 1, time: 1 });
    let sendTrxItems = await ApiClientData.getTop10Data({ type: 2, time: 1 });
    let receiveTrxNumbers = await ApiClientData.getTop10Data({
      type: 3,
      time: 1
    });
    let voteTrxNumbers = await ApiClientData.getTop10Data({ type: 4, time: 1 });
    this.setState({
      sendTrxNumbers,
      sendTrxItems,
      receiveTrxNumbers,
      voteTrxNumbers
    });
  }

  render() {
    let {
      sendTrxNumbers,
      sendTrxItems,
      receiveTrxNumbers,
      voteTrxNumbers
    } = this.state;
    return (
      <div>
        <span>1</span>
      </div>
    );
  }
}

export default Accounts;

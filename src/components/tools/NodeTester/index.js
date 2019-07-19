import React, {Component} from 'react';
import {trim} from "lodash";
import {channel} from "../../../services/api";
import {tu} from "../../../utils/i18n";


class NodeTester extends Component {

  constructor(props) {
    super(props);

    this.id = 0;
    this.listener = null;

    this.state = {
      ip: "",
      port: 50051,
      active: false,
      logs: [],
    };
  }

  componentDidMount() {

  }

  hideModal = () => {
    this.setState({
      modal: null,
    });
  };

  isValid = (ip, port) => {
    let isValidIp = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip);
    let isValidPort = !isNaN(parseInt(port, 10)) && port > 0;

    return isValidIp && isValidPort;
  };

  componentDidUpdate(prevProps, prevState) {

  }

  componentWillUnmount() {
    this.listener && this.listener.close();
  }

  stopListening = () => {
    this.listener && this.listener.close();
    this.setState({
      active: false,
      logs: [],
    });
  };

  testNode = (ip) => {
   // return
    this.listener && this.listener.close();
    this.listener = channel("/nodetest-" + ip, {
      query: {
        ip,
      }
    });

    this.listener.on("connect", () => {
      this.setState({
        active: true,
      });
    });

    this.listener.on("node-status", status => {
      this.setState(state => ({
        logs: [{
          ...status,
          id: this.id++,
        }, ...state.logs.slice(0, 9)],
      }));
    });
  };

  setPort = (ev) => {

    let port = trim(ev.target.value);

    if (port !== '') {
      port = parseInt(port, 10);
      port = isNaN(port) ? 0 : port;
    }

    this.setState({port});
  };

  render() {

    let {ip, port, modal, active, logs} = this.state;

    return (
        <main className="container header-overlap _tester">
          {modal}

          <div className="card">
            <div className="card-body">
              <h5 className="card-title text-left">{tu("node_tester")}
                <span className="_tester_msg">
               {tu("node_tester_msg")}
            </span>
              </h5>
              <div className="text-left">
                <span>IP</span>
              </div>
              <input
                  className="form-control text-left"
                  type="text"
                  placeholder="123.123.123.123"
                  value={ip}
                  onChange={ev => this.setState({ip: ev.target.value})}/><br/>
              <div className="text-left">
                <span>Port</span>
              </div>
              <input
                  className="form-control text-left"
                  type="text"
                  placeholder="50051"
                  value={port}
                  onChange={this.setPort}/>
              <div className="text-left">
                {
                  active ?
                      <button className="btn"
                              onClick={() => this.stopListening()}>{tu("node_tester_stop")}
                      </button> :
                      <button className="btn"
                              disabled={!this.isValid(ip, port)}
                              onClick={() => this.testNode(ip + ":" + port)}>
                        {tu("node_tester_test")}
                      </button>
                }
              </div>
            </div>
          </div>
          {
            (active && logs.length === 0) &&
            <div className="card mt-3">
              <table className="table table-hover table-striped bg-white m-0">
                <thead className="thead-dark">
                <tr align="center">
                  <th>{tu("connection_node")}</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td align="center">{tu("loading")}</td>
                </tr>
                </tbody>
              </table>
            </div>
          }
          {
            logs.length > 0 &&
            <div className="card mt-3">
              <table className="table table-hover table-striped bg-white m-0">
                <thead className="thead-dark">
                <tr>
                  <th>{tu("message")}</th>
                  <th style={{width: 200}}>{tu("node_tester_rt")}</th>
                </tr>
                </thead>
                <tbody>
                {
                  logs.map(log => (
                      <tr key={log.id}>
                        <td>{log.msg}</td>
                        <td>{log.responseTime} ms</td>
                      </tr>
                  ))
                }
                </tbody>
              </table>
            </div>
          }
        </main>
    );
  }
}

export default NodeTester;

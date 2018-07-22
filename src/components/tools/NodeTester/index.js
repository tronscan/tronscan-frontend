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
    let isValidPort = !isNaN(parseInt(port)) && port > 0;

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
      port = parseInt(port);
      port = isNaN(port) ? 0 : port;
    }

    this.setState({port});
  };

  render() {

    let {ip, port, modal, active, logs} = this.state;

    return (
      <main className="container header-overlap">
        {modal}

        <div className="card">
          <div className="card-body">
            <h5 className="card-title text-center">{tu("node_tester")}</h5>
            <p className="text-center">
              {tu("node_tester_msg")}
            </p>
            <div className="text-center">
              IP
            </div>
            <input
              className="form-control text-center"
              type="text"
              placeholder="123.123.123.123"
              value={ip}
              onChange={ev => this.setState({ip: ev.target.value})}/><br/>
            <div className="text-center">
              Port
            </div>
            <input
              className="form-control text-center"
              type="text"
              placeholder="50051"
              value={port}
              onChange={this.setPort}/>
            <div className="text-center p-3">
              {
                active ?
                  <button className="btn btn-danger"
                          onClick={() => this.stopListening()}>{tu("node_tester_stop")}
                  </button> :
                  <button className="btn btn-success"
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

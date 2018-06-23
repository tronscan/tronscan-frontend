import React, {Component} from 'react';
import {connect} from "react-redux";

export default class LaunchStatus extends Component {

  componentDidMount() {

  }

  render() {


    return (
      <main className="container header-overlap">

        <div className="row">
          <div className="col-md-12">
            <div className="card pb-5">
              <div className>
                <div className="card-body text-center text-primary">
                  <i className="fa fa-users fa-5x"/>
                  <h2 className="mt-3">GR Election</h2>
                  <p className="text-muted">
                    Genesis Representatives Elections
                  </p>
                </div>
                <ul className="list-group list-group-flush" style={styles.list}>
                  <li className="list-group-item d-flex">
                    Network Rehearsal Recovery
                    <span className="text-success ml-auto">
                    Completed
                  </span>
                  </li>
                  <li className="list-group-item d-flex">
                    Mainnet launches 1st rehearsal
                    <span className="text-success ml-auto">
                    Completed
                  </span>
                  </li>
                  <li className="list-group-item d-flex">
                    Mainnet launches 2nd rehearsal
                  </li>
                </ul>
                <div className="card-body text-center text-info">
                  <i className="fa fa-shield-alt fa-5x"/>
                  <h2 className="mt-3">Guardian Phase</h2>
                  <p className="text-muted">
                    Network Guardians
                  </p>
                </div>
                <ul className="list-group list-group-flush" style={styles.list}>
                  <li className="list-group-item d-flex">
                    Launch of the Guardian Network, waiting for Genesis
                  </li>
                  <li className="list-group-item d-flex">
                    Designated GBN (Genesis Boot Node)
                  </li>
                </ul>
                <div className="card-body text-center text-danger">
                  <i className="fa fa-burn fa-5x"/>
                  <h2 className="mt-3">Genesis Phase</h2>
                  <p className="text-muted">
                    Launch of Mainnet
                  </p>
                </div>
                <ul className="list-group list-group-flush" style={styles.list}>
                  <li className="list-group-item d-flex">
                    GBN produces Genesis Block
                  </li>
                  <li className="list-group-item d-flex">
                    GBN sets network launching parameters
                    and notifies other GRs
                  </li>
                  <li className="list-group-item d-flex">
                    GBN launches; GRs sync data
                  </li>
                  <li className="list-group-item d-flex">
                    Start of exchange integration with TRON’s mainnet
                  </li>
                  <li className="list-group-item d-flex">
                    SRs start voting
                  </li>
                </ul>
                <div className="card-body text-center text-success">
                  <i className="fa fa-book fa-5x"/>
                  <h2 className="mt-3">Constitutionalism</h2>
                  <p className="text-muted">
                    Entering the Constitutional Era
                  </p>
                </div>
                <ul className="list-group list-group-flush" style={styles.list}>
                  <li className="list-group-item d-flex">
                    Begin of the Constitutional Era after SRs replace all GRs
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }
}

const styles = {
  image: {
    maxWidth: 300,
    borderRadius: 5,
  },
  list: {
    fontSize: 18,
  }
};

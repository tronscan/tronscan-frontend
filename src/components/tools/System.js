import React, {Component} from 'react';
import {trim} from "lodash";
import {tu} from "../../utils/i18n";
import {connect} from "react-redux";
import {BlockNumberLink} from "../common/Links";
import {FormattedNumber} from "react-intl";


class System extends Component {

  constructor(props) {
    super(props);

    this.state = {
      modal: null,
    };
  }

  componentDidMount() {

  }

  hideModal = () => {
    this.setState({
      modal: null,
    });
  };

  componentDidUpdate(prevProps, prevState) {

  }

  componentWillUnmount() {

  }

  render() {

    let {modal} = this.state;

    let {sync} = this.props;

    if (!sync) {
      return null;
    }

    return (
      <main className="container header-overlap">
        {modal}
        <div className="card">
        <table className="table table-hover m-0 bg-white">
          <tbody>
          <tr>
            <td colSpan="2" className="bg-dark text-white border-top-0">Tronscan</td>
          </tr>
          <tr>
            <th style={{width: 300}}>{tu("Sync")}:</th>
            <td>
              <FormattedNumber value={sync.sync.progress} maximumFractionDigits={2}/>%
            </td>
          </tr>
          <tr>
            <th>{tu("block")}:</th>
            <td>
              <BlockNumberLink number={sync.database.block}>{sync.database.block}</BlockNumberLink>
            </td>
          </tr>
          <tr>
            <th>{tu("confirmed_block")}:</th>
            <td>
              <BlockNumberLink number={sync.database.unconfirmedBlock - 1}>{sync.database.unconfirmedBlock - 1}</BlockNumberLink>
            </td>
          </tr>
          <tr>
            <td colSpan="2" className="bg-dark text-white">Full Node</td>
          </tr>
          <tr>
            <th>{tu("block")}:</th>
            <td>
              {sync.full.block}
            </td>
          </tr>
          <tr>
            <td colSpan="2" className="bg-dark text-white">Solidity Node</td>
          </tr>
          <tr>
            <th>{tu("block")}:</th>
            <td>
              {sync.solidity.block}
            </td>
          </tr>
          </tbody>
        </table>
        </div>
      </main>
    );
  }
}

function mapStateToProps(state) {
  return {
    sync: state.app.syncStatus,
  };
}

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(System)

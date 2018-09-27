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
        <main className="container header-overlap _system">
          {modal}
          <div className="" style={{borderTop: "4px solid #C23631"}}>
            <table className="table table-hover m-0 bg-white">
              <tbody>
              <tr>
                <td colSpan="2" className="border-top-0">Tronscan</td>
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
                  <BlockNumberLink
                      number={sync.database.confirmedBlock - 1}>{sync.database.confirmedBlock - 1}</BlockNumberLink>
                </td>
              </tr>
              </tbody>
            </table>
            <table className="table table-hover m-0 bg-white mt-2">
              <tbody>
              <tr>
                <td colSpan="2" className="">Full Node</td>
              </tr>
              <tr>
                <th style={{width: 300}}>{tu("block")}:</th>
                <td>
                  <BlockNumberLink
                      number={sync.full.block}>{sync.full.block}</BlockNumberLink>
                </td>
              </tr>
              </tbody>
            </table>
            <table className="table table-hover m-0 mt-2 bg-white">
              <tbody>
              <tr>
                <td colSpan="2" className="">Solidity Node</td>
              </tr>
              <tr>
                <th style={{width: 300}}>{tu("block")}:</th>
                <td>
                  <BlockNumberLink
                      number={sync.solidity.block}>{sync.solidity.block}</BlockNumberLink>
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

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(System)

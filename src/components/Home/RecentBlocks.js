import React, {Component} from "react";
import {tu} from "../../utils/i18n";
import {FormattedNumber, injectIntl} from "react-intl";
import {loadBlocks} from "../../actions/blockchain";
import {connect} from "react-redux";
import {TronLoader} from "../common/loaders";
import {AddressLink} from "../common/Links";
import TimeAgo from "react-timeago";
import {Link} from "react-router-dom";
import {TRXPrice} from "../common/Price";
import {withTimers} from "../utils/timing";


class RecentBlocks extends Component {

  constructor() {
    super();

    this.state = {
      blocks: [],
    };
  }

  componentDidMount() {
    this.props.loadBlocks();
    // this.props.setInterval(() => {
    //   this.props.loadBlocks();
    // }, 6000);
  }

  render() {
    let {blocks} = this.props;

    if (blocks.length === 0) {
      return (
        <div className="text-center d-flex justify-content-center">
          <TronLoader/>
        </div>
      );
    }

    return (
      <div className="card">
        <div className="card-header bg-dark text-white d-flex">
          <h5 className="m-0 lh-150">{tu("blocks")}</h5>
          <Link to="/blockchain/blocks" className="ml-auto text-white btn btn-outline-secondary btn-sm">
            {tu("view_all")}
          </Link>
        </div>
        <ul className="list-group list-group-flush scrollbar-dark" style={styles.list}>
          {
            blocks.map(block => (
              <li key={block.number} className="list-group-item p-2 py-1">
                <div key={block.number} className="media d-flex align-items-stretch">
                  <Link className="block mr-1 text-white d-flex flex-column justify-content-center" to={`/block/${block.number}`}>
                    #{block.number}
                  </Link>
                  <div className="media-body mb-0 ml-1 d-flex">
                      <div className="text-left">
                        <div>
                          <i className="fas fa-exchange-alt mr-1"/>
                          <Link to={`/blockchain/transactions?block=${block.number}`}>
                            <FormattedNumber value={block.nrOfTrx} />{' '}
                            transactions
                          </Link>
                        </div>
                        <div className="text-gray-dark break-word">
                          Produced by{' '}
                          <AddressLink address={block.witnessAddress} truncate={false}>
                            {block.witnessAddress.substr(0, 12)}...
                          </AddressLink>
                        </div>

                      </div>
                    <div className="ml-auto text-right d-flex flex-column">
                      <div className="text-muted ">
                        <TimeAgo date={block.timestamp} />
                      </div>
                      <div className="text-gray-dark break-word mt-auto">
                        Block Reward: <TRXPrice amount={32}/>
                      </div>
                    </div>
                    </div>
                </div>
              </li>
            ))
          }
        </ul>
      </div>
    )
  }
}


function mapStateToProps(state) {
  return {
    blocks: state.blockchain.blocks,
    activeLanguage: state.app.activeLanguage,
  };
}

const mapDispatchToProps = {
  loadBlocks,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTimers(injectIntl(RecentBlocks)))


const styles = {
  list: {
    overflowY: 'scroll',
    overflowX: 'none',
    height: 500,
  }
};

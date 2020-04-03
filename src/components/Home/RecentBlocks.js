import React, {Component} from "react";
import {tu} from "../../utils/i18n";
import {FormattedNumber, injectIntl} from "react-intl";
import {loadBlocks} from "../../actions/blockchain";
import {connect} from "react-redux";
//import {TronLoader} from "../common/loaders";
import {AddressLink} from "../common/Links";
// import TimeAgo from "react-timeago";
//import moment from 'moment';
import {Link} from "react-router-dom";
import {TRXPrice} from "../common/Price";
import {withTimers} from "../../utils/timing";
import {IS_MAINNET} from "../../constants";
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar'
import BlockTime from '../common/blockTime'


import isMobile from "../../utils/isMobile";
//import {timeDiffFormat,setTimeString} from '../../utils/DateTime'
//import { clear } from "sisteransi";



class RecentBlocks extends Component {

  constructor() {
    super();

    this.state = {
      blocks: [],
      blockShow: [' ', ' ', ' ', ' ', ' ', ' ']
    };
  }

  componentDidMount() {
    let {timer} = this.state;
    this.props.loadBlocks();
    this.props.setInterval(() => {
      this.props.loadBlocks();
      
    }, 3000); 

  }

  

  render() {
    let { blocks, isRightText, transactions} = this.props;
    let {newBlocks} = this.state;
    // let { blockShow } = this.state
    // if (blocks.length === 0) {
    //   return (
    //       <div className="text-center d-flex justify-content-center">
    //         <TronLoader/>
    //       </div>
    //   );
    // }

    return (
        <div className="card" style={styles.card}>
          {/* test */}
          <div className="card-header bg-tron-light d-flex">
            <i className="fa fa-cubes mr-3 fa_width_20 color-grey-100"></i>
            <h5 className="m-0 lh-175 color-grey-100 confirmed_block_tip">
              {tu("blocks")}
              
            
            </h5>
            <Link to="/blockchain/blocks"
                  className="ml-auto btn btn-sm btn-default"
                  style={{borderRadius: '0.15rem'}}>
              {tu("view_all")}
            </Link>
          </div>
          <ul className="list-group list-group-flush" style={styles.list}>
          {
            isMobile?
            <PerfectScrollbar>
              {
                blocks.length != 0 ? (
                  blocks.map(block => (
                      <li key={block.number} className="list-group-item overflow-h mobile-block">
                        <div key={block.number} className="d-flex flex-column">
                          <div className="media-body mb-0 d-flex" style={{paddingTop: 1}}>
                            <div className="text-left">
                              <div className="d-flex justify-content-between align-times-center">
                                <Link className="mr-1 d-flex justify-content-start color-tron-100 pt-1 list-item-word"
                                      to={`/block/${block.number}`}>
                                  <i className="fa fa-cube mr-2 mt-1 fa_width color-tron-100"
                                    style={{fontSize: '1rem'}}></i>
                                  #{block.number}
                                </Link>
                                <div className="text-muted color-grey-300 small pt-2">
                                <BlockTime time={block.timestamp}></BlockTime>
                                </div>
                              </div>
                              <div>
                                <i className="fas fa-exchange-alt mr-2 color-tron-100"/>
                                <Link className="color-tron-100"
                                      to={`/blockchain/transactions?block=${block.number}`}>
                                  <FormattedNumber value={block.nrOfTrx}/>{' '}
                                  {tu("transactions")}
                                </Link>
                              </div>
                              <div className="text-gray-dark break-word d-flex list-item-word small">
                                <span className="mr-2 color-grey-300">{tu("produced_by")}:</span>
                                <AddressLink address={block.witnessAddress} truncate={false}>
                                  <span className="color-tron-100">{block.witnessName?block.witnessName:block.witnessAddress}</span>
                                </AddressLink>
                              </div>
                                {
                                    IS_MAINNET && <div className="text-gray-dark break-word color-grey-200 list-item-word"
                                      style={styles.nowrap}>
                                    <span className="small color-grey-300 d-inline-block">{tu("block_reward")}:</span> <TRXPrice amount={16}/>
                                  </div>
                                }


                            </div>
                            <div className="ml-auto text-right d-flex flex-column pt-2">
                            </div>
                          </div>
                        </div>
                      </li>
                  ))
                ) : (
                  this.state.blockShow.map((block,i) => (
                    <li key={i} className="list-group-item overflow-h mobile-block">
                      <div key={i} className="d-flex flex-column">
                        <div className="media-body mb-0 d-flex" style={{ paddingTop: 1 }}>
                          <div className="text-left">
                            <div className="d-flex justify-content-between align-times-center">
                              <Link className="mr-1 d-flex justify-content-start color-tron-100 pt-1 list-item-word"
                                to=''>
                                <i className="fa fa-cube mr-2 mt-1 fa_width color-tron-100"
                                  style={{ fontSize: '1rem' }}></i>
                                # --
                              </Link>
                              <div className="text-muted color-grey-300 small pt-2">
                                
                                <BlockTime time={block.timestamp}></BlockTime>
                                {/* <TimeAgo date={block.timestamp} title={moment(block.timestamp).format("MMM-DD-YYYY HH:mm:ss A")}/> */}
                              </div>
                            </div>
                            <div>
                              <i className="fas fa-exchange-alt mr-2 color-tron-100" />
                              <Link className="color-tron-100"
                                to=''>
                                --
                                {tu("transactions")}
                              </Link>
                            </div>
                            <div className="text-gray-dark break-word d-flex list-item-word small">
                              <span className="mr-2 color-grey-300">{tu("produced_by")}:</span>
                              {/* <AddressLink address={block.witnessAddress} truncate={false}> */}
                                <span className="color-tron-100">--</span>
                              {/* </AddressLink> */}
                            </div>
                            {
                              IS_MAINNET && <div className="text-gray-dark break-word color-grey-200 list-item-word"
                                style={styles.nowrap}>
                                <span className="small color-grey-300 d-inline-block">{tu("block_reward")}:</span> --
                              </div>
                            }


                          </div>
                          <div className="ml-auto text-right d-flex flex-column pt-2">
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                )
              }
            </PerfectScrollbar>
            :
            <PerfectScrollbar>
              {
                // blocks.length != 0 && transactions.length != 0
                  blocks.length != 0 ? (
                    blocks.map(block => (
                      <li key={block.number} className="list-group-item overflow-h" style={{ minHeight: "100px" }}>
                        <div key={block.number} className="d-flex flex-column">
                          <div className="media-body mb-0 d-flex" style={{paddingTop: 1}}>
                            <div className="text-left">
                              <Link className="mr-1 d-flex justify-content-start color-tron-100 pt-1 list-item-word"
                                    to={`/block/${block.number}`}>
                                <i className="fa fa-cube mr-2 mt-1 fa_width color-tron-100"
                                  style={{fontSize: '1rem'}}></i>
                                #{block.number}
                              </Link>
                              <div>
                                <i className="fas fa-exchange-alt mr-2 color-tron-100"/>
                                <Link className="color-tron-100"
                                      to={`/blockchain/transactions?block=${block.number}`}>
                                  <FormattedNumber value={block.nrOfTrx}/>{' '}
                                  {tu("transactions")}
                                </Link>
                              </div>
                              <div className="text-gray-dark break-word d-flex list-item-word">
                                <span className="mr-2 color-grey-300">{tu("produced_by")}:</span>
                                <AddressLink address={block.witnessAddress} truncate={false}>
                                  <span className="color-tron-100">{block.witnessName?block.witnessName:block.witnessAddress}</span>
                                </AddressLink>
                              </div>

                            </div>
                            <div className="ml-auto text-right d-flex flex-column pt-2">
                              {
                                IS_MAINNET &&  <div className="text-gray-dark break-word color-grey-200 list-item-word"
                                      style={styles.nowrap}><span className="d-inline-block">{tu("block_reward")}:</span> <TRXPrice amount={16}/>
                                </div>
                              }

                              <div className="text-muted color-grey-300 small" style={styles.nowrap}>
                              <BlockTime time={block.timestamp}></BlockTime>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                  ))
                ) : (
                  this.state.blockShow.map((v, i) => (
                    <li key={i} className="list-group-item overflow-h">
                      <div key={i} className="d-flex flex-column">
                        <div className="media-body mb-0 d-flex" style={{ paddingTop: 1 }}>
                          <div className="text-left">
                                <Link className="mr-1 d-flex justify-content-start color-tron-100 pt-1 list-item-word" to=''>
                              <i className="fa fa-cube mr-2 mt-1 fa_width color-tron-100"
                                style={{ fontSize: '1rem' }}></i>
                              # --
                              </Link>
                            <div>
                              <i className="fas fa-exchange-alt mr-2 color-tron-100" />
                              <Link className="color-tron-100" to=''>
                                -- {tu("transactions")}
                              </Link>
                            </div>
                            <div className="text-gray-dark break-word d-flex list-item-word">
                              <span className="mr-2 color-grey-300">{tu("produced_by")}:</span>
                              {/* <AddressLink address={} truncate={false}> */}
                              <span className="color-tron-100">--</span>
                              {/* </AddressLink> */}
                            </div>

                          </div>
                          <div className="ml-auto text-right d-flex flex-column pt-2">
                            {
                              IS_MAINNET && <div className="text-gray-dark break-word color-grey-200 list-item-word"
                                style={styles.nowrap}><span className="d-inline-block">{tu("block_reward")}:</span> --
                                </div>
                            }
                            <div className="text-muted color-grey-300 small" style={styles.nowrap}>
                              --
                              </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                )
                
              }
            </PerfectScrollbar>
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
    isRightText: state.app.isRightText
  };
}

const mapDispatchToProps = {
  loadBlocks,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTimers(injectIntl(RecentBlocks)))


const styles = {
  list: {
    overflowX: 'none',
    height: 594,
  },
  card: {
    border: 'none',
    borderRadius: 0
  },
  nowrap: {
    flex: 1,
    whiteSpace: 'nowrap'
  }
};

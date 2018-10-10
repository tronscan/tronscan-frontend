import React, {Fragment} from "react";
import {Sticky, StickyContainer} from "react-sticky";
import Paging from "../../common/Paging";
import {Client} from "../../../services/api";
import {TransactionHashLink, BlockNumberLink, AddressLink} from "../../common/Links";
import {FormattedNumber, injectIntl} from "react-intl";
import {tu} from "../../../utils/i18n";
import TimeAgo from "react-timeago";
import {TronLoader} from "../../common/loaders";
import {Truncate} from "../../common/text";
import {ContractTypes} from "../../../utils/protocol";
import SmartTable from "../../common/SmartTable"
import {upperFirst} from "lodash";

class Transactions extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      filter: {},
      transactions: [],
      total: 0,
      emptyState: props.EmptyState || (
          <TronLoader>
            Loading Transactions
          </TronLoader>
      )
    };
  }

  componentDidMount() {
    this.loadTransactions();
  }

  onChange = (page, pageSize) => {
    this.loadTransactions(page, pageSize);
  };
  changeWapper () {
   
    const oWapper = document.getElementById('event-wapper')
    if(oWapper.style.display == 'none'){
      oWapper.style.display = 'block'
    }else{
      oWapper.style.display = 'none'
    }
  }

  loadTransactions = async (page = 1, pageSize = 40) => {

    let {filter, isInternal = false} = this.props;

    this.setState({loading: true});

    let transactions = await Client.getContractTxs({
      sort: '-timestamp',
      limit: pageSize,
      start: (page - 1) * pageSize,
      ...filter,
    });

    this.setState({
      transactions: transactions.data,
      loading: false,
    });
  };

  customizedColumn = () => {
    let {intl, isInternal = false} = this.props;
    
    let column = [
      {
        title: 'TxHash | Block | Age',
        dataIndex: 'txHash',
        key: 'txHash',
        align: 'left',
        width: '150px',
        className: 'ant_table',
        render: (text, record, index) => {
          return <Truncate>
                  <AddressLink address="TAUN6FwrnwwmaEqYcckffC7wYmbaS6cBi"/>
                  #<BlockNumberLink number={2450578}/><br/>
                  <TimeAgo date={1539071616000}/>
                </Truncate>
        }
      },
      {
        title: 'Method',
        dataIndex: 'Method',
        key: 'Method',
        align: 'left',
        width: '250px',
        className: 'ant_table',
        render: (text, record, index) => {
          return <Truncate>
                  <div>transfer(address,uint256）</div>
                  <div>Ύx797af627]</div>
                </Truncate>
        }
      },
      {
        title: 'Event Logs',
        dataIndex: 'Logs',
        key: 'Logs',
        align: 'left',
        className: 'ant_table',
        render: (text, record, index) => {
          return <div className="event">
                    <div><a onClick={this.changeWapper}>Transfer</a>(<span className="e-blue"> address <span className="e-red">owner</span></span> 
                               
                                <span className="e-blue"> bytes32 <span className="e-red">operation</span></span> 
                                
                                <span className="e-blue"> uint256  <span className="e-red">value</span></span> 
                               
                                <span className="e-blue"> address <span className="e-red">owner</span></span> 
                                
                    )</div>
                    <div id="event-wapper" className=" p-3">
                      <div className="mb-1">
                        <span className="e-blue"> address <span className="e-red">owner</span></span>
                        <AddressLink address="TAUN6FwrnwwmaEqYcckffC7wYmbaS6cBi"/>
                      </div>
                      <div className="mb-1">
                        <span className="e-blue"> address <span className="e-red">owner</span></span>
                        <AddressLink address="TAUN6FwrnwwmaEqYcckffC7wYmbaS6cBi"/>
                      </div>
                    </div>

                    <div>
                      <select className="form-control-sm" id="exampleFormControlSelect1">
                        <option>Hex</option>
                        <option>Number</option>
                        <option>Text</option>
                        <option>Address</option>
                      </select>
                      <i className="fa fa-arrow-right mx-2" aria-hidden="true"></i>
                      <span>0000000000000000000000002903cadbe271e057edef157340b52a5898d7424f</span>
                    </div>
                  </div>
        }
      },
    ];
    return column;
  }

  render() {

    let {transactions, total, loading, EmptyState = null} = this.state;
    let {match, intl} = this.props;
    let column = this.customizedColumn();
    let tableInfo = intl.formatMessage({id: 'view_total'}) + ' ' + total + ' ' + intl.formatMessage({id: 'contract_unit'})

    return (
      <Fragment>
       
        {loading && <div className="loading-style" style={{marginTop: '-20px'}}><TronLoader/></div>}
        {/* <p>{tableInfo}</p> */}
        <div className="row">
          <div className="col-md-12 event-main">
              {total ? <div className="table_pos_info" style={{left: 'auto'}}>{tableInfo}</div> : ''}
              <SmartTable bordered={true} loading={loading}
                          column={column} data={transactions} total={total}
                          onPageChange={(page, pageSize) => {
                            this.loadContracts(page, pageSize)
                          }}/>
          </div>
        </div>
      </Fragment>
    )}
}

export default injectIntl(Transactions)

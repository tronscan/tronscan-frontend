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
import {upperFirst, forIn, uniqWith, isEqual} from "lodash";
import xhr from "axios/index";
import {API_URL} from "../../../constants";
import tronWeb from 'tronweb';
import { Select } from 'antd';
const Option = Select.Option;

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
  changeWapper (index) {
    const oWapper = document.getElementById('event-wapper'+index)
    if(oWapper.style.display == 'block'){
      oWapper.style.display = 'none'
    }else{
      oWapper.style.display = 'block'
    }
  }

  loadTransactions = async (page = 1, pageSize = 40) => {

    let {filter, intl, isInternal = false} = this.props;

    this.setState({loading: true});

    let contractEvent = await Client.getContractEvent(filter.address);

    let newList = [] 
    contractEvent.map((item, index) => {
      let eventList = []
      forIn(item.result, (value, key) => {
        eventList.push({
          name: key,
          value
        })
      })
      item.eventList = eventList
    })
    
    const list = uniqWith(contractEvent, isEqual)
    this.setState({
      transactions:list,
      total: list.length,
      loading: false
    });
  };

  handleChange(value, index, string) {
    const oSele = document.getElementById('select_'+index)
    var statusmap = {
      Hex () {
        return string
      },
      Text() {
        return tronWeb.toUtf8(string)
      },
      Number(){
        return parseInt(string,16)
      },
      Address(){
        return tronWeb.address.fromHex(string)
      }
    }
    oSele.innerHTML = statusmap[value]()
  }
  getaddress(string) {
    return tronWeb.address.fromHex(41 + string.split('0x')[1])
  }

  customizedColumn = () => {
    let {intl, isInternal = false} = this.props;
    
    let column = [
      {
        title: upperFirst(intl.formatMessage({id: 'TxHash_Block_Age'})),
        dataIndex: 'txHash',
        key: 'txHash',
        align: 'left',
        width: '150px',
        className: 'ant_table',
        render: (text, record, index) => {
          return <Truncate>
                  <TransactionHashLink hash={record.transaction_id}>{record.transaction_id}</TransactionHashLink><br/>
                  <span className="contract-event-block-number">#</span><BlockNumberLink number={record.block_number}/><br/>
                  <TimeAgo date={record.block_timestamp}/>
                </Truncate>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'Method'})),
        dataIndex: 'Method',
        key: 'Method',
        align: 'left',
        width: '250px',
        className: 'ant_table',
        render: (text, record, index) => {
          return <Truncate>
                  <div>{record.event_name}</div>
                  <div></div>
                </Truncate>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'Event_Logs'})),
        dataIndex: 'block_number',
        key: 'block_number',
        align: 'left',
        className: 'ant_table',
        render: (text, record, index) => {
          return <div className="event">
                    <div><a onClick={this.changeWapper.bind(this,index)} className="mr-2">{record.event_name}</a>
                    ( {
                       record.eventList.map(item => {
                        return (
                          <span className="e-blue" key={item.name}> {record.result_type[item.name]} <span className="e-red">{item.name}</span></span>
                        )
                       })
                    } )
                    </div>
                    <div id={"event-wapper"+index} className="event-wapper p-3">{
                      record.eventList.map(item => {
                        return <div className="mb-2" key={item.name}>
                        <span className="e-blue mr-2">{record.result_type[item.name]} <span className="e-red">{item.name}</span></span>

                        {record.result_type[item.name] == 'address'?
                          <AddressLink address={this.getaddress(item.value)}/>:
                          <div>{item.value}</div>
                        }
                      </div>
                      })
                    }</div>
                    
                    {record.row&&
                      <div className="event-topic">{
                        record.row.topics.map( (item,index) => {
                          return <p key={index}>[topic {index}] {item}</p>
                        })
                      }
                      </div>
                    }

                    <div>

                    {record.row&&
                      <span>
                        <Select defaultValue="Hex" style={{ width: 80 }} onChange={ value => { this.handleChange(value, index , record.row.data) }}>
                          <Option value="Hex">Hex</Option>
                          <Option value="Text">Text</Option>
                          <Option value="Number">Number</Option>
                          <Option value="Address">Address</Option>
                        </Select>
                        <i className="fa fa-arrow-right mx-2" aria-hidden="true"></i>
                        <span id={'select_'+index} className="event-hex">{ record.row.data}</span>
                      </span>
                    }
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
    let tableInfo = intl.formatMessage({id: 'view_total'}) + ' ' + total + ' ' + intl.formatMessage({id: 'Events'})

    if (!loading && transactions.length === 0) {
      if (!EmptyState) {
        return (
            <div className="p-3 text-center no-data">{tu("no_event")}</div>
        );
      }

      return <EmptyState/>;
    }

    return (
      <Fragment>
       
        {loading && <div className="loading-style" style={{marginTop: '-20px'}}><TronLoader/></div>}
        <p className="m-0 pt-3" style={{color: '#999999'}}>{tableInfo}</p>
        <div className="row py-3">
          <div className="col-md-12 event-main">
              <SmartTable bordered={true} loading={loading}
                          pagination={false}
                          scroll={{ x: 1000 }}
                          column={column} data={transactions} total={total}
                          onPageChange={(page, pageSize) => {
                            this.loadTransactions(page, pageSize)
                          }}/>
          </div>
        </div>
      </Fragment>
    )}
}

export default injectIntl(Transactions)

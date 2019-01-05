import React, {Fragment} from "react";
import {FormattedDate, FormattedNumber, FormattedTime, injectIntl} from "react-intl";
import {Sticky, StickyContainer} from "react-sticky";
import Paging from "./Paging";
import {Client} from "../../services/api";
import {AddressLink, TransactionHashLink} from "./Links";
import {TRXPrice} from "./Price";
import {ONE_TRX} from "../../constants";
import {tu} from "../../utils/i18n";
import TimeAgo from "react-timeago";
import {Truncate} from "./text";
import {withTimers} from "../../utils/timing";
import SmartTable from "./SmartTable.js"
import {upperFirst} from "lodash";
import {TronLoader} from "./loaders";
import {ContractTypes} from "../../utils/protocol";
import rebuildList from "../../utils/rebuildList";
import {SwitchToken} from "./Switch";
import {QuestionMark} from "./QuestionMark";
import {NameWithId} from "./names";

import _ from "lodash";

class Transfers extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      filter: {},
      transfers: [],
      page: 1,
      total: 0,
      pageSize: 20,
      showTotal: props.showTotal !== false,
      emptyState: props.emptyState,
      autoRefresh: props.autoRefresh || false,
      hideSmallCurrency:true,
      tokenName:"_"
    };
  }

  componentDidMount() {
    let {page, pageSize} = this.state;
    this.load(page,pageSize);

    if (this.state.autoRefresh !== false) {
      this.props.setInterval(() => this.load(page,pageSize), this.state.autoRefresh);
    }
  }

  onChange = (page, pageSize) => {
      this.setState({
          page:page,
          pageSize:pageSize
      },() => {
          this.load(page, pageSize);
      });

  };

  load = async (page, pageSize) => {
    let transfersTRX;
    let {filter} = this.props;
    let {showTotal,hideSmallCurrency,tokenName} = this.state;
    this.setState({loading: true});

    let {transfers: list, total} = await Client.getTransfers({
      sort: '-timestamp',
      limit: pageSize,
      start: (page - 1) * pageSize,
      count: showTotal ? true : null,
      total: this.state.total,
      token: tokenName,
      ...filter,
    });

    const transfers = rebuildList(list, 'tokenName', 'amount')

    transfers.map( item => {
      if(filter.address){
        item.fromtip = !(item.transferFromAddress == filter.address)
        item.totip = !(item.transferToAddress == filter.address)
      }else{
        item.fromtip = true
        item.totip = true
      }
    })

    if(hideSmallCurrency){
        transfersTRX = _(transfers)
            .filter(tb => tb.tokenName === "_" || tb.tokenName === "TRX")
            .value();
    }else{
        transfersTRX = transfers

    }
    this.setState({
      page,
      transfers:transfersTRX,
      total:total,
      loading: false,
    });
  };
  handleSwitch = (val) => {
      let {page, pageSize} = this.state;
      if(val){
          this.setState({
              hideSmallCurrency: val,
              tokenName:"_",
          },() => {
              this.load(1,20);
          });
      }else {
          this.setState({
              hideSmallCurrency: val,
              tokenName:'',
          },() => {
              this.load(1,20);
          });
      }

  }
  customizedColumn = () => {
    let {intl} = this.props;
    let column = [
     
      {
        title: upperFirst(intl.formatMessage({id: 'hash'})),
        dataIndex: 'transactionHash',
        key: 'transactionHash',
        align: 'left',
        width: '20%',
        className: 'ant_table',
        render: (text, record, index) => {
          return <Truncate>
            <TransactionHashLink hash={text}>
              {text}
            </TransactionHashLink>
          </Truncate>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'age'})),
        dataIndex: 'timestamp',
        key: 'timestamp',
        align: 'left',
        className: 'ant_table',
        width: '14%',
        render: (text, record, index) => {
          return <TimeAgo date={text}/>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'from'})),
        dataIndex: 'transferFromAddress',
        key: 'transferFromAddress',
        align: 'left',
        className: 'ant_table',
        render: (text, record, index) => {
          return record.fromtip?
          <AddressLink address={text}/>:
          <Truncate><span>{text}</span></Truncate>
        }
      },
      {
        title: '',
        className: 'ant_table',
        width: '30px',
        render: (text, record, index) => {
          return <img src={require("../../images/arrow.png")}/>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'to'})),
        dataIndex: 'transferToAddress',
        key: 'transferToAddress',
        align: 'left',
        className: 'ant_table',
        render: (text, record, index) => {
          return record.totip?
          <AddressLink address={text}/>:
          <Truncate><span>{text}</span></Truncate>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'amount'})),
        dataIndex: 'amount',
        key: 'amount',
        align: 'right',
        className: 'ant_table _text_nowrap',
        render: (text, record, index) => {
          return <NameWithId value={record}/>
        }
      },
      // {
      //     title: upperFirst(intl.formatMessage({id: 'status'})),
      //     dataIndex: 'confirmed',
      //     key: 'confirmed',
      //     align: 'center',
      //     className: 'ant_table',
      //     render: (text, record, index) => {
      //         return record.confirmed?
      //             <span className="badge badge-success text-uppercase">{intl.formatMessage({id:'Confirmed'})}</span> :
      //             <span className="badge badge-danger text-uppercase">{intl.formatMessage({id: 'Unconfirmed'})}</span>
      //     },
      // }
    ];
    return column;
  }

  render() {

    let {transfers, page, total, pageSize, loading, emptyState: EmptyState = null} = this.state;
    let column = this.customizedColumn();
    let {intl} = this.props;

    let tableInfo = intl.formatMessage({id: 'view_total'}) + ' ' + total + ' ' + intl.formatMessage({id: 'transfers_unit'})
    let locale  = {emptyText: intl.formatMessage({id: 'no_transfers'})}
    // if (!loading && transfers.length === 0) {
    //   if (!EmptyState) {
    //     return (
    //         <div className="p-3 text-center no-data">{tu("no_transfers")}</div>
    //     );
    //   }
    //
    //   return <EmptyState/>;
    // }

    return (
        <div className="token_black table_pos">
          {loading && <div className="loading-style"><TronLoader/></div>}
            {
                transfers.length? <div className="d-flex justify-content-between" style={{left: 'auto'}}>
                  <div className="table_pos_info d-md-block table_pos_info_addr">{tableInfo} <span> <QuestionMark placement="top" text="to_provide_a_better_experience"></QuestionMark></span></div>
                  <div className="table_pos_switch d-md-block table_pos_switch_addr">
                    <SwitchToken  handleSwitch={this.handleSwitch} text="only_TRX_transfers" isHide={false}/>
                  </div>
                </div>:<div className="d-flex justify-content-between" style={{left: 'auto'}}>
                  <div className="table_pos_info d-md-block table_pos_info_addr2">{tableInfo}<span> <QuestionMark placement="top" text="to_provide_a_better_experience"></QuestionMark></span></div>
                  <div className="table_pos_switch d-md-block table_pos_switch_addr2">
                    <SwitchToken  handleSwitch={this.handleSwitch} text="only_TRX_transfers" isHide={false}/>
                  </div>
                </div>
            }

            {
                transfers.length?
                  <SmartTable bordered={true} loading={loading} column={column} data={transfers} total={total} locale={locale} addr="address"
                              onPageChange={(page, pageSize) => {
                                  this.onChange(page, pageSize)
                              }}/> :<div className="pt-5">
                  <SmartTable bordered={true} loading={loading} column={column} data={transfers} total={total} locale={locale} addr="address"
                              onPageChange={(page, pageSize) => {
                                  this.onChange(page, pageSize)
                              }}/>
                </div>
            }



        </div>
    )
  }
}

export default withTimers(injectIntl(Transfers));

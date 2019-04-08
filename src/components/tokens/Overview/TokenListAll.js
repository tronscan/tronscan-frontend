import React, {Component} from 'react';
import { FormattedNumber, injectIntl} from "react-intl";
import {t, tu} from "../../../utils/i18n";
import {Client} from "../../../services/api";
import {TokenLink, TokenTRC20Link} from "../../common/Links";
import {QuestionMark} from "../../common/QuestionMark";
import {API_URL, ONE_TRX} from "../../../constants";
import {upperFirst, toLower} from "lodash";
import {TronLoader} from "../../common/loaders";
import xhr from "axios/index";

import {withTronWeb} from "../../../utils/tronWeb";
import {Link} from "react-router-dom";
import { Button,Table } from 'antd';
@withTronWeb
class TokenList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      tokens: [],
      loading: false,
      total: 0,
      filter: {
        order: 'desc',
        filter: 'all',
        sort: 'marketcap'
      },
      pagination: {
        showQuickJumper:true,
        position: 'both',
        showSizeChanger: true,
        defaultPageSize:20,
        total: 0
      },
    };
  }

  loadPage = async (page = 1, pageSize = 20) => {
    const {filter} = this.state
    const {data: {tokens, total}} = await xhr.get("http://52.15.68.74:10000/api/tokens/overview", {params: {
      start:  (page - 1) * pageSize,
      limit: pageSize,
      ...filter
    }});

    tokens.map((item,index) => {
      item.index = index + 1
      item.marketcap = item.marketcap || 0
      item.nrOfTokenHolders = item.nrOfTokenHolders || '-'
      item.volume24hInTrx =  item.volume24hInTrx|| 0
      item.priceInTrx = item.priceInTrx || '-'

      if(item.gain){
        if(item.gain<0){
          item.color = 'col-red'
          item.gain = item.gain.toFixed(2) + '%'
        }else{
          item.color = 'col-green'
          item.gain = '+' + item.gain.toFixed(2) + '%'
        }
      }else{
        item.gain= '-'
      }
    })

    this.setState({
      loading: false,
      tokens,
      pagination: {
        ...this.state.pagination,
        total
      },
      total: total
    });
    return total;
  };

  componentDidMount() {
    this.loadPage();
  }

  onChange = (params) => {
    this.setState({
      filter: {
        ...this.state.filter,
        ...params
      }
    }, () =>  this.loadPage())
  };

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;

    const map = {
      descend: 'desc',
      ascend: 'asc'
    }
    const sortMap = {
      nrOfTokenHolders: 'holderCount',
      gain: 'gain',
      priceInTrx: 'priceInTrx',
      gain :'gain',
      volume24hInTrx: 'volume24hInTrx',
      marketcap: 'marketcap'
    }
    this.setState({
      pagination: pager,
      filter: {
        ...this.state.filter,
        sort: sortMap[sorter.columnKey] || 'marketcap',
        order: map[sorter.order] || 'desc'
      }
    }, () => this.loadPage(pager.current, pager.pageSize));
  }

  customizedColumn = () => {
    let {intl} = this.props;
    let column = [
      {
        title: '#',
        dataIndex: 'index',
        key: 'index',
        align: 'center',
        className: 'ant_table _text_nowrap',
      },
      {
        title: upperFirst(intl.formatMessage({id: 'token'})),
        dataIndex: 'name',
        key: 'name',
        width: '50%',
        render: (text, record, index) => {
          return <div className="table-imgtext">
            {record.imgUrl ?
                <div style={{width: '42px', height: '42px', marginRight: '18px'}}>
                    {
                        record.id == 1002000? <div className="token-img-top">
                          <img style={{width: '42px', height: '42px'}} src={record.imgUrl}/>
                          <i></i>
                        </div>:<img style={{width: '42px', height: '42px'}} src={record.imgUrl}/>
                    }
                </div> :
                <div style={{width: '42px', height: '42px', marginRight: '18px'}}><img
                    style={{width: '42px', height: '42px'}} src={require('../../../images/logo_default.png')}/></div>
            }

            <div>
              <h5>
                {
                  record.tokenType == 'trc10'&&
                  <TokenLink 
                    name={record.name} 
                    id={record.tokenId}
                    namePlus={record.name + ' (' + record.abbr + ')'}/>
                }
                {
                  record.tokenType == 'trc20'&&
                  <TokenTRC20Link 
                    name={record.name}
                    namePlus={record.name + ' (' + record.abbr + ')'} 
                    address={record.contractAddress}/>
                }
              </h5>
              <p style={{wordBreak: "break-all"}}>{record.description}</p>
            </div>
          </div>
        }
      },
      {
        title: intl.formatMessage({id: 'price'})+ ' (TRX)',
        dataIndex: 'priceInTrx',
        key: 'priceInTrx',
        sorter: true,
        align: 'center',
        className: 'ant_table d-none d-md-table-cell _text_nowrap'
      },
      {
        title: intl.formatMessage({id: 'gain'}),
        sorter: true,
        dataIndex: 'gain',
        key: 'gain',
        render: (text, record, index) => {
          return <div className={record.color}>{record.gain}</div>
        },
        align: 'center',
        className: 'ant_table d-none d-md-table-cell _text_nowrap'
      },
      {
        title: intl.formatMessage({id: 'volume_24_trx'}),
        dataIndex: 'volume24hInTrx',
        key: 'volume24hInTrx',
        align: 'center',
        className: 'ant_table',
        sorter: true,
        render: (text, record, index) => {
          return text>0? <FormattedNumber value={text} maximumFractionDigits={2}/>: '-'
        }
      },
      {
        title: intl.formatMessage({id: 'market_capitalization'}),
        dataIndex: 'marketcap',
        key: 'marketcap',
        sorter: true,
        render: (text, record, index) => {
          return text>0? <FormattedNumber value={text}/>: '-'
        },
        align: 'center',
        className: 'ant_table _text_nowrap'
      },
      {
        title: intl.formatMessage({id: 'token_holders'}),
        dataIndex: 'nrOfTokenHolders',
        key: 'nrOfTokenHolders',
        sorter: true,
        render: (text, record, index) => {
          return text>0? <FormattedNumber value={text}/>: '-'
        },
        align: 'center',
        className: 'ant_table d-none d-sm-table-cell'
      }
    ];
    return column;
  }

  render() {
    let {tokens, alert, loading, total, totalAll} = this.state;
    let {match, intl} = this.props;
    let column = this.customizedColumn();
    let tableInfo = intl.formatMessage({id: 'part_total'}) + ' ' + total + '/' + totalAll + ' ' + intl.formatMessage({id: 'part_pass'})
    return (
        <main className="container header-overlap token_black">
          {alert}
          {loading && <div className="loading-style"><TronLoader/></div>}
          {
            <div className="row">
              <div className="col-md-12 table_pos">
                {total ?
                  <div className="table_pos_info d-none d-md-block" style={{left: 'auto', top: '0px'}}>
                      <div className="d-flex align-items-center mb-1">
                        {tu('token_fliter')}:   
                        <Button className="mx-2" onClick={() => this.onChange({filter: 'trc10'})}>{tu('TRC10_token')}</Button>  
                        <Button onClick={() => this.onChange({filter: 'trc20'})}>{tu('TRC20_token')}</Button>
                      </div>
                      <div>
                        {tableInfo} <span>
                          <QuestionMark placement="top" text="newly_issued_token_by_tronscan" className="token-list-info"></QuestionMark>
                        </span> &nbsp;&nbsp;  
                        <Link to="/exchange/trc10">{t("Trade_on_TRXMarket")}></Link>
                      </div>
                    </div> : ''}
                    <a className="apply-trc20" href="https://goo.gl/forms/PiyLiDeaXv3uesSE3" target="_blank" style={{color:'#C23631'}}>
                      <button className="btn btn-danger">
                          {tu('application_entry')}
                      </button>
                    </a>
                <Table
                  columns={column}
                  rowKey={record => record.index}
                  dataSource={tokens}
                  loading={this.state.loading}
                  onChange={this.handleTableChange}
                  pagination={this.state.pagination}
                  bordered={true}
                />

              </div>
            </div>
          }
        </main>

    )
  }
}

export default injectIntl(TokenList)

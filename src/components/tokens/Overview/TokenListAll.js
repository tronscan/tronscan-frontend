import React, {Component} from 'react';
import { FormattedNumber, injectIntl} from "react-intl";
import {t, tu} from "../../../utils/i18n";
import {Client} from "../../../services/api";
import {TokenLink, TokenTRC20Link} from "../../common/Links";
import {QuestionMark} from "../../common/QuestionMark";
import {API_URL, ONE_TRX, ONE_USDJ, ONE_JST, IS_MAINNET, CONTRACT_ADDRESS_USDJ, CONTRACT_ADDRESS_USDJ_TESTNET, CONTRACT_ADDRESS_JED,CONTRACT_ADDRESS_JED_TESTNET} from "../../../constants";
import {upperFirst, toLower} from "lodash";
import {TronLoader} from "../../common/loaders";
import xhr from "axios/index";
import {Tooltip} from "reactstrap";
import {withTronWeb} from "../../../utils/tronWeb";
import {Link} from "react-router-dom";
import { Button,Table, Radio, Divider, Row, Col } from 'antd';
import { TRXPrice } from "../../common/Price";
import { connect } from "react-redux";
import { loadUsdPrice } from "../../../actions/blockchain";
@withTronWeb
class TokenList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      tokens: [],
      loading: false,
      total: 0,
      totalAll: 0,
      countTop:0,
      filter: {
        order: 'desc',
        filter: 'all',
        sort: 'marketcap',
        order_current: "descend"
      },
      pagination: {
        showQuickJumper:true,
        position: 'bottom',
        showSizeChanger: true,
        defaultPageSize:20,
        total: 0
      },
      marketCapTip: false,
      currentWeekAll: 0,
      currentWeekTotalAll: 0,
      valueAtLeast: 0
    };
  }

  loadPage = async (page = 1, pageSize = 20) => {
    this.setState({loading: true})
    const { filter, countTop } = this.state
    const res = await xhr.get(API_URL+"/api/tokens/overview", {params: {
      start:  (page - 1) * pageSize,
      limit: pageSize,
      ...filter
    }}).catch(e=>{
      this.setState({loading: false})
    });
    if(!res){
      return
    }
    const {data: {tokens, total, totalAll, all,currentWeekAll,currentWeekTotalAll,valueAtLeast}} =res
    let count = 0;
    let Top = 0;
    tokens.map((item,index) => {
      if(!item.isTop){
        if(page == 1){
            item.index = count + 1 + (page-1)*pageSize
        }else{
            item.index = count + 1 + (page-1)*pageSize - countTop
        }
        count++
      }else{
          Top = Top + 1
          this.setState({
              countTop:Top
          },()=>{
              item.index = count + 1 + (page-1)*pageSize - countTop
          });
      }
     
      // item.marketcap = item.marketcap || 0
      // item.nrOfTokenHolders = item.nrOfTokenHolders || '-'
      // item.volume24hInTrx =  item.volume24hInTrx|| 0
      // item.priceInTrx = item.priceInTrx || '-'

      if(item.gain != undefined){
        item.gain = item.gain * 100
        if(item.gain<0){
          item.color = 'col-red'
          item.gain = item.gain.toFixed(2) + '%'
        }
        if(item.gain>0){
          item.color = 'col-green'
          item.gain = '+' + item.gain.toFixed(2) + '%'
        }
        if(item.gain==0){
          item.color = 'col-gray'
          item.gain =  '0%'
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
      total: total,
      totalAll,
      all,
      currentWeekAll,
      currentWeekTotalAll,
      valueAtLeast
    });
    return total;
    
  };

  componentDidMount() {
    this.loadPage();
    // this.getUsdPrice();
    this.props.loadUsdPrice();
  }

  onChange = (e) => {
    
    this.setState({
      filter: {
        ...this.state.filter,
        order: 'desc',
        sort: 'marketcap',
        filter: e.target.value,
        order_current: "descend"
      },
      pagination: {
        current:1
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
      volume24hInTrx: 'volume24hInTrx',
      marketcap: 'marketcap'
    }
    if(sorter.order === undefined){
      sorter['order']= 'ascend'
    }
    this.setState({
      pagination: pager,
      filter: {
        ...this.state.filter,
        sort: sortMap[sorter.columnKey] || 'marketcap',
        order: map[sorter.order] || 'desc',
        order_current: sorter.order
      }
    }, () => this.loadPage(pager.current, pager.pageSize));
  }

  customizedColumn = () => {
    let { filter, valueAtLeast } = this.state;
    let { intl, priceUSD } = this.props;
    const defaultImg = require("../../../images/logo_default.png");

    let column = [
      {
        title: upperFirst(intl.formatMessage({id: 'token_rank'})),
        dataIndex: 'index',
        key: 'index',
        width: '48px',
        align: 'center',
        className: 'ant_table _text_nowrap token-rank-wrap',
        render: (text, record, index) => {
            return <span>
                    {record.isTop?
                        <div>
                            <span className="starbeat"><i className="fas fa-star"></i> </span>
                            <span className="star-tip"></span>
                        </div>
                        :
                        <span>{text}</span>}
                    {record.level > 100?<img src={require('../../../images/token/hot.png')}></img>:''}
                  </span>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'token'})),
        dataIndex: 'name',
        key: 'name',
        width: '50%',
        render: (text, record, index) => {
          
          return (
            <div className="table-imgtext">
              {record.imgUrl ? (
                <div
                  style={{ width: "42px", height: "42px", marginRight: "18px" }}
                >
                  {record.abbr == "USDT" ||
                  record.abbr == "BTT" ||
                  record.abbr == "WIN" ? (
                    <div className="token-img-top">
                      <img
                        style={{ width: "42px", height: "42px" }}
                        src={record.imgUrl}
                        onError={e => {
                          e.target.onerror = null;
                          e.target.src = defaultImg;
                        }}
                      />
                      <i></i>
                    </div>
                  ) : (
                    <img
                      style={{ width: "42px", height: "42px" }}
                      src={record.imgUrl}
                      onError={e => {
                        e.target.onerror = null;
                        e.target.src = defaultImg;
                      }}
                    />
                  )}
                </div>
              ) : (
                <div
                  style={{ width: "42px", height: "42px", marginRight: "18px" }}
                >
                  <img
                    style={{ width: "42px", height: "42px" }}
                    src={defaultImg}
                  />
                </div>
              )}

              <div>
                <h5>
                  {record.isTop &&
                  record.contractAddress ==
                    "TNYNLRkqq956bQc2buvoLbaLgh25RkJMiN" ? (
                    <a href="javascript:;">
                      {record.name + " (" + record.abbr + ")"}
                    </a>
                  ) : (
                    <div>
                      {record.tokenType == "trc10" && (
                        <TokenLink
                          name={record.name}
                          id={record.tokenId}
                          namePlus={record.name + " (" + record.abbr + ")"}
                        />
                      )}
                      {record.tokenType == "trc20" && (
                        <TokenTRC20Link
                          name={record.name}
                          namePlus={record.name + " (" + record.abbr + ")"}
                          address={record.contractAddress}
                        />
                      )}
                    </div>
                  )}
                </h5>
                <p className="multi-line-overflow">{record.description}</p>
              </div>
            </div>
          );
        }
      },
      {
        title: intl.formatMessage({id: 'price'}),
        dataIndex: 'priceInTrx',
        key: 'priceInTrx',
        sorter: true,
        sortOrder: filter.sort === 'priceInTrx' && filter.order_current,
        align: 'left',
        className: 'ant_table d-none d-md-table-cell _text_nowrap',
        render:(text, record, index)=>{
          return (
            text ? (<div className="d-flex flex-column">
              <span>{(text*priceUSD).toFixed(6)}{' USD'}</span>
              {text && record.contractAddress != 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t' ? <span className="trx-price">{text.toFixed(6)}{' TRX'}</span> : ''}
            </div>) : (
              <div>
              {
                (record.contractAddress == CONTRACT_ADDRESS_USDJ || record.contractAddress == CONTRACT_ADDRESS_USDJ_TESTNET) &&  <span>{ ONE_USDJ.toFixed(6)} {' USD'}</span>
              }
              {
                (record.contractAddress == CONTRACT_ADDRESS_JED || record.contractAddress == CONTRACT_ADDRESS_JED_TESTNET) && <span>{ ONE_JST.toFixed(6)} {' USD'}</span>
              }
              { (record.contractAddress == CONTRACT_ADDRESS_USDJ || record.contractAddress == CONTRACT_ADDRESS_USDJ_TESTNET || record.contractAddress == CONTRACT_ADDRESS_JED || record.contractAddress == CONTRACT_ADDRESS_JED_TESTNET) ? "": "-"}
            </div>
            )
          )
        }
      },
      {
        title: () => {
          return (
            <div>
              <span className="mr-2">
                <QuestionMark placement="top" text="gain_tip" />
              </span>
              {upperFirst(intl.formatMessage({ id: "gain" }))}
            </div>
          )
        },
        sorter: true,
        sortOrder: filter.sort === 'gain' && filter.order_current,
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
        align: 'left',
        className: 'ant_table',
        sorter: true,
        sortOrder: filter.sort === 'volume24hInTrx' && filter.order_current,
        render: (text, record, index) => {
          // return text>0? <FormattedNumber value={text} maximumFractionDigits={2}/>: '-'
          return (
            text ? (<div className="d-flex flex-column">
              <span><FormattedNumber value={text*priceUSD} maximumFractionDigits={2}/>{' USD'}</span>
              {text && record.contractAddress != 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t' ? <span className="trx-price"><FormattedNumber value={text} maximumFractionDigits={2}/>{' TRX'}</span> : ''}
            </div>) : '-'
          )
        }
      },
      {
        // title: intl.formatMessage({id: 'market_capitalization_trx'}),
        title: () => {
          let text = intl.formatMessage({id: 'total_supply_tip1'}) + valueAtLeast + intl.formatMessage({id: 'total_supply_tip2'});
          return (
            <div>
              <span className="mr-2">
                <QuestionMark placement="top" text={text} />
              </span>
              {upperFirst(intl.formatMessage({ id: "market_capitalization_t" }))}
            </div>
          )
        },
        dataIndex: 'marketcap',
        key: 'marketcap',
        sorter: true,
        sortOrder: filter.sort === 'marketcap' && filter.order_current,
        render: (text, record, index) => {
          // return text>0? <FormattedNumber value={text}/>: '-'
          return (
            text ? (<div className="d-flex flex-column">
              <span><FormattedNumber value={text*priceUSD} maximumFractionDigits={2}/>{' USD'}</span>
              {text && record.contractAddress != 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t' ? <span className="trx-price"><FormattedNumber value={text} maximumFractionDigits={2}/>{' TRX'}</span> : ''}
            
            </div>) : "-"
          )
        },
        align: 'left',
        className: 'ant_table _text_nowrap'
      },
      {
        title: intl.formatMessage({id: 'token_holders'}),
        dataIndex: 'nrOfTokenHolders',
        key: 'nrOfTokenHolders',
        sorter: true,
        sortOrder: filter.sort === 'holderCount' && filter.order_current,
        render: (text, record, index) => {
            return text>0? <FormattedNumber value={text}/>: '-'
        },
        align: 'center',
        className: 'ant_table d-none d-sm-table-cell'
      },
      {
          title: intl.formatMessage({id: 'trc20_cur_order_header_action'}),
          dataIndex: 'abbr',
          key: 'abbr',
          width: '11%',
          render: (text, record, index) => {
            return <div>
              {
                  record.tokenType == 'trc10'&&
                  <Link to={`/token/${encodeURI(record.tokenId)}`} className="token-details btn" style={{textTransform:'capitalize'}}>{tu('details')}</Link>
              }
              {
                  record.tokenType == 'trc20'&&
                  <Link to={`/token20/${encodeURI(record.contractAddress)}`} className="token-details btn" style={{textTransform:'capitalize'}}>{tu('details')}</Link>
              }
              {
                  IS_MAINNET&& <span>
                    {(record.extra && record.extra.url && record.extra.desc) ? <a href={record.extra.url} className="token-active-details btn mt-2"  style={{textTransform:'capitalize'}}>{tu(record.extra.desc)}</a>
                        : (record.pairId )?
                            <Link to={`/exchange/trc20?id=${record.pairId}`} className="token-details btn mt-2" target="_blank" style={{textTransform:'capitalize'}}> {tu('token_trade')}</Link>
                            : <div>
                              <a href="javascript:;"
                                 className="token-disabled-exchange btn mt-2"
                                 style={{textTransform:'capitalize'}}
                                 id={record.tokenType == "trc20"?"exchange_"+record.contractAddress:"exchange_"+record.tokenId}
                                 onMouseOver={(prevS,props) => this.setState({[record.abbr + record.tokenId]: true})}
                                 onMouseOut={() => this.setState({[record.abbr+record.tokenId]: false})}>
                                  {tu('token_trade')}
                              </a>
                              <Tooltip placement="top" target={record.tokenType == "trc20"?"exchange_"+record.contractAddress:"exchange_"+record.tokenId} isOpen={this.state[record.abbr+record.tokenId]}> <span className="text-capitalize">{tu("token_does_not_support_exchange")}</span></Tooltip>
                            </div>}
                </span>

              }

            </div>

          },
          align: 'center',
          className: 'ant_table d-sm-table-cell token-list-action'
      }
    ];
    return column;
  }
  suncustomizedColumn = () => {
    let {filter} = this.state
    let { intl } = this.props;
    const defaultImg = require("../../../images/logo_default.png");
        let column = [
            {
                title: '#',
                dataIndex: 'index',
                key: 'index',
                width: '48px',
                align: 'center',
                className: 'ant_table _text_nowrap',
                render: (text, record, index) => {
                    return <span>
                {
                    record.isTop?
                        <div>
                          <span className="starbeat"><i className="fas fa-star"></i> </span>
                          <span className="star-tip"></span>
                        </div>
                        :
                        <span>{text}</span>
                }

            </span>
                }
            },
            {
                title: upperFirst(intl.formatMessage({id: 'token'})),
                dataIndex: 'name',
                key: 'name',
                width: '50%',
                render: (text, record, index) => {
                    return (
                      <div className="table-imgtext">
                        {record.imgUrl ? (
                          <div
                            style={{
                              width: "42px",
                              height: "42px",
                              marginRight: "18px"
                            }}
                          >
                            {record.abbr == "USDT" ||
                            record.abbr == "BTT" ||
                            record.abbr == "WIN" ? (
                              <div className="token-img-top">
                                <img
                                  style={{ width: "42px", height: "42px" }}
                                  src={record.imgUrl}
                                  onError={e => {
                                    e.target.onerror = null;
                                    e.target.src = defaultImg;
                                  }}
                                />
                                <i></i>
                              </div>
                            ) : (
                              <img
                                style={{ width: "42px", height: "42px" }}
                                src={record.imgUrl}
                                onError={e => {
                                  e.target.onerror = null;
                                  e.target.src = defaultImg;
                                }}
                              />
                            )}
                          </div>
                        ) : (
                          <div
                            style={{
                              width: "42px",
                              height: "42px",
                              marginRight: "18px"
                            }}
                          >
                            <img
                              style={{ width: "42px", height: "42px" }}
                              src={defaultImg}
                            />
                          </div>
                        )}

                        <div>
                          <h5>
                            {record.isTop &&
                            record.contractAddress ==
                              "TNYNLRkqq956bQc2buvoLbaLgh25RkJMiN" ? (
                              <a href="javascript:;">
                                {record.name + " (" + record.abbr + ")"}
                              </a>
                            ) : (
                              <div>
                                {record.tokenType == "trc10" && (
                                  <TokenLink
                                    name={record.name}
                                    id={record.tokenId}
                                    namePlus={
                                      record.name + " (" + record.abbr + ")"
                                    }
                                  />
                                )}
                                {record.tokenType == "trc20" && (
                                  <TokenTRC20Link
                                    name={record.name}
                                    namePlus={
                                      record.name + " (" + record.abbr + ")"
                                    }
                                    address={record.contractAddress}
                                  />
                                )}
                              </div>
                            )}
                          </h5>
                          <p style={{ wordBreak: "break-all" }}>
                            {record.description}
                          </p>
                        </div>
                      </div>
                    );
                }
            },
            {
                title:intl.formatMessage({id: 'DAppChain_holders'}),
                dataIndex: 'nrOfTokenHolders',
                key: 'nrOfTokenHolders',
                sorter: true,
                sortOrder: filter.sort === 'holderCount' && filter.order_current,
                render: (text, record, index) => {
                    return text>0? <FormattedNumber value={text}/>: '-'
                },
                align: 'center',
                className: 'ant_table d-none d-sm-table-cell'
            },
            {
                title: intl.formatMessage({id: 'trc20_cur_order_header_action'}),
                dataIndex: 'abbr',
                key: 'abbr',
                width: '10%',
                render: (text, record, index) => {
                    return <div>
                        {
                            record.tokenType == 'trc10'&&
                            <Link to={`/token/${encodeURI(record.tokenId)}`} className="token-details btn">{tu('details')}</Link>
                        }
                        {
                            record.tokenType == 'trc20'&&
                            <Link to={`/token20/${encodeURI(record.contractAddress)}`} className="token-details btn">{tu('details')}</Link>
                        }
                        {
                            IS_MAINNET&& <span>
                           {(record.extra && record.extra.url && record.extra.desc)? <a href={record.extra.url} className="token-active-details btn mt-2">{tu(record.extra.desc)}</a>
                            : (record.pairId )?
                            <Link to={`/exchange/trc20?id=${record.pairId}`} className="token-details btn mt-2"> {tu('token_trade')}</Link>
                            : <div>
                                  <a href="javascript:;"
                                     className="token-disabled-exchange btn mt-2"
                                     id={record.tokenType == "trc20"?"exchange_"+record.contractAddress:"exchange_"+record.tokenId}
                                     onMouseOver={(prevS,props) => this.setState({[record.abbr + record.tokenId]: true})}
                                     onMouseOut={() => this.setState({[record.abbr+record.tokenId]: false})}>
                                      {tu('token_trade')}
                                  </a>
                                  <Tooltip placement="top" target={record.tokenType == "trc20"?"exchange_"+record.contractAddress:"exchange_"+record.tokenId} isOpen={this.state[record.abbr+record.tokenId]}> <span className="text-capitalize">{tu("token_does_not_support_exchange")}</span></Tooltip>
                            </div>}
                </span>

                        }

                    </div>

                },
                align: 'center',
                className: 'ant_table d-sm-table-cell token-list-action'
            }
        ];
        return column;
    }

  render() {
    let {tokens, alert, loading, total, totalAll, all,currentWeekAll, currentWeekTotalAll, filter} = this.state;
    let {match, intl} = this.props;
    let column = IS_MAINNET?this.customizedColumn():this.suncustomizedColumn();
    let mainInfo = `${intl.formatMessage({id: 'part_total'})} ${total} ${intl.formatMessage({id: 'token_unit'})}`;
    //let mainInfo = `${intl.formatMessage({id: 'token_list_count'})} : ${total} `;
    let sunInfo = `${intl.formatMessage({id: 'token_list_count'})} : ${total} , ${intl.formatMessage({id: 'total_in_tronscan'})} : ${totalAll} `;

    let url = 'https://poloniex.org/launchBase?utm_source=TS3'
    if(intl.locale == 'zh'){
      url = 'https://poloniex.org/zh/launchBase?utm_source=TS3'
    }
    return (
        <main className="container header-overlap token_black">
          {alert}
          {loading && <div className="loading-style"><TronLoader/></div>}
          {
            <div className="row token-list-wrap">
              <div className="col-md-12 table_pos trc20-ad-bg pt-5 pt-md-0">
              {IS_MAINNET && <Link to={'/tokens/create'} className="create-token-btn">{tu('create_token')}</Link>}
                {total ?
                  <div className="d-md-block">
                      {all && IS_MAINNET && (
                        <div className="token-num-wrap d-flex d-sm-flex justify-content-between text-center my-3">
                          <div className="d-flex bg-white justify-content-center">
                            <div className="d-flex flex-column justify-content-center">
                              <div ><FormattedNumber value={all}/></div>
                              <div>{tu('token_tron_total')}</div>
                            </div>
                            <div></div>
                            <div className="d-flex flex-column justify-content-center">
                              <div><FormattedNumber value={currentWeekAll}/></div>
                              <div>{tu('token_week')}</div>
                            </div>
                          </div>
                          <div className="d-flex bg-white justify-content-center">
                            <div className="d-flex flex-column justify-content-center">
                              <div><FormattedNumber value={totalAll}/></div>
                              <div>{tu('token_scan_total')}</div>
                            </div>
                            <div></div>
                            <div className="d-flex flex-column justify-content-center">
                              <div><FormattedNumber value={currentWeekTotalAll}/></div>
                              <div>{tu('token_week')}</div>
                            </div>
                          </div>
                        </div>
                        )}
                      <div className="d-flex justify-content-between align-items-center mb-2 filter-wrap">
                        <div>
                          <div>
                            {all && !IS_MAINNET && <div>{tu('total_tron_ecosystem_tokens')}{all}</div>}
                            {IS_MAINNET ? mainInfo : sunInfo}  
                            {' '}
                            <span>
                              <QuestionMark placement="top" text="newly_issued_token_by_tronscan" className="token-list-info"></QuestionMark>
                            </span>
                          </div>
                            {/* {IS_MAINNET?<a href={`https://poloniex.org`} target="_blank" >{t("Trade_on_Poloni DEX")}></a>:''} */}
                        </div>
                        <div className="d-md-flex apply-trc20 apply-all align-items-center">
                          <div className="d-flex align-items-center mb-2 mb-md-0">
                            <Radio.Group size="Small" value={filter.filter}  onChange={this.onChange}>
                              <Radio.Button value="all">{tu('all')}</Radio.Button>
                              <Radio.Button value="trc10">TRC10</Radio.Button>
                              <Radio.Button value="trc20">TRC20</Radio.Button>
                            </Radio.Group>
                          </div>
                          {/**<a className="pl-2 md-2 ml-4" href="https://goo.gl/forms/PiyLiDeaXv3uesSE3" target="_blank" style={{color:'#C23631'}}>
                            <button className="btn btn-danger" style={{lineHeight: '18px'}}>
                                {tu('application_entry')}
                            </button>
                          </a> */}
                        </div>
                      </div>
                    </div> : ''}
                    

                <Table
                  columns={column}
                  rowKey={(record, index) => index}
                  dataSource={tokens}
                  loading={loading}
                  onChange={this.handleTableChange}
                  pagination={this.state.pagination}
                  bordered={true}
                  rowClassName={ (record, index) => {
                    if(record.isTop){
                      return 'trc20-star-ad'
                    }
                  }}
                  onRow={(record) => {
                    return {onClick: (event) => {
                      if(record.isTop &&  record.contractAddress == "TNYNLRkqq956bQc2buvoLbaLgh25RkJMiN"){
                        window.open(url)
                      }
                    }}}}
                />
              </div>
            </div>
          }
        </main>

    )
  }
}

// export default injectIntl(TokenList)
function mapStateToProps(state) {
  return {
    priceUSD: state.blockchain.usdPrice
  };
}

const mapDispatchToProps = {
  loadUsdPrice
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(TokenList));

import React, {Fragment} from "react";
import {tu} from "../../../utils/i18n";
import {AddressLink} from "../../common/Links";
import {Client} from "../../../services/api";
import {ONE_TRX, API_URL} from "../../../constants";
import SmartTable from "../../common/SmartTable.js"
import {FormattedNumber, injectIntl} from "react-intl";
import {TronLoader} from "../../common/loaders";
import {upperFirst, upperCase, lowerCase} from "lodash";
import { Tooltip } from 'antd';
import { FormatNumberByDecimals } from '../../../utils/number';
import {QuestionMark} from "../../common/QuestionMark";
import qs from 'qs'


class TokenHolders extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      filter: {},
      addresses: [],
      page: 0,
      total: 0,
      pageSize: 25
    };
  }

  componentDidMount() {
    this.loadTokenHolders();
  }

  componentDidUpdate() {

  }

  onChange = (page, pageSize) => {
    this.loadTokenHolders(page, pageSize);
  };

  loadTokenHolders = async (page = 1, pageSize = 20) => {
    let {filter, getCsvUrl} = this.props;
    this.setState({loading: true});
    const params = {
      sort: '-balance',
      limit: pageSize,
      start: (page - 1) * pageSize,
      count: true,
      address: filter.address
    }
    const query = qs.stringify({ format: 'csv',...params})
    getCsvUrl(`${API_URL}/api/tokenholders?${query}`)

    let {addresses, total, rangeTotal} = await Client.getTokenHolders(filter.token, params);

    // for (let index in addresses) {
    //   addresses[index].index = parseInt(index) + 1;
    // }
    let exchangeFlag = await Client.getTagNameList()

    if(addresses.length){
      addresses.map(item => {
        item.tagName = ''
        exchangeFlag.map(coin => {
          const typeList = Object.keys(coin.addressList)
          typeList.map(type => {
            if(coin.addressList[type].length == 1){
              if(coin.addressList[type][0] === item.address){
                item.tagName = `${upperFirst(coin.name)}${type !== 'default'? `-${type}`: ''}`
                if(lowerCase(coin.name) === 'binance'){
                  item.ico = lowerCase(coin.name)
                }
              }
            }else if(coin.addressList[type].length > 1){
              coin.addressList[type].map((address, index) => {
                if(address === item.address){
                  item.tagName = `${upperFirst(coin.name)}${type !== 'default'? `-${type} ${index + 1}`: ` ${index + 1}`}`
                  if(lowerCase(coin.name) === 'binance'){
                    item.ico = lowerCase(coin.name)
                  }
                }
              })
            }
          })
        })
       })
    }

    this.setState({
      page,
      addresses,
      total,
      rangeTotal,
      loading: false,
    });

  };
  customizedColumn = () => {
    let {intl, token,tokenPrecision} = this.props;
    let column = [
      {
        title: '#',
        dataIndex: 'index',
        key: 'index',
        width: '10%',
        align: 'left',
        className: 'ant_table',
      },
      {
        title: intl.formatMessage({id: 'address'}),
        dataIndex: 'address',
        key: 'address',
        render: (text, record, index) => {

          return record.ico?
              <Tooltip placement="topLeft" title={upperCase(intl.formatMessage({id: record.ico}))}>
                <span className="d-flex align-items-center">
                  <img src={require("../../../images/"+record.ico+'-logo.png')}
                      style={{width: '14px', marginLeft: '-20px', marginRight: '6px'}}
                  />
                <AddressLink address={record.address}/>
              </span>
            </Tooltip>:
            <AddressLink address={record.address}/>
          
        }
      },
      {
          title: 'Name Tag',
          dataIndex: 'addressTag',
          key: 'addressTag',
          align: 'left',
          width: '15%',
          render: (text, record, index) => {
              return <span style={{whiteSpace:'nowrap'}}> {record.addressTag} </span>
          }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'quantity'})),
        dataIndex: 'transactionHash',
        key: 'transactionHash',
        width: '20%',
        align: 'right',
        className: 'ant_table',
        render: (text, record, index) => {
          //return <FormattedNumber value={record.balance/ Math.pow(10,tokenPrecision.precision)}/>
          return <span>{FormatNumberByDecimals(record.balance , tokenPrecision.precision)}</span>
        }
      },
      {
        title: intl.formatMessage({id: 'percentage'}),
        dataIndex: 'percentage',
        key: 'percentage',
        width: '18%',
        align: 'right',
        className: 'ant_table',
        render: (text, record, index) => {
          return <div><FormattedNumber
              value={(((record.balance) / token.totalSupply) * 100)}
              maximumFractionDigits={6}
          /> %
          </div>

        }
      }
    ];

    return column;
  }

  render() {
    let {addresses, total, rangeTotal, loading} = this.state;
    let {intl} = this.props
    let column = this.customizedColumn();
    let tableInfo = intl.formatMessage({id: 'a_totle'}) + ' ' + total + ' ' + intl.formatMessage({id: 'hold_addr'})
    let tableInfoTip = intl.formatMessage({id: 'table_info_holders_tip1'}) + ' ' + rangeTotal + ' ' + intl.formatMessage({id: 'table_info_holders_tip2'});

    if (!loading && addresses.length === 0) {
      return (
          <div className="p-3 text-center no-data">{tu("no_holders_found")}</div>
      );
    }
    return (
        <Fragment>
          {loading && <div className="loading-style" style={{marginTop: '-20px'}}><TronLoader/></div>}
          <div className="row transfers">
            <div className="col-md-12 table_pos">
              {/* {total?<div className="table_pos_info d-none d-md-block">{tableInfo}</div>: ''} */}
              <div style={{paddingLeft:20}}>
                {total ?<div className="table_pos_info d-none d-md-block" style={{left: 'auto'}}>
                  <div>{tu('view_total')} {rangeTotal} {tu('hold_addr')}
                      { rangeTotal>= 10000?<QuestionMark placement="top" info={tableInfoTip} ></QuestionMark>:""}
                      <br/>
                      { rangeTotal>= 10000?<span>({tu('table_info_big')})</span>:""}
                  </div>
                </div> : ''}
              </div>
              <SmartTable border={false} loading={loading} column={column} data={addresses} total={total}
                          onPageChange={(page, pageSize) => {
                            this.loadTokenHolders(page, pageSize)
                          }}/>
            </div>
          </div>
        </Fragment>
    )
  }

}


export default injectIntl(TokenHolders);
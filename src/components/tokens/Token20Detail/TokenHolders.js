import React, {Fragment} from "react";
import {tu} from "../../../utils/i18n";
import {AddressLink} from "../../common/Links";
import {Client} from "../../../services/api";
import SmartTable from "../../common/SmartTable.js"
import {FormattedNumber, injectIntl} from "react-intl";
import {TronLoader} from "../../common/loaders";
import {upperFirst} from "lodash";
import xhr from "axios/index";
import {API_URL, ONE_TRX} from "../../../constants";
import {toastr} from 'react-redux-toastr'
import {isAddressValid} from "@tronscan/client/src/utils/crypto";
import { trim } from 'lodash'

class TokenHolders extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      search: "",
      filter: {},
      addresses: [],
      page: 0,
      total: 0,
      pageSize: 25,
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
    let {filter} = this.props;
    this.setState({loading: true});

    // let {addresses, total} = await Client.getTokenHolders(filter.token, {
    //   sort: '-balance',
    //   limit: pageSize,
    //   start: (page - 1) * pageSize,
    //   count: true
    // });
    let { data } = await xhr.get(API_URL+"/api/token_trc20/holders?sort=-balance&start=" +(page - 1) * pageSize+ "&limit="+pageSize+"&contract_address=" + filter.token);
    let addresses = data.trc20_tokens;
    let total= data.total;
    for (let index in addresses) {
      addresses[index].index = parseInt(index) + 1;
    }

    this.setState({
      page,
      addresses,
      total,
      loading: false,
    });

  };
  customizedColumn = () => {
    let {intl, token} = this.props;
    let column = [
      {
        title: '#',
        dataIndex: 'index',
        key: 'index',
        width: '5%',
        align: 'center',
        className: 'ant_table',
      },
      {
        title: intl.formatMessage({id: 'address'}),
        dataIndex: 'address',
        key: 'address',
        render: (text, record, index) => {
          return <AddressLink address={record.holder_address}/>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'quantity'})),
        dataIndex: 'balance',
        key: 'balance',
        width: '20%',
        align: 'right',
        className: 'ant_table',
        render: (text, record, index) => {
          return <FormattedNumber value={Number(record.balance) / (Math.pow(10,token.decimals))}/>
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
              value={(((record.balance) / token.total_supply_with_decimals) * 100)}
              maximumFractionDigits={6}
          /> %
          </div>

        }
      }
    ];

    return column;
  }
  doSearch = async () => {
      let {intl,filter} = this.props;
      let {search,addresses} = this.state;

      if (isAddressValid(search)){
          let result = await  xhr.get(API_URL+"/api/token_trc20/holders?contract_address=" + filter.token +"&holder_address=" + search);
          result.data.trc20_tokens[0].index = 1
          this.setState({
              addresses:result.data.trc20_tokens,
              total:1,
              search: ""
          });
      }else {
          toastr.warning(intl.formatMessage({id: 'warning'}), intl.formatMessage({id: 'search_TRC20_error'}));
          this.setState({
              search: ""
          });
      }


  };

  render() {
    let {addresses, total, loading,search} = this.state;
      if(total == 0){
          addresses =[];
      }
    let {intl} = this.props
    let column = this.customizedColumn();
    let tableInfo = intl.formatMessage({id: 'a_totle'})+' ' + total +' '+ intl.formatMessage({id: 'hold_addr'})
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
            <div className="nav-searchbar" style={styles.searchBox}>
              <div className="token20-input-group input-group">
                <div className="token20-search">
                  <input type="text"
                         className="form-control p-2 bg-white border-0 box-shadow-none"
                          value={search}
                          onChange={ev => this.setState({search: trim(ev.target.value)})}
                         placeholder={intl.formatMessage({id: "search_TRC20"})}/>
                  <div className="input-group-append">
                    <button className="btn box-shadow-none" onClick={this.doSearch}>
                      <i className="fa fa-search"/>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* {total?<div className="table_pos_info d-none d-md-block">{tableInfo}</div>: ''} */}
            <div style={styles.table}>
              <SmartTable border={false} loading={loading} column={column} data={addresses} total={total}
                          onPageChange={(page, pageSize) => {
                              this.loadTokenHolders(page, pageSize)
                          }}/>
            </div>
          </div>
        </div>
      </Fragment>
    )
  }

}
const styles = {
    searchBox:{
        background: '#fff',
        paddingTop: 10,
    }
};

export default injectIntl(TokenHolders);
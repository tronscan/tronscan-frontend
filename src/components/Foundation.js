import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import {loadAccounts} from "../actions/app";
import {tu} from "../utils/i18n";
import {FormattedNumber, injectIntl} from "react-intl";
import {filter} from "lodash";
import {AddressLink} from "./common/Links";
import {TronLoader} from "./common/loaders";
import {Table, Input, Button, Icon} from 'antd';
import xhr from "axios/index";

class Accounts extends Component {

  constructor() {
    super();

    this.state = {
      loading: true,
      searchString: "",
      accounts: [],
      total: 0,
    }
  }

  componentDidMount() {
    this.loadAccounts();
  }

  loadAccounts = async (page = 1, pageSize = 20) => {

    this.setState({loading: true});

    let data = await xhr.get("https://server.tron.network/api/v2/node/balance?page_index=" + page +"&per_page="+pageSize);

    this.setState({
      loading: false,
      accounts: data.data.data,
      total: data.data.total
    });
  };

  componentDidUpdate() {
  }


  renderAccounts() {

    let {accounts, total, loadAccounts} = this.state;
    let {intl} = this.props;
    let tableInfo = intl.formatMessage({id: 'view_total'}) + ' 1000 ' + intl.formatMessage({id: 'address_unit'})

    let column = [
      {
        title: '#',
        dataIndex: 'key',
        key: 'key',
        width: 100,
        align: 'left',
        className: 'ant_table'
      },
      {
        title: intl.formatMessage({id: 'address'}),
        dataIndex: 'address',
        key: 'address',
        align: 'left',
        render: (text, record, index) => {
          return (
              <AddressLink address={text}/>
          )
        }
      },
      {
        title: intl.formatMessage({id: 'balance'}),
        dataIndex: 'balance',
        key: 'balance',
        width: 200,
        align: 'right',
      }
    ];
    return (
        <div className="token_black">
          {
            accounts.length === 0 ?
                <div className="card" style={{background: 'white'}}>
                  <TronLoader>
                    {tu("loading")}
                  </TronLoader>
                </div>
                :
                <div className="card table_pos">
                  {total ? <div className="table_pos_info" style={{left: 'auto'}}>{tableInfo}</div> : ''}
                  <Table bordered={true} columns={column} dataSource={accounts} 
                        onChange={(pagination) => {
                          this.loadAccounts(pagination.current, pagination.pageSize)
                        }}
                        pagination={{position: 'both', showSizeChanger: true,defaultPageSize:20, total:1000 }}/>
                </div>
          }
        </div>
    )
  }

  render() {

    let {match} = this.props;
    let {total, loading} = this.state;

    return (
        <main className="container header-overlap pb-3 token_black">
          <div className="row foundation_title">
            <div className="col-md-4 mt-3 mt-md-0">
              <div className="card h-100 widget-icon">
                <div className="card-body pl-5">
                  <h3>
                    <FormattedNumber value={1000}/>
                  </h3>
                  {tu("addresses_number")}
                </div>
              </div>
            </div>

            <div className="col-md-4 mt-3 mt-md-0 position-relative">
              <div className="card h-100 widget-icon">

                <div className="card-body pl-5">
                  <h3>
                    <FormattedNumber value={total}/>
                  </h3>
                  {tu("foundation_address")}
                </div>
              </div>
            </div>

            <div className="col-md-4 mt-3 mt-md-0">
              <div className="card h-100 widget-icon">

                <div className="card-body pl-5">
                  <h3>
                    2020/01/01
                  </h3>
                  {tu("unfreeze_time")}
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-2">
            <div className="col-md-12">
              <div className="mt-1">
                {this.renderAccounts()}
              </div>
            </div>
          </div>
        </main>
    )
  }
}

function mapStateToProps(state) {
  return {
    accounts: state.app.accounts,
  };
}

const mapDispatchToProps = {
  loadAccounts,
};


export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Accounts))

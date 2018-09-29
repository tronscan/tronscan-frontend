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
import {trim} from "lodash";
class Accounts extends Component {

  constructor() {
    super();

    this.state = {
      loading: true,
      searchString: "",
      accounts: [],
      total: 0
    }
  }

  componentDidMount() {
    this.loadAccounts();
  }

  loadAccounts = async (page = 1, pageSize = 40) => {
    let planAddress = [
        {
          address:'TRA7vZqzFxycHjYrrjbjh5iTaywSmDefSV'
        }
    ]
    this.setState({loading: true});

    function compare(property) {
      return function (obj1, obj2) {

        if (obj1[property] > obj2[property]) {
          return 1;
        } else if (obj1[property] < obj2[property]) {
          return -1;
        } else {
          return 0;
        }

      }
    }

    /*
    let {accounts, total} = await Client.getAccounts({
      sort: '-balance',
      limit: pageSize,
      start: (page-1) * pageSize,
    });
    */

    let random = Math.random();
    let data = await xhr.get("https://server.tron.network/api/v2/node/balance_info?random=" + random);

    data.data.data.sort(compare('key'));
    let foundationAddress  = data.data.data
    for(let item in foundationAddress){
        for(let address in planAddress){
            if(foundationAddress[item].address === planAddress[address].address){
                foundationAddress[item].isPlan= true;
                planAddress[address].balance = parseFloat(trim(foundationAddress[item].balance.split('TRX')[0]));
            }
        }
    }
    this.setState({
      loading: false,
      accounts: foundationAddress,
      total: data.data.total,
      planAddress:planAddress
    });
  };

  componentDidUpdate() {
  }


  renderAccounts() {

    let {accounts, total} = this.state;
    let {intl} = this.props;
    let tableInfo = intl.formatMessage({id: 'view_total'}) + ' ' + 1000 + ' ' + intl.formatMessage({id: 'address_unit'})

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
              record.isPlan? <div className="d-flex"><i className="fas fa-heart" style={{color:'#C23631', marginTop:3,marginRight:5}}></i> <AddressLink address={text}/></div>:<AddressLink address={text}/>
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
                  {total ? <div className="table_pos_info" style={{left: 'auto'}}>{tableInfo} &nbsp;&nbsp;
                    <a href={intl.locale == 'zh'?"https://tron.network/donation?lng=zh":"https://tron.network/donation?lng=en"} target="_blank" style={{color:'#C23631'}}>{tu('tronics_support_plan')}></a></div> : ''}
                  <Table bordered={true} columns={column} dataSource={accounts}
                         pagination={{position: 'both', showSizeChanger: true,defaultPageSize:20}}/>
                </div>
          }
        </div>
    )
  }

  render() {

    let {match} = this.props;
    let {total, loading,planAddress} = this.state;
    let tronicsPlanTRX = 0;
    for(let plan in planAddress){
        tronicsPlanTRX += planAddress[plan].balance
    }
    tronicsPlanTRX = Math.round(tronicsPlanTRX)
    let foundationTRX =  Math.round(total - tronicsPlanTRX)
    return (
        <main className="container header-overlap pb-3 token_black">
          <div className="row foundation_title">

            <div className="col-md-3 mt-3 mt-md-0 pr-0">
              <div className="card h-100 widget-icon">
                <div className="card-body pl-4 bg-image_book">
                  <h3>
                    <FormattedNumber value={total}/>
                  </h3>
                  {tu("total_number_frozenTRX")}
                </div>
              </div>
            </div>

            <div className="col-md-3 mt-3 mt-md-0 position-relative pr-0">
              <div className="card h-100 widget-icon">
                <div className="card-body pl-4">
                  <h3>
                    <FormattedNumber value={tronicsPlanTRX}/>
                  </h3>
                  {tu("tronics_support_planTRX")}
                </div>
              </div>
            </div>

            <div className="col-md-3 mt-3 mt-md-0 pr-0">
              <div className="card h-100 widget-icon">
                <div className="card-body pl-4 bg-image_home" >
                  <h3>
                    <FormattedNumber value={foundationTRX}/>
                  </h3>
                  {tu("frozen_by_the_foundationTRX")}
                </div>
              </div>
            </div>
            <div className="col-md-3 mt-3 mt-md-0">
              <div className="card h-100 widget-icon bg-line_green">
                <div className="card-body pl-4 bg-image_frozen">
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

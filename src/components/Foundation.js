import React, {Component} from 'react';
import {connect} from "react-redux";
import {loadAccounts} from "../actions/app";
import {tu} from "../utils/i18n";
import {FormattedNumber, injectIntl} from "react-intl";
import {AddressLink} from "./common/Links";
import {TronLoader} from "./common/loaders";
import {Table, Input, Button, Icon} from 'antd';
import xhr from "axios/index";
import {Tooltip} from "reactstrap";
import {TRXPrice} from "./common/Price";
import {ONE_TRX,API_URL,uuidv4} from "../constants";
import {Client} from "../services/api";

class Accounts extends Component {

  constructor() {
    super();

    this.state = {
      loading: true,
      searchString: "",
      accounts: [],
      total: 1000,
      tronicsPlanTRX:0,
      foundationTRX:0,
    }
  }

  componentDidMount() {
    this.loadAccounts();
  }
  handleHover(key) {
    this.setState((prevS,props)=>({
        [key]: !prevS[key]
    }));
  }
  loadAccounts = async (page = 1, pageSize = 20) => {
    this.setState({loading: true});
    const {list} = await Client.getlistdonators();
    let random = Math.random();
    let data = await xhr.get(`${API_URL}/api/fund?uuid=${uuidv4}&random=${random}&page_index=${page}&per_page=${pageSize}`);
    const {funds} = await Client.getFundsSupply();
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
    data.data.data.data.sort(compare('key'));
    let foundationAddress  = data.data.data.data;
    for(let item in foundationAddress){
        for(let address in list){
            if(foundationAddress[item].address === list[address]){
                foundationAddress[item].isPlan= true;
            }
        }
    }

    this.setState({
        loading: false,
        accounts: foundationAddress,
        total: funds.fundSumBalance / ONE_TRX ,
        tronicsPlanTRX:funds.donateBalance / ONE_TRX,
        foundationTRX:funds.fundTrx,
        planAddress:list
    });


  };

  componentDidUpdate() {
  }


  renderAccounts() {
    let {accounts, total, loadAccounts,open} = this.state;
    let {intl} = this.props;
    let tableInfo = intl.formatMessage({id: 'view_total'}) + ' 1000 ' + intl.formatMessage({id: 'address_unit'})
    let column = [
      {
        title: '#',
        dataIndex: 'key',
        key: 'key',
        width: 100,
        align: 'left',
        //className: 'ant_table ant_table_plan',
        // rowClassName: (record,index) => {
        //     return (
        //         record.isPlan?  'ant_table_plan' :'ant_table'
        //     )
        // }
      },
      {
        title: intl.formatMessage({id: 'address'}),
        dataIndex: 'address',
        key: 'address',
        align: 'left',
        render: (text, record, index) => {
          return (
              record.isPlan?  <div><div className="d-flex"
                                        style={{width:300}}
                                        id={"Tronics-Support-Plan_"+record.key}
                                        onMouseOver={(prevS,props) => this.setState({[record.key]: true})}
                                        onMouseOut={() => this.setState({[record.key]: false})}>
                                        <i className="fas fa-heart" style={{color:'#C23631', marginTop:3,marginRight:5}}></i>
                                        <AddressLink address={text} truncate={false}/>
                                    </div>
                                    <Tooltip placement="top" target={"Tronics-Support-Plan_"+record.key} isOpen={this.state[record.key]}> <span className="text-capitalize">{tu("tronics_support_plan_recipient_address")}</span></Tooltip>
                              </div>:<AddressLink address={text}/>
          )
        }



      },
      {
        title: intl.formatMessage({id: 'balance'}),
        dataIndex: 'balance',
        key: 'balance',
        width: 200,
        align: 'right',
        render: (text, record, index) => {
          return <TRXPrice amount={text / ONE_TRX}/>
        }
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
                  {total ? <div className="table_pos_info d-none d-md-block" style={{left: 'auto'}}>{tableInfo} &nbsp;&nbsp;
                    <a href={intl.locale == 'zh'?"https://tron.network/donation?lng=zh":"https://tron.network/donation?lng=en"} target="_blank" style={{color:'#C23631'}}>{tu('tronics_support_plan')}></a></div> : ''}
                    <Table bordered={true} columns={column} dataSource={accounts} rowClassName={(record, index) => { return  record.isPlan ?  'ant_table_plan' :'' }}
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

    let {match,intl} = this.props;
    let {total, tronicsPlanTRX,foundationTRX,loading,planAddress} = this.state;
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
                <a href={intl.locale == 'zh'?"https://tron.network/donation?lng=zh":"https://tron.network/donation?lng=en"} target="_blank" className="tronics_plan_link">
                    <div className="card h-100 widget-icon">
                        <div className="card-body pl-4">
                            <h3>
                                <span className="tronics_plan_title">
                                    <FormattedNumber value={tronicsPlanTRX}/>
                                </span>
                            </h3>
                            <span className="tronics_plan_dec">
                                {tu("tronics_support_planTRX")}
                            </span>
                        </div>
                    </div>
                </a>
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

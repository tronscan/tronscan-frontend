import React, {Component} from 'react';
import {connect} from "react-redux";
import {loadAccounts} from "../actions/app";
import {tu} from "../utils/i18n";
import {FormattedNumber, injectIntl} from "react-intl";
// import {AddressLink} from "./common/Links";
import {Truncate} from "./common/text";
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
                                        {/* <AddressLink address={text} truncate={false}/> */}
                                        <span style={{color: '#c23631',fontFamily: 'Helvetica-Bold',userSelect: 'none'}}>
                                          <Truncate>{text}</Truncate>
                                        </span>    
                                    </div>
                                    <Tooltip placement="top" target={"Tronics-Support-Plan_"+record.key} isOpen={this.state[record.key]}> <span className="text-capitalize">{tu("tronics_support_plan_recipient_address")}</span></Tooltip>
                              </div>:
                              // <AddressLink address={text}/>
                              <span style={{color: '#c23631',fontFamily: 'Helvetica-Bold',userSelect: 'none'}}>
                                <Truncate>{text}</Truncate>
                              </span>    
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
                  {total ? <div className="table_pos_info mobile-total-info  d-md-block" style={{left: 'auto'}}>{tableInfo}  <span className='foundation_address_deadline_date' style={{fontSize:'0.675rem'}}>{tu("foundation_address_deadline_date")}</span></div> : ''}
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
          <div className="row foundation_title" style={{position:"relative"}}>
            <div className="col-md-6 mt-3 mt-md-0 pr-0">
              <div className="card h-100 widget-icon">
                <div className="card-body pl-4 bg-image_book">
                  <p>
                    <FormattedNumber value={total}/>
                  </p>
                  {tu("total_number_frozenTRX")}
                </div>
              </div>
            </div>
            {/* <div className="col-md-3 mt-3 mt-md-0 position-relative pr-0">
              <div className="card h-100 widget-icon">
                  <div className="card-body pl-4">
                      <p>
                          <span className="tronics_plan_title">
                              <FormattedNumber value={tronicsPlanTRX}/>
                          </span>
                      </p>
                      <span >
                          {tu("tronics_support_planTRX")}
                      </span>
                  </div>
              </div>
            </div> */}
            {/* <div className="col-md-3 mt-3 mt-md-0 pr-0">
              <div className="card h-100 widget-icon">
                <div className="card-body pl-4 bg-image_home" >
                  <p>
                    <FormattedNumber value={foundationTRX}/>
                  </p>
                  {tu("frozen_by_the_foundationTRX")}
                </div>
              </div>
            </div> */}
            <div className="col-md-6 mt-3 mt-md-0" >
              <div className="card h-100 widget-icon bg-line_green">
                <div className="card-body pl-4 bg-image_frozen">
                  <p>
                    2020/01/01
                  </p>
                  {tu("unfreeze_time")}
                </div>
              </div>
            </div>
            {/* <div style={{position:"absolute",right:'1rem', top: '-30px','fontSize':'16px',color:'#666'}}>
              {tu("foundation_address_update_date")}
            </div> */}
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

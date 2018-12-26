import React, {Component} from "react";
import { Table } from 'antd';
import {AddressLink, TransactionHashLink} from "../../../../common/Links";
import {FormattedDate, FormattedTime, injectIntl} from "react-intl";
import {TRXPrice} from "../../../../common/Price";
import {ONE_TRX} from "../../../../../constants";
import {Truncate} from "../../../../common/text";
import {tu, tv} from "../../../../../utils/i18n";
import {Client} from "../../../../../services/api";
import {Client20} from "../../../../../services/api";
import {connect} from "react-redux";
import { upperFirst } from 'lodash'
import {dateFormat} from '../../../../../utils/DateTime'
import {setUpdateTran} from '../../../../../actions/exchange'
import {TronLoader} from "../../../../common/loaders";

class Mytran extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      columns: [],
      total: 0,
      isLoading:true
    }
  }

  componentDidMount() {
    this.getColumns();
    this.getData({current: 1, pageSize:15});
  }

  componentDidUpdate(prevProps) {
    let { is_update_tran,isLoad } = this.props
    if(prevProps.is_update_tran != is_update_tran || (isLoad && prevProps.isLoad!=isLoad)){
      this.setState({
        isLoading:true
      })
      this.getData({current: 1, pageSize:15})
      setUpdateTran(false)
    }
  }

  getData = async (palyload) => {
    const {selectData,account} = this.props
   
    if(selectData.exchange_id){
      const params = {
        uAddr: account.address, 
        start: (palyload.current-1) * palyload.pageSize,
        limit: palyload.pageSize,
        status: '1,2,3'
      }
      const {data, code} = await Client20.getCurrentList(params);
      this.setState({
        isLoading:false
      })
      if(code === 0){
        this.setState({dataSource: data.rows, total: data.total})
      }
    }
  }

  getColumns() {
    let {intl} = this.props;
    let {dataSource, total} = this.state
    const columns = [
      {
        title: upperFirst(intl.formatMessage({id: 'trc20_my_trans_header_time'})),
        dataIndex: 'orderTime',
        key: 'orderTime',
        render: (text, record, index) => {
          return <span >{dateFormat(record.orderTime)}</span>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'trc20_my_trans_header_type'})),
        dataIndex: 'orderType',
        key: 'orderType',
        render: (text, record, index) => {
          return record.orderType === 0 ? <span className="col-green">{tu('trc20_BUY')}</span> : <span className="col-red">{tu('trc20_SELL')}</span>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'trc20_my_trans_header_price'})),
        dataIndex: 'price',
        key: 'price'
      },
      {
        title: upperFirst(intl.formatMessage({id: 'trc20_my_trans_header_amount'})),
        dataIndex: 'volume',
        key: 'volume',
        render: (text, record, index) => {
          return   <span>{ record.volume } { record.fShortName }</span>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'trc20_my_trans_header_volume'})),
        dataIndex: 'curTurnover',
        key: 'curTurnover',
        align: 'center',
        render: (text, record, index) => {
          return   <span>{ this.numFormat(record.curTurnover.toFixed(4))}{ record.sShortName }</span>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'trc20_my_trans_header_status'})),
        dataIndex: 'orderStatus',
        key: 'orderStatus',
        align: 'center',
        render: (text, record, index) => {
          return  <span>
          {record.orderStatus === 1 && <span className="status finish">{tu('trc20_my_trans_finish')}</span> }
           { (record.orderStatus === 2 || record.orderStatus === 3) && <span className="status fail">{tu('trc20_my_trans_cancle')}</span>}
        </span>
        }
      }
    ]
    return (
          <Table
              dataSource={dataSource}
              columns={columns}
              // pagination={false}
              onChange={pagination => this.getData(pagination)}
              pagination={{
                  defaultPageSize:15,
                  total
              }}
              rowKey={(record, index) => {
                  return index
              }}
              className="my-tran"
          />
    )

  }

  render() {
    let {dataSource, columns, total,isLoading} = this.state
    if (!dataSource || dataSource.length === 0) {
      return (
        <div className="p-3 text-center no-data">{tu("trc20_no_data")}</div>
      );
    }

    return (
      <div className="exchange__tranlist">
      
          {isLoading ? <TronLoader/> : this.getColumns()}

    </div>)
  }


  numFormat(v) {
    return v
      .toString()
      .replace(/(^|\s)\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
  }
}


function mapStateToProps(state) {
  
  return {
    selectData: state.exchange.data,
    currentWallet: state.wallet.current,
    activeLanguage:  state.app.activeLanguage,
    account:state.app.account,
    is_update_tran:state.exchange.is_update_tran ? state.exchange.is_update_tran:false
  };
}

const mapDispatchToProps = {
  setUpdateTran
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Mytran));

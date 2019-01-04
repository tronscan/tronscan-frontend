import React, {Component} from "react";
import { Table } from 'antd';
import {AddressLink, TransactionHashLink} from "../../../../common/Links";
import {FormattedDate, FormattedTime, injectIntl} from "react-intl";
import {TRXPrice} from "../../../../common/Price";
import {ONE_TRX} from "../../../../../constants";
import {Truncate} from "../../../../common/text";
import {tu, tv} from "../../../../../utils/i18n";
import {Client} from "../../../../../services/api";
import {connect} from "react-redux";
import { upperFirst } from 'lodash'
import rebuildList from "../../../../../utils/rebuildList";
class Mytran extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      columns: [],
      total: 0
    }
  }

  componentDidMount() {
    this.getColumns();
    this.getData({current: 1, pageSize:15});
  }

  // componentDidUpdate(prevProps) {
  //   const { selectData } = this.props
  //   if((prevProps.selectData.exchange_id != selectData.exchange_id)){
  //     this.getData()
  //   }
  // }

  getData = async (palyload) => {
    const {selectData, currentWallet} = this.props
    if(selectData.exchange_id){
      const params = {
        address: currentWallet.address,
        start: (palyload.current-1) * palyload.pageSize,
        limit: palyload.pageSize,
      }
      const {data, total} = await Client.getTransactionList(params);
      const newdata = rebuildList(data,'first_token_id','quant')
      this.setState({dataSource: newdata, total: total})
    }
  }

  getColumns() {
    let {intl} = this.props;
    let {dataSource, total} = this.state
    const columns = [
      // {
      //   title: upperFirst(intl.formatMessage({id: 'TxHash'})),
      //   dataIndex: 'trx_hash',
      //   key: 'trx_hash',
      //   render: (text, record, index) => {
      //     // className={record.status === 1? 'buy': 'sell'}
      //     return <span ><Truncate>
      //             <TransactionHashLink hash={text}>{text}</TransactionHashLink>
      //           </Truncate></span>
      //   }
      // },
      {
        title: upperFirst(intl.formatMessage({id: 'TxTime'})),
        dataIndex: 'createTime',
        key: 'createTime',
        width: '200px',
        render: (text, record, index) => {
          return <span>
            <FormattedDate value={Number(text)}/>&nbsp;
            <FormattedTime value={Number(text)}/>&nbsp;
          </span>
        }
      },
      // {
      //   title: upperFirst(intl.formatMessage({id: 'address'})),
      //   dataIndex: 'creatorAddress',
      //   key: 'creatorAddress',
      //   render: (text, record, index) => {
      //     return  <AddressLink address={text}/>
      //   }
      // },
      {
        title: upperFirst(intl.formatMessage({id: 'TxAmount'})),
        dataIndex: 'quant',
        key: 'quant',
        width: '200px',
        render: (text, record, index) => {
          return  record.tokenName == 'TRX'? 
          <TRXPrice amount={record.quant / ONE_TRX}/>
          :record.map_amount + ' ' + record.tokenID
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'status'})),
        dataIndex: 'confirmed',
        key: 'confirmed',
        align: 'center',
        render: (text, record, index) => {
          return  text?
          <span className="badge badge-success text-uppercase badge-success-radius">{tu("Confirmed")}</span> :
          <span className="badge badge-danger text-uppercase badge-danger-radius">{tu("Unconfirmed")}</span>;
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
          />
    )

  }

  render() {
    let {dataSource, columns, total} = this.state
    if (!dataSource || dataSource.length === 0) {
      return (
        <div className="p-3 text-center no-data">{tu("no_transactions")}</div>
      );
    }

    return (
      <div className="exchange__tranlist">
          {this.getColumns()}

    </div>)
  }
}


function mapStateToProps(state) {
  return {
    selectData: state.exchange.data,
    currentWallet: state.wallet.current,
    activeLanguage:  state.app.activeLanguage,
  };
}

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Mytran));

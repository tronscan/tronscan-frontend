import React, {Component} from "react";
import { Table } from 'antd';
import {AddressLink, TransactionHashLink} from "../../../common/Links";
import {FormattedDate, FormattedTime} from "react-intl";
import {TRXPrice} from "../../../common/Price";
import {ONE_TRX} from "../../../../constants";
import {Truncate} from "../../../common/text";
import {tu, tv} from "../../../../utils/i18n";
import {Client} from "../../../../services/api";
import {connect} from "react-redux";
class Mytran extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      columns: []
    }
  }


  componentDidMount() {
    this.getColumns();
    this.getData();
    const getDataTime = setInterval(() => {
      this.getData();
    }, 3000)

    this.setState({time: getDataTime})
  }

  componentWillUnmount() {
    const {time} = this.state
    clearInterval(time);
  }
  getData = async () => {
    const {selectData} = this.props
    if(selectData.exchange_id){
      const {data} = await Client.getTransactionList({exchangeID: selectData.creator_address});
      this.setState({dataSource: data})
    }
  }

  getColumns() {
    const columns = [
      {
        title: '交易哈希',
        dataIndex: 'trx_hash',
        key: 'trx_hash',
        render: (text, record, index) => {
          return <span className={record.status === 1? 'buy': 'sell'}><Truncate>
                  <TransactionHashLink hash={text}>{text}</TransactionHashLink>
                </Truncate></span>
        }
      },
      {
        title: '交易时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: '150px',
        render: (text, record, index) => {
          return <span>
            <FormattedDate value={Number(text)}/>&nbsp;
            <FormattedTime value={Number(text)}/>&nbsp;
          </span>
        }
      },
      {
        title: '地址',
        dataIndex: 'creatorAddress',
        key: 'creatorAddress',
        render: (text, record, index) => {
          return  <AddressLink address={text}/>
        }
      },
      {
        title: '交易金额',
        dataIndex: 'quant',
        key: 'quant',
        width: '150px',
        render: (text, record, index) => {
          return  record.tokenName == 'TRX'? 
          <TRXPrice amount={record.quant / ONE_TRX}/>
          :record.quant + ' ' + record.tokenID
        }
      },
      {
        title: '状态',
        dataIndex: 'confirmed',
        key: 'confirmed',
        align: 'center',
        render: (text, record, index) => {
          return  text === 1? 
          <span className="badge badge-success text-uppercase">{tu("Confirmed")}</span> :
          <span className="badge badge-danger text-uppercase">{tu("Unconfirmed")}</span>;
        }
      }
    ]

   this.setState({columns})
  }

  render() {
    let {dataSource, columns} = this.state
    if (!dataSource || dataSource.length === 0) {
      return (
        <div className="p-3 text-center no-data">{tu("no_transactions")}</div>
      );
    }

    return (
      <div className="exchange__tranlist">
        <Table 
          dataSource={dataSource} 
          columns={columns} 
          pagination={false}
          rowKey={(record, index) => {
            return index
          }}
        />

    </div>)
  }
}


function mapStateToProps(state) {
  return {
    selectData: state.exchange.data
  };
}

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Mytran);
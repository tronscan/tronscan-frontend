import React, {Component} from "react";
import { Table } from 'antd';
import {AddressLink, TransactionHashLink} from "../../../common/Links";
import {FormattedDate, FormattedTime} from "react-intl";
import {TRXPrice} from "../../../common/Price";
import {ONE_TRX} from "../../../../constants";
import {Truncate} from "../../../common/text";
import {tu, tv} from "../../../../utils/i18n";

export default class TranList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [{
        hash: 'd8bd5d82bbad6e3ae6d34032eb35baa3441510f8a6fa7334dcc6915f4303e203',
        time: 1540188360000,
        address: 'TJbjRBAKKhNEAHMEqjxRFA6KPBrVLuFtuf',
        amount: '123',
        status: 1,
        isconfirmed: 1
      },
      {
        hash: 'd8bd5d82bbad6e3ae6d34032eb35baa3441510f8a6fa7334dcc6915f4303e203',
        time: 1540188360000,
        address: 'TJbjRBAKKhNEAHMEqjxRFA6KPBrVLuFtuf',
        amount: '312312',
        status: 0,
        isconfirmed: 0
      }],
      columns: []
    }
  }

  componentDidMount() {
    this.getData();
    this.getColumns();
  }

  getData() {

    console.log();
  }

  getColumns() {
    const columns = [
      {
        title: '交易哈希',
        dataIndex: 'hash',
        key: 'hash',
        render: (text, record, index) => {
          return <span className={record.status === 1? 'buy': 'sell'}><Truncate>
                  <TransactionHashLink hash={text}>{text}</TransactionHashLink>
                </Truncate></span>
        }
      },
      {
        title: '交易时间',
        dataIndex: 'time',
        key: 'time',
        width: '150px',
        render: (text, record, index) => {
          return <span>
            <FormattedDate value={text}/>&nbsp;
            <FormattedTime value={text}/>&nbsp;
          </span>
        }
      },
      {
        title: '地址',
        dataIndex: 'address',
        key: 'address',
        render: (text, record, index) => {
          return  <AddressLink address={text}/>
        }
      },
      {
        title: '交易金额',
        dataIndex: 'amount',
        key: 'amount',
        width: '150px',
        render: (text, record, index) => {
          return  record.tokenName == 'TRX'? 
          <TRXPrice amount={record.amount / ONE_TRX}/>
          :record.amount + ' ' + record.tokenName
        }
      },
      {
        title: '状态',
        dataIndex: 'isconfirmed',
        key: 'isconfirmed',
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

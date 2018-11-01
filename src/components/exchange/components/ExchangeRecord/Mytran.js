import React, {Component} from "react";
import { Table } from 'antd';
import {AddressLink, TransactionHashLink} from "../../../common/Links";
import {FormattedDate, FormattedTime} from "react-intl";
import {TRXPrice} from "../../../common/Price";
import {ONE_TRX} from "../../../../constants";
import {Truncate} from "../../../common/text";
import {tu, tv} from "../../../../utils/i18n";

export default class Mytran extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [
        {
          "exchangeID":"1",//交易对ID
          "creatorAddress":"TFA1qpUkQ1yBDw4pgZKx25wEZAqkjGoZo1",//创建者
          "creatorName":"Sesamesee",//创建者
          "trx_hash":"0afa11cbfa9b4707b1308addc48ea31201157a989db92fe75750c068f0cc14e0",//交易hash
          "createTime":"1536416859000",//创建时间
          "tokenID":"IGG",//交易token名称  "_"代表TRX
          "quant":23,//对第一个token的交易数量
          "confirmed":0,//0 未确认，1 已确认
        },
        {
          "exchangeID":"1",//交易对ID
          "creatorAddress":"TFA1qpUkQ1yBDw4pgZKx25wEZAqkjGoZo1",//创建者
          "creatorName":"Sesamesee",//创建者
          "trx_hash":"0afa11cbfa9b4707b1308addc48ea31201157a989db92fe75750c068f0cc14e0",//交易hash
          "createTime":"1536416859000",//创建时间
          "tokenID":"IGG",//交易token名称  "_"代表TRX
          "quant":23,//对第一个token的交易数量
          "confirmed":0,//0 未确认，1 已确认
      }
    ],
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

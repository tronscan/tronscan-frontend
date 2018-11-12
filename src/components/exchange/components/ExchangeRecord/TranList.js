import React, {Component} from "react";
import { Table } from 'antd';
import {AddressLink, TransactionHashLink} from "../../../common/Links";
import {FormattedDate, FormattedTime, injectIntl} from "react-intl";
import {TRXPrice} from "../../../common/Price";
import {ONE_TRX} from "../../../../constants";
import {Truncate} from "../../../common/text";
import {tu, tv} from "../../../../utils/i18n";
import {Client} from "../../../../services/api";
import {connect} from "react-redux";
import {upperFirst} from 'lodash'

class TranList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      columns: [],
      //time: null
    }
  }


  componentDidMount() {
    const { selectData } = this.props
    this.getColumns();
    this.getData()
    const getDataTime = setInterval(() => {
      this.getData();
    }, 10000)

    this.setState({time: getDataTime})
  }

  componentDidUpdate(prevProps) {
    const { selectData } = this.props
    if((prevProps.selectData.exchange_id != selectData.exchange_id)){
      this.getData()
    }
  }

  componentWillUnmount() {
    const {time} = this.state
    clearInterval(time);
  }

  getData = async () => {
    const {selectData} = this.props
    if(selectData.exchange_id){
      const {data} = await Client.getTransactionList({limit: 15, exchangeID: selectData.exchange_id});
      this.setState({dataSource: data})
    }
  }

  getColumns() {
    let {dataSource} = this.state;
    let {intl} = this.props;
    const columns = [
      {
        title: upperFirst(intl.formatMessage({id: 'TxHash'})),
        dataIndex: 'trx_hash',
        key: 'trx_hash',
        render: (text, record, index) => {
          // className={record.status === 1? 'buy': 'sell'}
          return <span ><Truncate>
                  <TransactionHashLink hash={text}>{text}</TransactionHashLink>
                </Truncate></span>
        }
      },
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
      {
        title: upperFirst(intl.formatMessage({id: 'address'})),
        dataIndex: 'creatorAddress',
        key: 'creatorAddress',
        render: (text, record, index) => {
          return  <AddressLink address={text}/>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'TxAmount'})),
        dataIndex: 'quant',
        key: 'quant',
        width: '150px',
        render: (text, record, index) => {
          return  record.tokenID == '_'? 
          <TRXPrice amount={record.quant / ONE_TRX}/>
          :record.quant + ' ' + record.tokenID
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
          <span className="badge badge-danger text-uppercase badge-success-radius">{tu("Unconfirmed")}</span>;
        }
      }
    ]

    return (
        <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            rowKey={(record, index) => {
                return index
            }}
        />
    )
  }

  render() {
    let {dataSource, columns} = this.state;
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
    activeLanguage:  state.app.activeLanguage,
  };
}

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(TranList));
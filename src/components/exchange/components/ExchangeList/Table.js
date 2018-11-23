import React from "react";
import { Table } from 'antd';
import {QuestionMark} from "../../../common/QuestionMark";
import {withRouter} from 'react-router-dom';
import queryString from 'query-string';
import {connect} from "react-redux";
import {getSelectData} from "../../../../actions/exchange";
import { filter, map ,upperFirst} from 'lodash'
import {injectIntl} from "react-intl";

class ExchangeTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      dataSource: [],
      activeIndex:2,
    };
  }


  getColumns() {
    let {intl,dataSource} = this.props;
    const columns = [{
      title: upperFirst(intl.formatMessage({id: 'pairs'})),
      key: 'first_token_id',
      render: (text, record, index) => {
        return record.exchange_abbr_name
      }
    }, {
      title: upperFirst(intl.formatMessage({id: 'last_price'})),
      dataIndex: 'price',
      key: 'price',
    }, 
    {
      title:upperFirst(intl.formatMessage({id: 'pairs_change'})),
      dataIndex: 'up_down_percent',
      key: 'up_down_percent',
      render: (text, record, index) => {
        return (
          text.indexOf('-') != -1?
          <span className='col-red'>{text}</span>:
          <span className='col-green'>{text}</span>
        )
      }
    }];

    return (
        <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            rowKey={(record, index) => {
                return index
            }}
            rowClassName={this.setActiveClass}
            onRow={(record) => {
                return {
                    onClick: () => {
                        this.onSetUrl(record)
                    }
                }
            }}
        />
    )
  }


  setActiveClass = (record, index) => {
    return record.exchange_id === this.state.activeIndex ? "exchange-table-row-active": "";
  }
  getData() {
    const parsed = queryString.parse(this.props.location.search).id;
    const { dataSource, getSelectData } = this.props;
    const currentData = filter(dataSource, item => {
      return item.exchange_id == parsed
    })

    // 更新数据
    if(dataSource.length){
      if(!parsed){
        this.onSetUrl(dataSource[0])
      }else{
        getSelectData(currentData[0])
      }
    }

    // 获取选择状态
    map(dataSource, item => {
      if(item.exchange_id == parsed || !parsed){
        item.isCurrent = true
      }
    })
  }

  onSetUrl(record) {
    const {getSelectData} = this.props;
    this.setState({
        activeIndex:record.exchange_id //获取点击行的索引
    })
    this.props.history.push('/exchange?token='+ record.exchange_name+'&id='+record.exchange_id)
    getSelectData(record, true)
     
  }

  componentDidMount() {

  }

  componentDidUpdate() {
    this.getData()
  }

  render() {
    return (
        <div>
            {this.getColumns()}
        </div>
    )
  }
}

function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = {
  getSelectData,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(ExchangeTable)));


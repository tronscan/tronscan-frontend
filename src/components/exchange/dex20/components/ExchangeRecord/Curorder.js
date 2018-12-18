import React ,{Component} from 'react'
import {injectIntl} from "react-intl";
import {Client20} from "../../../../../services/api";
import {tu} from "../../../../../utils/i18n";
import { Table } from 'antd';
import {connect} from "react-redux";
import {withRouter} from 'react-router-dom';
import {upperFirst} from 'lodash'
import {dateFormat} from '../../../../../utils/DateTime'

class Curorder extends Component{
    constructor(){
        super()
        this.state = {
            start: 0,
            limit: 50,
            list:[]
            // list:[{"id":19976,"fShortName":"BET","sShortName":"TRX","volume":100,"price":0.1,"orderType":1,"orderTime":"1545101722239","orderID":"7291","schedule":"0.0000","curTurnover":0,"orderStatus":0},{"id":14419,"fShortName":"BET","sShortName":"TRX","volume":100,"price":0.1,"orderType":1,"orderTime":"1544696681304","orderID":"2444","schedule":"0.0000","curTurnover":0,"orderStatus":0}]

        }
    }

    componentDidMount(){
        this.getData()
    }

    render(){
        let {list} = this.state;
        let {intl} = this.props;
        const columns = [
            {
              title: upperFirst(intl.formatMessage({id: 'trc20_cur_order_header_order_time'})),
              dataIndex: 'orderTime',
              key: 'orderTime',
              render: (text, record, index) => {
                return <span>
                  {dateFormat(record.orderTime)}
                </span>
              }
            },
            {
              title: upperFirst(intl.formatMessage({id: 'trc20_cur_order_header_order_type'})),
              dataIndex: 'quant',
              key: 'quant',
              render: (text, record, index) => {
                return record.orderType == 0 ? <span className="col-green">{ tu('trc20_BUY') }</span> : <span className="col-red">{tu('trc20_SELL') }</span>
              }
            },
            {
              title: upperFirst(intl.formatMessage({id: 'trc20_cur_order_header_price'})),
              dataIndex: 'price',
              key: 'price',
              align: 'center'
            },
            {
                title: upperFirst(intl.formatMessage({id: 'trc20_cur_order_header_amount'})),
                dataIndex: 'volume',
                key: 'volume',
                render: (text, record, index) => {
                    return <span>{record.volume}{record.fShortName}</span>
                  },
                align: 'center'
              },
              {
                title: upperFirst(intl.formatMessage({id: 'trc20_cur_order_header_volume'})),
                dataIndex: 'curTurnover',
                key: 'curTurnover',
                render: (text, record, index) => {
                    return <span>{this.numFormat(record.curTurnover.toFixed(4)) }{record.fShortName}</span>
                  },
                align: 'center'
              },
              {
                title: upperFirst(intl.formatMessage({id: 'trc20_cur_order_header_progress'})),
                dataIndex: 'schedule',
                key: 'schedule',
                render: (text, record, index) => {
                    return <span>{(+record.schedule*100).toFixed(2)}%</span>
                  },
                align: 'center'
              },
              {
                title: upperFirst(intl.formatMessage({id: 'trc20_cur_order_header_action'})),
                dataIndex: 'cancel',
                key: 'cancel',
                render: (text, record, index) => {
                    return <span>{tu('trc20_cur_order_cancel')}</span>
                  },
                align: 'center'
              }
          ]
        return (
            <div className="exchange__tranlist">
                <Table
                    dataSource={list}
                    columns={columns}
                    pagination={false}
                    rowKey={(record, index) => {
                        return `${index}`
                    }}
                /> 

            </div>
        )
    }

    async getData(){ 

        let {start,limit} = this.state;
        let {app} = this.props;
        let uAddr = app.account ? app.account.address : '';
        if(!uAddr){
            return ;
        }

        let obj = {start,limit,uAddr,status: '0'}
        let {data,code} = await Client20.getCurrentList(obj)
        if (code === 0) {
            let list = []
            if (data && data.rows && data.rows.length > 0) {
              list = data.rows
            }

            this.setState({list})
            
          }


    }

    numFormat(v) {
        return v
          .toString()
          .replace(/(^|\s)\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
      }



}

function mapStateToProps(state) {
    
    return {
        app:state.app ? state.app:{}
        
    };
  }
  
  const mapDispatchToProps = {
    
  };

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(Curorder)));
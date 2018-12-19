import React ,{Component} from 'react'
import {injectIntl} from "react-intl";
import {Client20} from "../../../../../services/api";
import {tu} from "../../../../../utils/i18n";
import { Table } from 'antd';
import {connect} from "react-redux";
import {withRouter} from 'react-router-dom';
import {upperFirst} from 'lodash'
import {dateFormat} from '../../../../../utils/DateTime'
import { Wallet } from 'ethers';
import { Modal, Button } from 'antd';
import SweetAlert from "react-bootstrap-sweetalert";
import {cancelOrder} from '../../TW'

const confirm = Modal.confirm;

class Curorder extends Component{
    constructor(){
        super()
        this.state = {
            start: 0,
            limit: 50,
            list:[],
            timer:null,
            modal: null
        }

        this.cancelOrder = this.cancelOrder.bind(this)
    }

    componentDidMount(){
        let {timer} = this.state;
        this.getData()
        clearInterval(timer)
        this.setState({
            timer : setInterval(() => {
                this.getData()
            }, 3000)
        })
        

    }

    componentDidUpdate(prevProps){
        let {timer} = this.state
        let {wallet} = this.props;
        if(prevProps.wallet != wallet){
            clearInterval(timer)
            this.setState({
                timer : setInterval(() => {
                    this.getData()
                }, 3000)
            })
        }
    }

    render(){
        let {list,modal} = this.state;
        let {intl} = this.props;
        


        if (!list || list.length === 0) {
            return (
                <div className="p-3 text-center no-data">{tu("trc20_no_data")}</div>
            );
        }

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
                    return <span onClick={()=>this.cancelOrder(record)}>{tu('trc20_cur_order_cancel')}</span>
                  },
                align: 'center'
              }
          ]
        return (
            
            <div className="exchange__tranlist">
            { modal }
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

    cancelOrder(record){
        console.log(123,record)
        let {intl} = this.props;
        let _this = this;
        confirm({
            title: intl.formatMessage({id: 'trc20_prompt'}),
            content:intl.formatMessage({id: 'trc20_cancel_order_confirm'}),
            okText: intl.formatMessage({id: 'trc20_confirm'}),
            cancelText: intl.formatMessage({id: 'trc20_cancel'}),
            onOk() {
                if (record.orderID) {
                    _this.cancleOrderFun(record)
                  }
            },
            onCancel() {},
          });
    }

    async cancleOrderFun(item){
        try {
            const _id = await cancelOrder(item.orderID)
            if (_id) {
                this.setState({
                    modal: (
                        <SweetAlert success title={tu("transaction_success")}  onConfirm={this.hideModal}>
                            {tu("trc20_order_success")}
                        </SweetAlert>
                    )
                });
              
            }
          } catch (err) {
            this.setState({
                modal: (
                    <SweetAlert success title={tu("transaction_error")}  onConfirm={this.hideModal}>
                        {tu("trc20_cancel_order_fail")}
                    </SweetAlert>
                )
            });
          }
    }

    hideModal = () => {
        this.setState({modal: null});
  }

    numFormat(v) {
        return v
          .toString()
          .replace(/(^|\s)\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
      }



}

function mapStateToProps(state) {
    
    return {
        app:state.app ? state.app:{},
        wallet:state.wallet ? state.wallet.isOpen : false
    };
  }
  
  const mapDispatchToProps = {
    
  };

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(Curorder)));
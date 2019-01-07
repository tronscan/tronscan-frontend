import React from "react";
import { Table } from 'antd';
import {QuestionMark} from "../../../../common/QuestionMark";
import {withRouter} from 'react-router-dom';
import queryString from 'query-string';
import {connect} from "react-redux";
import {getSelectData} from "../../../../../actions/exchange";
import { filter, map ,upperFirst} from 'lodash'
import {injectIntl} from "react-intl";
import Lockr from "lockr";
import _ from "lodash";

class ExchangeTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      dataSource: props.dataSource,
      activeIndex:props.activeIndex,
      optional:[],
      optionalBok:false,
    };
  }

  getColumns() {
    let {intl,setCollection} = this.props;
    let { dataSource } = this.state;
    let isfov = Lockr.get('DEX') == 'GEM'

    const columns = [{
      title: upperFirst(intl.formatMessage({id: 'pairs'})),
      key: 'first_token_id',
      render: (text, record, index) => {
        return <div className="position-relative">
          {
            isfov &&
            <div className="fov_tip">
              {
                record.token_type == 'dex20'
                ?<img src={require("../../../../../images/svg/20.svg")}/>
                :<img src={require("../../../../../images/svg/10.svg")}/>
              }
            </div>
          }
          <span className="optional-star">
              <span onClick={(ev) => {setCollection(ev,record.exchange_id,index,record)}}>
                  {
                      record.optionalBok ? <i className="star_red"></i> : <i className="star"></i>
                  }
              </span>
          </span>
          <span className="exchange-abbr-name">{record.exchange_abbr_name}</span>
        </div>
      }
    },
    {
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
                       this.docodUrl(record)
                   },
                   // onClick: (e) => {
                   //     this.props.setCollection(e,record.exchange_id)
                   // },
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
    const {getSelectData } = this.props;
    let { dataSource } = this.state;
    const currentData = filter(dataSource, item => {
      return item.exchange_id == parsed
    })
    // 更新数据
    if(dataSource.length){
      if(!parsed || !currentData.length){
          this.onSetUrl(dataSource[0])
      }else{
        this.onSetUrl(currentData[0], true)
      }
    }

    // 获取选择状态
    map(dataSource, item => {
      if(item.exchange_id == parsed || !parsed){
        item.isCurrent = true
      }
    })
  }

  onSetUrl(record,type) {
    const {getSelectData} = this.props;
    if(!record.exchange_id)return
    if(record.token_type == 'dex20'){
      this.props.history.push('/exchange20?token='+ record.exchange_name+'&id='+record.exchange_id)
      return
    }
    this.setState({
        activeIndex:record.exchange_id //获取点击行的索引
    },() => {
    })
    getSelectData(record, true)
    if(!type){
      this.props.history.push('/exchange?token='+ record.exchange_name+'&id='+record.exchange_id)
    }
   
     
  }
  docodUrl(record){
    const {klineLock} = this.props
    if(klineLock){
      this.onSetUrl(record)
    }
    // clearTimeout(this.time)
    // this.time = setTimeout(() => {
    //   this.onSetUrl(record)
    // }, 500);
  }

  componentDidMount() {


  }

  componentDidUpdate(prevProps) {
    let { dataSource,tab } = this.props;
    if ( dataSource && dataSource.length && prevProps.dataSource.length !== dataSource.length && dataSource[0].exchange_id && prevProps.tab === tab) {
    // if (!dataSource.length || dataSource[0].exchange_id != prevProps.dataSource[0].exchange_id) {
       this.getData()
    }
  }
  componentWillReceiveProps(nextProps) {
      const {getSelectData,setSearchAddId} = this.props;
      this.setState({
          dataSource: nextProps.dataSource,
      });
      if(this.props.searchAddId){
          let record =  _.filter(nextProps.dataSource, (o) => { return o.exchange_id == nextProps.activeIndex; });
          if(record.length > 0){
            this.props.history.push('/exchange?token='+ record[0].exchange_name+'&id='+record[0].exchange_id)
            getSelectData(record[0],true)
          }
         
          this.setState({
              activeIndex:nextProps.activeIndex,
          },()=>{
              this.props.setSearchAddId()
          });
      }

      if(this.props.tab !== nextProps.tab){
          this.setState({
              activeIndex:nextProps.activeIndex,
          });
      }
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
  return {
    klineLock: state.exchange.klineLock
  };
}

const mapDispatchToProps = {
  getSelectData,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(ExchangeTable)));


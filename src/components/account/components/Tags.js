import React,{Component} from "react";
import { tu } from "../../../utils/i18n";
import { upperFirst } from "lodash";
import { BlockNumberLink } from "../../common/Links";
import { FormattedNumber, injectIntl,FormattedDate,FormattedTime } from "react-intl";
import { Table, Input, Button, Icon } from "antd";
import { API_URL } from "../../../constants";
import qs from "qs";
import { Client } from "../../../services/api";
import { TronLoader } from "../../common/loaders";
import AddTags from './AddTags'

class Tags extends Component{
    constructor(){
        super();
       
        this.state = {
          pagination: {
            showQuickJumper: true,
            position: "bottom",
            showSizeChanger: true,
            defaultPageSize: 20,
            total: 0
          },
          popup:null
        }
    }
    componentDidMount(){
      this.load() 
    }

    load = async (page = 1, pageSize = 20) => {
      let { filter, getCsvUrl } = this.props;
      this.setState({ loading: true });
  
      const params = {
        sort: "-number",
        limit: pageSize,
        start: (page - 1) * pageSize,
        ...filter
      };
     
      let { blocks, total } = await Client.getBlocks(params);
  
      this.setState({
        page,
        blocks,
        total,
        loading: false,
        pagination: {
          ...this.state.pagination,
          total
        }
      });
    };

    customizedColumn = () => {
      let { intl } = this.props;
      let {timeType} = this.state
      let column = [
        {
          title: upperFirst(intl.formatMessage({ id: "data_account" })),
          dataIndex: "number",
          key: "number",
          align: "left",
          className: "ant_table",
          render: (text, record, index) => {
            return <BlockNumberLink number={text} />;
          }
        },
       
        {
          title: upperFirst(intl.formatMessage({ id: "account_tags_table_1" })),
          dataIndex: "nrOfTrx",
          key: "nrOfTrx",
          align: "left",
          width:'150px',
          className: "ant_table",
          render: (text, record, index) => {
            return <span><FormattedNumber value={text} /> Txns</span>;
          }
        },
        {
          title: upperFirst(
            intl.formatMessage({ id: "account_tags_table_2" })
          ),
          key: "netUsage",
          dataIndex: "netUsage",
          align: "left",
          className: "ant_table",
          render: (text, record, index) => {
          return (<span><FormattedNumber value={record.netUsage} /> {tu('bandwidth')} / <FormattedNumber value={record.energyUsage} /> {tu('energy')}</span> ) ;
          }
        },
        {
          title: upperFirst(intl.formatMessage({ id: "proposal_action" })),
          dataIndex: "size",
          key: "size",
          align: "left",
          className: "ant_table",
          render: (text, record, index) => {
            return <FormattedNumber value={text} />;
          },
          width:'150px'
        },
       
      ];
      return column;
    };

    addTagsModal = ()=>{
      console.log(111)
      this.setState({
        popup: (
            <AddTags onClose={this.hideModal}/>
        )
      });
    }

    hideModal = () => {
      this.setState({popup: null});
    };

    render(){
      let {
        page,
        total,
        pageSize,
        loading,
        blocks,
        popup
      } = this.state;
      let column = this.customizedColumn();
      let { intl } = this.props;
      let tableInfo = 
        intl.formatMessage({ id: "account_tags_number" },{total:total});
  
        return (
          <div className="card">
            {popup}
            <div className="card-body temp-table">
              <div className="d-flex justify-content-between account-switch">
                <h5 className="card-title text-center m-0">
                  {tu("account_tags_list")}
                </h5>
                <button className="btn btn-primary" onClick={this.addTagsModal}>
                  {tu("account_tags_add")}
                </button>
              </div>
              <p>{tu('account_tags_desc')}</p>
              <div className="token_black table_pos">
                {loading && (
                  <div className="loading-style">
                    <TronLoader />
                  </div>
                )}
                {total ? (
                  <div
                    className="mb-2"
                    style={{ left: "auto" }}
                  >
                    {tableInfo}
                  </div>
                ) : (
                  ""
                )}
                <Table
                  bordered={true}
                  loading={loading}
                  dataSource={blocks}
                  columns={column}
                  pagination={this.state.pagination}
                  onChange={(page, pageSize) => {
                    this.load(page.current, page.pageSize);
                  }}
                  rowKey={(record, index) => {
                    return index; 
                  }}       
                  />
              </div>
            </div>
          </div>
        )
    }
    
    

}

export default injectIntl(Tags)

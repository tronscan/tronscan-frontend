import React, { Fragment } from "react";
import { Client } from "../../services/api";
import { t, tu } from "../../utils/i18n";
import { withTimers } from "../../utils/timing";
import { upperFirst } from "lodash";
import { FormattedNumber, injectIntl } from "react-intl";
import { Tooltip, Table, Switch } from "antd";
import { QuestionMark } from "../common/QuestionMark.js";
import { ONE_TRX, IS_MAINNET, WARNING_VERSIONS } from "../../constants";
import { TronLoader } from "../common/loaders";
class ExchangeQuotes extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      list: [1,2,3],
      total: 0,
      rangeTotal: 0,
      loading: false,
      pagination: {
        showQuickJumper: true,
        position: "bottom",
        showSizeChanger: true,
        defaultPageSize: 20,
        total: 0
      }
    };
  }

  componentDidMount(){
    this.loadData()
  }

  loadData = () => {

  }
  customizedColumn = () => {
    let { intl } = this.props;
    let column = [
      {
        title: upperFirst(intl.formatMessage({ id: "token_rank" })),
        dataIndex: "address",
        key: "address",
        align: "left",
        // width: "12%",
        className: "ant_table",
        render: (text, record, index) => {
          return ''
        }
      },
      {
        title: upperFirst(intl.formatMessage({ id: "token_exchange" })),
        dataIndex: "name",
        key: "name",
        align: "left",
        // width: "10%",
        className: "ant_table",
        render: (text, record, index) => {
          return ''
        }
      },
      {
        title: upperFirst(intl.formatMessage({ id: "token_exchange_pair" })),
        dataIndex: "date_created",
        key: "date_created",
        align: "left",
        className: "ant_table",
        render: (text, record, index) => {
          return ''//<span>{text ? <FormattedDate value={text} /> : "--"}</span>;
        }
      },
      {
        title: upperFirst(intl.formatMessage({ id: "token_exchange_price" })),
        dataIndex: "trc20token",
        key: "trc20token",
        align: "left",
        className: "ant_table",
        render: (text, record, index) => {
          const defaultImg = require("../../images/logo_default.png");
          return ''
        }
      },
      {
        title: upperFirst(
          intl.formatMessage({ id: "token_exchange_24h_vol" })
        ),
        dataIndex: "compile_version",
        key: "compile_version",
        align: "left",
        className: "ant_table",
        render: (text, record, index) => {
          return ''
        }
      },
      {
        title: ()=> (
          <div>
            <span className="ml-2">
              <QuestionMark placement="top" text="token_exchange_rate_tip" />
            </span>
            {upperFirst(intl.formatMessage({ id: "token_exchange_vol_rate" }))}
          </div>
        ),
        dataIndex: "compile_settings",
        key: "compile_settings",
        align: "left",
        className: "ant_table",
        render: (text, record, index) => {
          const val = text ? JSON.parse(text) : "";
          return ''
        }
      }
    ];
    return column;
  };

  sunNetCustomizedColumn = () => {
    let { intl } = this.props;
    const title = (
      <div>
        {upperFirst(intl.formatMessage({ id: "balance" }))}
        <span className="ml-2">
          <QuestionMark placement="top" text="contract_balance_tip" />
        </span>
      </div>
    );
    let column = [
      {
        title: upperFirst(intl.formatMessage({ id: "address" })),
        dataIndex: "address",
        key: "address",
        align: "left",
        width: "12%",
        className: "ant_table",
        render: (text, record, index) => {
          return ''
        }
      },
      {
        title: upperFirst(intl.formatMessage({ id: "ContractName" })),
        dataIndex: "name",
        key: "name",
        align: "left",
        width: "10%",
        className: "ant_table",
        render: (text, record, index) => {
          return ''
        }
      },
      {
        title: upperFirst(intl.formatMessage({ id: "contract_create_time" })),
        dataIndex: "date_created",
        key: "date_created",
        align: "left",
        className: "ant_table",
        render: (text, record, index) => {
          return ''//<span>{text ? <FormattedDate value={text} /> : "--"}</span>;
        }
      },
      {
        title: upperFirst(intl.formatMessage({ id: "contract_token_name" })),
        dataIndex: "trc20token",
        key: "trc20token",
        align: "left",
        className: "ant_table",
        render: (text, record, index) => {
          const defaultImg = require("../../images/logo_default.png");
          return ''
        }
      },
      {
        title: upperFirst(
          intl.formatMessage({ id: "contract__compile_version" })
        ),
        dataIndex: "compile_version",
        key: "compile_version",
        align: "left",
        className: "ant_table",
        render: (text, record, index) => {
          return ''
        }
      },
      {
        title: upperFirst(intl.formatMessage({ id: "contract_setting" })),
        dataIndex: "compile_settings",
        key: "compile_settings",
        align: "left",
        className: "ant_table",
        render: (text, record, index) => {
          const val = text ? JSON.parse(text) : "";
          return ''
        }
      }
    ];
    return column;
  };

  handleTableChange = () => {

  }
  render(){
    let { list, pagination, loading, total } = this.state;
    let column = IS_MAINNET
      ? this.customizedColumn()
      : this.sunNetCustomizedColumn();
    return (
      <Fragment >
        {loading && (
          <div className="loading-style" style={{ marginTop: "-20px" }}>
            <TronLoader />
          </div>
        )}
        <div className="bg-white exchange-quotes-wrap">
        <div className="total-info">{tu('token_exchange_total1')}{`${total}`}{tu('token_exchange_total2')}</div>
          <Table
            bordered={false}
            columns={column}
            rowKey={(record, index) => {
              return index;
            }}
            dataSource={list}
            // scroll={scroll}
            pagination={pagination}
            loading={loading}
            onChange={this.handleTableChange}
          />
        </div>
      </Fragment>
    )
  }
}
export default withTimers(injectIntl(ExchangeQuotes));
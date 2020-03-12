import React, {Component, Fragment} from "react";
import {tu} from "../../../utils/i18n";
import {FormattedNumber, injectIntl} from "react-intl";
import {toUpper} from "lodash";
import {TokenLink, TokenTRC20Link, AddressLink} from "../../common/Links";
import {SwitchToken} from "../../common/Switch";
import { Truncate } from "../../common/text";
import SmartTable from "../../common/SmartTable.js"
import {upperFirst} from "lodash";
import _ from "lodash";
import { CONTRACT_ADDRESS_USDT, CONTRACT_ADDRESS_WIN, CONTRACT_ADDRESS_GGC } from "../../../constants";
import {TRXPrice} from "../../common/Price";
import {Table, Menu, Dropdown, Button, Radio} from 'antd'
import { ONE_TRX } from "../../../constants";
import { recoverAddress } from "ethers/utils";
import {QuestionMark} from "../../common/QuestionMark";
import {TronLoader} from "../../common/loaders";
import {Client} from "../../../services/api";
import {API_URL} from "../../../constants";


class FreezeDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filterType: "self",
      pagination: {
        showQuickJumper: true,
        position: "bottom",
        showSizeChanger: true,
        defaultPageSize: 20,
        total: 0
      },
      resourceType: "all",
    }
  }

  componentDidMount() {
    this.load();
  }

  load = async (page = 1, pageSize = 20,sorter) => {

    let votes = [{votes:10}]
    this.setState({
      votes
    })
  };
  onChange = (e) => {
    console.log(e)
  }

  customizedColumn = () => {
    let {intl} = this.props;
    let { resourceType } = this.state
    const menu =   (<Menu onClick={this.handleMenuClick} className="list-filter">
          <Menu.Item  key="all" className={`${resourceType == 'all' && 'active'}`}>
              <div>{tu('account_all')}</div>
          </Menu.Item>
          <Menu.Item key="energy" className={`${resourceType == 'energy' && 'active'}`}>
            <div>{tu('energy')}</div>
          </Menu.Item>
          <Menu.Item key="bandwidth" className={`${resourceType == 'bandwidth' && 'active'}`}>
            <div>{tu('bandwidth')}</div>
          </Menu.Item>
      </Menu>
    )
    const droplist = (
      <Dropdown overlay={menu} placement="bottomLeft">
        <span style={{position: 'relative'}}>
          {upperFirst(intl.formatMessage({id: 'account_freeze_type'}))}
          <i className="arrow-down"></i>
        </span>
      </Dropdown>
    )
    let column = [
      {
        title: upperFirst(intl.formatMessage({id: 'account_freeze_time'})),
        dataIndex: 'votes',
        key: 'votes',
        align: 'left',
        className: 'ant_table',
        render: (text, record, index) => {
            return <span>{text}</span>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'account_freeze_address'})),
        dataIndex: 'votes',
        key: 'votes',
        align: 'left',
        className: 'ant_table',
        render: (text, record, index) => {
            return <span>{text}</span>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'account_freeze_received'})),
        dataIndex: 'votes',
        key: 'votes',
        align: 'left',
        className: 'ant_table',
        render: (text, record, index) => {
            return <span>{text}</span>
        }
      },
      {
        title: droplist,
        dataIndex: 'votes',
        key: 'votes',
        align: 'left',
        className: 'ant_table',
        render: (text, record, index) => {
            return <span>{text}</span>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'account_freeze_amount'})) + '(TRX)',
        dataIndex: 'votes',
        key: 'votes',
        align: 'left',
        className: 'ant_table',
        render: (text, record, index) => {
            return <span>{text}</span>
        }
      },
      {
        title: (
          <span>
            {upperFirst(intl.formatMessage({id: 'account_freeze_resource_amount'}))}
            <span className="ml-2">
              <QuestionMark placement="top" text="account_freeze_resource_amount_tip"/>
            </span>
          </span>),
        dataIndex: 'votes',
        key: 'votes',
        align: 'left',
        className: 'ant_table',
        render: (text, record, index) => {
            return <span>{text}</span>
        }
      },
    ]

    return column
  }

  handleTableChange = () => {

  }

  render() {
    const column = this.customizedColumn()
    const { pagination, loading, data, votes } = this.state
    const { intl } = this.props
    return (
      <Fragment>
        <div className="mt-4 mb-2" >
          <Radio.Group defaultValue="self" style={{fontSize: '12px'}} onChange={this.onChange}>
            <Radio.Button value="self">{tu('account_freeze_self')}</Radio.Button>
            <Radio.Button value="b">{tu('account_freeze_to_other')}</Radio.Button>
            <Radio.Button value="c">{tu('account_freeze_other_to')}</Radio.Button>
          </Radio.Group>
        </div>
        <div className="token_black table_pos">
          {loading && <div className="loading-style"><TronLoader/></div>}
          {data ? 
          <div className="text-center p-3 no-data">
              {tu("account_freeze_no_data")}
          </div>:
          <div className="mt-1">
            <Table
                bordered={true}
                columns={column}
                rowKey={(record, index) => {
                  return index;
                }}
                dataSource={votes}
                scroll={scroll}
                pagination={pagination}
                loading={loading}
                onChange={this.handleTableChange}
            />
          </div>}
        </div>
      </Fragment>
    )
  }
}

export default injectIntl(FreezeDetail)
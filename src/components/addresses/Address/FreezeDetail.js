import React, { Component, Fragment } from "react";
import { tu } from "../../../utils/i18n";
import {
  FormattedDate,
  FormattedTime,
  FormattedNumber,
  injectIntl
} from "react-intl";
import { toUpper } from "lodash";
import { TokenLink, TokenTRC20Link, AddressLink } from "../../common/Links";
import { SwitchToken } from "../../common/Switch";
import { Truncate } from "../../common/text";
import SmartTable from "../../common/SmartTable.js";
import { upperFirst } from "lodash";
import _ from "lodash";
import {
  CONTRACT_ADDRESS_USDT,
  CONTRACT_ADDRESS_WIN,
  CONTRACT_ADDRESS_GGC
} from "../../../constants";
import { TRXPrice } from "../../common/Price";
import { Table, Menu, Dropdown, Button, Radio } from "antd";
import { ONE_TRX } from "../../../constants";
import { recoverAddress } from "ethers/utils";
import { QuestionMark } from "../../common/QuestionMark";
import { TronLoader } from "../../common/loaders";
import { Client, AccountApi } from "../../../services/api";
import { API_URL } from "../../../constants";
import { isAddressValid } from "@tronscan/client/src/utils/crypto";

class FreezeDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterType: 1,
      pagination: {
        showQuickJumper: true,
        position: "bottom",
        showSizeChanger: true,
        defaultPageSize: 20,
        total: 0
      },
      resourceType: 0
    };
  }

  componentDidMount() {
    this.load();
  }

  load = async (page = 1, pageSize = 20, sorter) => {
    const { address } = this.props;
    const { resourceType, filterType } = this.state;
    this.setState({ loading: true });
    const res = await AccountApi.getAccountFreezeResource({
      address,
      type: filterType,
      resourceType
    }).catch(e => console.log(e));
    let votes = (res && res.data) || [];
    this.setState({
      votes,
      loading: false
    });
  };
  onChange = e => {
    this.setState(
      {
        filterType: e.target.value,
        resourceType: 0
      },
      () => {
        this.load();
      }
    );
  };
  handleMenuClick = e => {
    this.setState(
      {
        resourceType: e.key
      },
      () => {
        this.load();
      }
    );
  };

  customizedColumn = () => {
    let { intl, address } = this.props;
    let { resourceType } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} className="list-filter">
        <Menu.Item key="0" className={`${resourceType == "0" && "active"}`}>
          <div>{tu("all")}</div>
        </Menu.Item>
        <Menu.Item key="1" className={`${resourceType == "1" && "active"}`}>
          <div>{tu("bandwidth")}</div>
        </Menu.Item>
        <Menu.Item key="2" className={`${resourceType == "2" && "active"}`}>
          <div>{tu("energy")}</div>
        </Menu.Item>
      </Menu>
    );
    const droplist = (
      <Dropdown overlay={menu} placement="bottomLeft">
        <span style={{ position: "relative" }}>
          {upperFirst(intl.formatMessage({ id: "account_freeze_type" }))}
          <i className="arrow-down"></i>
        </span>
      </Dropdown>
    );
    let column = [
      {
        title: upperFirst(intl.formatMessage({ id: "account_freeze_time" })),
        dataIndex: "timestamp",
        key: "timestamp",
        align: "left",
        className: "ant_table",
        render: (text, record, index) => {
          return (
            <Fragment>
              <FormattedDate value={Number(text)} />
              &nbsp;
              <FormattedTime
                value={Number(text)}
                hour="numeric"
                minute="numeric"
                second="numeric"
                hour12={false}
              />
            </Fragment>
          );
        }
      },
      {
        title: upperFirst(intl.formatMessage({ id: "account_freeze_address" })),
        dataIndex: "ownerAddress",
        key: "ownerAddress",
        width: "20%",
        align: "left",
        className: "ant_table",
        render: (text, record, index) => {
          return text != address ? (
            <AddressLink address={text}>{text}</AddressLink>
          ) : (
            <div style={{ maxWidth: "220px" }}>{addressFormat(text)}</div>
          );
        }
      },
      {
        title: upperFirst(
          intl.formatMessage({ id: "account_freeze_received" })
        ),
        dataIndex: "receiverAddress",
        key: "receiverAddress",
        width: "20%",
        align: "left",
        className: "ant_table",
        render: (text, record, index) => {
          return text != address ? (
            <AddressLink address={text}>{text}</AddressLink>
          ) : (
            <div style={{ maxWidth: "220px" }}>{addressFormat(text)}</div>
          );
        }
      },
      {
        title: droplist,
        dataIndex: "resource",
        key: "resource",
        align: "left",
        className: "ant_table",
        render: (text, record, index) => {
          return upperFirst(intl.formatMessage({ id: text.toLowerCase() })); //<span>{text}</span>
        }
      }, 
      {
        title: (
          <span>
            {upperFirst(
              intl.formatMessage({ id: "account_freeze_resource_amount" })
            )}
            <span className="ml-2">
              <QuestionMark
                placement="top"
                text="account_freeze_resource_amount_tip"
              />
            </span>
          </span>
        ),
        dataIndex: "resourceValue",
        key: "resourceValue",
        align: "left",
        className: "ant_table",
        render: (text, record, index) => {
          return (
            <span>
              <FormattedNumber value={text} />
            </span>
          );
        }
      },
      {
        title:
          upperFirst(intl.formatMessage({ id: "account_freeze_amount" })) +
          "(TRX)",
        dataIndex: "frozenBalance",
        key: "frozenBalance",
        align: "left",
        className: "ant_table",
        render: (text, record, index) => {
          return (
            <span>
              <FormattedNumber value={text / ONE_TRX} />
            </span>
          );
        }
      }
    ];

    return column;
  };

  handleTableChange = () => {};

  render() {
    const column = this.customizedColumn();
    const { pagination, loading, votes, resourceType } = this.state;
    const { intl } = this.props;
    return (
      <div className="freeze-detail-wrap">
        <div className="mt-4 mb-2">
          <Radio.Group
            defaultValue="1"
            style={{ fontSize: "12px" }}
            onChange={this.onChange}
          >
            <Radio.Button value="1">{tu("account_freeze_self")}</Radio.Button>
            <Radio.Button value="2">
              {tu("account_freeze_to_other")}
            </Radio.Button>
            <Radio.Button value="3">
              {tu("account_freeze_other_to")}
            </Radio.Button>
          </Radio.Group>
        </div>
        <div className="token_black table_pos">
          {loading && (
            <div className="loading-style">
              <TronLoader />
            </div>
          )}
          {votes && votes.length == 0 && resourceType == "0" ? (
            <div className="text-center p-3 no-data">
              {tu("account_freeze_no_data")}
            </div>
          ) : (
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
            </div>
          )}
        </div>
      </div>
    );
  }
}

function addressFormat(addr) {
  let children_start =
    addr && isAddressValid(addr) ? addr.substring(0, 29) : "";
  let children_end = addr && isAddressValid(addr) ? addr.substring(29, 34) : "";

  return (
    <div className="ellipsis_box">
      <div className="ellipsis_box_start">{children_start}</div>
      <div className="ellipsis_box_end">{children_end}</div>
    </div>
  );
}

export default injectIntl(FreezeDetail);

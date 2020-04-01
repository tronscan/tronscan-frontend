import React, { Component } from "react";
import { tu } from "../../../utils/i18n";
import { upperFirst } from "lodash";
import { BlockNumberLink } from "../../common/Links";
import {
  FormattedNumber,
  injectIntl,
  FormattedDate,
  FormattedTime
} from "react-intl";
import { Table, Input, Button, Icon } from "antd";
import { API_URL } from "../../../constants";
import qs from "qs";
import { Client } from "../../../services/api";
import { TronLoader } from "../../common/loaders";
import AddTag from "./AddTag";
import ApiClientAccount from "../../../services/accountApi";
import {
  AddressLink,
  HrefLink,
  TokenLink,
  TokenTRC20Link
} from "../../common/Links";
import "../../../styles/tags.scss";
import SweetAlert from "react-bootstrap-sweetalert";

class Tags extends Component {
  constructor() {
    super();

    this.state = {
      pagination: {
        showQuickJumper: true,
        position: "bottom",
        showSizeChanger: true,
        defaultPageSize: 20,
        total: 0,
        data: []
      },
      popup: null
    };
  }
  componentDidMount() {
    this.load();
  }

  load = async (page = 1, pageSize = 20) => {
    this.setState({ loading: true });
    let { address } = this.props;

    const params = {
      user_address: address,
      limit: pageSize,
      start: (page - 1) * pageSize
    };

    let { data } = await ApiClientAccount.getTagsList(params);

    this.setState({
      page,
      data: data.user_tags,
      total: data.total,
      loading: false,
      pagination: {
        ...this.state.pagination,
        total: data.total
      }
    });
  };

  customizedColumn = () => {
    let { intl } = this.props;
    let { timeType } = this.state;
    let column = [
      {
        title: upperFirst(intl.formatMessage({ id: "data_account" })),
        dataIndex: "targetAddress",
        key: "targetAddress",
        align: "left",
        className: "ant_table",
        width: "30%",
        render: (text, record, index) => {
          return <AddressLink address={text}>{text}</AddressLink>;
        }
      },

      {
        title: upperFirst(intl.formatMessage({ id: "account_tags_table_1" })),
        dataIndex: "tag",
        key: "tag",
        align: "left",
        className: "ant_table",
        width: "20%",
        render: (text, record, index) => {
          return <div className="ellipsis tag-len">{text}</div>;
        }
      },
      {
        title: upperFirst(intl.formatMessage({ id: "account_tags_table_2" })),
        key: "description",
        dataIndex: "description",
        align: "left",
        className: "ant_table",
        width: "35%",
        render: (text, record, index) => {
          return <div className="ellipsis desc-len">{text}</div>;
        }
      },
      {
        title: upperFirst(intl.formatMessage({ id: "proposal_action" })),
        dataIndex: "size",
        key: "size",
        align: "left",
        className: "ant_table",
        width: "15%",
        render: (text, record, index) => {
          return (
            <span>
              <button className="btn" onClick={this.editTagModal}>
                {tu("account_tags_edit")}
              </button>
              <button className="btn" onClick={this.deleteTagModal}>
                {tu("account_tags_delete")}
              </button>
            </span>
          );
        }
      }
    ];
    return column;
  };

  addTagsModal = () => {
    this.setState({
      popup: <AddTag onClose={this.hideModal} />
    });
  };

  editTagModal = () => {
    this.setState({
      popup: <AddTag onClose={this.hideModal} />
    });
  };

  deleteTagModal = () => {
    this.setState({
      popup: (
        <SweetAlert
          showCancel
          confirmBtnText={tu("account_tags_delete")}
          confirmBtnBsStyle="danger"
          cancelBtnBsStyle="default"
          cancelBtnText={tu("cancel")}
          title={tu("account_tags_delete_is")}
          onConfirm={this.deleteTag}
          onCancel={this.hideModal}
          style={{ height: "300px" }}
        >
          <div className="form-group" style={{ marginBottom: "36px" }}>
            <div
              className="mt-3 mb-2 text-left"
              style={{ color: "#666" }}
            ></div>
          </div>
        </SweetAlert>
      )
    });
  };

  deleteTag = () => {
    // delete tags
  };

  hideModal = () => {
    this.setState({ popup: null });
  };

  render() {
    let { page, total, pageSize, loading, data, popup } = this.state;
    let column = this.customizedColumn();
    let { intl } = this.props;
    let tableInfo = intl.formatMessage(
      { id: "account_tags_number" },
      { total: total }
    );

    return (
      <div className="card tags">
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
          <p>{tu("account_tags_desc")}</p>
          <div className="token_black table_pos">
            {loading && (
              <div className="loading-style">
                <TronLoader />
              </div>
            )}
            {total ? (
              <div className="mb-2" style={{ left: "auto" }}>
                {tableInfo}
              </div>
            ) : (
              ""
            )}
            <Table
              bordered={true}
              loading={loading}
              dataSource={data}
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
    );
  }
}

export default injectIntl(Tags);

import React, { Component, Fragment } from "react";
import { tu } from "../../../utils/i18n";
import { upperFirst } from "lodash";
import { injectIntl } from "react-intl";
import { Table, Icon, Tooltip } from "antd";
import { TronLoader } from "../../common/loaders";
import AddTag from "./AddTag";
import ApiClientAccount from "../../../services/accountApi";
import { AddressLink } from "../../common/Links";
import "../../../styles/tags.scss";
import SweetAlert from "react-bootstrap-sweetalert";
import { Link } from "react-router-dom";

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
      },
      data: [],
      popup: null,
      page: 1,
    };
  }
  componentDidMount() {
    this.load();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.address !== prevProps.address) {
      this.load();
    }
  }

  load = async (page = 1, pageSize = 20) => {
    this.setState({ loading: true });
    let { address } = this.props;

    const params = {
      user_address: address,
      limit: pageSize,
      start: (page - 1) * pageSize,
      random:parseInt(Math.random()*10000)
    };

    let { data } = await ApiClientAccount.getTagsList(params);
    let { user_tags, contract_map, total } = data;
    user_tags.forEach((item) => {
      if (contract_map) {
        contract_map[item.targetAddress]
          ? (item.ownerIsContract = true)
          : (item.ownerIsContract = false);
      }
    });

    this.setState({
      page,
      data: user_tags,
      total: total,
      loading: false,
      pagination: {
        ...this.state.pagination,
        total: data.total,
      },
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
          return (
            <div>
              {record.addressTag && (
                <Link to={`/address/${text}`}>{record.addressTag}</Link>
              )}
              {record.ownerIsContract ? (
                <span className="d-flex">
                  <Tooltip
                    placement="top"
                    title={upperFirst(
                      intl.formatMessage({
                        id: "transfersDetailContractAddress",
                      })
                    )}
                  >
                    <Icon
                      type="file-text"
                      style={{
                        verticalAlign: 0,
                        color: "#77838f",
                        lineHeight: 1.4,
                      }}
                    />
                  </Tooltip>
                  <AddressLink address={text} isContract={true}>
                    {text}
                  </AddressLink>
                </span>
              ) : (
                <AddressLink address={text}>{text}</AddressLink>
              )}
            </div>
          );
        },
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
        },
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
        },
      },
      {
        title: upperFirst(intl.formatMessage({ id: "proposal_action" })),
        dataIndex: "size",
        key: "size",
        align: "left",
        className: "ant_table",
        width: "30%",
        render: (text, record, index) => {
          return (
            <span>
              <button
                className="btn btn-md btn-default mr-2"
                onClick={() => this.editTagModal(record)}
              >
                {tu("account_tags_edit")}
              </button>
              <button
                className="btn btn-md btn-danger"
                onClick={(targetAddress) =>
                  this.deleteTagModal(record.targetAddress)
                }
              >
                {tu("account_tags_delete")}
              </button>
            </span>
          );
        },
      },
    ];
    return column;
  };

  addTagsModal = () => {
    this.setState({
      popup: (
        <AddTag onClose={this.hideModal} onloadTableP={this.onloadTable} />
      ),
    });
  };

  editTagModal = (record) => {
    this.setState({
      popup: (
        <AddTag
          onClose={this.hideModal}
          targetAddress={record.targetAddress}
          onloadTableP={this.onloadTable}
        />
      ),
    });
  };

  onloadTable = () => {
    let { page, pagination } = this.state;
    setTimeout(() => {
      this.load(page, pagination.pageSize);
    }, 1000);
  };

  deleteTagModal = (targetAddress) => {
    this.setState({
      deleteTargetAddress: targetAddress,
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
      ),
    });
  };

  deleteTag = async () => {
    // delete tags
    let { address } = this.props;
    let { deleteTargetAddress, page, pagination } = this.state;
    let obj = {
      user_address: address,
      target_address: deleteTargetAddress,
    };

    let { retCode, retMsg } = await ApiClientAccount.removeTag(obj);
    if (retCode == 0) {
      this.setState({
        popup: (
          <SweetAlert
            success
            title={tu("account_tags_delete_succss")}
            onConfirm={this.hideModal}
          />
        ),
      });

      setTimeout(() => {
        this.load(page, pagination.pageSize);
        this.setState({
          popup: null,
        });
      }, 1000);
    } else {
      this.setState({
        popup: (
          <SweetAlert success title={retMsg[0]} onConfirm={this.hideModal} />
        ),
      });
    }
  };

  hideModal = () => {
    this.setState({ popup: null });
  };

  render() {
    let { page, total, pageSize, loading, data, popup } = this.state;
    let column = this.customizedColumn();
    let { intl } = this.props;
    let tableInfo =
      total == 1 && intl.locale == "en"
        ? intl.formatMessage(
            { id: "account_tags_number_one" },
            { total: total }
          )
        : intl.formatMessage({ id: "account_tags_number" }, { total: total });

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
              <Fragment>
                <div className="mb-2" style={{ left: "auto" }}>
                  {tableInfo}
                </div>
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
              </Fragment>
            ) : (
              <div className="no-data">
                <img src={require("../../../images/logo_default.png")} />
                <p className="text-muted">{tu("trc20_no_data")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(Tags);

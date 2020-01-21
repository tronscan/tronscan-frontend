import React, { Fragment } from "react";
import { tu, t } from "../../../utils/i18n";
import { Table } from "antd";
import { FormattedNumber, injectIntl } from "react-intl";
import { QuestionMark } from "../../common/QuestionMark";
import { upperFirst, cloneDeep } from "lodash";
import { AddressLink } from "../../common/Links";
import { Link } from "react-router-dom";
import SmartTable from "../../common/SmartTable";

class DataResources extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      resourcesList: [{ id: 1 }],
      titleStyle: {
        fontFamily: "PingFangSC-Medium",
        fontSize: "16px",
        color: "#3C3C3C"
      }
    };
  }
  componentDidMount() {}

  customizedEnergyColumn = () => {
    const { topData, intl } = this.props;
    let energyData = [];
    if (topData) {
      if (topData.length > 0) {
        topData[0].data ? (energyData = topData[0].data) : [];
      } else {
        energyData = [];
      }
    } else {
      energyData = [];
    }

    let length = energyData.length - 1;
    let column = [
      {
        title: upperFirst(
          intl.formatMessage({
            id: "data_resource_table_rank"
          })
        ),
        dataIndex: "rank",
        key: "rank",
        align: "center",
        render: (text, record, index) => {
          return (
            <span className="rankWidth">
              {index == length ? (
                intl.formatMessage({ id: "data_total" })
              ) : index < 3 ? (
                <span className={`rank-${index} rank`}></span>
              ) : (
                index + 1
              )}
            </span>
          );
        }
      },
      {
        title: upperFirst(
          intl.formatMessage({
            id: "data_resource_table_account"
          })
        ),
        dataIndex: "address",
        key: "address",
        align: "left",
        width: "150px",
        render: (text, record, index) => {
          return text ? (
            <span className="resourceAddress">
               {record.addressTag && (
                <Link to={`/address/${text}`}>{record.addressTag}</Link>
              )}
              <AddressLink address={text}>{text}</AddressLink>
            </span>
          ) : (
            "--"
          );
        }
      },
      {
        title: upperFirst(
          intl.formatMessage({
            id: "data_resource_table_freezingTRX_energy"
          })
        ),
        dataIndex: "energy_use",
        key: "energy_use",
        align: "left",
        render: (text, record, index) => {
          return (
            <span className="">
              <FormattedNumber value={parseInt(text || 0)}></FormattedNumber>{" "}
              ENERGY
            </span>
          );
        }
      },
      {
        title: upperFirst(
          intl.formatMessage({
            id: "data_resource_table_burningTRX_energy"
          })
        ),
        dataIndex: "energy_burn",
        key: "energy_burn",
        align: "left",
        render: (text, record, index) => {
          return (
            <span className="">
              <FormattedNumber value={parseInt(text || 0)}></FormattedNumber>{" "}
              ENERGY
            </span>
          );
        }
      },
      {
        title: upperFirst(
          intl.formatMessage({
            id: "data_whole_contract_use"
          })
        ),
        dataIndex: "contract_use",
        key: "contract_use",
        align: "left",
        render: (text, record, index) => {
          return (
            <span className="">
              <FormattedNumber value={parseInt(text || 0)}></FormattedNumber>{" "}
              ENERGY
            </span>
          );
        }
      },
      {
        title: upperFirst(
          intl.formatMessage({
            id: "data_resource_table_energy_consumed"
          })
        ),
        dataIndex: "whole_energy_use",
        key: "whole_energy_use",
        align: "left",
        render: (text, record, index) => {
          return (
            <span className="">
              <FormattedNumber value={parseInt(text || 0)}></FormattedNumber>{" "}
              ENERGY
            </span>
          );
        }
      },
      {
        title: () => {
          return (
            <div>
              <span className="mr-2">
                {upperFirst(
                  intl.formatMessage({ id: "data_resource_table_percentage" })
                )}
              </span>
              <QuestionMark
                placement="top"
                text="data_resource_table_percentage_tips"
              />
            </div>
          );
        },
        dataIndex: "percentage",
        key: "percentage",
        align: "left",
        render: (text, record, index) => {
          return (
            <span className="percentageWidth">{(text * 100).toFixed(2)}%</span>
          );
        }
      }
    ];
    return column;
  };

  customizedBandWidthColumn = () => {
    const { topData, intl } = this.props;
    let bandWidthData = [];
    if (topData) {
      if (topData.length > 0) {
        topData[1].data ? (bandWidthData = topData[1].data) : [];
      } else {
        bandWidthData = [];
      }
    } else {
      bandWidthData = [];
    }
    const length = bandWidthData.length - 1;
    let column = [
      {
        title: upperFirst(
          intl.formatMessage({
            id: "data_resource_table_rank"
          })
        ),
        dataIndex: "rank",
        key: "rank",
        render: (text, record, index) => {
          return (
            <span className="rankWidth">
              {index == length ? (
                intl.formatMessage({ id: "data_total" })
              ) : index < 3 ? (
                <span className={`rank-${index} rank`}></span>
              ) : (
                index + 1
              )}
            </span>
          );
        },
        align: "center"
      },
      {
        title: upperFirst(
          intl.formatMessage({
            id: "data_resource_table_account"
          })
        ),
        dataIndex: "address",
        key: "address",
        width: "150px",
        align: "left",
        render: (text, record, index) => {
          return text ? (
            <span className="resourceAddress">
              {record.addressTag && (
                <Link to={`/address/${text}`}>{record.addressTag}</Link>
              )}
              <AddressLink address={text}>{text}</AddressLink>
            </span>
          ) : (
            "--"
          );
        }
      },
      {
        title: upperFirst(
          intl.formatMessage({
            id: "data_bandwidth_freezed"
          })
        ),
        dataIndex: "net_use",
        key: "net_use",
        align: "left",
        render: (text, record, index) => {
          return (
            <span>
              <FormattedNumber value={parseInt(text || 0)}></FormattedNumber>{" "}
              BANDWIDTH
            </span>
          );
        }
      },
      {
        title: upperFirst(
          intl.formatMessage({
            id: "data_bandwidth_burned"
          })
        ),
        dataIndex: "net_burn",
        key: "net_burn",
        align: "left",
        render: (text, record, index) => {
          return (
            <span>
              <FormattedNumber value={parseInt(text || 0)}></FormattedNumber>{" "}
              BANDWIDTH
            </span>
          );
        }
      },
      {
        title: upperFirst(
          intl.formatMessage({
            id: "data_bandwidth_consumed_total"
          })
        ),
        dataIndex: "whole_net_use",
        key: "whole_net_use",
        align: "left",
        render: (text, record, index) => {
          return (
            <span>
              <FormattedNumber value={parseInt(text || 0)}></FormattedNumber>{" "}
              BANDWIDTH
            </span>
          );
        }
      },
      {
        title: () => {
          return (
            <div>
              <span className="mr-2">
                {upperFirst(
                  intl.formatMessage({ id: "data_resource_table_percentage" })
                )}
              </span>
              <QuestionMark
                placement="top"
                text="data_resource_bandwith_table_percentage_tips"
              />
            </div>
          );
        },
        dataIndex: "percentage",
        key: "percentage",
        align: "left",
        render: (text, record, index) => {
          return (
            <span className="percentageWidth">{(text * 100).toFixed(2)}%</span>
          );
        }
      }
    ];
    return column;
  };

  render() {
    let energyColumns = this.customizedEnergyColumn();
    let bandWidthColumns = this.customizedBandWidthColumn();
    const { resourcesList, loading, titleStyle } = this.state;
    const { topData } = this.props;
    let energyData, bandWidthData;

    if (topData) {
      if (topData.length > 0) {
        topData[0].data ? (energyData = topData[0].data) : [];
        topData[1].data ? (bandWidthData = topData[1].data) : [];
      } else {
        energyData = [];
        bandWidthData = [];
      }
    } else {
      energyData = [];
      bandWidthData = [];
    }

    return (
      <div className="resourceWrapper">
        <h4 style={titleStyle} className="mt-4 mb-2">
          {tu("data_resource_table_title")}
        </h4>
        <div className="resourceTable top-data">
          {resourcesList.length === 0 ? (
            <div className="pt-5 pb-5 text-center no-data transfers-bg-white">
              {tu("no_transfers")}
            </div>
          ) : (
            <SmartTable
              bordered={false}
              loading={loading}
              column={energyColumns}
              data={energyData}
              position="bottom"
              isPaddingTop={false}
              pagination={false}
            />
          )}
        </div>
        <h4 style={titleStyle} className="mt-4 mb-2">
          {tu("data_resource_table_bandwidth_title")}
        </h4>
        <div className="resourceTable bandWidthTable top-data">
          {resourcesList.length === 0 ? (
            <div className="pt-5 pb-5 text-center no-data transfers-bg-white">
              {tu("no_transfers")}
            </div>
          ) : (
            <SmartTable
              bordered={false}
              loading={loading}
              column={bandWidthColumns}
              data={bandWidthData}
              position="bottom"
              isPaddingTop={false}
              pagination={false}
            />
          )}
        </div>
      </div>
    );
  }
}

export default injectIntl(DataResources);

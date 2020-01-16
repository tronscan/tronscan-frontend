import React, { Fragment }  from 'react';
import { tu, t } from "../../../utils/i18n";
import { Table, } from "antd";
import {
    FormattedNumber,
    injectIntl,
    FormattedDate,
    FormattedTime
  } from "react-intl";
import { upperFirst } from "lodash";
import { AddressLink } from "../../common/Links";
import SmartTable from "../../common/SmartTable";

class DataResources extends React.Component{
  constructor(){
    super();
    this.state={
        data:[],
        loading:false,
        resourcesList:[{'id':1}],
        titleStyle:{
            fontFamily: "PingFangSC-Medium",
            fontSize: "16px",
            color: "#3C3C3C"
        }
    }
  }
  componentDidMount(){

  }
  customizedEnergyColumn = () => {
    let { intl } = this.props;
    let column = [
        {
            title: upperFirst(
                intl.formatMessage({
                    id: "data_resource_table_rank"
                })
            ),
            dataIndex: "transactionHash",
            key: "transactionHash",
            align: "center",
        },
        {
            title: upperFirst(
                intl.formatMessage({
                    id: "data_resource_table_account"
                })
            ),
            dataIndex: "transactionHash1",
            key: "transactionHash1",
            align: "center",
            render: (text, record, index) => {
                return text ? (
                <span className="addressWidth">
                    <span className="">
                        <AddressLink address={text}>{text}</AddressLink>
                    </span>
                    </span>
                    ) : (
                    "--"
                );
            },
        },
        {
            title: upperFirst(
                intl.formatMessage({
                    id: "data_resource_table_freezingTRX_energy"
                })
            ),
            dataIndex: "transactionHash2",
            key: "transactionHash2",
            align: "center",
            render: (text, record, index) => {
                return (
                  <span className="">
                    <FormattedNumber value={parseInt(text || 0)}></FormattedNumber>
                  </span>
                );
            },
        },
        {
            title: upperFirst(
                intl.formatMessage({
                    id: "data_resource_table_burningTRX_energy"
                })
            ),
            dataIndex: "transactionHash3",
            key: "transactionHash3",
            align: "center",
            render: (text, record, index) => {
                return (
                  <span className="">
                    <FormattedNumber value={parseInt(text || 0)}></FormattedNumber>
                  </span>
                );
            },
        },
        {
            title: upperFirst(
                intl.formatMessage({
                    id: "data_resource_table_energy_consumed"
                })
            ),
            dataIndex: "transactionHash4",
            key: "transactionHash4",
            align: "center",
            render: (text, record, index) => {
                return (
                  <span className="">
                    <FormattedNumber value={parseInt(text || 0)}></FormattedNumber>
                  </span>
                );
            },
        },
        {
            title: upperFirst(
                intl.formatMessage({
                    id: "data_resource_table_percentage"
                })
            ),
            dataIndex: "transactionHash5",
            key: "transactionHash5",
            align: "center",
            render: (text, record, index) => {
                return (
                  <span className="percentageWidth">{(text * 100).toFixed(2)} %</span>
                );
            },
        }
    ]
    return column;
  }

  customizedBandWidthColumn = () => {
    let { intl } = this.props;
    let column = [
        {
            title: upperFirst(
                intl.formatMessage({
                    id: "data_resource_table_rank"
                })
            ),
            dataIndex: "transactionHash",
            key: "transactionHash",
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
            dataIndex: "transactionHash1",
            key: "transactionHash1",
            align: "center",
            render: (text, record, index) => {
                return text ? (
                <span className="addressWidth">
                    <span>
                        <AddressLink address={text}>{text}</AddressLink>
                    </span>
                </span>
                    ) : (
                    "--"
                );
            },
        },
        {
            title: upperFirst(
                intl.formatMessage({
                    id: "data_resource_table_freezingTRX_energy"
                })
            ),
            dataIndex: "transactionHash2",
            key: "transactionHash2",
            align: "center",
            render: (text, record, index) => {
                return (
                  <span>
                    <FormattedNumber value={parseInt(text || 0)}></FormattedNumber>
                  </span>
                );
            },
        },
        {
            title: upperFirst(
                intl.formatMessage({
                    id: "data_resource_table_burningTRX_energy"
                })
            ),
            dataIndex: "transactionHash3",
            key: "transactionHash3",
            align: "center",
            render: (text, record, index) => {
                return (
                  <span >
                    <FormattedNumber value={parseInt(text || 0)}></FormattedNumber>
                  </span>
                );
            },
        },
        {
            title: upperFirst(
                intl.formatMessage({
                    id: "data_resource_table_energy_consumed"
                })
            ),
            dataIndex: "transactionHash4",
            key: "transactionHash4",
            align: "center",
            render: (text, record, index) => {
                return (
                  <span>
                    <FormattedNumber value={parseInt(text || 0)}></FormattedNumber>
                  </span>
                );
            },
        },
        {
            title: upperFirst(
                intl.formatMessage({
                    id: "data_resource_table_percentage"
                })
            ),
            dataIndex: "transactionHash5",
            key: "transactionHash5",
            align: "center",
            render: (text, record, index) => {
                return (
                  <span className="percentageWidth">{(text * 100).toFixed(2)} %</span>
                );
            },
        }
    ]
    return column;
  }


  render(){
    let energyColumns = this.customizedEnergyColumn();
    let bandWidthColumns = this.customizedBandWidthColumn();
    const {data,resourcesList,loading,titleStyle} = this.state;
    return (
        <div className="resourceWrapper">
            <h4 style={titleStyle} className="mt-4 mb-2">{tu("data_resource_table_title")}</h4>
            <div className="resourceTable">
                {resourcesList.length === 0 ? (
                  <div className="pt-5 pb-5 text-center no-data transfers-bg-white">
                    {tu("no_transfers")}
                  </div>
                ) : (
                  <SmartTable
                    bordered={false}
                    loading={loading}
                    column={energyColumns}
                    data={data}
                    position="bottom"
                    isPaddingTop={false}
                  />
                )}
            </div>
            <h4 style={titleStyle} className="mt-4 mb-2">最高带宽消耗</h4>
            <div className="resourceTable">
                {resourcesList.length === 0 ? (
                  <div className="pt-5 pb-5 text-center no-data transfers-bg-white">
                    {tu("no_transfers")}
                  </div>
                ) : (
                  <SmartTable
                    bordered={false}
                    loading={loading}
                    column={bandWidthColumns}
                    data={data}
                    position="bottom"
                    isPaddingTop={false}
                  />
                )}
            </div>
        </div>
    )
  }
}

export default injectIntl(DataResources);

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
                    id: "hash"
                })
            ),
            dataIndex: "transactionHash",
            key: "transactionHash",
            align: "left",
        },
        {
            title: upperFirst(
                intl.formatMessage({
                    id: "hash"
                })
            ),
            dataIndex: "transactionHash1",
            key: "transactionHash1",
            align: "left",
        },
        {
            title: upperFirst(
                intl.formatMessage({
                    id: "hash"
                })
            ),
            dataIndex: "transactionHash2",
            key: "transactionHash2",
            align: "left",
        },
        {
            title: upperFirst(
                intl.formatMessage({
                    id: "hash"
                })
            ),
            dataIndex: "transactionHash3",
            key: "transactionHash3",
            align: "left",
        },
        {
            title: upperFirst(
                intl.formatMessage({
                    id: "hash"
                })
            ),
            dataIndex: "transactionHash4",
            key: "transactionHash4",
            align: "left",
        },
        {
            title: upperFirst(
                intl.formatMessage({
                    id: "hash"
                })
            ),
            dataIndex: "transactionHash5",
            key: "transactionHash5",
            align: "left",
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
                    id: "hash"
                })
            ),
            dataIndex: "transactionHash",
            key: "transactionHash",
            align: "left",
        },
        {
            title: upperFirst(
                intl.formatMessage({
                    id: "hash"
                })
            ),
            dataIndex: "transactionHash1",
            key: "transactionHash1",
            align: "left",
        },
        {
            title: upperFirst(
                intl.formatMessage({
                    id: "hash"
                })
            ),
            dataIndex: "transactionHash2",
            key: "transactionHash2",
            align: "left",
        },
        {
            title: upperFirst(
                intl.formatMessage({
                    id: "hash"
                })
            ),
            dataIndex: "transactionHash3",
            key: "transactionHash3",
            align: "left",
        },
        {
            title: upperFirst(
                intl.formatMessage({
                    id: "hash"
                })
            ),
            dataIndex: "transactionHash4",
            key: "transactionHash4",
            align: "left",
        },
        {
            title: upperFirst(
                intl.formatMessage({
                    id: "hash"
                })
            ),
            dataIndex: "transactionHash5",
            key: "transactionHash5",
            align: "left",
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
            <h4 style={titleStyle} className="mt-4 mb-2">最高能量消耗</h4>
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

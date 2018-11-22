import React, {Fragment} from "react";
import {tu} from "../../utils/i18n";
import {injectIntl} from "react-intl";
import { Table } from 'antd';
import { filter, map ,upperFirst} from 'lodash'
import {Client} from "../../services/api";
import {Link} from "react-router-dom";
import {ONE_TRX} from "../../constants";
import {TronLoader} from "../common/loaders";


class Committee extends React.Component {

    constructor() {
        super();
        this.state = {
            committee: [
                {
                    "icon": "",
                    "dec": "committee_dec_1",
                },
                {
                    "icon":"../../images/proposals/proposal_2.png",
                    "dec":"committee_dec_2",
                },
                {
                    "icon":"../../images/proposals/proposal_3.png",
                    "dec":"committee_dec_3",
                },
                {
                    "icon":"../../images/proposals/proposal_4.png",
                    "dec":"committee_dec_4",
                },
            ],
            dataSource:[]
        };
    }

    componentDidMount() {
        this.getChainparameters();
    }

    async getChainparameters() {
        let { tronParameters } = await Client.getChainparameters();
        tronParameters.map(item => {
            switch (item['key']){
                case "MAINTENANCE_TIME_INTERVAL":
                    item.name = 'propose_1';
                break;
                case "ACCOUNT_UPGRADE_COST":
                    item.name = 'propose_2';
                break;
                case "CREATE_ACCOUNT_FEE":
                    item.name = 'propose_3';
                break;
                case "TRANSACTION_FEE":
                    item.name = 'propose_4';
                break;
                case "ASSET_ISSUE_FEE":
                    item.name = 'propose_5';
                break;
                case "WITNESS_PAY_PER_BLOCK":
                    item.name = 'propose_6';
                break;
                case "WITNESS_STANDBY_ALLOWANCE":
                    item.name = 'propose_7';
                break;
                case "CREATE_NEW_ACCOUNT_FEE_IN_SYSTEM_CONTRACT":
                    item.name = 'propose_8';
                break;
                case "CREATE_NEW_ACCOUNT_BANDWIDTH_RATE":
                    item.name = 'propose_9';
                break;
                case "ALLOW_CREATION_OF_CONTRACTS":
                    item.name = 'propose_10';
                break;
                case "REMOVE_THE_POWER_OF_THE_GR":
                    item.name = 'propose_11';
                break;
                case "ENERGY_FEE":
                    item.name = 'propose_12';
                break;
                case "EXCHANGE_CREATE_FEE":
                    item.name = 'propose_13';
                break;
                case "MAX_CPU_TIME_OF_ONE_TX":
                    item.name = 'propose_14';
                break;

            }
        })


        this.setState({
            dataSource: tronParameters
        })
    }

    getColumns() {
        let { intl } = this.props;
        let { dataSource } = this.state;

        const columns = [{
            title: upperFirst(intl.formatMessage({id: 'propose_number'})),
            key: 'index',
            width:'20%',
            render: (text, record, index) => {
                return  '#' + (index+1)
            }
        }, {
            title: upperFirst(intl.formatMessage({id: 'propose_parameters'})),
            dataIndex: 'name',
            key: 'name',
            render: (text, record, index) => {
                return <span>
                     {text && intl.formatMessage({id: text})}
                </span>


            }
        },
        {
            title:upperFirst(intl.formatMessage({id: 'propose_current_value'})),
            dataIndex: 'value',
            key: 'value',
            render: (text, record, index) => {
                return  <div>
                    {
                        record.key == 'MAINTENANCE_TIME_INTERVAL' && <div><span className='col-green'>{text / (1000 * 60 * 60)}</span> &nbsp;<span>{
                            intl.formatMessage({id: "propose_hour"})
                        }</span></div>
                    }
                    {
                        record.key == 'ACCOUNT_UPGRADE_COST' && <div><span className='col-green'>{text / ONE_TRX}</span> &nbsp;<span>TRX</span></div>
                    }
                    {
                        record.key == 'CREATE_ACCOUNT_FEE' && <div><span className='col-green'>{text / ONE_TRX}</span> &nbsp;<span>TRX</span></div>
                    }
                    {
                        record.key == 'TRANSACTION_FEE' && <div><span className='col-green'>{text}</span> &nbsp;<span>Sun/byte</span></div>
                    }
                    {
                        record.key == 'ASSET_ISSUE_FEE' && <div><span className='col-green'>{text / ONE_TRX}</span> &nbsp;<span>TRX</span></div>
                    }
                    {
                        record.key == 'WITNESS_PAY_PER_BLOCK' && <div><span className='col-green'>{text / ONE_TRX}</span> &nbsp;<span>TRX</span></div>
                    }
                    {
                        record.key == 'WITNESS_STANDBY_ALLOWANCE' && <div><span className='col-green'>{text / ONE_TRX}</span> &nbsp;<span>TRX</span></div>
                    }
                    {
                        record.key == 'CREATE_NEW_ACCOUNT_FEE_IN_SYSTEM_CONTRACT' && <div><span className='col-green'>{text / ONE_TRX}</span> &nbsp;<span>TRX</span></div>
                    }
                    {
                        record.key == 'CREATE_NEW_ACCOUNT_BANDWIDTH_RATE' && <div><span className='col-green'>{text}</span> &nbsp;<span>bandwith/byte</span></div>
                    }
                    {
                        record.key == 'ALLOW_CREATION_OF_CONTRACTS' && <div>
                            {
                                <span className='col-green'>{tu('propose_activate')}</span>
                            }
                        </div>
                    }
                    {
                        record.key == 'REMOVE_THE_POWER_OF_THE_GR' && <div>
                            {
                                <span className='col-green'>{tu('propose_finished')}</span>
                            }
                        </div>
                    }
                    {
                        record.key == 'ENERGY_FEE' && <div>
                            {
                                <span className='col-green'>{text / ONE_TRX} TRX</span>
                            }
                        </div>
                    }
                    {
                        record.key == 'EXCHANGE_CREATE_FEE' && <div>
                            {
                                <span className='col-green'>{text / ONE_TRX} TRX</span>
                            }
                        </div>
                    }
                    {
                        record.key == 'MAX_CPU_TIME_OF_ONE_TX' && <div>
                            {
                                <span className='col-green'>{text} ms</span>
                            }
                        </div>
                    }





                </div>

            }
        }];

        return (
            <Table
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                bordered={false}
                rowKey={(record, index) => {
                    return index
                }}
            />
        )
    }



    render() {
        let { committee } = this.state;
        return (
            <main className="container header-overlap committee">
                <div className="row">
                    <div className="col-12 committee-title">
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <img src={require("../../images/proposals/proposal_1.png")}  className="m-auto"/>
                            <p className="mt-4 p-2">{tu("committee_dec_1")}</p>
                        </div>
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <img src={require("../../images/proposals/proposal_2.png")}  className="m-auto"/>
                            <p className="mt-4 p-2">{tu("committee_dec_2")}</p>
                        </div>
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <img src={require("../../images/proposals/proposal_3.png")}  className="m-auto"/>
                            <p className="mt-4 p-2">{tu("committee_dec_3")}</p>
                        </div>
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <img src={require("../../images/proposals/proposal_4.png")}  className="m-auto"/>
                            <p className="mt-4 p-2">{tu("committee_dec_4")}</p>
                        </div>
                    </div>
                    <div className="m-auto">
                        <Link to="/proposals">
                            <button className="btn btn-danger mt-4">
                                {tu("get_committee_proposal")}
                            </button>
                        </Link>
                    </div>
                </div>
                <hr style={{marginTop:40,marginBottom:40}}/>
                <div className="network-parameters pb-4">
                    <h4 className="pt-4">
                        <span className="text-uppercase">
                            <span>{tu('TRON_network_parameters')}</span>
                        </span> &nbsp;&nbsp;
                    </h4>
                    <div className="mt-4">
                        {this.getColumns()}
                    </div>
                </div>
            </main>
        );
    }
}


export default injectIntl(Committee);

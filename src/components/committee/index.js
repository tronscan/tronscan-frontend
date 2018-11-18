import React, {Fragment} from "react";
import {tu} from "../../utils/i18n";
import {injectIntl} from "react-intl";
import { Table } from 'antd';
import { filter, map ,upperFirst} from 'lodash'
import {Client} from "../../services/api";
import {Link} from "react-router-dom";

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
                    "icon":"",
                    "dec":"committee_dec_2",
                },
                {
                    "icon":"",
                    "dec":"committee_dec_3",
                },
                {
                    "icon":"",
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
        console.log('tronParameters',tronParameters)
        this.setState({
            dataSource: tronParameters
        })
    }

    getColumns() {
        let { intl } = this.props;
        let { dataSource } = this.state;

        const columns = [{
            title: upperFirst(intl.formatMessage({id: '序号'})),
            key: 'index',
            render: (text, record, index) => {
                return  '#' + (index+1)
            }
        }, {
            title: upperFirst(intl.formatMessage({id: '参数'})),
            dataIndex: 'key',
        },
        {
            title:upperFirst(intl.formatMessage({id: '当前值'})),
            dataIndex: 'value',
            key: 'value',
            render: (text, record, index) => {
                return (
                    <span className='col-green'>{text}</span>
                )
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
                        {
                            committee.map((item,index) =>(
                                <div className="col-md-3 col-sm-6 col-xs-12" key={index}>
                                    <h2 className="m-auto"></h2>
                                    <p className="mt-4 p-2">{tu(item.dec)}</p>
                                </div>
                            ))
                        }
                    </div>
                    <div className="m-auto">
                        <Link to="/proposal">
                            <button className="btn btn-danger mt-4">
                                {tu("get_committee_proposal")}
                            </button>
                        </Link>
                    </div>
                </div>
                <hr style={{marginTop:40,marginBottom:40}}/>
                <div className="network-parameters">
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

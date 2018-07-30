/* eslint-disable no-undef */
import React, {Fragment} from "react";
import {tu} from "../../utils/i18n";
import {loadTokens} from "../../actions/tokens";
import {connect} from "react-redux";
import TimeAgo from "react-timeago";
import {FormattedNumber} from "react-intl";
import {Client} from "../../services/api";
import {AddressLink, BlockNumberLink, TransactionHashLink} from "../common/Links";
import {ONE_TRX} from "../../constants";
import {getQueryParams} from "../../utils/url";
import Paging from "../common/Paging";
import {Sticky, StickyContainer} from "react-sticky";
import {TRXPrice} from "../common/Price";
import {Truncate} from "../common/text";
import {filter} from "lodash";
class Transfers extends React.Component {

    constructor() {
        super();
        this.state = {
            transfers: [],
            total: 0,
            "data": [
                {
                    "id": "ace7dead-8d8f-4e6c-8e9b-7ae66d9dbebb",
                    "parentHash": "0bb1a86337fbe3fd18e6e6f3d0ea956d25716471940707b142b71fd84f5249ee0",
                    "block": 1014113,
                    "timestamp": 1532938269000,
                    "txType":"call",
                    "transferFromAddress": "TLRE3FWW68ARygPNaGHQ3tD6ut4czPJyQ9",
                    "transferToAddress": "TH5mDzehcYDaGCKdfbbkPCAWfPQSsuBAdH",
                    "amount": 10,
                    "tokenName": "BitPound",
                    "confirmed": false
                },
                {
                    "id": "ace7dead-8d8f-4e6c-8e9b-7ae66d9dbebb",
                    "parentHash": "1bb1a86337fbe3fd18e6e6f3d0ea956d25716471940707b142b71fd84f5249ee1",
                    "block": 1014113,
                    "timestamp": 1532938269000,
                    "txType":"call",
                    "transferFromAddress": "TLRE3FWW68ARygPNaGHQ3tD6ut4czPJyQ9",
                    "transferToAddress": "TH5mDzehcYDaGCKdfbbkPCAWfPQSsuBAdH",
                    "amount": 10,
                    "tokenName": "BitPound",
                    "confirmed": false
                },
                {
                    "id": "ace7dead-8d8f-4e6c-8e9b-7ae66d9dbebb",
                    "parentHash": "2bb1a86337fbe3fd18e6e6f3d0ea956d25716471940707b142b71fd84f5249ee2",
                    "block": 1014113,
                    "timestamp": 1532938269000,
                    "txType":"call",
                    "transferFromAddress": "TLRE3FWW68ARygPNaGHQ3tD6ut4czPJyQ9",
                    "transferToAddress": "TH5mDzehcYDaGCKdfbbkPCAWfPQSsuBAdH",
                    "amount": 10,
                    "tokenName": "BitPound",
                    "confirmed": false
                },
                {
                    "id": "ace7dead-8d8f-4e6c-8e9b-7ae66d9dbebb",
                    "parentHash": "666bb1a86337fbe3fd18e6e6f3d0ea956d25716471940707b142b71fd84f5249ee2",
                    "block": 1014115,
                    "timestamp": 1532938269000,
                    "txType":"call",
                    "transferFromAddress": "TLRE3FWW68ARygPNaGHQ3tD6ut4czPJyQ9",
                    "transferToAddress": "TH5mDzehcYDaGCKdfbbkPCAWfPQSsuBAdH",
                    "amount": 10,
                    "tokenName": "BitPound",
                    "confirmed": false
                },
            ]
        };
    }

    componentDidMount() {
        this.load();
    }

    componentDidUpdate() {
        //checkPageChanged(this, this.load);
    }
    onChange = (page,pageSize) => {
        this.load(page,pageSize);
    };
    load = async (page = 1, pageSize=40) => {

        let {location} = this.props;

        this.setState({ loading: true });

        let searchParams = {};
        let interData = this.state.data
        let interArr = []

        for (let [key, value] of Object.entries(getQueryParams(location))) {
            switch (key) {
                case "address":
                case "block":
                    searchParams[key] = value;
                    break;
            }
        }

        let {transfers, total} = await Client.getTransfers({
            sort: '-timestamp',
            limit: pageSize,
            start: (page-1) * pageSize,
            ...searchParams,
        });

        let a = [];
        let b = [];
        let newArr = []
        for(let i in interData){
            a[i] = filter(interData , { 'block': interData[i]['block']})
            for(let key in a[i]){
                if(key>0 ){
                    a[i][key]['block'] = ''
                    a[i][key]['timestamp'] = ''
                }
            }
            b = b.concat(a[i]);
            newArr = Array.from(new Set(b))
        }
        this.setState({
            transfers,
            loading: false,
            total
        });
    };

    render() {

        let {transfers, total, loading} = this.state;
        let {match} = this.props;

        return (
            <main className="container header-overlap pb-3">
                <div className="text-center alert alert-light alert-dismissible fade show" role="alert">
                    <span>{tu("inter_a_total")}</span>
                    <span> {total} </span>
                    <span>{tu("inter_transactions_found")}</span>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <StickyContainer>
                            <div className="card">
                                {
                                    <Fragment>
                                        <Sticky>
                                            {
                                                ({style}) => (
                                                    <div style={{ zIndex: 100, ...style }} className="card-body bg-white py-3 border-bottom">
                                                        <Paging onChange={this.onChange} loading={loading} url={match.url} total={total} />
                                                    </div>
                                                )
                                            }
                                        </Sticky>
                                        <table className="table table-hover table-striped m-0 transactions-table">
                                            <thead className="thead-dark">
                                            <tr>
                                                <th className="d-none d-md-table-cell" style={{ width: 100 }}>{tu("block")}</th>
                                                <th className="d-none d-lg-table-cell" style={{ width: 125 }}>{tu("created")}</th>
                                                <th style={{ width: 130 }}>{tu("parent_hash")}</th>
                                                <th style={{ width: 100 }}>{tu("inter_type")}</th>
                                                <th className="d-none d-md-table-cell">{tu("from")}</th>
                                                <th className="d-none d-sm-table-cell">{tu("to")}</th>
                                                <th className="">{tu("value")}</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                transfers.map((trx, index) => (
                                                    <tr key={trx.transactionHash}>

                                                        <td className="d-none d-md-table-cell">
                                                            <BlockNumberLink number={trx.block}/>
                                                        </td>
                                                        <td className="text-nowrap d-none d-lg-table-cell">
                                                            <TimeAgo date={trx.timestamp} />
                                                        </td>
                                                        <th>
                                                            <Truncate>
                                                                <TransactionHashLink hash={trx.transactionHash}>{trx.transactionHash}</TransactionHashLink>
                                                            </Truncate>
                                                        </th>
                                                        <td className="d-none d-md-table-cell">
                                                                cell
                                                        </td>
                                                        <td className="d-none d-md-table-cell">
                                                            <AddressLink address={trx.transferFromAddress} />
                                                        </td>
                                                        <td className="d-none d-sm-table-cell">
                                                            <AddressLink address={trx.transferToAddress} />
                                                        </td>
                                                        <td className="text-nowrap">
                                                            {
                                                                trx.tokenName.toUpperCase() === 'TRX' ?
                                                                    <Fragment>
                                                                        <TRXPrice amount={trx.amount / ONE_TRX}/>
                                                                    </Fragment> :
                                                                    <Fragment>
                                                                        <FormattedNumber value={trx.amount}/> {trx.tokenName}
                                                                    </Fragment>
                                                            }
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                            </tbody>
                                        </table>
                                    </Fragment>
                                }
                            </div>
                        </StickyContainer>
                    </div>
                </div>
            </main>
        )
    }
}

function mapStateToProps(state) {
    return {
    };
}

const mapDispatchToProps = {
    loadTokens,
};

export default connect(mapStateToProps, mapDispatchToProps)(Transfers);

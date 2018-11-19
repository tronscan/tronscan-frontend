import React, {Fragment} from "react";
import {tu} from "../../../utils/i18n";
import { Table } from 'antd';
import { filter, map ,upperFirst} from 'lodash'
import {Client} from "../../../services/api";
import {Link} from "react-router-dom";
import {FormattedDate, FormattedTime, injectIntl} from "react-intl";
import {TronLoader} from "../../common/loaders";
import {AddressLink} from "../../common/Links";


class ProposalDetail extends React.Component {

    constructor(match) {
        super();
        this.state = {
            proposal:null,
            loading:false
        };
    }

    componentDidMount() {
        let {match} = this.props;
        this.loadProposal(match.params.id)
    }

    async loadProposal (id){
        this.setState({loading: true});
        let {data} = await Client.getProposalById(id);
        console.log("data",data)
        this.setState({
            proposal: data,
            loading: false,
        })
    }


    render() {
        let {proposal,loading} = this.state;
        return (
            <main className="container header-overlap committee">
                <div className="row">
                    <div className="col-md-12 ">
                        {
                            loading ? <div className="card">
                                    <TronLoader>
                                        {tu("loading_address")} {proposal.proposalId}
                                    </TronLoader>
                                </div> :
                                <Fragment>
                                    <div className="card list-style-header">
                                        {
                                            proposal.proposalId &&
                                            <div className="card-body">
                                                <h5 className="card-title m-0">
                                                    <i className="fa fa-cube mr-2"/>
                                                    {tu("representatives")}
                                                </h5>
                                            </div>
                                        }
                                        <div className="row">
                                            <div className="col-md-12">

                                                {/*<table className="table m-0">*/}
                                                {/*<tbody>*/}
                                                {/*{*/}
                                                {/*Boolean(rank) &&*/}
                                                {/*<tr>*/}
                                                {/*<th>{tu("rank_real_time")}:</th>*/}
                                                {/*<td>*/}
                                                {/*{rank}*/}
                                                {/*</td>*/}
                                                {/*</tr>*/}
                                                {/*}*/}
                                                {/*{*/}
                                                {/*address.representative.enabled &&*/}
                                                {/*<Fragment>*/}
                                                {/*{*/}
                                                {/*address.name &&*/}
                                                {/*<tr>*/}
                                                {/*<th>{tu("name")}:</th>*/}
                                                {/*<td>*/}
                                                {/*{address.name}*/}
                                                {/*</td>*/}
                                                {/*</tr>*/}
                                                {/*}*/}
                                                {/*<tr>*/}
                                                {/*<th>{tu("website")}:</th>*/}
                                                {/*<td>*/}
                                                {/*<ExternalLink url={address.representative.url}/>*/}
                                                {/*</td>*/}
                                                {/*</tr>*/}
                                                {/*<tr>*/}
                                                {/*<th>{tu("blocks_produced")}:</th>*/}
                                                {/*<td>*/}
                                                {/*<FormattedNumber value={blocksProduced}/>*/}
                                                {/*</td>*/}
                                                {/*</tr>*/}
                                                {/*</Fragment>*/}
                                                {/*}*/}
                                                {/*<tr>*/}
                                                {/*<th>{tu("address")}:</th>*/}
                                                {/*<td>*/}
                                                {/*<AddressLink address={address.address} includeCopy={true}/>*/}
                                                {/*</td>*/}
                                                {/*</tr>*/}
                                                {/*{!address.representative.enabled?<tr>*/}
                                                {/*<th>{tu("name")}:</th>*/}
                                                {/*<td>*/}
                                                {/*<span>{address.name?address.name:"-"}</span>*/}
                                                {/*</td>*/}
                                                {/*</tr>:"" }*/}

                                                {/*<tr>*/}
                                                {/*<th>{tu("transfers")}:</th>*/}
                                                {/*<td>*/}
                                                {/*<i className="fa fa-arrow-down text-success"/>&nbsp;*/}
                                                {/*<span>{stats.transactions_in}</span>&nbsp;*/}
                                                {/*<i className="fa fa-arrow-up  text-danger"/>&nbsp;*/}
                                                {/*<span>{stats.transactions_out}</span>&nbsp;*/}
                                                {/*</td>*/}
                                                {/*</tr>*/}
                                                {/*<tr>*/}
                                                {/*<th>{tu("balance")}:</th>*/}
                                                {/*<td>*/}
                                                {/*<ul className="list-unstyled m-0">*/}
                                                {/*<li>*/}
                                                {/*<TRXPrice amount={address.balance / ONE_TRX}/>*/}
                                                {/*</li>*/}
                                                {/*</ul>*/}
                                                {/*</td>*/}
                                                {/*</tr>*/}
                                                {/*<tr>*/}
                                                {/*<th>{tu("tron_power")}:</th>*/}
                                                {/*<td>*/}
                                                {/*<ul className="list-unstyled m-0">*/}
                                                {/*<li>*/}
                                                {/*<TRXPrice showCurreny={false} amount={(address.frozen.total + address.accountResource.frozen_balance_for_energy.frozen_balance) / ONE_TRX}/>*/}
                                                {/*</li>*/}
                                                {/*</ul>*/}
                                                {/*</td>*/}
                                                {/*</tr>*/}
                                                {/*<tr>*/}
                                                {/*<th>{tu("total_balance")}:</th>*/}
                                                {/*<td>*/}
                                                {/*<ul className="list-unstyled m-0">*/}
                                                {/*<li>*/}
                                                {/*<TRXPrice amount={(address.balance + address.frozen.total + address.accountResource.frozen_balance_for_energy.frozen_balance) / ONE_TRX}/>{' '}*/}
                                                {/*<span className="small">(<TRXPrice*/}
                                                {/*amount={(address.balance + address.frozen.total) / ONE_TRX} currency="USD"*/}
                                                {/*showPopup={false}/>)</span>*/}
                                                {/*</li>*/}
                                                {/*</ul>*/}
                                                {/*</td>*/}
                                                {/*</tr>*/}
                                                {/*{*/}
                                                {/*Boolean(totalVotes) &&*/}
                                                {/*<tr>*/}
                                                {/*<th>{tu("total_votes")}:</th>*/}
                                                {/*<td>*/}
                                                {/*<ul className="list-unstyled m-0">*/}
                                                {/*<li>*/}
                                                {/*<FormattedNumber value={totalVotes}/>*/}
                                                {/*</li>*/}
                                                {/*</ul>*/}
                                                {/*</td>*/}
                                                {/*</tr>*/}
                                                {/*}*/}
                                                {/*</tbody>*/}
                                                {/*</table>*/}
                                            </div>
                                        </div>
                                    </div>



                                </Fragment>
                        }
                    </div>
                </div>




            </main>
        )
    }
}


export default injectIntl(ProposalDetail);

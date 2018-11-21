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
        let {match} = this.props;
        let {proposal,loading} = this.state;
        return (
            <main className="container header-overlap committee">
                <div className="row">
                    <div className="col-md-12 ">
                        {
                            loading ? <div className="card">
                                    <TronLoader>
                                         # {match.params.id}{tu('proposal')}
                                    </TronLoader>
                                </div> :
                                <Fragment>
                                    <div className="card list-style-header">
                                        {
                                            match.params.id &&
                                            <div className="card-body">
                                                <h5 className="card-title m-0">
                                                    {/*<i className="fa fa-cube mr-2"/>*/}
                                                    # {match.params.id}{tu('proposal')}
                                                </h5>
                                            </div>
                                        }
                                        <div className="row">
                                            <div className="col-md-12">
                                                <table className="table m-0">
                                                <tbody>
                                                <tr>
                                                    <th>{tu("proposer")}:</th>
                                                    <td>{proposal.proposer.name?proposal.proposer.name:proposal.proposer.address}</td>
                                                </tr>
                                                <tr>
                                                    <th>{tu("proposal_time_of_creation")}:</th>
                                                    <td>{proposal.proposer.name?proposal.proposer.name:proposal.proposer.address}</td>
                                                </tr>
                                                <tr>
                                                    <th>{tu("proposal_time_of_expire")}:</th>
                                                    <td>{proposal.proposer.name?proposal.proposer.name:proposal.proposer.address}</td>
                                                </tr>


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
                                                }
                                                </tbody>
                                                </table>
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

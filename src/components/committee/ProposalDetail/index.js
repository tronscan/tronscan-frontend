import React, {Fragment} from "react";
import {tu,t} from "../../../utils/i18n";
import { Table } from 'antd';
import { filter, map ,upperFirst} from 'lodash'
import {Client} from "../../../services/api";
import {Link} from "react-router-dom";
import {FormattedDate, FormattedTime, injectIntl} from "react-intl";
import {TronLoader} from "../../common/loaders";
import {AddressLink} from "../../common/Links";
import {ONE_TRX} from "../../../constants";

class ProposalDetail extends React.Component {

    constructor() {
        super();
        this.state = {
            loading:false
        };
    }

    componentDidMount() {
        let {match} = this.props;
        this.load(match.params.id)
    }

    async load(id) {
        this.setState({loading: true});
        let {data} = await Client.getProposalById(id);
        let parametersArr = [
            'MAINTENANCE_TIME_INTERVAL',
            'ACCOUNT_UPGRADE_COST',
            'CREATE_ACCOUNT_FEE',
            'TRANSACTION_FEE',
            'ASSET_ISSUE_FEE',
            'WITNESS_PAY_PER_BLOCK',
            'WITNESS_STANDBY_ALLOWANCE',
            'CREATE_NEW_ACCOUNT_FEE_IN_SYSTEM_CONTRACT',
            'CREATE_NEW_ACCOUNT_BANDWIDTH_RATE',
            'ALLOW_CREATION_OF_CONTRACTS',
            'REMOVE_THE_POWER_OF_THE_GR',
            'ENERGY_FEE',
            'EXCHANGE_CREATE_FEE',
            'MAX_CPU_TIME_OF_ONE_TX',
        ];
        for(let item in data.paramters){
            data.key = parametersArr[item];
            data.proposalVal =  data.paramters[item];
        }
        this.setState({
            proposal: data,
            loading: false,
        })
    }


    render() {
        let {match,intl} = this.props;
        let {proposal,loading} = this.state;
        return (
            <main className="container header-overlap">
                <div className="row">
                    <div className="col-md-12 ">
                        {
                            loading ? <div className="card">
                                    <TronLoader>
                                        {tu("loading_address")} #{match.params.id}
                                    </TronLoader>
                                </div> :
                                <Fragment>
                                    <div className="card list-style-header">
                                        {
                                            match.params.id &&
                                            <div className="card-body">
                                                <h5 className="card-title m-0">
                                                    # {match.params.id}&nbsp;{tu('proposal')}
                                                </h5>
                                            </div>
                                        }
                                        <div className="row">

                                            <div className="col-md-12">
                                                <table className="table m-0">
                                                    {
                                                        proposal &&
                                                        <tbody>
                                                            <tr>
                                                                <th>{tu("proposer")}:</th>
                                                                <td>{proposal.proposer.name ?  <AddressLink address={proposal.proposer.address}>{proposal.proposer.name}</AddressLink> : <AddressLink address={proposal.proposer.address}>{proposal.proposer.address}</AddressLink>}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>{tu("proposal_time_of_creation")}:</th>
                                                                <td>
                                                                    <FormattedDate value={Number(proposal.createTime)}/>&nbsp;
                                                                    <FormattedTime value={Number(proposal.createTime)}/>&nbsp;
                                                                    <span>(UTC)</span>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th>{tu("proposal_time_of_expire")}:</th>
                                                                <td>
                                                                    <FormattedDate value={Number(proposal.expirationTime)}/>&nbsp;
                                                                    <FormattedTime value={Number(proposal.expirationTime)}/>&nbsp;
                                                                    <span>(UTC)</span>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th>{tu("proposal_content_info")}:</th>
                                                                <td>
                                                                    {
                                                                        proposal.key == 'MAINTENANCE_TIME_INTERVAL' &&
                                                                        <div>
                                                                            <span>{ intl.formatMessage({id: 'propose_1'})}</span>
                                                                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                            <span className='col-green'>{proposal.proposalVal / (1000 * 60 * 60)}</span> &nbsp;
                                                                            <span>{intl.formatMessage({id: "propose_hour"})}</span>
                                                                        </div>
                                                                    }
                                                                    {
                                                                        proposal.key == 'ACCOUNT_UPGRADE_COST' &&
                                                                        <div>
                                                                            <span>{ intl.formatMessage({id: 'propose_2'})}</span>
                                                                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                            <span className='col-green'>{proposal.proposalVal / ONE_TRX}</span> &nbsp;
                                                                            <span>TRX</span>
                                                                        </div>
                                                                    }
                                                                    {
                                                                        proposal.key == 'CREATE_ACCOUNT_FEE' &&
                                                                        <div>
                                                                            <span>{ intl.formatMessage({id: 'propose_3'})}</span>
                                                                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                            <span className='col-green'>{proposal.proposalVal / ONE_TRX}</span> &nbsp;
                                                                            <span>TRX</span>
                                                                        </div>
                                                                    }
                                                                    {
                                                                        proposal.key == 'TRANSACTION_FEE' &&
                                                                        <div>
                                                                            <span>{ intl.formatMessage({id: 'propose_4'})}</span>
                                                                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                            <span className='col-green'>{proposal.proposalVal}</span> &nbsp;
                                                                            <span>Sun/byte</span>
                                                                        </div>
                                                                    }
                                                                    {
                                                                        proposal.key == 'ASSET_ISSUE_FEE' &&
                                                                        <div>
                                                                            <span>{ intl.formatMessage({id: 'propose_5'})}</span>
                                                                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                            <span className='col-green'>{proposal.proposalVal / ONE_TRX}</span> &nbsp;
                                                                            <span>TRX</span>
                                                                        </div>
                                                                    }
                                                                    {
                                                                        proposal.key == 'WITNESS_PAY_PER_BLOCK' &&
                                                                        <div>
                                                                            <span>{ intl.formatMessage({id: 'propose_6'})}</span>
                                                                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                            <span className='col-green'>{proposal.proposalVal / ONE_TRX}</span> &nbsp;
                                                                            <span>TRX</span>
                                                                        </div>
                                                                    }
                                                                    {
                                                                        proposal.key == 'WITNESS_STANDBY_ALLOWANCE' &&
                                                                        <div>
                                                                            <span>{ intl.formatMessage({id: 'propose_7'})}</span>
                                                                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                            <span className='col-green'>{proposal.proposalVal / ONE_TRX}</span> &nbsp;
                                                                            <span>TRX</span></div>
                                                                    }
                                                                    {
                                                                        proposal.key == 'CREATE_NEW_ACCOUNT_FEE_IN_SYSTEM_CONTRACT' &&
                                                                        <div>
                                                                            <span>{ intl.formatMessage({id: 'propose_8'})}</span>
                                                                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                            <span className='col-green'>{proposal.proposalVal / ONE_TRX}</span> &nbsp;
                                                                            <span>TRX</span></div>
                                                                    }
                                                                    {
                                                                        proposal.key == 'CREATE_NEW_ACCOUNT_BANDWIDTH_RATE' &&
                                                                        <div>
                                                                            <span>{ intl.formatMessage({id: 'propose_9'})}</span>
                                                                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                            <span className='col-green'>{proposal.proposalVal / ONE_TRX}</span> &nbsp;
                                                                            <span>TRX</span>
                                                                        </div>
                                                                    }
                                                                    {
                                                                        proposal.key == 'ALLOW_CREATION_OF_CONTRACTS' &&
                                                                        <div>
                                                                            <span>{ intl.formatMessage({id: 'propose_10'})}</span>
                                                                            <span className='col-green'>{tu('propose_activate')}</span>
                                                                        </div>
                                                                    }
                                                                    {
                                                                        proposal.key == 'REMOVE_THE_POWER_OF_THE_GR' &&
                                                                        <div>
                                                                            <span>{ intl.formatMessage({id: 'propose_11'})}</span>
                                                                        </div>
                                                                    }
                                                                    {
                                                                        proposal.key == 'ENERGY_FEE' &&
                                                                        <div>
                                                                            <span>{ intl.formatMessage({id: 'propose_12'})}</span>
                                                                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                            <span className='col-green'>{proposal.proposalVal / ONE_TRX} TRX</span>
                                                                        </div>
                                                                    }
                                                                    {
                                                                        proposal.key == 'EXCHANGE_CREATE_FEE' &&
                                                                        <div>
                                                                            <span>{ intl.formatMessage({id: 'propose_13'})}</span>
                                                                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                            <span className='col-green'>{proposal.proposalVal / ONE_TRX} TRX</span>
                                                                        </div>
                                                                    }
                                                                    {
                                                                        proposal.key == 'MAX_CPU_TIME_OF_ONE_TX' &&
                                                                        <div>
                                                                            <span>{ intl.formatMessage({id: 'propose_14'})}</span>
                                                                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                            <span className='col-green'>{proposal.proposalVal} ms</span>
                                                                        </div>
                                                                    }
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th>{tu("proposal_status")}:</th>
                                                                <td>
                                                                    {
                                                                        proposal.state == 'PENDING' &&
                                                                        <div>
                                                                            <span className="badge badge-warning text-uppercase badge-success-radius">{tu("proposal_voting")}</span>
                                                                        </div>
                                                                    }
                                                                    {
                                                                        proposal.state == 'DISAPPROVED' &&
                                                                        <div>
                                                                            <span className="badge badge-danger text-uppercase badge-success-radius">{tu("proposal_ineffective")}</span>
                                                                        </div>
                                                                    }
                                                                    {
                                                                        proposal.state == 'APPROVED' &&
                                                                        <div>
                                                                            <span className="badge badge-success text-uppercase badge-success-radius">{tu("proposal_effective")}</span>
                                                                        </div>
                                                                    }
                                                                    {
                                                                        proposal.state == 'CANCELED' &&
                                                                        <div>
                                                                            <span className="badge text-uppercase badge-success-radius">{tu("proposal_cancelled")}</span>
                                                                        </div>
                                                                    }
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th>{tu("approvers_of_the_proposal")}:</th>
                                                                <td>
                                                                    {proposal.approvals.length}&nbsp;<span>{t('total_approving_votes')}</span>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th>{tu("approvers_of_the_proposal")}:</th>
                                                                <td>
                                                                    <div style={{width:900}}>
                                                                    {
                                                                        proposal.approvals.map((item,index) => (
                                                                            <span key={index} className="mt-1" style={{display:'inline-block',width: 150}}>
                                                                                {item.name ?  <AddressLink address={item.address}>{item.name}</AddressLink> : <AddressLink address={item.address}>{item.address}</AddressLink>}
                                                                             </span>
                                                                        ))
                                                                    }
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    }
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


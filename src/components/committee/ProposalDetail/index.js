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
            'getMaintenanceTimeInterval',
            'getAccountUpgradeCost',
            'getCreateAccountFee',
            'getTransactionFee',
            'getAssetIssueFee',
            'getWitnessPayPerBlock',
            'getWitnessStandbyAllowance',
            'getCreateNewAccountFeeInSystemContract',
            'getCreateNewAccountBandwidthRate',
            'getAllowCreationOfContracts',
            'getRemoveThePowerOfTheGr',
            'getEnergyFee',
            'getExchangeCreateFee',
            'getMaxCpuTimeOfOneTx',
            'getAllowUpdateAccountName',
            'getAllowSameTokenName',
            'getAllowDelegateResource',
            'getTotalEnergyLimit',
            'getAllowTvmTransferTrc10',
            'getTotalEnergyLimitNew',
        ];

        for(let item in data.paramters){
            data.key = parametersArr[item];
            data.proposalVal = data.paramters[item];
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
                                                                        proposal.key == 'getMaintenanceTimeInterval' &&
                                                                        <div className="proposal-message">
                                                                            <span>{ intl.formatMessage({id: 'propose_1'})}</span>
                                                                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                            <span className='col-green'>{proposal.proposalVal / (1000 * 60 * 60)}</span> &nbsp;
                                                                            <span>{intl.formatMessage({id: "propose_hour"})}</span>
                                                                        </div>
                                                                    }
                                                                    {
                                                                        proposal.key == 'getAccountUpgradeCost' &&
                                                                        <div className="proposal-message">
                                                                            <span>{ intl.formatMessage({id: 'propose_2'})}</span>
                                                                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                            <span className='col-green'>{proposal.proposalVal / ONE_TRX}</span> &nbsp;
                                                                            <span>TRX</span>
                                                                        </div>
                                                                    }
                                                                    {
                                                                        proposal.key == 'getCreateAccountFee' &&
                                                                        <div className="proposal-message">
                                                                            <span>{ intl.formatMessage({id: 'propose_3'})}</span>
                                                                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                            <span className='col-green'>{proposal.proposalVal / ONE_TRX}</span> &nbsp;
                                                                            <span>TRX</span>
                                                                        </div>
                                                                    }
                                                                    {
                                                                        proposal.key == 'getTransactionFee' &&
                                                                        <div className="proposal-message">
                                                                            <span>{ intl.formatMessage({id: 'propose_4'})}</span>
                                                                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                            <span className='col-green'>{proposal.proposalVal}</span> &nbsp;
                                                                            <span>Sun/byte</span>
                                                                        </div>
                                                                    }
                                                                    {
                                                                        proposal.key == 'getAssetIssueFee' &&
                                                                        <div className="proposal-message">
                                                                            <span>{ intl.formatMessage({id: 'propose_5'})}</span>
                                                                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                            <span className='col-green'>{proposal.proposalVal / ONE_TRX}</span> &nbsp;
                                                                            <span>TRX</span>
                                                                        </div>
                                                                    }
                                                                    {
                                                                        proposal.key == 'getWitnessPayPerBlock' &&
                                                                        <div className="proposal-message">
                                                                            <span>{ intl.formatMessage({id: 'propose_6'})}</span>
                                                                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                            <span className='col-green'>{proposal.proposalVal / ONE_TRX}</span> &nbsp;
                                                                            <span>TRX</span>
                                                                        </div>
                                                                    }
                                                                    {
                                                                        proposal.key == 'getWitnessStandbyAllowance' &&
                                                                        <div className="proposal-message">
                                                                            <span>{ intl.formatMessage({id: 'propose_7'})}</span>
                                                                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                            <span className='col-green'>{proposal.proposalVal / ONE_TRX}</span> &nbsp;
                                                                            <span>TRX</span></div>
                                                                    }
                                                                    {
                                                                        proposal.key == 'getCreateNewAccountFeeInSystemContract' &&
                                                                        <div className="proposal-message">
                                                                            <span>{ intl.formatMessage({id: 'propose_8'})}</span>
                                                                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                            <span className='col-green'>{proposal.proposalVal / ONE_TRX}</span> &nbsp;
                                                                            <span>TRX</span></div>
                                                                    }
                                                                    {
                                                                        proposal.key == 'getCreateNewAccountBandwidthRate' &&
                                                                        <div className="proposal-message">
                                                                            <span>{ intl.formatMessage({id: 'propose_9'})}</span>
                                                                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                            <span className='col-green'>{proposal.proposalVal}</span> &nbsp;
                                                                            <span>bandwith/byte</span>
                                                                        </div>
                                                                    }
                                                                    {
                                                                        proposal.key == 'getAllowCreationOfContracts' &&
                                                                        <div className="proposal-message">
                                                                            <span>{ intl.formatMessage({id: 'propose_10'})}</span>
                                                                            <span className='col-green'>{tu('propose_activate')}</span>
                                                                        </div>
                                                                    }
                                                                    {
                                                                        proposal.key == 'getRemoveThePowerOfTheGr' &&
                                                                        <div className="proposal-message">
                                                                            <span>{ intl.formatMessage({id: 'propose_11'})}</span>
                                                                        </div>
                                                                    }
                                                                    {
                                                                        proposal.key == 'getEnergyFee' &&
                                                                        <div className="proposal-message">
                                                                            <span>{ intl.formatMessage({id: 'propose_12'})}</span>
                                                                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                            <span className='col-green'>{proposal.proposalVal / ONE_TRX} TRX</span>
                                                                        </div>
                                                                    }
                                                                    {
                                                                        proposal.key == 'getExchangeCreateFee' &&
                                                                        <div className="proposal-message">
                                                                            <span>{ intl.formatMessage({id: 'propose_13'})}</span>
                                                                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                            <span className='col-green'>{proposal.proposalVal / ONE_TRX} TRX</span>
                                                                        </div>
                                                                    }
                                                                    {
                                                                        proposal.key == 'getMaxCpuTimeOfOneTx' &&
                                                                        <div className="proposal-message">
                                                                            <span>{ intl.formatMessage({id: 'propose_14'})}</span>
                                                                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                            <span className='col-green'>{proposal.proposalVal} ms</span>
                                                                        </div>
                                                                    }
                                                                    {
                                                                        proposal.key == 'getAllowUpdateAccountName' &&
                                                                        <div className="proposal-message">
                                                                            <span>{ intl.formatMessage({id: 'propose_15'})}</span>
                                                                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                            {
                                                                                proposal.proposalVal? <span className='col-green'>{tu('propose_allowed')}</span>:
                                                                                    <span className='col-green'>{tu('propose_not_allowed')}</span>
                                                                            }
                                                                        </div>
                                                                    }
                                                                    {
                                                                        proposal.key == 'getAllowSameTokenName' &&
                                                                        <div className="proposal-message">
                                                                            <span>{ intl.formatMessage({id: 'propose_16'})}</span>
                                                                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                            {
                                                                                proposal.proposalVal? <span className='col-green'>{tu('propose_allowed')}</span>:
                                                                                    <span className='col-green'>{tu('propose_not_allowed')}</span>
                                                                            }
                                                                        </div>
                                                                    }
                                                                    {
                                                                        proposal.key == 'getAllowDelegateResource' &&
                                                                        <div className="proposal-message">
                                                                            <span>{ intl.formatMessage({id: 'propose_17'})}</span>
                                                                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                            {
                                                                                proposal.proposalVal? <span className='col-green'>{tu('propose_allowed')}</span>:
                                                                                    <span className='col-green'>{tu('propose_not_allowed')}</span>
                                                                            }
                                                                        </div>
                                                                    }
                                                                    {
                                                                        proposal.key == 'getTotalEnergyLimit' &&
                                                                        <div className="proposal-message">
                                                                            <span>{ intl.formatMessage({id: 'propose_18'})}</span>
                                                                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                            <span className='col-green'>{proposal.proposalVal}</span>
                                                                        </div>
                                                                    }
                                                                    {
                                                                        proposal.key == 'getAllowTvmTransferTrc10' &&
                                                                        <div className="proposal-message">
                                                                            <span>{ intl.formatMessage({id: 'propose_19'})}</span>
                                                                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                            {
                                                                                proposal.proposalVal? <span className='col-green'>{tu('propose_allowed')}</span>:
                                                                                    <span className='col-green'>{tu('propose_not_allowed')}</span>
                                                                            }
                                                                        </div>
                                                                    }
                                                                    {
                                                                        proposal.key == 'getTotalEnergyLimitNew' &&
                                                                        <div className="proposal-message">
                                                                            <span>{ intl.formatMessage({id: 'propose_18'})}</span>
                                                                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                            <span className='col-green'>{proposal.proposalVal}</span>
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
                                                                            <span className="badge badge-secondary text-uppercase badge-success-radius">{tu("proposal_cancelled")}</span>
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
                                                                <th></th>
                                                                <td>
                                                                    <div className="approvers-proposal">
                                                                    {
                                                                        proposal.approvals.map((item,index) => (
                                                                            <span key={index} className="mt-1 approvers-proposal-item" >
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


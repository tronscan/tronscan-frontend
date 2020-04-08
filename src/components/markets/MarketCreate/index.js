import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { tu } from './../../../utils/i18n';
import TokenInfo from './TokenInfo';
import TeamInfo from './TeamInfo';
import OtherInfo from './OtherInfo';
import { Form } from 'antd';
import { Client } from './../../../services/api';
import moment from 'moment';
import SweetAlert from 'react-bootstrap-sweetalert';
import { MARKETPAGE, API_URL, MARKET_API_URL, TOKENTYPE } from './../../../constants';
import xhr from 'axios/index';
import NavigationPrompt from 'react-router-navigation-prompt';
import { jsencrypt } from './../../../utils/jsencrypt';

@connect(
    (state, ownProp) => ({
        account: state.app.account,
        wallet: state.wallet.current,
        page: ownProp.match.params.page,
        tokenId: ownProp.match.params.tokenId,
        id: ownProp.match.params.id,
    })
)

export class MarketCreate extends Component {

    static propTypes = {
        id: PropTypes.string.isRequired,
        page: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            params: {
            },
            isSubmitSuccess: false,
        };
    }

    componentDidMount() {
        const { location: { state } } = this.props;
        if (this.isLoggedIn()){
            if (!!state && !!state.tokenInfo) {
                this.setState({
                    params: this.formatData(state.tokenInfo),
                });
            } else {
                this.getMarketInfoToken();
            }
        }
    }

    isLoggedIn = () => {
        let { account, intl } = this.props;
        if (!account.isLoggedIn){
            this.setState({
                modal: <SweetAlert
                    warning
                    title={tu('not_signed_in')}
                    confirmBtnText={intl.formatMessage({ id: 'confirm' })}
                    confirmBtnBsStyle="danger"
                    onConfirm={() => { this.setState({ modal: null }); this.goAccount(); }}
                >
                </SweetAlert>
            });
        }
        return account.isLoggedIn;
    };

    goAccount = () => {
        this.props.history.push('/account');
    }

    /**
     * get market token
     */
    getMarketInfoToken = async() => {
        const { tokenId } = this.props;
        const param = {
            tokenIdOrAddr: tokenId
        };

        let { data: { data = {} } } = await xhr.post(`${MARKET_API_URL}/api/token/getTokenInfoByTokenIdOrAddr`, param);
        
        this.setState({
            params: this.formatData(data),
        });
    }

    formatData = data => {
        const { additionalInfoN1, additionalInfoN2, additionalInfoN3 } = data;
        const { saleInformatiom, tokenInformation } = (additionalInfoN1 && JSON.parse(additionalInfoN1)) || {};
        const { overview, teamInfomation } = (additionalInfoN2 && JSON.parse(additionalInfoN2)) || {};
        const { otherInformation } = (additionalInfoN3 && JSON.parse(additionalInfoN3)) || {};
        const params = { ...saleInformatiom, ...tokenInformation, ...overview, ...teamInfomation, ...otherInformation };
        return params;
    }

    showSucessModal = () => {
        let { intl } = this.props;
        this.setState({
            modal: <SweetAlert
                success
                title=""
                confirmBtnText={intl.formatMessage({ id: 'confirm' })}
                confirmBtnBsStyle="danger"
                onConfirm={this.goAccount}
            >
                <p>{tu('market_other_success')}</p>
                <p>
                    {tu('market_other_success_desc_left')}
                    <a href="https://support.poloniex.org/hc/en-us/requests/new">
                        <label className="color-red">{tu('market_other_success_desc_right')}</label>
                    </a>
                </p>
            </SweetAlert>
        }
        );
    }

    showErrorModal = (msg) => {
        let { intl } = this.props;
        this.setState({
            modal: <SweetAlert
                error
                title=""
                confirmBtnText={intl.formatMessage({ id: 'confirm' })}
                confirmBtnBsStyle="danger"
                onConfirm={this.hideModal}
            >
                {msg}
            </SweetAlert>
        }
        );
    }

    hideModal = () => {
        this.setState({
            modal: null,
        });
    };

    prevStep = () => {
        const { step } = this.state;
        let newStep = step;
        switch (step) {
            case 1:
            case 2:
                newStep -= 1;
                break;
            case 0:
            default:
                this.props.history.replace('/account');
                break;
        }

        this.setState({
            step: newStep,
        });
    };

    submit = () => {
        const { form: { getFieldsValue } } = this.props;
        const { step, params } = this.state;
        const values = getFieldsValue();
        let newParams = Object.assign(params, values);
        let newStep = step;
        switch (step) {
            case 1:
                newStep += 1;
                break;
            case 2:
                this.additionalInfo();
                break;
            case 0:
            default:
                newStep += 1;
                break;
            }
        
        this.setState({
            step: newStep,
            params: newParams,
        });
    }

    /**
     * get page
     */
    getPage = () => {
        const { form } = this.props;
        const { step, params } = this.state;

        let buttonPrev = tu('sign_out');
        let buttonNext = tu('next');
        let page = (<TokenInfo form={form} params={params} />);
        switch (step) {
            case 1:
                buttonPrev = tu('prev_step');
                buttonNext = tu('next');
                page = (<TeamInfo form={form} params={params} />);
                break;
            case 2:
                buttonPrev = tu('prev_step');
                buttonNext = tu('submit');
                page = (<OtherInfo form={form} params={params} />);
                break;
            case 0:
            default:
                buttonPrev = tu('sign_out');
                buttonNext = tu('next');
                page = (<TokenInfo form={form} params={params} />);
                break;
        }

        return <div>
            {page}
            <div className="text-right px-2">
                {<a className="btn btn-default btn-lg" onClick={this.prevStep}>{buttonPrev}</a>}
                <button className="ml-4 btn btn-danger btn-lg" onClick={this.submit}>{buttonNext}</button>
            </div>
        </div>;
    }

    /**
     * the assembly data
     */
    assemblyData = () => {
        const { id } = this.props;
        const { params } = this.state;
        const { tokenProceedsUsage, tokenReleaseSchedule, currentTokenUtility,
            futureTokenUtility, seedSaleTokenPrice, amountRaisedInSeedSale, seedSaleStartAndEndDate,
            seedSaleDisPlan, privateSaleTokenPrice, amountRaisedInPrivateSale,
            privateSaleStartAndCompletionDate, privateSaleDisPlan, publicSaleTokenPrice,
            publicSaleTargetAmount, publicSaleStartAndEndDate, publicSaleDisPlan, totalAmountOfFundsRaised,
            initialCirculatingSupply, teamOverview, howDidYourTeamMeet, teamMembersBased, teamMemberFullTime,
            teamLockUpPlan,technicalOverview, topGithubRep, socialCommunityOverview, competitorOverview,
            DappRadarOrDappReviewRanking, productUsage, roadmap, marketingPlan, keyBusDevAndPart, linkToAllTronWallet,
            relationshipWithAnyTronSR, whichExchangesTradedOn, yourAvg24HVolume, theTop3ReasonsYouShouldBeListed,
            citeYourSources, top3Things, youSupportYourCoinProjectTime, productDemoLink, allYourProductsLink,
            circulatingSupply, top5HoldersOfYourToken } = params;

        const tokenInformation = {
            tokenProceedsUsage,
            tokenReleaseSchedule,
            currentTokenUtility,
            futureTokenUtility
        };
        const saleInformatiom = {
            seedSaleTokenPrice,
            amountRaisedInSeedSale,
            seedSaleStartAndEndDate,
            seedSaleDisPlan,
            privateSaleTokenPrice,
            amountRaisedInPrivateSale,
            privateSaleStartAndCompletionDate,
            privateSaleDisPlan,
            publicSaleTokenPrice,
            publicSaleTargetAmount,
            publicSaleStartAndEndDate,
            publicSaleDisPlan,
            totalAmountOfFundsRaised,
            initialCirculatingSupply,
        };

        const tokenAdditionalInfoN1 = {
            tokenInformation,
            saleInformatiom
        };


        const teamInfomation = {
            teamOverview,
            howDidYourTeamMeet,
            teamMembersBased,
            teamMemberFullTime,
            teamLockUpPlan
        };
        const overview = {
            technicalOverview,
            topGithubRep,
            socialCommunityOverview,
            competitorOverview,
            DappRadarOrDappReviewRanking,
            productUsage,
            roadmap,
            marketingPlan
        };
        const tokenAdditionalInfoN2 = {
            teamInfomation,
            overview
        };

        const otherInformation = {
            keyBusDevAndPart,
            linkToAllTronWallet,
            relationshipWithAnyTronSR,
            whichExchangesTradedOn,
            yourAvg24HVolume,
            theTop3ReasonsYouShouldBeListed,
            citeYourSources,
            top3Things,
            youSupportYourCoinProjectTime,
            productDemoLink,
            allYourProductsLink,
            circulatingSupply,
            top5HoldersOfYourToken,
        };

        const tokenAdditionalInfoN3 = {
            otherInformation,
        };

        return {
            tokenAdditionalInfoN1,
            tokenAdditionalInfoN2,
            tokenAdditionalInfoN3,
            id,
        };
    }

    /**
     * submit form
     */
    additionalInfo = async() => {
        let { intl } = this.props;
        const isSubmit = this.validateForm();
        if (!isSubmit) {
            this.showErrorModal(intl.formatMessage({ id: 'market_other_v_required' }));
            return false;
        }
        const infoData = {
            data: jsencrypt(JSON.stringify(this.assemblyData()))
        };
        const { data: { code } } = await xhr.post(`${MARKET_API_URL}/api/token/additionalInfo`, infoData);
        if (code === 200) {
            this.showSucessModal();
            this.setState({
                isSubmitSuccess: true,
            })
        } else {
            this.showErrorModal(intl.formatMessage({ id: 'market_other_error' }));
        }
    }

    /**
     * validate form
     */
    validateForm = () => {
        const { params } = this.state;
        const arr = params && Object.keys(params);
        let isSubmit = false;
        for (let i = 0; i < arr.length; i++) {
            if (!!params[arr[i]]) {
                isSubmit = true;
                break;
            }
        }
        return isSubmit;
    }

    navigationchange(nextLocation){
        const { account } = this.props;
        const { isSubmitSuccess } = this.state;
        return nextLocation && nextLocation.pathname.indexOf('/tokens/markets/add') == -1 && account.isLoggedIn && !isSubmitSuccess;
    }

    render() {
        const { modal } = this.state;
        return (
            <main className="container pb-4 mb-4 token-create header-overlap tokencreated token_black bg-white"
                style={{ marginTop: '-40px' }}>
                {modal}
                <Form
                    className="ant-advanced-search-form"
                >
                    {this.getPage()}
                </Form>
                <NavigationPrompt when={(currentLocation, nextLocation) => this.navigationchange(nextLocation)}>
                    {({ onConfirm, onCancel }) => (
                        <SweetAlert
                            info
                            showCancel
                            title={tu('leave_tip')}
                            confirmBtnText={tu('confirm')}
                            cancelBtnText={tu('cancel')}
                            cancelBtnBsStyle="default"
                            confirmBtnBsStyle="danger"
                            onConfirm={onConfirm}
                            onCancel={onCancel}
                        >
                        </SweetAlert>
                    )}
                </NavigationPrompt>
            </main>
        );
    }
}

export default Form.create({ name: 'market_info' })(injectIntl(MarketCreate));
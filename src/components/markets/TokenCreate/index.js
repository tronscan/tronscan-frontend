import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { tu } from '../../../utils/i18n';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import 'moment/min/locales';
import moment from 'moment';
import InputInfo from './InputInfo/index';
import SubmitInfo from './SubmitInfo';
import ResultInfo from './ResultInfo';
import SweetAlert from 'react-bootstrap-sweetalert';
import NavigationPrompt from 'react-router-navigation-prompt';
import xhr from 'axios/index';
import { API_URL, ONE_TRX, TOKENTYPE, MARKET_API_URL, MARKETPAGE } from '../../../constants';
import { TronLoader } from '../../common/loaders';
import _ from 'lodash';

@connect(
    (state, ownProp) => ({
        account: state.app.account,
        wallet: state.wallet.current,
        id: ownProp.match.params.id,
        type: ownProp.match.params.type,
        page: ownProp.match.params.page,
    })
)

// @reactMixin.decorate(Lifecycle)
export class TokenCreate extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        page: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = {
            updateId: '',
            step: 0,
            type: this.props.type,
            modal: null,
            isUpdate: this.props.page === MARKETPAGE.UPDATE,
            leave_lock: false,
            paramData: {
                tokenType: '',
                tokenName: '',
                tokenSymbol: '',
                tokenId: '',
                tokenAddress: '',
                circulation: '',
                ownerAddress: '',
                description: '',
                logo: 'https://coin.top/production/upload/logo/default.png',
                exchangePair: '',
                fprice: 1,
                sprice: 0,
                home_page: '',
                email: '',
                isInOtherMarket: '',
                tokenIssScheme: '',
                white_paper: '',
                contractCodeUrl: '',
                reddit: '',
                icoAddress: '',
                teamInfo: '',
                coinMarketCapUrl: '',
            },
        };
    }

    componentDidMount() {
        const { id, type, page, location: { state } } = this.props;
        if (this.isLoggedIn()){
            if (page === MARKETPAGE.UPDATE) {
                let { paramData } = this.state;
                if (!!state && !!state.tokenInfo) {
                    paramData = state.tokenInfo;
                    this.setState({
                        paramData,
                        updateId: state.tokenInfo && state.tokenInfo.id,
                    });
                } else {
                    this.getMarketInfoToken();
                }
            } else {
                if (type === TOKENTYPE.TOKEN10){
                    this.loadToken10(id);
                } else if (type === TOKENTYPE.TOKEN20) {
                    this.loadToken20(id);
                }
            }
        }
    }

    loadToken10 = async(id) => {
        let { intl } = this.props;
        this.setState({ loading: true });
        let result = await xhr.get(API_URL + '/api/token?id=' + id + '&showAll=1');
        let token = result.data.data[0];

        Object.keys(token).map(key => {
            if (token[key] == 'no_message') token[key] = '';
        });
        if (!token){
            this.setState({
                loading:false,
                token: null,
                modal: <SweetAlert
                    info
                    confirmBtnText={intl.formatMessage({ id: 'confirm' })}
                    confirmBtnBsStyle="success"
                    onConfirm={this.goAccount}
                >
                    {tu('information_is_being_confirmed')}
                </SweetAlert>
            }
            );
            return;
        } else {
            if (!this.isAuthor(token.ownerAddress)){
                this.setState({
                    modal: <SweetAlert
                    error
                    confirmBtnText={intl.formatMessage({ id: 'confirm' })}
                    confirmBtnBsStyle="success"
                    onConfirm={this.hideModal}
                    style={{ marginLeft: '-240px', marginTop: '-195px' }}
                >
                    {tu('token_create_auther_different')}
                </SweetAlert>
                })
                return;
            }
        }
        this.setState({
            loading: false,
            type: 'trc10',
            paramData: {
                tokenId: id,
                tokenName: token.name,
                tokenSymbol: token.abbr,
                description: token.description,
                totalSupply: (token.totalSupply / Math.pow(10, token.precision)).toString(),
                precision: token.precision,
                logo: token.imgUrl,
                ownerAddress: token.ownerAddress,
                sprice: (token.trxNum / ONE_TRX).toString(),
                fprice: (token.num.toString() / Math.pow(10, token.precision)).toString(),
                home_page: token.url,
                email: token.email ? token.email : '',
                white_paper: token.white_paper,
            },
        });
    };

    loadToken20 = async(id) => {
        let { intl } = this.props;
        this.setState({ loading: true, });
        let result = await xhr.get(API_URL+'/api/token_trc20?contract='+id);
        let token = result.data.trc20_tokens[0];
        if (!token){
            this.setState({
                loading:false,
                token: null,
                modal: <SweetAlert
                    info
                    confirmBtnText={intl.formatMessage({ id: 'confirm' })}
                    confirmBtnBsStyle="success"
                    onConfirm={this.goAccount}
                >
                    {tu('information_is_being_confirmed')}
                </SweetAlert>
            });

            return;
        } else {
            if (!this.isAuthor(token.issue_address)){
                this.setState({
                    modal: <SweetAlert
                    error
                    confirmBtnText={intl.formatMessage({ id: 'confirm' })}
                    confirmBtnBsStyle="success"
                    onConfirm={this.hideModal}
                    style={{ marginLeft: '-240px', marginTop: '-195px' }}
                >
                    {tu('token_create_auther_different')}
                </SweetAlert>
                })
                return;
            }
        }
        this.setState({
            loading: false,
            type: 'trc20',
            paramData: {
                tokenAddress: id,
                tokenName: token.name,
                tokenSymbol: token.symbol,
                description: token.token_desc,
                totalSupply: (token.total_supply_with_decimals / Math.pow(10,token.decimals)).toString(),
                precision: token.precision,
                logo: token.icon_url,
                ownerAddress: token.issue_address,
                fprice: '1',
                sprice: '',
                token_id: id,
                author: token.issue_address,
                home_page: token.home_page,
                email: token.email ? token.email : '',
                white_paper: token.white_paper,
            },
        });
    };


    componentDidUpdate(prevProps) {
        let { wallet } = this.props;
        if (wallet !== null) {
            if (prevProps.wallet === null || wallet.address !== prevProps.wallet.address) {
                this.setDefaultData();
            }
        }
    }

    setDefaultData = () => {
        this.setState({
            paramData: {
                ...this.state.paramData,
                author: this.props.account.address
            }
        });
    }

    changeStep = (step) => {
        this.setState({ step: step });
    }

    changeState = (params) => {
        this.setState(params);
    }

    isAuthor = (author) => {
        let { intl, account } = this.props;
        if (account.address !== author) {
            this.setState({
                loading: false,
                step: 0,
                // modal: <SweetAlert
                //     error
                //     confirmBtnText={intl.formatMessage({ id: 'confirm' })}
                //     confirmBtnBsStyle="success"
                //     onConfirm={this.hideModal}
                //     style={{ marginLeft: '-240px', marginTop: '-195px' }}
                // >
                //     {tu('token_create_auther_different')}
                // </SweetAlert>
            });
            return false;
        }
        return true;
    };

    hideModal = () => {
        this.setState({
            modal: null,
        });
    };

    goAccount = () => {
        this.props.history.push('/account');
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

    navigationchange(nextLocation){
        let { account } = this.props;
        const { leave_lock, step } = this.state;
        return nextLocation && nextLocation.pathname.indexOf('/tokens/markets/create') == -1
        && nextLocation.pathname.indexOf('/tokens/markets/update') == -1 && leave_lock && step < 2 && account.isLoggedIn;
    }

    /**
     * get Status
     */
    getStatus = () => {
        let { step } = this.state;
        const info = ['input', 'confirm', 'result'];
        return <div className="steps mb-4 py-2">
            {
                info.map((item, index) => {
                    let stepclass = '';
                    if (index < step){
                        stepclass = 'is-success';
                    }
                    if (index == step){
                        stepclass = 'is-process';
                    }
                    if (index > step){
                        stepclass = 'is-wait';
                    }
                    return <div className={`${stepclass} steps-item`} key={index}>{index + 1}. {tu(item)}</div>;
                })
            }
        </div>;
    }

    /**
     * get market token
     */
    getMarketInfoToken = async() => {
        const { id } = this.props;
        const param = {
            tokenIdOrAddr: id
        };

        let { data: { data = {} } } = await xhr.post(`${MARKET_API_URL}/api/token/getTokenInfoByTokenIdOrAddr`, param);
        const { tokenOtherInfo, description, sprice, fprice } = data;
        
        data.description = window.decodeURIComponent(description);
        const tokenOtherInfoObj = !!tokenOtherInfo ? JSON.parse(tokenOtherInfo) : {};
        data = Object.assign(data, tokenOtherInfoObj, { sprice: `${sprice}`, fprice: `${fprice}` });

        this.setState({
            paramData: data,
            updateId: data && data.id,
        });
    }

    render() {
        let { step, modal, loading, isUpdate } = this.state;
        // loadItem
        const loadItem = (
            <div className="card">
                <TronLoader>
                    {tu('loading_token')}
                </TronLoader>
            </div>
        );

        // InputInfoItem
        const inputInfoItem = step === 0 && (<InputInfo
            {...this.props}
            state={this.state}
            nextStep={(number) => this.changeStep(number)}
            nextState={(params) => this.changeState(params)}
        />);

        // SubmitInfoItem
        const submitInfoItem = step === 1 && (<SubmitInfo
            state={this.state}
            nextStep={(number) => this.changeStep(number)}
            nextState={(params) => this.changeState(params)}
        />);

        // ResultInfoItem
        const resultInfoItem = step === 2 && (<ResultInfo
            {...this.props}
            state={this.state}
            nextStep={(number) => this.changeStep(number)}
            nextState={(params) => this.changeState(params)}
        />);

        // content
        const contentItem = (
            <div className="row">
                <div className="col-sm-12">
                    <div className="card">
                        <div className="card-body">
                            { inputInfoItem }
                            { submitInfoItem }
                            { resultInfoItem }
                        </div>
                    </div>
                </div>
            </div>);

        return (
            <main  className="container pb-3 token-create header-overlap tokencreated token_black">
                {!isUpdate && this.getStatus()}
                {loading ? loadItem : contentItem}
                {modal}
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

export default injectIntl(TokenCreate);

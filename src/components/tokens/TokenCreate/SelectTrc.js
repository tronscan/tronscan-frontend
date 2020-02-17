import React, {Component, Fragment, PureComponent} from 'react';
import {t, tu} from "../../../utils/i18n";
import {connect} from "react-redux";
import {FormattedNumber, FormattedDate, injectIntl} from "react-intl";
import 'moment/min/locales';
import { Steps } from 'antd';
import SweetAlert from "react-bootstrap-sweetalert";
import {Client} from "../../../services/api";

const Step = Steps.Step;

@connect(
  state => ({
    wallet: state.wallet.current,
  })
)

export class TokenCreate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modalSelect: null,
      issuedAsset: null,
      ...this.props.state
    };
  }

  componentDidMount() {
    this.checkExistingToken()
  }

  componentDidUpdate(prevProps, prevState) {
    let {wallet} = this.props;
    if (wallet !== null) {
      if (prevProps.wallet === null || wallet.address !== prevProps.wallet.address) {
        this.checkExistingToken()
      }
    }
  }

  setSelect(type) {
    const {isLoggedInFn, nextState} = this.props
    nextState({type: type})
    // if(isLoggedInFn()){
    //   if(type == 'trc10'){
    //     if(this.state.issuedAsset){
    //       nextState({type: type})
    //     }else{
    //       this.setModal()
    //     }
    //   }else{
    //     nextState({type: type})
    //   }
    // }
  }

  goToNextStep =() => {
    const {nextStep, isLoggedInFn, wallet, isAuthorFn} = this.props
    const {issuedAsset, isUpdate,paramData:{author}} = this.state;
    const {type} = this.props.state;
    if(!isLoggedInFn()) return;
    if( isUpdate  && !isAuthorFn(author)) return;
    if(!issuedAsset && (type == 'trc10')){
      this.setModal('trx_token_account_limit')
      return
    }
    // if(wallet.balance < 1024*Math.pow(10,6)){
    //   this.setModal('trx_token_fee_message')
    //   return
    // }
    nextStep(1)
  }

  setModal = (msg) => {
    let {intl} = this.props;
    this.setState({
      modalSelect: <SweetAlert
        error
        title={tu(msg)}
        confirmBtnText={intl.formatMessage({id: 'confirm'})}
        confirmBtnBsStyle="danger"
        onConfirm={() => this.setState({modalSelect: null})}
        style={{marginLeft: '-240px', marginTop: '-195px'}}
      >
      </SweetAlert>
    })
  }

  checkExistingToken = () => {
    let {wallet} = this.props;
    if (wallet !== null) {
      Client.getIssuedAsset(wallet.address).then(({token}) => {
        this.setState({issuedAsset: (token == undefined)})
        // token !== undefined && this.props.nextState({type: 'trc20'})
      });
    }
  };

  render() {
    let {type} = this.props.state
    const { locale } = this.props.intl
    const url = locale == 'zh'?
    'https://support.tronscan.org/hc/zh-cn/articles/360027103591-%E4%BB%80%E4%B9%88%E6%98%AFTRC10%E5%92%8CTRC20%E9%80%9A%E8%AF%81':
    'https://support.tronscan.org/hc/en-us/articles/360027103751-What-s-the-differences-between-TRC10-and-TRC20-Tokens-';
    return (
        <main className="text-center">
          {this.state.modalSelect}
          <h2 className="mb-4 font-weight-bold">{tu('select_type')}</h2>
          <h5 className="f-18 mb-4 d-block">
            {tu('select_trx_tip1')}
            <a className="col-red mx-1" href={url} target="_bank">{tu('select_trx_tip2')}</a>
            {tu('select_trx_tip3')}
          </h5>
          <p className="text-muted mb-4 font-weight-light">{tu('select_tip1')}<br/>
          {tu('select_tip2')}</p>

          <div className="d-flex justify-content-between mx-auto mb-5 select-trc">
            {
              [10, 20].map(item => {
                return  <div className={`select-trc-item ${type == `trc${item}`&& 'is-active'}`}  key={item}
                          onClick={() => {this.setSelect(`trc${item}`)}}>
                          <div className="text-center">
                            <h1 className="mb-0">{item}</h1>{tu('token')}
                          </div>
                        </div>
              })
            }
          </div>
          <button 
            type="button" 
            className="btn btn-danger btn-lg btn-w" 
            style={{width: '252px'}}
            onClick={this.goToNextStep}
         >{tu('trc20_confirm')}</button>
        </main>
    )
  }
}

export default injectIntl(TokenCreate);

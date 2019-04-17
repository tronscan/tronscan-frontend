import React, {Component, Fragment, PureComponent} from 'react';
import {t, tu} from "../../../utils/i18n";
import {connect} from "react-redux";
import {FormattedNumber, FormattedDate, injectIntl} from "react-intl";
import 'moment/min/locales';
import { Steps } from 'antd';
import SweetAlert from "react-bootstrap-sweetalert";

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
      ...this.props.state
    };
  }

  componentDidMount() {
    const {checkExistingToken, nextState} = this.props
    if(!checkExistingToken()){
      nextState({type: 'trc20'})
    }
  }

  componentDidUpdate(prevProps) {
    let {wallet, checkExistingToken} = this.props;
    if (wallet !== null) {
      if (prevProps.wallet === null || wallet.address !== prevProps.wallet.address) {
        if(!checkExistingToken()){
         this.setModal()
        }
      }
    }
  }

  setSelect(type) {
    const {isLoggedInFn, nextState, checkExistingToken} = this.props
    if(isLoggedInFn()){
      if(type == 'trc10'){
        if(checkExistingToken()){
          nextState({type: type})
        }else{
          this.setModal()
        }
      }else{
        nextState({type: type})
      }
    }
  }

  goToNextStep =() => {
    const {nextStep, isLoggedInFn} = this.props
    if(isLoggedInFn()){
      nextStep(1)
    }
  }

  setModal = () => {
    let {intl} = this.props;
    this.setState({
      modal: <SweetAlert
        warning
        title={false}
        confirmBtnText={intl.formatMessage({id: 'confirm'})}
        confirmBtnBsStyle="warning"
        onConfirm={() => this.setState({modal: null})}
        style={{marginLeft: '-240px', marginTop: '-195px'}}
      >
        {tu("trx_token_account_limit")}
      </SweetAlert>
    })
  }

  render() {
    let {type} = this.props.state
    return (
        <main className="text-center">
          <h2 className="mb-4 font-weight-bold">{tu('select_type')}</h2>
          <h5 className="f-18 mb-4 justify-content-center">
            {tu('select_trx_tip1')}
            <a className="col-red mx-1">{tu('select_trx_tip2')}</a>
            {tu('select_trx_tip3')}
          </h5>
          <p className="text-muted mb-4 font-weight-light">10通证不需要合约，1024个Trx <br/>
          20通证由智能合约发行，不需要Trx</p>

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
            className="btn btn-danger btn-lg" 
            style={{width: '252px'}}
            onClick={this.goToNextStep}
          >{tu('trc20_confirm')}</button>
        
        </main>
    )
  }
}

export default injectIntl(TokenCreate);

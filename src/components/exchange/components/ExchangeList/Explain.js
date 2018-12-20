import React, {Component} from "react";
import {connect} from "react-redux";
import {tu} from "../../../../utils/i18n";
import { withRouter } from 'react-router'
import {Link} from "react-router-dom"
import SweetAlert from "react-bootstrap-sweetalert";
import {injectIntl} from "react-intl";
class Explain extends Component {
    constructor(props) {
      super(props);
      this.state = {
          modal: null
      }
    }
    goCreate(){
        const lng = this.props.intl.locale;
        const isOpen = this.props.wallet.isOpen;
        const txt = lng === 'zh'?'请登录钱包':'Please Login!';
        if(!isOpen){
            this.setState({
                modal: (
                    <SweetAlert warning onConfirm={()=>{this.setState({modal: null})}}>
                        {txt}
                    </SweetAlert>
                )
            });
            return;
        }else{
          this.props.history.push({pathname:'/account'});
        }
    }
    render(){
        const {modal} = this.state;
        return (
          <div className="exchange-list-explain p-3">
            {modal}
            <div className="mb-3">{tu("token_application_instructions_title")}</div>
            <div className="exchange-list-explain__content p-2">
              <p style={{color: '#666'}}>
                {tu("token_application_instructions_1")}
                <a href="https://docs.google.com/forms/d/1vqWaXG6rNgL-Uk2rNhwhm5pggp7fGhf7GB9EWmkeXzU/edit" target="_blank">{tu("click_here_to_apply")}</a>
              </p>
            </div>
            <div className="mb-3 mt-3">{tu("create_deal_pair")}</div>
            <div className="exchange-list-explain__content p-2">
                <p style={{color: '#666'}}>
                    {tu("add_deal_pair_desc")}
                    <a href="javascript:;" onClick={()=>{this.goCreate()}}>{tu('click_create')}</a>
                </p>
            </div>
        </div>
        )
   }
}

function mapStateToProps(state) {
    return {
        account: state.app.account,
        tokenBalances: state.account.tokens,
        totalTransactions: state.account.totalTransactions,
        frozen: state.account.frozen,
        accountResource: state.account.accountResource,
        wallet: state.wallet,
        currentWallet: state.wallet.current,
        trxBalance: state.account.trxBalance,
        activeLanguage:  state.app.activeLanguage
    };
}
export default connect(mapStateToProps)(withRouter(injectIntl(Explain)))

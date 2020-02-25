import React, { Component, Fragment, PureComponent } from "react";
import { t, tu } from "../../../utils/i18n";
import { connect } from "react-redux";
import { FormattedNumber, FormattedDate, injectIntl } from "react-intl";
import "moment/min/locales";
import moment from "moment";
import { Steps } from "antd";
import SelectProposal from "./SelectProposal";
import SetProposal from "./SetProposal";
import SubmitInfo from "./SubmitInfo";
import ResultInfo from "./resultInfo";
import { Prompt } from "react-router";
import { BrowserRouter } from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";
import { Button } from "antd";
import NavigationPrompt from "react-router-navigation-prompt";
import xhr from "axios";
import { API_URL, ONE_TRX } from "../../../constants";
import { TronLoader } from "../../common/loaders";
import { Client } from "../../../services/api";
import _ from "lodash";
import WARNIMG from './../../../images/compiler/warning.png';
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import ApplyForDelegate from "./../common/ApplyForDelegate";
import Lockr from "lockr";
// const confirm = Modal.confirm;
const Step = Steps.Step;
const typeMap = ["Select", "Propose", "Confirm", "Result"];
@connect(state => ({
  account: state.app.account,
  wallet: state.wallet.current
}))

// @reactMixin.decorate(Lifecycle)
export class ProposalsCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      type: "trc20",
      modal: null,
      isUpdate: false,
      leave_lock: false,
      proposalsCreateList:[],
      paramData: {
        res: "",
        errorInfo: ""
      },
      isTronLink: 0,
    };
  }

  componentDidMount() {
    let { match, account } = this.props;
    //login status
    if (this.isLoggedIn(1)) {
      this.setDefaultData();
      location.href = "#/proposalscreate/Select";
    }
    if (account.isLoggedIn) {
      this.setState({
          isTronLink: Lockr.get("islogin"),
      });
  }
  }

  
  componentDidUpdate(prevProps, prevState) {
    let { wallet } = this.props;
    if (wallet !== null) {
      if (
        prevProps.wallet === null ||
        wallet.address !== prevProps.wallet.address
      ) {
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
  };

  changeStep = step => {
    let { isUpdate } = this.state;
    this.setState({ step: step });
    if (!isUpdate) {
      location.href = `#/proposalscreate/${typeMap[step]}`;
    }
  };
  changeState = params => {
    this.setState(params);
  };
 

  hideModal = () => {
    this.setState({
      modal: null
    });
  };

  goAccount = () => {
    this.props.history.push("/account");
  };

  isLoggedIn = type => {
    let { account, intl } = this.props;
    if (!account.isLoggedIn) {
      if (type != 1) {
        this.setState({
          modal: (
            <SweetAlert
              warning
              title={tu("not_signed_in")}
              confirmBtnText={intl.formatMessage({ id: "confirm" })}
              confirmBtnBsStyle="danger"
              onConfirm={() => this.setState({ modal: null })}
              style={{ marginLeft: "-240px", marginTop: "-195px" }}
            ></SweetAlert>
          )
        });
      }
    }
    return account.isLoggedIn;
  };

  // 
  applySuperModal(){
    let { intl } = this.props;
    this.setState({
        modal: 
            <Modal isOpen={true} toggle={this.hideModal} className="committee-modal" style={{width: '460px'}}>
                <ModalHeader toggle={this.hideModal} className=""></ModalHeader>
                <ModalBody>
                    <div style={{color: '#333',padding:'10px 0 50px',fontSize: '16px',textAlign: 'center'}}>{tu('proposal_apply_super')}</div>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <div style={{width: '220px',height: '38px',lineHeight: '38px', textAlign: 'center', background: '#69C265', color: '#fff',cursor: 'pointer'}}
                            onClick={() => {
                                this.applyForDelegate()
                            }}>
                            {tu('proposal_apply_super_btn')}
                        </div>
                    </div>
                </ModalBody>
            </Modal>
    });

}

  applyForDelegate = () => {
    let {privateKey} = this.state;
    this.setState({
      modal: (
          <ApplyForDelegate
              isTronLink={this.state.isTronLink}
              privateKey={privateKey}
              onCancel={this.hideModal}
              onConfirm={() => {
                // setTimeout(() => this.props.reloadWallet(), 1200);
                this.setState({
                    modal: (
                        <SweetAlert success timeout="3000" onConfirm={this.hideModal}>
                          {tu("proposal_apply_super_success")}
                        </SweetAlert>
                    )
                });
              }}/>
      )
    })
  }
  isApplySuperModal = () =>{
    const { wallet } = this.props;
    if(!wallet.representative.enabled){
        this.applySuperModal()
        return
    }
  }
 
  

  navigationchange(nextLocation) {
    const { leave_lock, step } = this.state;
    return (
      nextLocation &&
      nextLocation.pathname.indexOf("/proposalscreate") == -1 &&
      leave_lock &&
      step < 3
    );
  }

  render() {
    let { step, modal, paramData, leave_lock, isUpdate, loading } = this.state;
    let info = ["proposal_select", "proposal_value", "proposal_confirm", "proposal_result"];
    // 发起提议文案Item
    const ProposalCreateItem = (
      <div className="proposal-text-container mb-4">
          <div className="compile-icon ml-0">
              <img src={WARNIMG} />
          </div>
          <div className="compile-text">
              {tu('proposal_create_info')}
          </div>
      </div>
    );
    return (
      <main className="container pb-3 token-create header-overlap tokencreated token_black">
        <div className="steps mb-4 py-2 ">
          {info.map((item, index) => {
            let stepclass = "";
            if (index < step) {
              stepclass = "is-success";
            }
            if (index == step) {
              stepclass = "is-process";
            }
            if (index > step) {
              stepclass = "is-wait";
            }
            return (
              <div className={`${stepclass} steps-item`} key={index}>
                {index + 1}. {tu(item)}
              </div>
            );
          })}
        </div>
        {loading ? (
          <div className="card">
            <TronLoader>{tu("loading_token")}</TronLoader>
          </div>
        ) : (
          <div className="row">
            <div className="col-sm-12">
             {(step==0 || step==1) &&  ProposalCreateItem} 
              <div className="card">
                <div className="">
                  {step === 0 && (
                    <SelectProposal
                      state={this.state}
                      nextStep={number => {
                        this.changeStep(number);
                      }}
                      nextState={params => {
                        this.changeState(params);
                      }}
                      isLoggedInFn={this.isLoggedIn}
                      isApplySuperModalFn = {this.isApplySuperModal}
                    />
                  )}
                  {step === 1 && (
                    <SetProposal
                      state={this.state}
                      nextStep={number => {
                        this.changeStep(number);
                      }}
                      nextState={params => {
                        this.changeState(params);
                      }}
                      isLoggedInFn={this.isLoggedIn}
                      isApplySuperModalFn = {this.isApplySuperModal}
                    />
                  )}
                  {step === 2 && (
                    <SubmitInfo
                      state={this.state}
                      nextStep={number => {
                        this.changeStep(number);
                      }}
                      nextState={params => {
                        this.changeState(params);
                      }}
                      isLoggedInFn={this.isLoggedIn}
                      isApplySuperModalFn = {this.isApplySuperModal}
                    />
                  )}
                  {step === 3 && (
                    <ResultInfo
                      state={this.state}
                      nextStep={number => {
                        this.changeStep(number);
                      }}
                      nextState={params => {
                        this.changeState(params);
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {modal}
        <NavigationPrompt
          when={(currentLocation, nextLocation) =>
            this.navigationchange(nextLocation)
          }
        >
          {({ onConfirm, onCancel }) => (
            <SweetAlert
              info
              showCancel
              title={tu("proposal_quit")}
              confirmBtnText={tu("confirm")}
              cancelBtnText={tu("cancel")}
              cancelBtnBsStyle="default"
              confirmBtnBsStyle="danger"
              onConfirm={onConfirm}
              onCancel={onCancel}
              style={{ marginLeft: "-240px", marginTop: "-195px" }}
            ></SweetAlert>
          )}
        </NavigationPrompt>
      </main>
    );
  }
}

export default injectIntl(ProposalsCreate);

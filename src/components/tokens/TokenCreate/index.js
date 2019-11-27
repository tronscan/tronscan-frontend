import React, { Component, Fragment, PureComponent } from "react";
import { t, tu } from "../../../utils/i18n";
import { connect } from "react-redux";
import { FormattedNumber, FormattedDate, injectIntl } from "react-intl";
import "moment/min/locales";
import moment from "moment";
import { Steps } from "antd";
import SelectTrc from "./SelectTrc";
import InputInfo from "./InputInfo/index";
import SubmitInfo from "./SubmitInfo";
import ResultInfo from "./resultInfo";
import { Prompt } from "react-router";
import { BrowserRouter } from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";
import { Modal, Button } from "antd";
import NavigationPrompt from "react-router-navigation-prompt";
import xhr from "axios/index";
import { API_URL, ONE_TRX } from "../../../constants";
import { TronLoader } from "../../common/loaders";
import { Client } from "../../../services/api";
import _ from "lodash";

const confirm = Modal.confirm;

const Step = Steps.Step;
const typeMap = ["Type", "Record", "Confirm", "Result"];
@connect(state => ({
  account: state.app.account,
  wallet: state.wallet.current
}))

// @reactMixin.decorate(Lifecycle)
export class TokenCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      type: "trc20",
      modal: null,
      isUpdate: false,
      leave_lock: false,
      social_total: 20,
      social_current: 4,
      paramData: {
        token_id: "",
        token_name: "",
        token_abbr: "",
        token_introduction: "",
        token_supply: "",
        precision: 0,
        logo_url: "https://coin.top/production/upload/logo/default.png",
        file_name: "",
        author: "",
        contract_address: "",
        contract_created_date: "",
        contract_created_address: "",
        contract_code: "",
        website: "",
        email: "",
        white_paper: "",
        github_url: "",
        trx_amount: "",
        token_amount: "",
        participation_type: true,
        participation_start_date: moment()
          .add(1, "days")
          .startOf("day"),
        participation_end_date: moment()
          .add(2, "days")
          .startOf("day"),
        freeze_type: false,
        freeze_amount: 0,
        freeze_date: 0
      },
      iconList: [
        { method: "Twitter", active: true, link: [""] },
        { method: "Facebook", active: true, link: [""] },
        { method: "Telegram", active: true, link: [""] },
        { method: "Weibo", active: true, link: [""] },
        { method: "Reddit", active: false, link: [""] },
        { method: "Medium", active: false, link: [""] },
        { method: "Steem", active: false, link: [""] },
        { method: "Instagram", active: false, link: [""] },
        { method: "Wechat", active: false, link: [""] },
        { method: "Group", active: false, link: [""] },
        { method: "Discord", active: false, link: [""] }
      ],
      res: "",
      errorInfo: ""
    };
  }

  componentDidMount() {
    let { match } = this.props;
    if (this.isLoggedIn(1)) {
      if (match.path === "/tokens/update/:id" && match.params.id) {
        if (!isNaN(match.params.id)) {
          this.loadToken10(match.params.id);
        } else {
          this.loadToken20(match.params.id);
        }
      } else {
        this.setDefaultData();
        location.href = "#/tokens/create/Type";
      }
    }
  }

  loadToken10 = async id => {
    let { account, intl } = this.props;
    this.setState({ loading: true, isUpdate: true });
    let result = await xhr.get(API_URL + "/api/token?id=" + id + "&showAll=1");
    let token = result.data.data[0];
    let new_social_media = [];

    Object.keys(token).map(key => {
      if (token[key] == "no_message") token[key] = "";
    });
    if (!token) {
      this.setState({
        loading: false,
        token: null,
        modal: (
          <SweetAlert
            info
            confirmBtnText={intl.formatMessage({ id: "confirm" })}
            confirmBtnBsStyle="success"
            onConfirm={this.goAccount}
            style={{ marginLeft: "-240px", marginTop: "-195px" }}
          >
            {tu("information_is_being_confirmed")}
          </SweetAlert>
        )
      });
      return;
    } else {
      if (!this.isAuthor(token.ownerAddress)) {
        return;
      }
    }

    let { frozen_supply } = await Client.getAccountByAddressNew(
      token.ownerAddress
    );

    if (token.new_social_media && token.new_social_media.length > 0) {
      new_social_media = JSON.parse(token.new_social_media);
      for (let icon in this.state.iconList) {
        let hasMethod = false;
        for (let item in new_social_media) {
          if (
            new_social_media[item].method === this.state.iconList[icon].method
          ) {
            hasMethod = true;
          }
        }
        if (!hasMethod) {
          new_social_media.push({
            method: this.state.iconList[icon].method,
            active: false,
            link: [""]
          });
        }
      }
    } else {
      new_social_media = this.state.iconList;
      new_social_media.map((item, index) => {
        token.social_media.map((name, icon_index) => {
          if (item.method == name.name) {
            item.link[0] = name.url;
          }
        });
      });
    }

    this.setState({
      loading: false,
      step: 1,
      type: "trc10",
      isUpdate: true,
      paramData: {
        token_id: id,
        token_name: token.name,
        token_abbr: token.abbr,
        token_introduction: token.description,
        token_supply: (
          token.totalSupply / Math.pow(10, token.precision)
        ).toString(),
        precision: token.precision,
        logo_url: token.imgUrl,
        author: token.ownerAddress,
        trx_amount: (token.trxNum / ONE_TRX).toString(),
        token_amount: (
          token.num.toString() / Math.pow(10, token.precision)
        ).toString(),
        participation_type:
          token.endTime - token.startTime > 1000 ? true : false,
        participation_start_date: moment(token.startTime),
        participation_end_date: moment(token.endTime),
        freeze_type: frozen_supply.length > 0 ? true : false,
        freeze_amount:
          frozen_supply.length > 0 ? frozen_supply[0].amount.toString() : "",
        freeze_date: frozen_supply.length > 0 ? frozen_supply[0].expires : "",
        website: token.url,
        email: token.email ? token.email : "",
        white_paper: token.white_paper,
        github_url: token.github
      },
      iconList: new_social_media
    });
  };

  loadToken20 = async id => {
    let { account, intl } = this.props;
    this.setState({ loading: true, isUpdate: true });
    let result = await xhr.get(API_URL + "/api/token_trc20?contract=" + id);
    let token = result.data.trc20_tokens[0];
    let contractInfo;
    let new_social_media = [];
    if (!token) {
      this.setState({
        loading: false,
        token: null,
        modal: (
          <SweetAlert
            info
            confirmBtnText={intl.formatMessage({ id: "confirm" })}
            confirmBtnBsStyle="success"
            onConfirm={this.goAccount}
            style={{ marginLeft: "-240px", marginTop: "-195px" }}
          >
            {tu("information_is_being_confirmed")}
          </SweetAlert>
        )
      });

      return;
    } else {
      if (!this.isAuthor(token.issue_address)) {
        return;
      } else {
        contractInfo = await Client.getContractInfo(token.contract_address);
      }
    }

    if (token.new_social_media && token.new_social_media.length > 0) {
      new_social_media = JSON.parse(token.new_social_media);
      for (let icon in this.state.iconList) {
        let hasMethod = false;
        for (let item in new_social_media) {
          if (
            new_social_media[item].method === this.state.iconList[icon].method
          ) {
            hasMethod = true;
          }
        }
        if (!hasMethod) {
          new_social_media.push({
            method: this.state.iconList[icon].method,
            active: false,
            link: [""]
          });
        }
      }
    } else {
      new_social_media = this.state.iconList;
      new_social_media.map((item, index) => {
        token.social_media_list.map((name, icon_index) => {
          if (item.method == name.name) {
            if (!(name.url.includes("[") && name.url.includes("]"))) {
              name.url = '["' + name.url + '"]';
            }
            item.link = JSON.parse(name.url);
          }
        });
      });
    }
    this.setState({
      loading: false,
      step: 1,
      type: "trc20",
      isUpdate: true,
      paramData: {
        token_id: id,
        token_name: token.name,
        token_abbr: token.symbol,
        token_introduction: token.token_desc,
        token_supply: (
          token.total_supply_with_decimals / Math.pow(10, token.decimals)
        ).toString(),
        precision: token.decimals,
        logo_url: token.icon_url,
        author: token.issue_address,
        contract_address: token.contract_address,
        //contract_created_date: moment(token.issue_time),
        contract_created_date: contractInfo.data[0].date_created
          ? moment(contractInfo.data[0].date_created)
          : "",
        contract_created_address: contractInfo.data[0].creator.address
          ? contractInfo.data[0].creator.address
          : "",
        website: token.home_page,
        email: token.email ? token.email : "",
        white_paper: token.white_paper
      },
      iconList: new_social_media
    });
  };

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
      location.href = `#/tokens/create/${typeMap[step]}`;
    }
  };
  changeState = params => {
    this.setState(params);
  };
  isAuthor = author => {
    let { intl, account } = this.props;
    if (account.address !== author) {
      this.setState({
        loading: false,
        step: 0,
        modal: (
          <SweetAlert
            error
            confirmBtnText={intl.formatMessage({ id: "confirm" })}
            confirmBtnBsStyle="success"
            onConfirm={this.hideModal}
            style={{ marginLeft: "-240px", marginTop: "-195px" }}
          >
            {tu("token_create_auther_different")}
          </SweetAlert>
        )
      });
      return false;
    }
    return true;
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

  navigationchange(nextLocation) {
    const { leave_lock, step } = this.state;
    return (
      nextLocation &&
      nextLocation.pathname.indexOf("/tokens/create") == -1 &&
      nextLocation.pathname.indexOf("/tokens/update") == -1 &&
      leave_lock &&
      step < 3
    );
  }

  render() {
    let { step, modal, paramData, leave_lock, isUpdate, loading } = this.state;
    //let info = !isUpdate ?['type', 'input', 'confirm', 'result']:['update_token', 'confirm', 'result'];
    let info = ["type", "input", "confirm", "result"];
    return (
      <main className="container pb-3 token-create header-overlap tokencreated token_black">
        <div className="steps mb-4 py-2">
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
              <div className="card">
                <div className="card-body">
                  {step === 0 && (
                    <SelectTrc
                      state={this.state}
                      nextStep={number => {
                        this.changeStep(number);
                      }}
                      nextState={params => {
                        this.changeState(params);
                      }}
                      isLoggedInFn={this.isLoggedIn}
                      isAuthorFn={this.isAuthor}
                    />
                  )}
                  {step === 1 && (
                    <InputInfo
                      state={this.state}
                      nextStep={number => {
                        this.changeStep(number);
                      }}
                      nextState={params => {
                        this.changeState(params);
                      }}
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
              title={tu("leave_tip")}
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

export default injectIntl(TokenCreate);

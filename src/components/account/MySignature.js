import { connect } from "react-redux";
import { Link } from "react-router-dom";
import React, { Fragment } from "react";
import { tu, t, option_t } from "../../utils/i18n";
import { alpha } from "../../utils/str";
import { Client } from "../../services/api";
import { upperFirst, cloneDeep } from "lodash";
import { Tag, Radio } from "antd";
import {TronLoader} from "../common/loaders";
import {
  TokenLink,
  TokenTRC20Link,
  HrefLink,
  AddressLink
} from "../common/Links";
import { QuestionMark } from "../common/QuestionMark";
import xhr from "axios/index";
import {
  FormattedDate,
  FormattedNumber,
  FormattedRelative,
  FormattedTime,
  injectIntl
} from "react-intl";
import {
  API_URL,
  CONTRACT_MAINNET_API_URL,
  TOKENTYPE,
  MARKET_API_URL,
  VERIFYSTATUS,
  MARKET_HTTP_URL
} from "../../constants";
import { getTime } from "date-fns";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Tooltip } from "reactstrap";
import { Popover, Button, Tooltip as AntdTip } from "antd";
import { IS_SUNNET, IS_MAINNET } from "./../../constants";
import SweetAlert from "react-bootstrap-sweetalert";
import SmartTable from "../common/SmartTable.js";
import TotalInfo from "../common/TableTotal";
import Countdown from "react-countdown-now";
import _, { find } from "lodash";
import SignDetailsModal from "./SignDetailsModal";
import { reloadWallet } from "../../actions/wallet";
import {withTronWeb} from "../../utils/tronWeb";

@withTronWeb
class MySignature extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: null,
      total: 0,
      data: [],
      //0-签名中，1-签名交易完成， 2-交易过期/处理失败 10-待签名  11-已签名 255-全部
      filter: {
        direction: 255,
        multiState: props.type
      },
      isShowSignDetailsModal: false,
      details: {},
      now:Math.ceil(Date.now()/1000),
      loading:false,
      lock:true,
    };
  }

  componentDidMount() {
    let { type } = this.props;
    this.load();
    // if (type !== 10) {
    //   this.load();
    // }
  }

  async componentDidUpdate(prevProps) {
    let { type, wallet } = this.props;
    let { lock } = this.state;
    if (prevProps.type !== type && type === 10 && lock) {
      this.setState(
        {
          filter: {
            direction: 255,
            multiState: type,
          },
        },
        () => {
          this.load();
        }
      );
    }
  }

  load = async (page = 1, pageSize = 20) => {
    this.setState({ loading: true });
    let { wallet } = this.props;
    let { filter } = this.state;
    let {
      data: { data }
    } = await xhr.get(
       "https://list.tronlink.org/api/wallet/multi/trx_record",
      {
        params: {
          address: wallet.address,
          start: (page - 1) * pageSize,
          state: filter.direction,
          limit: 5000,
          netType: "main_net"
        }
      }
    );
    let signatureList = data.data || [];
    signatureList.map(item => {
      if (item.state == 0) {
        item.signatureProgress.map((sign, index) => {
          if (sign.address == wallet.address) {
            //0-未签名 1-已签名
            if (sign.isSign == 0) {
              item.multiState = 10;
            } else {
              item.multiState = 11;
            }
          }
        });
      } else {
        item.multiState = item.state;
      }
    });
    let list;
    if (filter.multiState !== 255) {
      list = _(signatureList)
        .filter(signTx => signTx.multiState == filter.multiState)
        .value();
    } else {
      list = signatureList;
    }
    this.setState({
      page,
      data: list,
      total: list.length || 0,
      loading: false,
      signatureList: signatureList
    });
  };

  changeSignatureList() {
    let { wallet } = this.props;
    let { signatureList, filter } = this.state;

    signatureList = signatureList || [];
    signatureList.map(item => {
      if (item.state == 0) {
        item.signatureProgress.map((sign, index) => {
          if (sign.address == wallet.address) {
            //0-未签名 1-已签名
            if (sign.isSign == 0) {
              item.multiState = 10;
            } else {
              item.multiState = 11;
            }
          }
        });
      } else {
        item.multiState = item.state;
      }
    });
    let list;

    if (filter.multiState !== 255) {
      list = _(signatureList)
        .filter(signTx => signTx.multiState == filter.multiState)
        .value();
    } else {
      list = signatureList;
    }
    

    this.setState({
      data: list,
      total: list.length || 0,
      loading: false
    });
  }
  /**
   * Change Type
   */
  onRadioChange = (type, str) => {
    let multiState;
    if (type == 0 && str == "to_be_sign") {
      multiState = 10;
    } else if (type == 0 && str == "signed") {
      multiState = 11;
    } else {
      multiState = type;
    }
    if(type == 0 && str == "to_be_sign"){
      this.setState({ lock: false });
    }else{
      this.setState({ lock: true });
    }
    this.props.handleType(multiState)
    this.setState(
      {
        filter: {
          direction: type,
          multiState
        }
      },
      () => this.changeSignatureList()
    );
  };

  multiSign = async details => {
    let { wallet } = this.props;
    let { filter } = this.state;
    let transactionId;
    let result, success, tronWeb, currentTransactionHexStr;
    if(this.props.wallet.type==="ACCOUNT_LEDGER"){
      tronWeb = this.props.tronWeb()
    }else{
      tronWeb = this.props.account.tronWeb;
    }
    if (
      !(
        details.contractType == "TransferContract" ||
        details.contractType == "TransferAssetContract" ||
        details.contractType == "TriggerSmartContract" ||
        details.contractType == "AccountPermissionUpdateContract"
      )
    ) {
      this.onNotSupportSign();
      return;
    }
    //create transaction
    let currentTransaction = cloneDeep(details.currentTransaction);
    let HexStr = cloneDeep(details.currentTransaction.raw_data.contract[0].parameter.value);
    
    if(this.props.wallet.type==="ACCOUNT_LEDGER"){
      let parameterValue = Client.getParameterValue(HexStr, details.contractType);
      currentTransaction.raw_data.contract[0].parameter.value = parameterValue
    }
    //set transaction txID
    currentTransaction.txID = details.hash;
    //sign transaction
    let SignTransaction = await tronWeb.trx
      .multiSign(
        currentTransaction,
        tronWeb.defaultPrivateKey,
        currentTransaction.raw_data.contract[0].Permission_id
      )
      .catch(e => {
        console.log("e", e);
      });

    if(SignTransaction){
      if(this.props.wallet.type==="ACCOUNT_LEDGER" ){
        SignTransaction.raw_data.contract[0].parameter.value = HexStr
      }  
      //xhr multi-sign transaction api
      let { data } = await xhr.post(
        "https://list.tronlink.org/api/wallet/multi/transaction",
        {
          address: wallet.address,
          transaction: SignTransaction,
          netType: "main_net"
        }
      );
      result = data.code;
      this.closeSignDetailsModal();
      if (result == 0) {
        transactionId = true;
      } else {
        transactionId = false;
      }
      if (transactionId) {
        this.onSignedTransactionSuccess(filter.multiState);
      } else {
        this.onSignedTransactionFailed(filter.multiState,false);
      }
    }else{
      if (result == 0) {
        transactionId = true;
      } else {
        transactionId = false;
      }
      if (transactionId) {
        this.onSignedTransactionSuccess(filter.multiState);
      } else {
        this.onSignedTransactionFailed(filter.multiState,SignTransaction);
      }
    }
    
    
  };
  /**
   * open support sign popups
   */
  onNotSupportSign = str => {
    this.setState({
      modal: (
        <SweetAlert
          error
          title={tu("tronscan_not_support_signatures_this_transaction")}
          onConfirm={this.hideModal}
        />
      )
    });
  };
  /**
   * close modal
   */
  hideModal = () => {
    this.setState({
      modal: null
    });
  };
  /**
   * close SignedTransaction
   */
  hideSignedModal = multiState => {
    this.setState(
      {
        modal: null,
        filter: {
          direction: 255,
          multiState: multiState
        }
      },
      () => {
        this.props.reloadWallet();
        this.load();
      }
    );
  };

  /**
   * open SignedTransaction Success
   */
  onSignedTransactionSuccess = multiState => {
    this.setState({
      modal: (
        <SweetAlert
          success
          title={tu("transaction_signature_muti_successful")}
          onConfirm={() => this.hideSignedModal(multiState)}
        />
      )
    });
  };
  /**
   * open SignedTransaction Failed
   */
  onSignedTransactionFailed = (multiState,SignTransaction) => {
    this.setState({
      modal: (
        <SweetAlert
          error
          title={(SignTransaction === 0 && this.props.wallet.type==="ACCOUNT_LEDGER")? tu("too_many_bytes_to_encode"):tu("transaction_signature_muti_failed")}
          onConfirm={() => this.hideSignedModal(multiState)}
        />
      )
    });
  };

  /**
   * close SignDetailsModal
   */
  closeSignDetailsModal = () => {
    this.setState({ isShowSignDetailsModal: false });
  };

  /**
   * open SignDetailsModal
   * @param details
   */
  openSignDetailsModal = details => {
    this.setState({
      isShowSignDetailsModal: true,
      details
    });
  };

  customizedColumn = () => {
    let { intl } = this.props;
    let {now} = this.state;
    let column = [
      {
        title: upperFirst(intl.formatMessage({ id: "signature_type" })),
        dataIndex: "contractType",
        key: "contractType",
        align: "left",
        className: "ant_table",
        render: (text, record, index) => {
          return <span>{text}</span>;
        }
      },
      {
        title: upperFirst(intl.formatMessage({ id: "signature_sponsor" })),
        dataIndex: "originatorAddress",
        key: "originatorAddress",
        align: "left",
        className: "ant_table",
        width: "15%",
        render: (text, record, index) => {
          return <AddressLink address={text}>{text}</AddressLink>;
        }
      },
      {
        title: upperFirst(intl.formatMessage({ id: "signature_time_left" })),
        dataIndex: "expireTime",
        key: "expireTime",
        align: "center",
        className: "ant_table",
        render: (text, record, index) => {
          return text ? (
            <Countdown
              date={(now + record.expireTime) * 1000}
              daysInHours={true}
            />
          ) : (
            "-"
          );
        }
      },
      {
        title: upperFirst(intl.formatMessage({ id: "signature_list" })),
        dataIndex: "confirmed",
        key: "confirmed",
        align: "left",
        // width: '25%',
        className: "ant_table",
        render: (text, record, index) => {
          return (
            <div
              className="p-2 position-relative"
              style={{ background: "#f3f3f3" }}
            >
              <div className="text-left signature-currentWeight">
                {record.currentWeight + "/" + record.threshold}
              </div>
              {record.signatureProgress.map((item, index) => {
                return (
                  <div key={index} className="d-flex mt-1">
                    <div style={{ width: 250 }}>
                      <AddressLink address={item.address}>
                        {item.address}
                      </AddressLink>
                    </div>
                    <div className="ml-2 p-1 d-block signature-weight">
                      {item.weight}
                    </div>
                    {item.isSign == 1 ? (
                      <i className="ml-2 signature-siged"></i>
                    ) : (
                      ""
                    )}
                  </div>
                );
              })}
            </div>
          );
        }
      },
      {
        title: upperFirst(intl.formatMessage({ id: "signature_status" })),
        dataIndex: "multiState",
        key: "multiState",
        align: "center",
        className: "ant_table",
        width: "15%",
        render: (text, record, index) => {
          return (
            <span>
              <span>
                {text == 10 && tu("to_be_sign")}
                {text == 11 && tu("signed")}
              </span>
              <span style={{ color: "#c23631" }}>
                {text == 2 && tu("signature_failed")}
              </span>
              <span style={{ color: "#69C265" }}>
                {text == 1 && tu("signature_successful")}
              </span>
            </span>
          );
        }
      },
      {
        title: upperFirst(intl.formatMessage({ id: "signature_operate" })),
        dataIndex: "signature_operate",
        key: "signature_operate",
        align: "right",
        className: "ant_table",
        width: "25%",
        render: (text, record, index) => {
          return (
            <span>
              {record.multiState == 10 ? (
                <div>
                  <a
                    href="javascript:;"
                    className="text-primary btn btn-default btn-sm"
                    onClick={() => this.multiSign(record)}
                  >
                    {tu("signature")}
                  </a>
                  <a
                    href="javascript:;"
                    className="text-primary btn btn-default btn-sm ml-2"
                    onClick={() => this.openSignDetailsModal(record)}
                  >
                    {tu("details")}
                  </a>
                </div>
              ) : record.multiState == 1 ? (
                <div>
                  <div>
                    <a
                      href="javascript:;"
                      className="text-primary btn btn-default btn-sm"
                      onClick={() => this.openSignDetailsModal(record)}
                    >
                      {tu("details")}
                    </a>
                  </div>
                  <div className="mt-3">
                    <Link
                      className="color-tron-100 list-item-word"
                      style={{ fontSize: 12 }}
                      to={`/transaction/${record.hash}`}
                    >
                      {tu("view_on_chain_transactions")}
                    </Link>
                  </div>
                </div>
              ) : (
                <div>
                  <a
                    href="javascript:;"
                    className="text-primary btn btn-default btn-sm"
                    onClick={() => this.openSignDetailsModal(record)}
                  >
                    {tu("details")}
                  </a>
                </div>
              )}
            </span>
          );
        }
      }
    ];
    return column;
  };

  render() {
    let {
      data,
      filter,
      total,
      rangeTotal = 0,
      loading,
      emptyState: EmptyState = null,
      isShowSignDetailsModal,
      details,
      modal
    } = this.state;
    let column = this.customizedColumn();
    return (
      <Fragment>
        <div className="row">
          <div className="col-md-12">
            <div className="card list-style-body border-0">
              <div
                className="card-header list-style-body__header"
                style={{ background: "#f3f3f3" }}
              >
                <ul className="nav nav-tabs card-header-tabs">
                  <li className="nav-item">
                    <a
                      className={
                        filter.multiState == 255
                          ? "nav-link text-dark active"
                          : "nav-link text-dark"
                      }
                      href="javascript:;"
                      aria-current="page"
                      onClick={() =>
                        this.onRadioChange(255, "address_transfer_all")
                      }
                    >
                      <span>{tu("address_transfer_all")}</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className={
                        filter.multiState == 10
                          ? "nav-link text-dark active"
                          : "nav-link text-dark"
                      }
                      href="javascript:;"
                      aria-current="page"
                      onClick={() => this.onRadioChange(0, "to_be_sign")}
                    >
                      <span>{tu("to_be_sign")}</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className={
                        filter.multiState == 11
                          ? "nav-link text-dark active"
                          : "nav-link text-dark"
                      }
                      href="javascript:;"
                      aria-current="page"
                      onClick={() => this.onRadioChange(0, "signed")}
                    >
                      <span>{tu("signed")}</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className={
                        filter.multiState == 2
                          ? "nav-link text-dark active"
                          : "nav-link text-dark"
                      }
                      href="javascript:;"
                      aria-current="page"
                      onClick={() => this.onRadioChange(2, "signature_failed")}
                    >
                      <span>{tu("signature_failed")}</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className={
                        filter.multiState == 1
                          ? "nav-link text-dark active"
                          : "nav-link text-dark"
                      }
                      href="javascript:;"
                      aria-current="page"
                      onClick={() =>
                        this.onRadioChange(1, "signature_successful")
                      }
                    >
                      <span>{tu("signature_successful")}</span>
                    </a>
                  </li>
                </ul>
              </div>
              <div className="token_black pl-4 pr-4 position-relative">
                {(!loading && data.length !== 0) && (
                  <TotalInfo
                    total={total}
                    rangeTotal={total}
                    typeText="transactions_unit"
                  />
                )}
                {loading?<TronLoader/>:(
                  data.length === 0 ? (
                    <div className="p-3 text-center no-data">
                      {tu("no_transactions")}
                    </div>
                  ) :
                  <SmartTable
                    bordered={true}
                    loading={loading}
                    column={column}
                    data={data}
                    total={total}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        {isShowSignDetailsModal && (
          <SignDetailsModal
            onCancel={this.closeSignDetailsModal}
            details={details}
            onSign={this.multiSign}
          />
        )}
        {modal}
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    account: state.app.account,
    wallet: state.wallet.current,
    walletType: state.app.wallet,
    currentWallet: state.wallet.current,
    activeLanguage: state.app.activeLanguage,
    sidechains: state.app.sideChains
  };
}

const mapDispatchToProps = {
  reloadWallet
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(MySignature));

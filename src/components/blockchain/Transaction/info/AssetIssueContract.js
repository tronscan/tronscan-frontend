/*
 * Auther:xueyuanying
 * Date:2019-12-25
 */
import React, { Fragment } from "react";
import { connect } from "react-redux";
import { tu } from "../../../../utils/i18n";
import Field from "../../../tools/TransactionViewer/Field";
import { AddressLink, ExternalLink } from "../../../common/Links";
import { ONE_TRX } from "../../../../constants";
import {
  FormattedNumber,
  FormattedDate,
  FormattedTime,
  injectIntl
} from "react-intl";
import { Link } from "react-router-dom";
import { TransationTitle } from "./common/Title";
import BandwidthUsage from "./common/BandwidthUsage";
import SignList from "./common/SignList";
import { upperFirst } from "lodash";
import { Tooltip,Icon } from 'antd';

@connect(
  state => {
    return {
      activeLanguage: state.app.activeLanguage
    };
  }
)
class AssetIssueContract extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fee: "1,024 TRX",
      createTime:0,
      UtcUnit:"",
      TrxUnit:'TRX'
    };
  }
  componentDidMount(){
    this.createTime()
  }

  createTime(){
    let {contract} = this.props;
    let timestamp = contract.timestamp || 0;
    let frozen_supply = contract.frozen_supply && contract.frozen_supply[0] ? contract.frozen_supply[0] : {}
    let freezeTimeStamp = frozen_supply.frozen_days || 0
    let createTime = timestamp + freezeTimeStamp*24*60*60*1000;
   
    this.setState({
      createTime:createTime
    })

    
  }
  render() {
    let { contract,activeLanguage,intl } = this.props;
    let {createTime,TrxUnit} = this.state;
    let signList = contract.signature_addresses || [];
    let frozen_supply = contract.frozen_supply && contract.frozen_supply[0] ? contract.frozen_supply[0] : {}
    
    return (
      <Fragment>
        <TransationTitle contractType={contract.contractType}></TransationTitle>
        <div className="table-responsive">
          <table className="table">
            <tbody>
              <Field label="transaction_issue_address">
              <span className="d-flex">
                {/*  Distinguish between contract and ordinary address */}
                {contract.contract_map[contract["owner_address"]]? (
                  <span className="d-flex">
                    <Tooltip
                      placement="top"
                      title={upperFirst(
                        intl.formatMessage({
                          id: "transfersDetailContractAddress"
                        })
                      )}
                    >
                      <Icon
                        type="file-text"
                        style={{
                          verticalAlign: 0,
                          color: "#77838f",
                          lineHeight: 1.4
                        }}
                      />
                    </Tooltip>
                    <AddressLink address={contract["owner_address"]} isContract={true}>
                      {contract["owner_address"]}
                    </AddressLink>
                  </span>
                ) :
                <AddressLink address={contract["owner_address"]}>
                  {contract["owner_address"]}
                </AddressLink>
                }
              </span>
              </Field>
              <Field label="transaction_fee">{this.state.fee}</Field>
              <Field label="trc20_token_id">{contract.token_id}</Field>
              <Field label="token_name">
                <Link to={`/token/${contract.token_id}`}>
                    {contract.parameterValue && contract.parameterValue.name} ({contract.abbr})
                </Link>
              </Field>
              <Field label="total_supply">
                <FormattedNumber
                  value={
                    contract.total_supply /
                    (contract.precision ? Math.pow(10, contract.precision) : 1)
                  }
                />
              </Field>
                <Field label="token_price_new">{contract.trx_num/contract.num} {TrxUnit}</Field>
               <Field
                label="transaction_consumed_bandwidth_cap_per"
                tip={true}
                text="transaction_consumed_bandwidth_cap_per_tip"
              >
                {contract.new_limit || 0} {tu('bandwidth')}
              </Field>
              <Field
                label="transaction_consumed_bandwidth_cap_all"
                tip={true}
                text="transaction_consumed_bandwidth_cap_all_tip"
              >
                {contract.new_public_limit || 0} {tu('bandwidth')}
              </Field>
              <Field label="start_time">
                {contract.end_time - contract.start_time > 1000 ? (
                  <span>
                    <FormattedDate value={contract.start_time} />{" "}
                    <FormattedTime
                      value={contract.start_time}
                      hour="numeric"
                      minute="numeric"
                      second="numeric"
                      hour12={false}
                    /> 
                  </span>
                ) : (
                  "-"
                )}
              </Field>
              <Field label="end_time">
                {contract.end_time - contract.start_time > 1000 ? (
                  <span>
                    <FormattedDate value={contract.end_time} />{" "}
                    <FormattedTime
                      value={contract.start_time}
                      hour="numeric"
                      minute="numeric"
                      second="numeric"
                      hour12={false}
                    /> 
                  </span>
                ) : (
                  "-"
                )}
              </Field>
              {frozen_supply.frozen_amount && <Field label="transaction_frozen_number">
                <FormattedNumber
                  value={
                    ((frozen_supply.frozen_amount) || 0) / ONE_TRX
                  }
                ></FormattedNumber>
              </Field>}
              {frozen_supply.frozen_days && <Field label="transaction_frozen_day">
                {(frozen_supply.frozen_days) || 0} {tu('day')}{activeLanguage == 'en' && frozen_supply.frozen_days>1 && 's'}
              </Field>}
              <Field label="transaction_unfreeze_time">
                  <FormattedDate value={createTime} />{" "}
                  <FormattedTime
                    value={createTime}
                    hour="numeric"
                    minute="numeric"
                    second="numeric"
                    hour12={false}
                  /> 
              </Field>
              {JSON.stringify(contract.cost) != "{}" && (
                <Field label="consume_bandwidth">
                  <BandwidthUsage cost={contract.cost} />
                </Field>
              )}
              {signList && signList.length > 1 && (
                <Field label="signature_list" tip={true} text={tu('only_show_sinatures')}>
                  <SignList signList={signList} />
                </Field>
              )}
            </tbody>
          </table>
        </div>
      </Fragment>
    );
  }
}

export default injectIntl(AssetIssueContract);

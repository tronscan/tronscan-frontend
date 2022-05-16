/*
 * Auther:xueyuanying
 * Date:2019-12-25
 */
import React, { Fragment } from "react";
import { connect } from "react-redux";
import { tu } from "../../../../utils/i18n";
import Field from "../../../tools/TransactionViewer/Field";
import { AddressLink } from "../../../common/Links";
import { TRXPrice } from "../../../common/Price";
import { ONE_TRX } from "../../../../constants";
import { TransationTitle } from "./common/Title";
import BandwidthUsage from "./common/BandwidthUsage";
import SignList from "./common/SignList";
import { upperFirst } from "lodash";
import { Tooltip,Icon } from 'antd';
import {injectIntl} from "react-intl";
@connect(
  state => {
    return {
      activeLanguage: state.app.activeLanguage
    };
  }
)
class FreezeBalanceContract extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    let { contract,activeLanguage,intl } = this.props;
    let signList = contract.signature_addresses || [];

    return (
      <Fragment>
        <TransationTitle contractType={contract.contractType}></TransationTitle>
        <div className="table-responsive">
          <table className="table">
            <tbody>
              <Field label="transaction_owner_address">
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
              <Field label="transaction_receiver_address">
                <span className="d-flex">
                  {/*  Distinguish between contract and ordinary address */}
                  {contract.contract_map[contract["receiver_address"]] || contract.contract_map[contract["owner_address"]] ? (
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
                      <AddressLink address={contract["receiver_address"] || contract["owner_address"]} isContract={true}>
                        {contract["receiver_address"] || contract["owner_address"]}
                      </AddressLink>
                    </span>
                  ) :
                  <AddressLink address={contract["receiver_address"] || contract["owner_address"]}>
                    {contract["receiver_address"] || contract["owner_address"]}
                  </AddressLink>
                  }
                </span>
               
              </Field>

              <Field label="transaction_freeze_num">
                {contract["frozen_balance"] / ONE_TRX} TRX
              </Field>
              <Field label="frozen_days">
                {contract["frozen_duration"] || 0} {tu("day")}{activeLanguage == 'en' && contract["frozen_duration"]>1 && 's'}
              </Field>
              <Field label="transaction_get_resourse">
                {tu("tron_power")} &{" "}
                {contract["resource"] ? tu(`energy`) : tu(`bandwidth`)}
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

export default injectIntl(FreezeBalanceContract);

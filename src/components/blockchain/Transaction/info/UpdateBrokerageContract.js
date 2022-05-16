import React, { Fragment } from "react";
import {
  AddressLink,
  ExternalLink,
  ContractLink,
  TokenTRC20Link
} from "../../../common/Links";
import Field from "../../../tools/TransactionViewer/Field";
import SignList from "./common/SignList";
import { TransationTitle } from "./common/Title";
import BandwidthUsage from "./common/BandwidthUsage";
import { tu } from "../../../../utils/i18n";
import {injectIntl} from "react-intl";
import { upperFirst } from "lodash";
import { Tooltip,Icon } from 'antd';

function UpdateBrokerageContract({contract,intl}) {
  const { brokerage, signature_addresses, contractType, cost } = contract;
  let signList = signature_addresses;
  return (
    <Fragment>
      <TransationTitle contractType={contractType} />
      <table className="table table-responsive">
        <tbody>
          {contract["owner_address"] ? (
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
                    <AddressLink address={contract["owner_address"]} isContract={true}> {contract["owner_address"]}</AddressLink>
                    </span>
                ) :
                    <AddressLink address={contract["owner_address"]}>
                        {contract["owner_address"]}
                    </AddressLink>
                }
              </span>
            </Field>
          ) : (
            ""
          )}
          <Field label="transaction_rewards_distribution_ratio">
            {100 - (brokerage || 0)} %
          </Field>
          {JSON.stringify(contract.cost) != "{}" && (
            <Field label="consume_bandwidth">
              <BandwidthUsage cost={cost} />
            </Field>
          )}
          {signList && signList.length > 1 && (
            <Field
              label="signature_list"
              tip={true}
              text={tu("only_show_sinatures")}
            >
              <SignList signList={signList} />
            </Field>
          )}
        </tbody>
      </table>
    </Fragment>
  );
}

export default injectIntl(UpdateBrokerageContract)

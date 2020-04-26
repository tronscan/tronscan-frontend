/*
 * Auther:xueyuanying
 * Date:2019-12-25
 */
import React, { Fragment } from "react";
import { tu } from "../../../../utils/i18n";
import Field from "../../../tools/TransactionViewer/Field";
import { AddressLink, ExternalLink } from "../../../common/Links";
import { TRXPrice } from "../../../common/Price";
import { ONE_TRX } from "../../../../constants";
import { TransationTitle } from "./common/Title";
import BandwidthUsage from "./common/BandwidthUsage";
import SignList from "./common/SignList";
import {injectIntl} from "react-intl";
import { upperFirst } from "lodash";
import { Tooltip,Icon } from 'antd';

class UpdateAssetContract extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    let { contract,intl } = this.props;
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
              <Field label="description">{contract.description}</Field>
              <Field label="sr_url">
                <ExternalLink url={contract.url} />
              </Field>
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

export default injectIntl(UpdateAssetContract);

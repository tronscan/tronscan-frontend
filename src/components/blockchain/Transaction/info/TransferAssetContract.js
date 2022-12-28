/*
 * Auther:xueyuanying
 * Date:2019-12-25
 */
import React, { Fragment } from "react";
import { tu } from "../../../../utils/i18n";
import Field from "../../../tools/TransactionViewer/Field";
import { AddressLink } from "../../../common/Links";
import { TRXPrice } from "../../../common/Price";
import { ONE_TRX } from "../../../../constants";
import { NameWithId } from "../../../common/names";
import rebuildList from "../../../../utils/rebuildList";
import { TransationTitle } from "./common/Title";
import BandwidthUsage from "./common/BandwidthUsage";
import SignList from "./common/SignList";
import { upperFirst } from "lodash";
import { Tooltip,Icon } from 'antd';
import {injectIntl} from "react-intl";

class TransferAssetContract extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    let { contract,intl } = this.props;

    let TokenIDList = [];
    let tokenIdData;
    TokenIDList.push(contract);
    if (TokenIDList) {
      tokenIdData = rebuildList(TokenIDList, "asset_name", "amount")[0];
    }
    let signList = contract.signature_addresses || [];

    return (
      <Fragment>
        <TransationTitle contractType={contract.contractType}></TransationTitle>
        <div className="table-responsive">
          <table className="table">
            <tbody>
              <Field label="from">
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
              <Field label="to">
                <span className="d-flex">
                  {/*  Distinguish between contract and ordinary address */}
                  {contract.contract_map[contract["to_address"]]? (
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
                      <AddressLink address={contract["to_address"]} isContract={true}>
                        {contract["to_address"]}
                      </AddressLink>
                    </span>
                  ) :
                  <AddressLink address={contract["to_address"]}>
                    {contract["to_address"]}
                  </AddressLink>
                  }
                </span>
              </Field>
              <Field label="amount">{tokenIdData.map_amount || 0}</Field>
              <Field label="trc20_token_id">
                {contract.map_token_id || "-"}
              </Field>
              <Field label="token">
                <NameWithId
                  value={contract}
                  type="abbr"
                  notamount
                  totoken
                  tokenid={false}
                />
              </Field>
              {contract.contract_note && <Field label="note">
                {contract.contract_note || ""}
              </Field>}
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

export default injectIntl(TransferAssetContract);

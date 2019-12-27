import React, {Fragment} from "react";
import {t,tv} from "../../../../../utils/i18n";


export default function BandwidthUsage({cost,type}){
  const {energy_usage_total, origin_energy_usage, energy_usage, energy_fee, energy_burn, net_usage, net_fee} = cost
  return(
    type ? <div>
      {(net_usage || net_fee) && <div className="d-flex border-bottom pt-2">
        <div className="content_box_name">
          {t("consume_bandwidth")}
        </div>
        <div className="flex1">
          <div className="d-flex border-bottom content_item">{net_usage}</div>
          <div className="d-flex border-bottom content_item">{t(`net_usage`)}: {net_usage}</div>
          {/* <div className="d-flex border-bottom content_item">{t(`net_free`)}: {}</div> */}
          <div className="d-flex border-bottom content_item">{tv(`net_burn`,{num:net_fee/1000000})}: {}</div>
        </div>
      </div>}
      {energy_usage_total && 
      (<div className="d-flex border-bottom pt-2">
        <div className="content_box_name">
          {t("consume_energy")}
        </div>
        <div className="flex1">
          <div className="d-flex border-bottom content_item">{energy_usage_total}</div>
          <div className="d-flex border-bottom content_item">{t(`energy_usage`)}: {energy_usage}</div>
          <div className="d-flex border-bottom content_item">{tv(`energy_burn`,{num:energy_fee/1000000})}: {energy_usage_total - energy_usage - origin_energy_usage}</div>
          <div className="d-flex border-bottom content_item">{t(`origin_energy_usage`)}: {origin_energy_usage}</div>
        </div>
      </div>)}
    </div>:
    <tr>
      <th>{t("consume_bandwidth")}</th>
      <td style={{padding:'0 0.75rem'}}>
        <div className="d-flex content_item" style={{borderBottom: '1px solid #e5e5e5'}}>{net_usage}</div>
        <div className="d-flex content_item" style={{borderBottom: '1px solid #e5e5e5'}}>{t(`net_usage`)}: {net_usage}</div>
        <div className="d-flex content_item" style={{borderBottom: '1px solid #e5e5e5'}}>{tv(`net_burn`,{num:net_fee/1000000})}: {}</div>
      </td>
    </tr>
  )
}
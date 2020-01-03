import React, {Fragment} from "react";
import {t,tv, tu} from "../../../../../utils/i18n";
import {toThousands} from '../../../../../utils/number'


export default function BandwidthUsage({cost,type}){
  if(JSON.stringify(cost) == "{}") return ''
  const {energy_usage_total, origin_energy_usage, energy_usage, energy_fee, energy_burn, net_usage, net_fee} = cost
  return(
    type ? 
      (energy_usage_total && 
        (<div className="flex1">
          <div className="d-flex band-item">{toThousands(energy_usage_total)}&nbsp;{tu('energy')}</div>
          <div className="d-flex band-item item-belong">{t(`energy_usage`)}: {toThousands(energy_usage)}&nbsp;{tu('energy')}</div>
          <div className="d-flex band-item item-belong">{tv(`energy_burn`,{num:energy_fee/1000000})}: {toThousands(energy_usage_total - energy_usage - origin_energy_usage)}&nbsp;{tu('energy')}</div>
          <div className="d-flex band-item item-belong">{t(`origin_energy_usage`)}: {toThousands(origin_energy_usage)}&nbsp;{tu('energy')}</div>
        </div>)):
      ((net_usage || net_fee) && 
      <div className="flex1">
        <div className="d-flex band-item">{toThousands(net_usage||(net_fee/10))}&nbsp;{tu('bandwidth')}</div>
        <div className="d-flex band-item item-belong">{t(`net_free`)}: {toThousands(net_usage)}&nbsp;{tu('bandwidth')}</div>
        {/* <div className="d-flex">{t(`net_free`)}: {}</div> */}
        <div className="d-flex band-item item-belong">{tv(`net_burn`,{num:net_fee/1000000})}: {toThousands(net_fee/10)}&nbsp;{tu('bandwidth')}</div>
      </div>)
    )
}
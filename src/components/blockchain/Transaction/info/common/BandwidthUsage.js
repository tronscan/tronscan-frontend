import React, {Fragment} from "react";
import {t,tv, tu} from "../../../../../utils/i18n";
import {toThousands} from '../../../../../utils/number'
import {injectIntl} from "react-intl";

function BandwidthUsage({cost,type,intl}){
  if(JSON.stringify(cost) == "{}") return ''
  const {energy_usage_total, origin_energy_usage, energy_usage, energy_fee, energy_burn, net_usage, net_fee} = cost
  return(
    type ? 
      (energy_usage_total && 
        (<div className="flex1">
          <div className="d-flex band-item">{toThousands(energy_usage_total)}&nbsp;<div className="">{tu('energy')}</div></div>
          <div className="d-flex band-item item-belong"><div className="band-item-title" title={intl.formatMessage({id:`energy_usage`})}>{t(`energy_usage`)}:</div> {toThousands(energy_usage)}&nbsp;<div className="">{tu('energy')}</div></div>
          <div className="d-flex band-item item-belong"><div className="band-item-title" title={intl.formatMessage({id:`energy_burn`},{num:energy_fee/1000000})}>{tv(`energy_burn`,{num:energy_fee/1000000})}:</div> {toThousands(energy_usage_total - energy_usage - origin_energy_usage)}&nbsp;<div className="">{tu('energy')}</div></div>
          <div className="d-flex band-item item-belong"><div className="band-item-title" title={intl.formatMessage({id:`origin_energy_usage`})}>{t(`origin_energy_usage`)}:</div> {toThousands(origin_energy_usage)}&nbsp;<div className="">{tu('energy')}</div></div>
        </div>)):
      ((net_usage || net_fee) && 
      <div className="flex1">
        <div className="d-flex band-item">{toThousands(net_usage||(net_fee/10))}&nbsp;<div className="">{tu('bandwidth')}</div></div>
        <div className="d-flex band-item item-belong"><div className="band-item-title" title={intl.formatMessage({id:`net_free`})}>{t(`net_free`)}:</div> {toThousands(net_usage)}&nbsp;<div className="">{tu('bandwidth')}</div></div>
        {/* <div className="d-flex">{t(`net_free`)}: {}</div> */}
        <div className="d-flex band-item item-belong"><div className="band-item-title" title={intl.formatMessage({id:`net_burn`},{num:net_fee/1000000})}>{tv(`net_burn`,{num:net_fee/1000000})}:</div> {toThousands(net_fee/10)}&nbsp;<div className="">{tu('bandwidth')}</div></div>
      </div>)
    )
}

export default injectIntl(BandwidthUsage)
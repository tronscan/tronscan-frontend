import React, {Fragment} from "react";
import {FormattedNumber} from "react-intl";
import {Tooltip} from "reactstrap";
import {Client} from "../../services/api";
import {ONE_TRX} from "../../constants";
import {alpha} from "../../utils/str";
import {tu} from "../../utils/i18n";
import CountUp from 'react-countup';

export class TRXBurned extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            id: alpha(24),
            feeBurnedNum:0,
            burnedNumTotal:0,
            startFeeBurnedNum:-9223372036854.775808,
            independenceDayBurned: 1000000000
        };
    }

    async loadBurnedNum() {
        let address = await Client.getAddress('TLsV52sRDL79HXGGm9yzwKibb6BeruhUzy');
        let feeBurnedNum = (Math.abs(this.state.startFeeBurnedNum) - Math.abs(address.balance / ONE_TRX)).toFixed(0);
        let burnedNumTotal = Number(feeBurnedNum) + this.state.independenceDayBurned;
        this.setState((state) => ({
            feeBurnedNum:feeBurnedNum,
            burnedNumTotal:burnedNumTotal
        }));
    }

    componentDidMount() {
        this.loadBurnedNum();
    }

    render() {
        let {open, id ,feeBurnedNum,burnedNumTotal,independenceDayBurned} = this.state;

        return (
            <Fragment>
                {/**/}
                <FormattedNumber value={burnedNumTotal}
                                 maximumFractionDigits={2}
                                 minimumFractionDigits={2}
                >
                    {value => <span id={id}
                                    onMouseOver={() => this.setState({open: true})}
                                    onMouseOut={() => this.setState({open: false})}>
                    {/*{value}*/}
                    <CountUp start={0} end={burnedNumTotal} duration={2}  separator="," decimals={0}/>
                    </span>}
                </FormattedNumber>
                <Tooltip placement="top" isOpen={open} target={id}>
                    {tu("fee_burned")} <FormattedNumber value={feeBurnedNum} maximumFractionDigits={2} minimumFractionDigits={2} /> <br/>
                    {tu("independence_day_burned")} <FormattedNumber value={independenceDayBurned} maximumFractionDigits={2} minimumFractionDigits={2} /> <br/>

                </Tooltip>
            </Fragment>

        )
    }
}




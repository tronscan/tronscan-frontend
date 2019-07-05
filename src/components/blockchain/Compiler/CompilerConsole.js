import React from "react";
import {FormattedNumber, injectIntl} from "react-intl";
import { TronLoader } from "../../common/loaders";
import { upperFirst } from 'lodash'
import convert from 'htmr';
import CompilerJsoninfo from "./CompilerJsonInfo";

class CompilerConsole extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            color: {
                error: "orangered",
                success: "limegreen",
                warning: "yellowgreen",
                info: "blueviolet"
            }
        };
    }
    componentDidMount() {

    }

    render() {
        let {loading, html, color} = this.state;
        let { CompileStatus } = this.props;
        return (
           <div>
               {CompileStatus.map((log, i) => (
                   <div key={i}>
                       {
                           log.type == "success" && log.class == "compile"?
                               <p  className="contract-compiler-console-log"
                                   style={{color: color[log.type]}}>
                                   Compiled success: Contract
                                   {log.contractName}
                                   <CompilerJsoninfo title="Show ABI" json={JSON.stringify(log.contract.abi)} />
                                   <CompilerJsoninfo title="Show Bytecode" json={JSON.stringify(log.contract.byteCode)}/>
                               </p> :
                               <p   className="contract-compiler-console-log"
                                    style={{color: color[log.type]}}>
                                   {convert(log.content)}
                               </p>
                       }
                   </div>
               ))}
           </div>
        )
    }
}

export default injectIntl(CompilerConsole)
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
        console.log('CompileStatus',CompileStatus)
        return (
           <div>
               {CompileStatus.map((log, i) => (
                   <div key={i}>
                       {
                           (log.type == "success" && log.class == "compile")&&
                           <p  className="contract-compiler-console-log"
                               style={{color: color[log.type]}}>
                               Compiled success: Contract {log.contract.contractName} &nbsp;
                               <CompilerJsoninfo title="Show ABI" json={JSON.stringify(log.contract.abi)} />
                               <CompilerJsoninfo title="Show Bytecode" json={JSON.stringify(log.contract.byteCode)}/>
                           </p>
                       }
                       {
                           /*默认*/
                           (log.type  && !log.class) && <p className="contract-compiler-console-log"
                                style={{color: color[log.type]}}>
                               {convert(log.content)}
                            </p>
                       }
                       {
                           (log.type == "info" && log.class == "unsigned")&&
                           <p  className="contract-compiler-console-log"
                               style={{color: color[log.type]}}>
                               Transaction unsigned. &nbsp;
                               <CompilerJsoninfo title='View Unsigned Transaction' json={JSON.stringify(log.contract)}/>
                               <br/>
                               Waiting user sign
                           </p>
                       }
                       {
                           (log.type == "info" && log.class == "signed")&&
                           <p  className="contract-compiler-console-log"
                               style={{color: color[log.type]}}>
                               Transaction signed! &nbsp;
                               <CompilerJsoninfo title='View Signed Transaction' json={JSON.stringify(log.contract)}/>
                               <br/>
                               Broadcast transaction
                           </p>
                       }
                       {
                           (log.type == "info" && log.class == "broadcast")&&
                           <p  className="contract-compiler-console-log"
                               style={{color: color[log.type]}}>
                               Broadcast transaction success!&nbsp;
                               <CompilerJsoninfo title='View Broadcast Result' json={JSON.stringify(log.contract)}/>
                               <br/>
                               Waiting for confirm from Tron blockchain
                           </p>
                       }

                   </div>
               ))}
           </div>
        )
    }
}

export default injectIntl(CompilerConsole)
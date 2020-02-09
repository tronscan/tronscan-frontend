import React from "react";
import {FormattedNumber, injectIntl} from "react-intl";
import { TronLoader } from "../../common/loaders";
import { upperFirst } from 'lodash'
import convert from 'htmr';
import CompilerJsoninfo from "./CompilerJsonInfo";
import PerfectScrollbar from 'react-perfect-scrollbar'


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
    componentWillReceiveProps(nextProps)  {
        let compilerConsole = this.refs['compilerConsole'];
        compilerConsole.scrollTop = compilerConsole.scrollHeight;
    }



    render() {
        let {loading, html, color} = this.state;
        let { CompileStatus } = this.props;
        return (
            <PerfectScrollbar>
                <div ref="compilerConsole" className="contract-compiler-console">
               {CompileStatus.map((log, i) => (
                   <div key={i}>
                       {
                           (log.type == "success" && log.class == "compile")&&
                           <div  className="contract-compiler-console-log"
                               style={{color: color[log.type]}}>
                               Compiled success: Contract {log.contract.contractName} &nbsp;
                               <CompilerJsoninfo title="Show ABI" json={JSON.stringify(log.contract.abi)} />
                               <CompilerJsoninfo title="Show Bytecode" json={JSON.stringify(log.contract.byteCode)}/>
                           </div>
                       }
                       {
                           /*默认*/
                           (log.type  && !log.class) && <div className="contract-compiler-console-log"
                                style={{color: color[log.type]}}>
                               {convert(log.content)}
                            </div>
                       }
                       {
                           (log.type == "info" && log.class == "unsigned")&&
                           <div  className="contract-compiler-console-log"
                               style={{color: color[log.type]}}>
                               Transaction unsigned. &nbsp;
                               <CompilerJsoninfo title='View Unsigned Transaction' json={JSON.stringify(log.contract)}/>
                               <br/>
                               Waiting user sign
                           </div>
                       }
                       {
                           (log.type == "info" && log.class == "signed")&&
                           <div  className="contract-compiler-console-log"
                               style={{color: color[log.type]}}>
                               Transaction signed! &nbsp;
                               <CompilerJsoninfo title='View Signed Transaction' json={JSON.stringify(log.contract)}/>
                               <br/>
                               Broadcast transaction
                           </div>
                       }
                       {
                           (log.type == "info" && log.class == "broadcast")&&
                           <div  className="contract-compiler-console-log"
                               style={{color: color[log.type]}}>
                               Broadcast transaction success!&nbsp;
                               <CompilerJsoninfo title='View Broadcast Result' json={JSON.stringify(log.contract)}/>
                               <br/>
                               Waiting for confirm from Tron blockchain
                           </div>
                       }

                       {
                           (log.type == "success" && log.class == "deploy") &&
                           <div  className="contract-compiler-console-log"
                               style={{color: color[log.type]}}>
                               {convert(log.content)}
                           </div>
                       }
                       {
                           (log.type == "error" && log.class == "deploy") &&
                           <div  className="contract-compiler-console-log"
                               style={{color: color[log.type]}}>
                               {convert(log.content)}
                           </div>
                       }
                       {
                           (log.type == "error" && log.class == "info-error") &&
                           <div  className="contract-compiler-console-log"
                                 style={{color: color[log.type]}}>
                               {convert(log.content)}
                               <span className="contract-compiler-console-info">
                                   <span onClick={() => this.props.deploy()} className="info-btn ml-2">try again</span>
                               </span>
                           </div>
                       }

                   </div>
               ))}
           </div>
            </PerfectScrollbar>
        )
    }
}

export default injectIntl(CompilerConsole)
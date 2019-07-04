import React from "react";
import {FormattedNumber, injectIntl} from "react-intl";
import { TronLoader } from "../../common/loaders";
import { upperFirst } from 'lodash'
import moment from 'moment';

class CompilerConsole extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            html:'<i>77</i>',
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
                   <p
                        className="contract-compiler-console-log"
                        style={{color: color[log.type]}}
                        dangerouslySetInnerHTML={{ __html: log.content}}
                   />
               ))}

           </div>
        )
    }
}

export default injectIntl(CompilerConsole)
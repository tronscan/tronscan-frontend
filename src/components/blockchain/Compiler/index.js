/* eslint-disable no-undef */
import React, {Fragment} from "react";
import {injectIntl} from "react-intl";
import {NavLink, Route, Switch} from "react-router-dom";
import {FormattedNumber} from "react-intl";
import {TronLoader} from "../../common/loaders";
import { Tooltip } from 'antd'
import MonacoEditor from 'react-monaco-editor';


class ContractCompiler extends React.Component {
    constructor({match}) {
        super();
        this.state = {
            loading: false,
            code: '// type your code...',
        }
    }

    editorDidMount(editor, monaco) {
        console.log('editorDidMount', editor);
        editor.focus();
    }

    onChange(newValue, e) {
        console.log('onChange', newValue, e);
    }

    componentDidMount() {
        let {match} = this.props;
        this.loadContract(match.params.id);

    }

    componentWillUnmount() { }


    async loadContract(id) {
        //this.setState({loading: true, address: {address: id} });

    }


    render() {
        let { loading, code } = this.state;
        const options = {
            selectOnLineNumbers: true
        };
        return (
            <main className="container header-overlap">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex justify-content-center al">
                                    {
                                        loading ? <TronLoader/> :
                                            <MonacoEditor
                                                width="800"
                                                height="600"
                                                language="javascript"
                                                theme="vs-dark"
                                                value={code}
                                                options={options}
                                                onChange={this.onChange}
                                                editorDidMount={this.editorDidMount}
                                            />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        )
    }
}

function mapStateToProps(state) {


    return {
    };
}

const mapDispatchToProps = {
};

export default injectIntl(ContractCompiler);

import React from "react";
import ReactAce from 'react-ace-editor';
import {CopyText} from "../../common/Copy";
import {tu, tv} from "../../../utils/i18n";
import {Client} from "../../../services/api";


export default class Code extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      name: "",
      compilerVersion: "",
      sourceCode: "",
      abi: "",
      creationCode: ""
    };
  }

  componentDidMount() {
    let {filter} = this.props;
    this.loadContractCode(filter.address);
  }

  async loadContractCode(id) {
    let contractCode = await Client.getContractCode(id);

    this.setState({
      name: contractCode.data.name,
      compilerVersion: contractCode.data.compilerVersion,
      sourceCode: contractCode.data.sourceCode,
      abi: contractCode.data.contractABI,
      creationCode: contractCode.data.contractCreationCode
    }, () => {
      this.ace.editor.setValue(this.state.sourceCode);
      this.ace.editor.clearSelection();
    });

    //this.ace.editor.setValue('123');
  }

  onChange = (newValue, e) => {

    //const editor = this.ace.editor;

  }

  render() {
    let {name, compilerVersion, sourceCode, abi, creationCode} = this.state;

    return (
        <main className="container">

          <div className="row">
            <div className="col-md-12 ">
              <br/>
              <strong><i className="fa fa-check"></i> Contract Source Code Verified (Exact match)</strong>
              <table className="table table-hover mt-3">
                <tbody>

                <tr>
                  <th>{tu("contract_name")}:</th>
                  <td style={{width: '80%'}}>
                    {name}
                  </td>
                </tr>
                <tr>
                  <th>{tu("compiler_version")}:</th>
                  <td style={{width: '80%'}}>
                    {compilerVersion}
                  </td>
                </tr>

                </tbody>
              </table>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 ">
              <div className="d-flex mb-1">
                <span>Contract Source Code <i className="fa fa-code"></i></span>
                <CopyText text={sourceCode} className="ml-auto ml-1"/>
              </div>
              <ReactAce
                  mode="text"
                  theme="eclipse"
                  setReadOnly={true}
                  onChange={this.onChange}
                  style={{height: '400px'}}
                  ref={instance => {
                    this.ace = instance;
                  }}
              />

            </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-12 ">
              <div className="d-flex mb-1">
                <span>Contract ABI <i className="fa fa-cogs"></i></span>
                <CopyText text={abi} className="ml-auto ml-1"/>
              </div>
              <textarea className="w-100 form-control"
                        rows="7"
                        value={abi}
                        onChange={ev => this.setState({abi: ev.target.value})}/>

            </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-12 ">
              <div className="d-flex mb-1">
                <span>Contract Creation Code <i className="fa fa-braille"></i></span>
                <CopyText text={creationCode} className="ml-auto ml-1"/>
              </div>
              <textarea className="w-100 form-control"
                        rows="7"
                        value={creationCode}
                        onChange={ev => this.setState({creationCode: ev.target.value})}/>

            </div>
          </div>

        </main>

    )
  }
}

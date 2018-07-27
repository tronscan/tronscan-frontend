import React from "react";
import ReactAce from 'react-ace-editor';
import {CopyText} from "../../common/Copy";
import {tu, tv} from "../../../utils/i18n";


export default class Code extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      ace: ""
    };
  }

  componentDidMount() {
    this.ace.editor.setValue("");
    this.ace.editor.clearSelection();
  }

  onChange = (newValue, e) => {
    console.log(newValue, e);

    const editor = this.ace.editor;
    console.log(editor.getValue());
  }

  render() {
    let {ace} = this.state;
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
                    {"TokenERC20"}
                  </td>
                </tr>
                <tr>
                  <th>{tu("compiler_version")}:</th>
                  <td style={{width: '80%'}}>
                    {"v0.4.21+commit.dfe3193c"}
                  </td>
                </tr>

                </tbody>
              </table>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 ">
              <div className="d-flex mb-1">
                <span>Contract Source Code</span>
                <CopyText text={ace} className="ml-auto ml-1"/>
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
        </main>

    )
  }
}

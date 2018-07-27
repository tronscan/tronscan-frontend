import React, {Component} from 'react';
import {trim} from "lodash";
import {tu} from "../../utils/i18n";
import {connect} from "react-redux";
import {BlockNumberLink} from "../common/Links";
import {FormattedNumber} from "react-intl";


class VerifyContractCode extends Component {

  constructor(props) {
    super(props);

    this.state = {
      modal: null,
    };
  }

  componentDidMount() {

  }


  componentDidUpdate(prevProps, prevState) {

  }

  componentWillUnmount() {

  }

  render() {

    return (
        <main className="contract container header-overlap">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title text-left">Verify and Publish your Solidity Source Code</h5>
              <p>
                Step 1 : Enter your Contract Source Code below.
              </p>
              <p>
                Step 2 : If the Bytecode generated matches the existing Creation Address Bytecode, the contract is then
                Verified.
              </p>
              <p>
                Step 3 : Contract Source Code is published online and publicably verifiable by anyone.
              </p>
              <br/>
              <p>
                NOTES
              </p>
              <p>
                1. To verify Contracts that accept Constructor arguments, please enter the ABI-encoded Arguments in the
                last box below.
              </p>
              <p>
                2. For debugging purposes if it compiles correctly at Browser Solidity, it should also compile correctly
                here.
              </p>
              <p>
                3. Contracts that use "imports" will need to have the code concatenated into one file as we do not
                support "imports" in separate files. You can try using the Blockcat solidity-flattener or
                SolidityFlattery
              </p>
              <p>
                4. We do not support contract verification for contracts created by another contract
              </p>
              <p>
                5. There is a timeout of up to 45 seconds for each contract compiled. If your contract takes longer than
                this we will not be able to verify it.
              </p>
            </div>
          </div>


              <div className="card">
                <div className="card-body">
                  <div className="row">
                  <div className="col-md-3 mt-3 mt-md-0">
                    <div className="input-group">
                      <input type="text" className="form-control" placeholder="Recipient's username"
                             aria-label="Recipient's username" aria-describedby="basic-addon2"/>
                      <div className="input-group-append">
                        <span className="input-group-text" id="basic-addon2">@example.com</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 mt-3 mt-md-0">
                    <div className="input-group">
                      <input type="text" className="form-control" placeholder="Recipient's username"
                             aria-label="Recipient's username" aria-describedby="basic-addon2"/>
                      <div className="input-group-append">
                        <span className="input-group-text" id="basic-addon2">@example.com</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 mt-3 mt-md-0">
                    <div className="input-group">
                      <input type="text" className="form-control" placeholder="Recipient's username"
                             aria-label="Recipient's username" aria-describedby="basic-addon2"/>
                      <div className="input-group-append">
                        <span className="input-group-text" id="basic-addon2">@example.com</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 mt-3 mt-md-0">
                    <div className="input-group">
                      <input type="text" className="form-control" placeholder="Recipient's username"
                             aria-label="Recipient's username" aria-describedby="basic-addon2"/>
                      <div className="input-group-append">
                        <span className="input-group-text" id="basic-addon2">@example.com</span>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
              </div>

         
        </main>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyContractCode)

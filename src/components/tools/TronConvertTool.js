import React, {Component} from 'react';
import {trim} from "lodash";
import {tu} from "../../utils/i18n";
import {connect} from "react-redux";
import {BlockNumberLink} from "../common/Links";
import {FormattedNumber} from "react-intl";


class TronConvertTool extends Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {

  }

  hideModal = () => {
    this.setState({
      modal: null,
    });
  };

  componentDidUpdate(prevProps, prevState) {

  }

  componentWillUnmount() {

  }

  render() {

    return (
        <div className="container header-overlap">
          <div className="card">
            <div className="row">
              <div className="col-md-12">
                <iframe  style={{width:'100%',height:'100%',minHeight:'750px',paddingTop:'15px',border:0 }} src="http://18.221.104.145:8888/TronConvertTool.html"></iframe>


              </div>
            </div>
          </div>
        </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TronConvertTool)

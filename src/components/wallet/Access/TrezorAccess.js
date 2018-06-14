import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {trim} from "lodash";

class TrezorAccess extends Component {

  render() {

    return (
      <div className="text-center p-3 mx-5">
        Coming soon...
      </div>
    )
  }
}


function mapStateToProps(state) {
  return {
  };
}

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TrezorAccess));

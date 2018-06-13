import React, {Component} from 'react';
import {connect} from "react-redux";

class OpenWallet extends Component {

  componentDidMount() {

  }

  render() {


    return (
      <main className="container header-overlap news">

      </main>
    )
  }
}

const styles = {

};

function mapStateToProps(state) {
  return {
  };
}

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(OpenWallet)

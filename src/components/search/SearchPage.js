import React, {Component} from 'react';
import {connect} from "react-redux";

class SearchPage extends Component {

  constructor() {
    super();

    this.state ={
      blocks: [],
      transactions: [],
    };
  }

  componentDidMount() {

  }

  async doSearch(criteria) {

    let blocks = await Client.getBlocks({
      hash: criteria,
    });
  }

  render() {

    let {witnesses} = this.props;

    return (
      <main role="main" className="container">
        <div className="row">
          <div className="col-md-12">
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage)

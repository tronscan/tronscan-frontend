/* eslint-disable no-undef */
import React from "react";
import {tu} from "../../utils/i18n";
import {loadTokens} from "../../actions/tokens";
import {connect} from "react-redux";
import {isNaN, random, range} from "lodash";
import TimeAgo from "react-timeago";
import {FormattedNumber} from "react-intl";
import {Client} from "../../services/api";
import {AddressLink, BlockNumberLink} from "../common/Links";
import Paging from "../common/Paging";
import {Sticky, StickyContainer} from "react-sticky";


class Blocks extends React.Component {

  constructor() {
    super();

    this.state = {
      loading: false,
      blocks: [],
      total: 0,
    };
  }

  componentDidMount() {
    this.loadBlocks();
  }
  onChange = (page,pageSize) => {
    this.loadBlocks(page,pageSize);
   };

  loadBlocks = async (page = 1,pageSize=40) => {

    this.setState({ loading: true });

    let {blocks, total} = await Client.getBlocks({
      sort: '-number',
      limit: pageSize,
      start: (page-1) * pageSize,
    });

    this.setState({
      loading: false,
      blocks,
      total
    });
  };

  componentDidUpdate() {
    //checkPageChanged(this, this.loadBlocks);
  }

  render() {

    let {blocks, total, loading} = this.state;
    let {match} = this.props;

    return (
      <main className="container header-overlap pb-3">
        {
          <div className="row">
            <div className="col-md-12">
              <StickyContainer>
                <div className="card">
                  <Sticky>
                    {
                      ({style}) => (
                        <div style={{ zIndex: 100, ...style }} className="py-3 bg-white card-body border-bottom">
                          <Paging onChange={this.onChange} loading={loading} url={match.url} total={total}  />
                        </div>
                      )
                    }
                  </Sticky>
                  <table className="table table-hover m-0 table-striped">
                    <thead className="thead-dark">
                    <tr>
                      <th style={{width: 100}}>{tu("height")}</th>
                      <th style={{width: 150}}>{tu("age")}</th>
                      <th style={{width: 100}}><i className="fas fa-exchange-alt"/></th>
                      <th className="d-none d-sm-table-cell">{tu("produced by")}</th>
                      <th className="d-none d-lg-table-cell" style={{width: 100}}>{tu("bytes")}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                      blocks.map(block => (
                        <tr key={block.number}>
                          <th>
                            <BlockNumberLink number={block.number}/>
                          </th>
                          <td className="text-nowrap"><TimeAgo date={block.timestamp} /></td>
                          <td className="" style={{width: 100}}>
                            <FormattedNumber value={block.nrOfTrx} />
                          </td>
                          <td className="d-none d-sm-table-cell">
                            <div className="show-mobile">
                              <AddressLink address={block.witnessAddress}/>
                            </div>
                            <div className="hidden-mobile">
                              <AddressLink address={block.witnessAddress} />
                            </div>
                          </td>
                          <td className="d-none d-lg-table-cell">
                            <FormattedNumber value={block.size}/>
                          </td>
                        </tr>
                      ))
                    }
                    </tbody>
                  </table>
                </div>
              </StickyContainer>
            </div>
          </div>
        }
      </main>
    )
  }

}





function mapStateToProps(state) {

  return {
  };
}

const mapDispatchToProps = {
  loadTokens,
};

export default connect(mapStateToProps, mapDispatchToProps)(Blocks);

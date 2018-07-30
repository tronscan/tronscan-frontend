import React from "react";
import {Sticky, StickyContainer} from "react-sticky";
import Paging from "./Paging";
import {Client} from "../../services/api";
import {BlockNumberLink} from "./Links";
import {t, tu} from "../../utils/i18n";
import {FormattedNumber} from "react-intl";
import TimeAgo from "react-timeago";

export default class Blocks extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      filter: {},
      blocks: [],
      page: 0,
      total: 0,
      pageSize: 25,
      totalVotes: 0,
      emptyState: props.emptyState,
    };
  }

  componentDidMount() {
    this.load();
  }

  onChange = (page, pageSize) => {
    this.load(page, pageSize);
  };

  load = async (page = 1, pageSize = 40) => {

    let {filter} = this.props;

    this.setState({ loading: true });

    let {blocks, total} = await Client.getBlocks({
      sort: '-number',
      limit: pageSize,
      start: (page-1) * pageSize,
      ...filter,
    });

    this.setState({
      page,
      blocks,
      total,
      loading: false,
    });
  };

  render() {

    let {page, total, pageSize, loading, blocks, emptyState: EmptyState = null} = this.state;

    if (!loading && blocks.length === 0) {
      if (!EmptyState) {
        return (
          <div className="p-3 text-center">{t("no_blocks_found")}</div>
        );
      }
      return <EmptyState />;
    }

    return (
      <StickyContainer>
        {
          total > pageSize &&
            <Sticky>
              {
                ({style}) => (
                  <div style={{zIndex: 100, ...style}} className="card-body bg-white py-3 border-bottom">
                    <Paging onChange={this.onChange} total={total} loading={loading} pageSize={pageSize} page={page}/>
                  </div>
                )
              }
            </Sticky>
        }
        <table className="table table-hover m-0 table-striped">
          <thead className="thead-dark">
          <tr>
            <th style={{width: 100}}>{tu("height")}</th>
            <th style={{width: 150}}>{tu("age")}</th>
            <th style={{width: 100}}><i className="fas fa-exchange-alt"/></th>
            <th style={{width: 100}}>{tu("bytes")}</th>
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
                <td style={{width: 100}}><FormattedNumber value={block.nrOfTrx} /></td>
                <td>
                  <FormattedNumber value={block.size}/>
                </td>
              </tr>
            ))
          }
          </tbody>
        </table>
      </StickyContainer>
    )
  }
}

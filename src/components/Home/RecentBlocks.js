import React, {Component} from "react";
import {tu} from "../../utils/i18n";
import {FormattedNumber, injectIntl} from "react-intl";
//import {loadBlocks} from "../../actions/blockchain";
import {connect} from "react-redux";
import {TronLoader} from "../common/loaders";
import {AddressLink} from "../common/Links";
import TimeAgo from "react-timeago";
import {Link} from "react-router-dom";
import {TRXPrice} from "../common/Price";
import {withTimers} from "../../utils/timing";
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar'
import {Client} from "../../services/api";

class RecentBlocks extends Component {

  constructor() {
    super();

    this.state = {
      blocks: [],
    };
  }

  componentDidMount() {
    this.loadBlocks();
    this.props.setInterval(() => {
      this.loadBlocks();
    }, 6000);
  }

  loadBlocks = async () => {
    let {blocks} = await Client.getBlocks({
        order: '-timestamp',
        limit: 15,
    });
    let {witnesses} = await Client.getWitnesses();

    for(let block in blocks){
        for(let witness in witnesses){
            if(blocks[block].witnessAddress===witnesses[witness].address){
                if(witnesses[witness].name!=="")
                    blocks[block].witnessName=witnesses[witness].name;
                else
                    blocks[block].witnessName=witnesses[witness].url.substring(7).split('.com')[0];;
            }

        }
    }
    this.setState({ blocks });
  };

  render() {
    let {blocks} = this.state;

    if (blocks.length === 0) {
      return (
          <div className="text-center d-flex justify-content-center">
            <TronLoader/>
          </div>
      );
    }

    return (
        <div className="card" style={styles.card}>
          <div className="card-header bg-tron-light d-flex">
            <i className="fa fa-cubes mr-3 fa_width_20 color-grey-100"></i>
            <h5 className="m-0 lh-175 color-grey-100">{tu("blocks")}</h5>
            <Link to="/blockchain/blocks" className="ml-auto btn btn-sm btn-outline-secondary color-grey-200 color-grey-border" style={{borderRadius:'0.15rem'}}>
              {tu("view_all")}
            </Link>
          </div>
          <ul className="list-group list-group-flush" style={styles.list}>
            <PerfectScrollbar>
            {
              blocks.map(block => (
                  <li key={block.number} className="list-group-item overflow-h">
                    <div key={block.number} className="d-flex flex-column">
                      <div className="media-body mb-0 d-flex">
                        <div className="text-left">
                          <Link className= "mr-1 d-flex justify-content-start color-tron-100 pt-1 list-item-word"
                                to={`/block/${block.number}`}>
                            <i className="fa fa-cube mr-2 mt-1 fa_width color-tron-100" style={{fontSize:'1rem'}}></i>
                            #{block.number}
                          </Link>
                          <div>
                            <i className="fas fa-exchange-alt mr-2 color-tron-100"/>
                            <Link className="color-tron-100"
                                  to={`/blockchain/transactions?block=${block.number}`}>
                              <FormattedNumber value={block.nrOfTrx}/>{' '}
                              {tu("transactions")}
                            </Link>
                          </div>
                          <div className="text-gray-dark break-word d-flex list-item-word" >
                            <span className="mr-2 color-grey-300">{tu("produced_by")}:</span>
                            <AddressLink address={block.witnessAddress} truncate={false}>
                              <span className="color-tron-100">{block.witnessName}</span>
                            </AddressLink>
                          </div>

                        </div>
                        <div className="ml-auto text-right d-flex flex-column pt-2">

                          <div className="text-gray-dark break-word color-grey-200 list-item-word"  style={styles.nowrap}>
                            {tu("block_reward")}: <TRXPrice amount={32}/>
                          </div>
                          <div className="text-muted color-grey-300 small" style={styles.nowrap}>
                            <TimeAgo date={block.timestamp}/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
              ))
            }
            </PerfectScrollbar>
          </ul>
        </div>
    )
  }
}


function mapStateToProps(state) {
  return {
    //blocks: state.blockchain.blocks,
    activeLanguage: state.app.activeLanguage,
  };
}

const mapDispatchToProps = {
  //loadBlocks,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTimers(injectIntl(RecentBlocks)))


const styles = {
  list: {
    overflowX: 'none',
      height: 594,
  },
  card:{
      border:'none',
      borderRadius:0
  },
  nowrap:{
      flex:1,
      whiteSpace:'nowrap'
  }
};

import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { loadAccounts } from "../../actions/app";
import { tu } from "../../utils/i18n";
import { FormattedNumber, injectIntl } from "react-intl";
import { upperFirst, trim } from "lodash";
import { AddressLink } from "../common/Links";
import { CIRCULATING_SUPPLY, ONE_TRX } from "../../constants";
import { TRXPrice } from "../common/Price";
//import SmartTable from "../common/SmartTable.js";
import { TronLoader } from "../common/loaders";
//import { QuestionMark } from "../common/QuestionMark";
//import xhr from "axios/index";
import { Client } from "../../services/api";
import { Tooltip, Input, Table } from "antd";
import {HrefLink} from "../common/Links";
const { Search } = Input;

class AwardList extends Component {
  constructor() {
    super();

    this.state = {
      modal: null,
      loading: false,
      searchString: "",
      developers: [
          {
              id:1,
              awards: 'First Prize',
              dappName:'BestDApp',
              website:'bestd.app',
              websiteHref:'http://bestd.app',
              Introduction:'Best.dapp is a decentralized game platform based on the blockchain technology, with fairness, equality, transparency, openness and complete anonymousness.',
              bonus:'5000',
          },
          {
            id:2,
            awards: 'First Prize',
            dappName:'Lottery',
            website:'tronlott.me',
            websiteHref:'http://tronlott.me',
            Introduction:'TRON-Lottery is the first lottery game on sunnetwork. It is based on smart contracts and is completely fair. It also supports mining, dividends and other operations. Welcome to play.',
            bonus:'5000',
        },
        {
            id:3,
            awards: 'First Prize',
            dappName:'DApp1st',
            website:'dapp1st.co',
            websiteHref:'http://dapp1st.co',
            Introduction:'Dapp1st is a classic dice game on the blockchain.It is based on smart contracts, completely open source, and completely fair.',
            bonus:'5000',
        },
        {
            id:4,
            awards: 'Second Prize',
            dappName:'TRONSix',
            website:'tronsix.com',
            websiteHref:'http://tronsix.com',
            Introduction:"TRONSix is a dice game that we run on the TRON sidechain. The underlying layer is based on the TRON VM's smart contract. Fair, open source, and fair.",
            bonus:'3000',
        },
        {
            id:5,
            awards: 'Second Prize',
            dappName:'Tron-Racer',
            website:'arinatycoon.com/tron-racer',
            websiteHref:'http://arinatycoon.com/tron-racer',
            Introduction:'-',
            bonus:'3000',
        },
        {
            id:6,
            awards: 'Second Prize',
            dappName:'Cryptucky',
            website:'cryptuckyderby.com',
            websiteHref:'http://www.cryptuckyderby.com',
            Introduction:'-',
            bonus:'3000',
        },
        {
            id:7,
            awards: 'Second Prize',
            dappName:'cryptoidols',
            website:'arinahunters.com/cryptoidols',
            websiteHref:'https://www.arinahunters.com/cryptoidols',
            Introduction:`本游戏为A.I.美少女卡牌区块链游戏,
            玩家为偶像事务所的经纪人,
            透过招募美少女偶像(721 TOKEN),
            并且培育养成每位偶像,
            让美少女偶像上位,
            赚取大量财富及宝石.
            
            玩家也可透过卡牌融合,
            快速提升偶像的实力,
            未来游戏会解锁更多玩法,
            让偶像活动更加多元.
            
            另外本游戏未来的更新将利用智能合约,
            创造出百亿虚拟粉丝(TRC-721),
            每位虚拟粉丝都是独一无二的存在,
            会拥有游戏中的货币及物品,
            玩家可以透过游戏获取粉丝的关注,
            并且透过和虚拟粉丝互动,
            获得粉丝的礼物,
            并可透过完成任务获得财富,
            让你的美少女偶像登上颠峰.`,
            bonus:'3000',
        },
        {
            id:8,
            awards: 'Second Prize',
            dappName:'TRON Win',
            website:'tronwin.cc',
            websiteHref:'http://tronwin.cc',
            Introduction:"TRONWin wants to become the BIGGEST and BEST online gambling platform on TRON.  We've developed lots of DApps on different blockchain before. Mine is our first try, lots of more is coming. Have fun!",
            bonus:'3000',
        },
        {
            id:9,
            awards: 'Second Prize',
            dappName:'SpayFall',
            website:'dappz.cc',
            websiteHref:'http://dappz.cc',
            Introduction:'SpyFall aims to become a new standard dice game run on the SUN Network.',
            bonus:'3000',
        },
        {
            id:10,
            awards: 'Third Prize',
            dappName:'pockernumber',
            website:'tronbet.fun',
            websiteHref:'https://tronbet.fun',
            Introduction:'PokerNumber is a puzzle poker game. Players can earn high returns by investing in corresponding projects.',
            bonus:'1000',
        },
        {
            id:11,
            awards: 'Third Prize',
            dappName:'sunnetwork-maze',
            website:'sunnetwork-maze.com',
            websiteHref:'http://sunnetwork-maze.com',
            Introduction:'-',
            bonus:'1000',
        },
        {
            id:12,
            awards: 'Third Prize',
            dappName:'Poker',
            website:'tronpk.com',
            websiteHref:'http://tronpk.com',
            Introduction:'TRON Poker is a decentralized, fair, transparent, and open game platform based on blockchain technology.It has launched a variety of blockchain games based on TRON smart contracts worldwide. The platform uses blockchain technology to provide completely fair game rules, automated revenue distribution, complete protection of player privacy, and all traceable transaction records.',
            bonus:'1000',
        },
        {
            id:13,
            awards: 'Third Prize',
            dappName:'ChineseZodiac',
            website:'tronad.cc',
            websiteHref:'http://tronad.cc',
            Introduction:'Welcome to ChineseZodiac. The Sun Network Gaming Center.',
            bonus:'1000',
        },
        {
            id:14,
            awards: 'Third Prize',
            dappName:'CoinFlip',
            website:'troncool.com',
            websiteHref:'http://troncool.com',
            Introduction:'Choose coin side to win the future',
            bonus:'1000',
        },
        {
            id:15,
            awards: 'Third Prize',
            dappName:'OneDice',
            website:'51bf.me',
            websiteHref:'http://51bf.me',
            Introduction:'OneDice wants to become the BIGGEST and BEST online gambling platform on #TRX blockchain.',
            bonus:'1000',
        },
        {
            id:16,
            awards: 'Third Prize',
            dappName:'ThreeColor',
            website:'dappad.cc',
            websiteHref:'http://dappad.cc',
            Introduction:'ThreeColor it’s a platform for decentralized games where everyone can make a real profit through games',
            bonus:'1000',
        },

        {
            id:17,
            awards: 'Third Prize',
            dappName:'Energy',
            website:'abet.fun',
            websiteHref:'https://abet.fun',
            Introduction:'Energy is a Tron smart contract for placing bets on our provably-fair dice game using TRX with no deposits or sign-ups.',
            bonus:'1000',
        },
        {
            id:18,
            awards: 'Third Prize',
            dappName:'ZodiacSigns',
            website:'tronfun.cc',
            websiteHref:'http://tronfun.cc',
            Introduction:'Welcome to ZodiacSigns. The Sun Network Gaming Center',
            bonus:'1000',
        },
        {
            id:19,
            awards: 'Third Prize',
            dappName:'PokerSuit',
            website:'trondice.xyz',
            websiteHref:'https://trondice.xyz',
            Introduction:'PokerSuit is a decentralized gambling site that utilizes the official Sun Network oracle for provably fair games.',
            bonus:'1000',
        },
        {
            id:20,
            awards: 'Third Prize',
            dappName:'betNow!',
            website:'trxbet.cc',
            websiteHref:'http://trxbet.cc',
            Introduction:'BetNow is completely developed based on TRON smart contract, fair and open and safe. A series of gameplay such as mining dividends will be launched in the future.',
            bonus:'1000',
        },
        {
            id:21,
            awards: 'Third Prize',
            dappName:'Be Fun',
            website:'befun.pw',
            websiteHref:'http://befun.pw',
            Introduction:'-',
            bonus:'1000',
        },
        {
            id:22,
            awards: 'Participation Award',
            dappName:'HumanSenses',
            website:'solarbet.xyz',
            websiteHref:'https://solarbet.xyz',
            Introduction:'-',
            bonus:'250',
        },
        {
            id:23,
            awards: 'Participation Award',
            dappName:'pangu',
            website:'pangu.trade',
            websiteHref:'http://pangu.trade',
            Introduction:'Decentralized exchange based on TRON & SUN DAppChain',
            bonus:'250',
        },
        {
            id:24,
            awards: 'Participation Award',
            dappName:'Wild Universe',
            website:'wilduniverse.co',
            websiteHref:'http://wilduniverse.co',
            Introduction:'Life simulation game about pets based on SUN DAppChain.',
            bonus:'250',
        },
        {
            id:25,
            awards: 'Participation Award',
            dappName:'G Connect',
            website:'gconnect.io',
            websiteHref:'http://gconnect.io',
            Introduction:'Payment solutions for gaming industry. First solution is donation service for gamers based on TRON Network. Second is cryptocurrency wallet for iOS & Android.',
            bonus:'250',
        },
      ],
      total: 0,
      searchCriteria: "",
      pagination: {
        showQuickJumper: true,
        position: "bottom",
        showSizeChanger: true,
        defaultPageSize: 20,
        total: 0
      },
    //   filter: {
    //     sortField: "currentMonth",
    //     userSort: -1,
    //     order_current: "descend"
    //   }
    };
  }

  componentDidMount() {
    // this.loadAccounts();
  }

  loadAccounts = async (page = 1, pageSize = 20) => {
    const { searchCriteria, filter } = this.state;
    this.setState({ loading: true });

    let { data, total } = await Client.getUserList({
      search: searchCriteria,
      pageSize: pageSize,
      page: page,
      ...filter
    });

    data.map((item, index) => {
      item.index = index + 1;
      // eslint-disable-next-line
      item.extraData = new Function("return " + item.extra)();
    });
    this.setState({
      loading: false,
      developers: data,
      total: total,
      pagination: {
        ...this.state.pagination,
        total
      }
    });
  };


  onChange = (page, pageSize) => {
    this.loadAccounts(page, pageSize);
  };

//   onSearchChange = searchCriteria => {
//     this.setState(
//       {
//         searchCriteria: trim(searchCriteria)
//       },
//       () => {
//         this.loadAccounts();
//       }
//     );
//   };



  customizedColumn = () => {
    let { intl } = this.props;
    let { filter } = this.state;
    const defaultImg = require("../../images/logo_default.png");

    let column = [
      {
          title: 'ID',
          dataIndex: 'ID',
          align: 'left',
          width:'5%',
          render: (text, record, index) => {
              return <div>{record.id}</div>
          }
      },
      {
        title: 'Awards',
        dataIndex: "awards",
        key: "awards",
        align: "left",
        className: "ant_table",
        width:'10%',
        render: (text, record, index) => {
          return (
            <div>
                <div>{record.awards}</div>
            </div>
          );
        }
      },

      {
        title: 'Name',
        dataIndex: "dappName",
        key: "dappName",
        align: "center",
        className: "ant_table",
        width:'20%',
        render: (text, record, index) => {
          return (
            <HrefLink href={record.websiteHref} target="_blank" className="text-muted">
                <span style={{'wordBreak': 'break-all'}}>{record.dappName}</span>
            </HrefLink>
          );
        }
      },
      // {
      //   title: 'Website',
      //   dataIndex: "website",
      //   key: "website",
      //   align: "center",
      //   width:'10%',
      //   render: (text, record, index) => {
      //     return (
      //       <HrefLink href={record.websiteHref} target="_blank" className="text-muted">
      //           <span style={{overflow: "hidden",whiteSpace: "nowrap",textOverflow: "ellipsis"}}>{record.website}</span>
      //       </HrefLink>
      //     );
      //   }
      // },
      {
        title: 'Introduction',
        dataIndex: "Introduction",
        key: "Introduction",
        align: "center",
        className: "ant_table",
        render: (text, record, index) => {
          return (
            <div >
                <Tooltip title={record.Introduction}>
                    <div style={{width:'600px',overflow: "hidden",whiteSpace: "nowrap",textOverflow: "ellipsis"}}>
                        {record.Introduction}
                    </div>
                </Tooltip>
            </div>
          );
        }
      },
      {
        title: 'Bonus(USDT)',
        dataIndex: "bonus",
        key: "bonus",
        align: "right",
        className: "ant_table",
        render: (text, record, index) => {
          return (
            <FormattedNumber value={record.bonus} />
          );
        }
      }
    ];
    return column;
  };

  render() {
    let { match, intl } = this.props;
    let { total, loading, rangeTotal = 0, developers, modal } = this.state;
    let column = this.customizedColumn();
    return (
      <main className="container header-overlap pb-3 token_black">
        {modal}
        {loading && (
          <div className="loading-style">
            <TronLoader />
          </div>
        )}
        <div className="row">
          {/* {total ? (
            <p className="developers_reward_tip">
              {tu("developers_reward_tip")}
            </p>
          ) : (
            ""
          )} */}

          <div className="col-md-12">
            {/* {total ? (
              <div
                className="table_pos_info d-none d-md-block"
                style={{ left: "auto" }}
              >
                <div>
                  {tu("view_total")} {total} {tu("developers_account")}
                </div>
              </div>
            ) : (
              ""
            )} */}
            {/* <div className="table_pos_search" style={{ right: "15px" }}>
              <Search
                placeholder={intl.formatMessage({ id: "developers_search" })}
                enterButton={intl.formatMessage({ id: "search" })}
                size="large"
                onSearch={value => this.onSearchChange(value)}
              />
            </div> */}
            <div className="card table_pos table_pos_addr">
              <Table
                columns={column}
                rowKey={(record, index) => index}
                dataSource={developers}
                loading={loading}
                // onChange={this.handleTableChange}
                pagination={this.state.pagination}
                bordered={true}
                // rowClassName={(record, index) => {
                //   if (record.index < 6) {
                //     return "trc20-star-ad";
                //   }
                // }}
              />
            </div>
            {/* {total ? (
              <p className="developers_tip_bottom">{tu("developers_niTron")}</p>
            ) : (
              ""
            )} */}
          </div>
        </div>
      </main>
    );
  }
}

function mapStateToProps(state) {
  return {
    accounts: state.app.accounts
  };
}

const mapDispatchToProps = {
  loadAccounts
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(AwardList));
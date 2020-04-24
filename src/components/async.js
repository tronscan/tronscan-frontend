import React from "react";
import loadable from "@/utils/loadable";

export const StatisticsAsync = loadable(() =>
  import(/* webpackChunkName: "Stats" */ "./blockchain/Statistics/index.js")
);

export const SingleChartAsync = loadable(() =>
  import(
    /* webpackChunkName: "SingleStats" */ "./blockchain/Statistics/SingleChart.js"
  )
);

export const ChartsAsync = loadable(() =>
  import(
    /* webpackChunkName: "Charts" */ "./blockchain/Statistics/Charts.js"
  )
);

export const MarketsAsync = loadable(() =>
  import(/* webpackChunkName: "Markets" */ "./markets")
);

export const WalletWizardAsync = loadable(() =>
  import(/* webpackChunkName: "WalletWizard" */ "./wallet/Wizard")
);

export const VerifyContractCodeAsync = loadable(() =>
  import(
    /* webpackChunkName: "VerifyContractCode" */ "./tools/VerifyContractCode"
  )
);

export const TransactionViewerAsync = loadable(() =>
  import(
    /* webpackChunkName: "TransactionViewer" */ "./tools/TransactionViewer"
  )
);

export const VoteOverviewAsync = loadable(() =>
  import(/* webpackChunkName: "VoteOverview" */ "./voting/VoteOverview")
);

export const VoteLiveAsync = loadable(() =>
  import(/* webpackChunkName: "VoteLive" */ "./voting/VoteLive")
);

export const RepresentativesAsync = loadable(() =>
  import(
    /* webpackChunkName: "Representatives" */ "./representatives/Representatives"
  )
);

export const AccountAsync = loadable(() =>
  import(/* webpackChunkName: "Account" */ "./account/Account")
);

export const NodeTesterAsync = loadable(() =>
  import(/* webpackChunkName: "NodeTester" */ "./tools/NodeTester/index")
);

export const TronConvertToolAsync = loadable(() =>
  import(/* webpackChunkName: "TronConvertTool" */ "./tools/TronConvertTool")
);

export const SystemAsync = loadable(() =>
  import(/* webpackChunkName: "System" */ "./tools/System")
);

export const DemoAsync = loadable(() =>
  import(/* webpackChunkName: "DemoAsync" */ "./Demo")
);

export const FaqAsync = loadable(() =>
  import(/* webpackChunkName: "FaqAsync" */ "./Pages/Faq")
);

export const MyTokenAsync = loadable(() =>
  import(/* webpackChunkName: "MyToken" */ "./Pages/MyToken")
);

export const TRONRatingAsync = loadable(() =>
  import(/* webpackChunkName: "TRONRating" */ "./Pages/TRONRating")
);

export const CopyrightAsync = loadable(() =>
  import(/* webpackChunkName: "CopyrightAsync" */ "./Pages/Copyright")
);

export const LedgerHelpAsync = loadable(() =>
  import(/* webpackChunkName: "LedgerHelp" */ "./Pages/LedgerHelp")
);

export const TokenOverviewAsync = loadable(() =>
  import(/* webpackChunkName: "TokenOverview" */ "./tokens/Overview/index")
);

export const TokenListAsync = loadable(() =>
  import(/* webpackChunkName: "TokenList" */ "./tokens/Overview/TokenList")
);

export const TokenTRC20ListAsync = loadable(() =>
  import(
    /* webpackChunkName: "TokenListTRC20" */ "./tokens/Overview/TokenListTRC20"
  )
);

export const TokenAllAsync = loadable(() =>
  import(
    /* webpackChunkName: "TokenListAll" */ "./tokens/Overview/TokenListAll"
  )
);

export const TokensCreateAsync = loadable(() =>
  import(/* webpackChunkName: "TokensCreate" */ "./tokens/TokenCreate/index")
);

export const TokensMarketsCreateAsync = loadable(() =>
  import(/* webpackChunkName: "TokensCreate" */ "./markets/TokenCreate/index")
);

export const TokensMarketsAddListAsync = loadable(() =>
  import(/* webpackChunkName: "MarketCreate" */ "./markets/MarketCreate/index")
);

export const AccountsAsync = loadable(() =>
  import(/* webpackChunkName: "Accounts" */ "./Accounts")
);

export const DevelopersRewardAsync = loadable(() =>
  import(/* webpackChunkName: "Accounts" */ "./Pages/DevelopersReward")
);
export const FoundationAsync = loadable(() =>
  import(/* webpackChunkName: "Foundation" */ "./Foundation")
);
export const TopDataAsync = loadable(() =>
  import(/* webpackChunkName: "Foundation" */ "./Data/TopData/index")
);

export const NodesAsync = loadable(() =>
  import(/* webpackChunkName: "Nodes" */ "./network/Nodes")
);

export const LiveAsync = loadable(() =>
  import(/* webpackChunkName: "Live" */ "./blockchain/Live")
);

export const TokenDetailAsync = loadable(() =>
  import(/* webpackChunkName: "TokenDetail" */ "./tokens/TokenDetail/index")
);

export const Token20DetailAsync = loadable(() =>
  import(/* webpackChunkName: "Token20Detail" */ "./tokens/Token20Detail/index")
);

export const ProposalDetailAsync = loadable(() =>
  import(
    /* webpackChunkName: "ProposalDetail" */ "./committee/ProposalDetail/index"
  )
);

export const ContractCompilerAsync = loadable(() =>
  import(
    /* webpackChunkName: "ContractCompiler" */ "./blockchain/Compiler/index"
  )
);

export const AboutAsync = loadable(() =>
  import(/* webpackChunkName: "About" */ "./Pages/About")
);



export const HomeAsync = loadable(() =>
  import(/* webpackChunkName: "Home" */ "./Home")
);

export const SmartContract = loadable(() =>
  import(/* webpackChunkName: "SmartContract" */ "./blockchain/Contract")
);

export const Exchangetrc = loadable(() =>
  import(/* webpackChunkName: "Exchangetrc" */ "./exchange/index")
);

export const Representative = loadable(() =>
  import(
    /* webpackChunkName: "Representative" */ "./representatives/representative"
  )
);

export const BTTSupplyTemp = loadable(() =>
  import(
    /* webpackChunkName: "BTTSupplyTemp" */ "./tokens/TokenDetail/tempBtt.js"
  )
);

export const Block = loadable(() =>
  import(/* webpackChunkName: "Block" */ "./blockchain/Block")
);

export const Transaction = loadable(() =>
  import(/* webpackChunkName: "Transaction" */ "./blockchain/Transaction")
);

export const Address = loadable(() =>
  import(/* webpackChunkName: "Address" */ "./addresses/Address")
);

export const Blocks = loadable(() =>
  import(/* webpackChunkName: "Blocks" */ "./blockchain/Blocks")
);

export const Transactions = loadable(() =>
  import(/* webpackChunkName: "Transactions" */ "./blockchain/Transactions")
);

export const Transfers = loadable(() =>
  import(/* webpackChunkName: "Transfers" */ "./blockchain/Transfers")
);

export const Contracts = loadable(() =>
  import(/* webpackChunkName: "Contracts" */ "./blockchain/Contracts")
);

export const Notice = loadable(() =>
  import(/* webpackChunkName: "Notice" */ "./exchange/notice")
);

export const ContractTrans = loadable(() =>
  import(/* webpackChunkName: "ContractTrans" */ "./blockchain/ContractTrans")
);

export const Committee = loadable(() =>
  import(/* webpackChunkName: "Committee" */ "./committee/index")
);

export const Proposals = loadable(() =>
  import(/* webpackChunkName: "Proposals" */ "./committee/Proposals")
);
export const MyProposals = loadable(() =>
  import(/* webpackChunkName: "MyProposals" */ "./committee/MyProposals")
);
export const myParticipated = loadable(() =>
  import(/* webpackChunkName: "ParticipateProposals" */ "./committee/MyProposals/MyParticipated")
);


export const ProposalsCreateAsync = loadable(() =>
  import(/* webpackChunkName: "ProposalsCreate" */ "./committee/ProposalCreate/index")
);

export const ErrorAsync = loadable(() =>
  import(/* webpackChunkName: "ErrorAsync" */ "./Error")
);

export const Exchange20 = loadable(() =>
  import(/* webpackChunkName: "Exchange20" */ "./exchange/dex20/index")
);
export const ContractSourceCode = loadable(() =>
  import(
    /* webpackChunkName: "ContractSourceCode" */ "./blockchain/Contract/SourceCode"
  )
);

export const ContractUseServiceTerms = loadable(() =>
  import(
    /* webpackChunkName: "ContractSourceCode" */ "./blockchain/Contract/UseServiceTerms"
  )
);

export const ContractLicense = loadable(() =>
  import(
    /* webpackChunkName: "ContractSourceCode" */ "./blockchain/Contract/License"
  )
);

export const RatingRule = loadable(() =>
  import(
    /* webpackChunkName: "ContractSourceCode" */ "./tokens/RatingRule"
  )
);

export const AwardListAsync = loadable(() =>
  import(/* webpackChunkName: "AwardList" */ "./Pages/AwardList")
);


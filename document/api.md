# 1
**/api/system/status**
Desc: List data synchronization state
Demo: curl -X Get  https://apilist.tronscan.org/api/system/status
@param: null;
@return: data synchronization state;


# 2
**/api/block/latest**
Desc: Get the lastest block
Demo: curl -X Get  https://apilist.tronscan.org/api/block/latest
@param: null;
@return: the latest block;

# 3
**/api/account/list**
Desc: List all the accounts in the blockchain (only 10,000 accounts are displayed, sorted by TRX balance from high to low)
Demo: curl -X Get  https://apilist.tronscan.org/api/account/list?sort=-balance&limit=20&start=0&address=TMuA6YqfCeX8EhbfYEg5y7S4DqzSJireY9
@param sort: define the sequence of the records return;
@param limit: page size for pagination;
@param start: query index for pagination;
@param address: query address
@return: accounts list;

# 4
**/api/account**
Desc: Get a single account's detail
Demo: curl -X Get  https://apilist.tronscan.org/api/account?address=TWd4WrZ9wn84f5x1hZhL4DHvk738ns5jwb
@param address: an account;
@return: an account detail info;

# 5
**/api/block**
Desc: List the blocks in the blockchain(only display the latest 10,000 data records in the query time range)
Demo: curl -X Get  https://apilist.tronscan.org/api/block?sort=-number&limit=20&start=20&start_timestamp=1551715200000&end_timestamp=1551772172616
@param sort: define the sequence of the records return;
@param limit: page size for pagination;
@param start: query index for pagination;
@param count: total number of records;
@param start_timestamp: query date range;
@param end_timestamp: query date range;
@return: blocks list;

# 6
**/api/block**
Desc: List all the blocks produced by the specified SR in the blockchain
Demo: curl -X Get  https://apilist.tronscan.org/api/block?sort=-number&limit=20&count=true&start=0&producer=TMuA6YqfCeX8EhbfYEg5y7S4DqzSJireY9
@param sort: define the sequence of the records return;
@param limit: page size for pagination;
@param start: query index for pagination;
@param count: total number of records;
@param start_timestamp: query date range;
@param end_timestamp: query date range;
@param producer: SR address;
@return: blocks produced by the specified SR;

# 7
**/api/block**
Desc: Get a single block's detail
Demo: curl -X Get  https://apilist.tronscan.org/api/block?number=5987471
@param number: block number;
@return: a block detail info;

# 8
**/api/transaction**
Desc: List the transactions in the blockchain(only display the latest 10,000 data records in the query time range)
Demo: curl -X Get  https://apilist.tronscan.org/api/transaction?sort=-timestamp&count=true&limit=20&start=0&start_timestamp=1548000000000&end_timestamp=1548056638507
@param sort: define the sequence of the records return;
@param limit: page size for pagination;
@param start: query index for pagination;
@param count: total number of records;
@param start_timestamp: query date range;
@param end_timestamp: query date range;
@return: transactions list;

# 9
**/api/transaction**
Desc: List the transactions related to a specified account(only display the latest 2,000 data records in the query time range)
Demo: curl -X Get  https://apilist.tronscan.org/api/transaction?sort=-timestamp&count=true&limit=20&start=0&address=TMuA6YqfCeX8EhbfYEg5y7S4DqzSJireY9
@param sort: define the sequence of the records return;
@param limit: page size for pagination;
@param start: query index for pagination;
@param count: total number of records;
@param start_timestamp: query date range;
@param end_timestamp: query date range;
@param address: an account;
@return: transactions list;

# 10
**/api/contracts/transaction**
Desc: List the transactions related to an smart contract(only display the latest 2,000 data records in the query time range)  Demo: curl -X Get  https://apilist.tronscan.org/api/contracts/transaction?&limit=20&start=0&contract=TEEXEWrkMFKapSMJ6mErg39ELFKDqEs6w3&start_timestamp=1568798788872&end_timestamp=1569403588872
@param limit: page size for pagination;
@param start: query index for pagination;
@param start_timestamp: query date range;
@param end_timestamp: query date range;
@param contract: contract address;
@return: transactions list;

# 11
**/api/transaction-info**
Desc: List a transaction detail
Demo: curl -X Get  https://apilist.tronscan.org/api/transaction-info?hash=1c25bc75d0bebac2f3aa71c350d67c4eed56ec2501b72302ae6d0110dc40cf96
@param hash: query transaction hash;
@return: a transaction detail info;

# 12
**/api/transfer**
Desc: List the transfers in the blockchain(only display the latest 10,000 data records in the query time range)
Demo: curl -X Get  https://apilist.tronscan.org/api/transfer?sort=-timestamp&count=true&limit=20&start=0&start_timestamp=1548000000000&end_timestamp=1548057645667
@param sort: define the sequence of the records return;
@param limit: page size for pagination;
@param start: query index for pagination;
@param count: total number of records;
@param start_timestamp: query date range;
@param end_timestamp: query date range;
@return: all the transfers list;

# 13
**/api/transfer**
Desc: List the transfers related to an specified account(only display the latest 2,000 data records in the query time range)
Demo: curl -X Get  https://apilist.tronscan.org/api/transfer?sort=-timestamp&count=true&limit=20&start=0&token=_&address=TMuA6YqfCeX8EhbfYEg5y7S4DqzSJireY9
@param sort: define the sequence of the records return;
@param limit: page size for pagination;
@param start: query index for pagination;
@param count: total number of records;
@param start_timestamp: query date range;
@param end_timestamp: query date range;
@param token: '_' shows only TRX transfers;
@param address: transfers related address;
@return: transfers list related to an specified account;

# 14
**/api/nodemap**
Desc: List all the nodes in the blockchain
Demo: curl -X Get  https://apilist.tronscan.org/api/nodemap
@param: null;
@return: all the nodes;

# 15
**/api/listdonators**
Desc: List all the donators to the foundation address
Demo: curl -X Get  https://apilist.tronscan.org/api/listdonators
@param: null;
@return: all the donators;

# 16
**/api/fund**
Desc: List all the foundation addresses
Demo: curl -X Get  https://apilist.tronscan.org/api/fund?page_index=1&per_page=20
@param page_index: query index for pagination;
@param per_page: page size for pagination;
@return: all the foundation addresses and balance;

# 17
**/api/funds**
Desc: List TRX number overview info
Demo: curl -X Get  https://apilist.tronscan.org/api/funds
@param: null;
@return: TRX number overview info;

# 18
**/api/contracts**
Desc: List all the contracts in the blockchain
Demo: curl -X Get  https://apilist.tronscan.org/api/contracts?count=true&limit=20&start=0&sort=-timestamp&start_timestamp=1568884835489&end_timestamp=1569489635489
@param limit: page size for pagination;
@param start: query index for pagination;
@param count: total number of records;
@param start_timestamp: query date range;
@param end_timestamp: query date range;
@param sort: define the sequence of the records return;
@return: contracts list;

# 19
**/api/contract**
Desc: Get a single contract's detail
Demo: curl -X Get  https://apilist.tronscan.org/api/contract?contract=TEEXEWrkMFKapSMJ6mErg39ELFKDqEs6w3
@param contract: contract address;
@return: a contract detail info;

# 20
**/api/contracts/code**
Desc: Get a single contract's abi & byteCode
Demo: curl -X Get  https://apilist.tronscan.org/api/contracts/code?contract=TEEXEWrkMFKapSMJ6mErg39ELFKDqEs6w3
@param contract: contract address;
@return: a single contract's abi & byteCode;

# 21
**/api/contracts/trigger**
Desc: List all the triggers of the contracts in the blockchain(only display the latest 10,000 data records in the query time range)
Demo: curl -X Get  https://apilist.tronscan.org/api/contracts/trigger?limit=20&start=0&start_timestamp=1529856000000&end_timestamp=1569490226162
@param limit: page size for pagination;
@param start: query index for pagination;
@param start_timestamp: query date range;
@param end_timestamp: query date range;
@return: all contracts' trigger detail;

# 22
**/api/tokens/overview**
Desc: List all the tokens in the blockchain (including trc10 and trc20 tokens)
Demo: curl -X Get  https://apilist.tronscan.org/api/tokens/overview?start=0&limit=20&order=desc&filter=all&sort=volume24hInTrx&order_current=descend
@param limit: page size for pagination;
@param start: query index for pagination;
@param order: define the sequence order of the records return;
@param start_timestamp: query date range;
@param end_timestamp: query date range;
@param sort: define the sorting rule;
@param filter: define the tokens return. "trc10" for trc10 tokens, "trc20" for trc20 tokens; "all" for all trc10 and trc20 tokens
@return: tokens list;

# 23
**/api/token_trc20**
Desc: List a single trc20 token's detail
Demo: curl -X Get  https://apilist.tronscan.org/api/token_trc20?contract=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t&showAll=1
@param contract: token address
@return: a single trc20 token's detail;

# 24
**/api/token**
Desc: List a single trc10 token's detail
Demo: curl -X Get  https://apilist.tronscan.org/api/token?id=1001761&showAll=1
@param id: token id;
@param showAll: if equals 1, audited and Unaudited tokens can both be returned;
@return: a single trc10 token's detail;

# 25
**/api/witness**
Desc: List all the witnesses in the blockchain
Demo: curl -X Get  https://apilist.tronscan.org/api/witness
@param: null;
@return: all the witnesses in the blockchain;

# 26
**/api/vote/witness**
Desc: List all the votes info of the witnesses
Demo: curl -X Get  https://apilist.tronscan.org/api/vote/witness
@param: null;
@return: all the votes info of the witnesses;

# 27
**/api/vote**
Desc: List all the votes info made by a specified voter
Demo: curl -X Get  https://apilist.tronscan.org/api/vote?sort=-votes&limit=20&start=0&voter=TMuA6YqfCeX8EhbfYEg5y7S4DqzSJireY9
@param sort: define the sequence of the records return;
@param limit: page size for pagination;
@param start: query index for pagination;
@param voter: an voter account;
@return: all the votes info made by a specified voter;

# 28
**/api/vote**
Desc: List all the voters that vote for a specified candidate
Demo: curl -X Get  https://apilist.tronscan.org/api/vote?sort=-votes&limit=20&start=0&candidate=TGzz8gjYiYRqpfmDwnLxfgPuLVNmpCswVp
@param sort: define the sequence of the records return;
@param limit: page size for pagination;
@param start: query index for pagination;
@param candidate: an witness account;
@return: all the voters that vote for a specified candidate;

# 29
**/api/chainparameters**
Desc: List all the proposal parameters
Demo: curl -X Get  https://apilist.tronscan.org/api/chainparameters
@param: null;
@return: all the proposal parameters;

# 30
**/api/proposal**
Desc: List all the proposals in the blockchain
Demo: curl -X Get  https://apilist.tronscan.org/api/proposal?sort=-number&limit=20&start=0
@param sort: define the sequence of the records return;
@param limit: page size for pagination;
@param start: query index for pagination;
@return: all the proposals;

# 31
**/api/proposal**
Desc: List a single proposal detail
Demo: curl -X Get  https://apilist.tronscan.org/api/proposal?id=16
@param id: proposal id;
@return: a single proposal detail info;

# 32
**/api/exchanges/list**
Desc: List all the audited exchange pairs
Demo: curl -X Get  https://apilist.tronscan.org/api/exchanges/list
@param: null;
@return: all the audited exchange pairs;

# 33
**/api/exchanges/listall**
Desc: List all the exchange pairs in the blockchain
Demo: curl -X Get  https://apilist.tronscan.org/api/exchanges/listall
@param: null;
@return: all the exchange pairs;

# 34
**/api/exchange/transaction**
Desc: List a single the exchange pair's transaction records
Demo: curl -X Get  https://apilist.tronscan.org/api/exchange/transaction?sort=-timestamp&start=0&limit=15&exchangeID=9&address=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t&start_timestamp=1529856000000&end_timestamp=1569490226162
@param sort: define the sequence of the records return;
@param limit: page size for pagination;
@param start: query index for pagination;
@param exchangeID: exchange id;
@param address: query address;
@param start_timestamp: query date range;
@param end_timestamp: query date range;
@return: a single the exchange pair's transaction records;

# 35
**/api/exchange/kgraph**
Desc: List a single the exchange pair's trade chart data
Demo: curl -X Get  https://apilist.tronscan.org/api/exchange/kgraph?exchange_id=9&granularity=1h&time_start=1547510400&time_end=1548062933
@param start_timestamp: query date range;
@param end_timestamp: query date range;
@param granularity: data statistics time interval;
@param exchange_id: exchange id;
@return: a single the exchange pair's trade chart data;

# 36
**/api/stats/overview**
Desc: Blockchain data overview in history
Demo: curl -X Get  https://apilist.tronscan.org/api/stats/overview?days=2
@param days: days of statistic data, default 15
@return: list of avgBlockTime, blockchainSize, newAddressSeen, newBlockSeen, newTransactionSeen, totalAddress, totalBlockCount, totalTransaction;

# 37
**/api/broadcast**
Desc: Broadcast a transaction to the blockchain
Demo: curl -X Post  https://apilist.tronscan.org/api/broadcast
@param: transaction: signature generated hex;
@return: broadcast result;

# 38
**/api/contract/events**
Desc: List the TRC-20 transfers related to a specified account(only display the latest 10,000 data records in the query time range)
Demo: curl -X Get  https://apilist.tronscan.org/api/contract/events?address=TSbJFbH8sSayRFMavwohY2P6QfKwQEWcaz&start=0&limit=20&start_timestamp=1529856000000&end_timestamp=1569490226162&contract=TNisVGhbxrJiEHyYUMPxRzgytUtGM7vssZ
@param limit: page size for pagination;
@param start: query index for pagination;
@param start_timestamp: query date range;
@param end_timestamp: query date range;
@param address: an account;
@param contract: contractaddress
@return: TRC-20 transfers list;

# 39
**/api/internal-transaction**
Desc: List the internal transactions related to a specified contract (only display the latest 2,000 data records in the query time range)
Demo: curl -X Get  https://apilist.tronscan.org/api/internal-transaction?limit=20&start=0&contract=TWmhXhXjgXTj87trBufmWFuXtQP8sCWZZV&start_timestamp=1529856000000&end_timestamp=1552549684954
@param limit: page size for pagination;
@param start: query index for pagination;
@param start_timestamp: query date range;
@param end_timestamp: query date range;
@param contract: contract address;
@return: contract internal transactions list;

# 40
**/api/internal-transaction**
Desc: List the internal transactions related to a specified account (only display the latest 2,000 data records in the query time range)
Demo: curl -X Get  https://apilist.tronscan.org/api/internal-transaction?limit=20&start=0&address=TBTzh1N24TUinHHrnxZoAv7ouWrNe6M9n2&start_timestamp=1529856000000&end_timestamp=1552549684954
@param limit: page size for pagination;
@param start: query index for pagination;
@param start_timestamp: query date range;
@param end_timestamp: query date range;
@param address: an account;
@return: internal transactions list;

# 41
**/api/asset/transfer**
Desc: List the transfers related to a specified TRC10 token(only display the latest 2,000 data records in the query time range)
Demo: curl -X Get  https://apilist.tronscan.org/api/asset/transfer?limit=20&start=0&name=IGG&issueAddress=TSbhZijH2t7Qn1UAHAu7PBHQdVAvRwSyYr&start_timestamp=1529856000000&end_timestamp=1552549912537
@param limit: page size for pagination;
@param start: query index for pagination;
@param name: token name;
@param issueAddress: token creation address;
@param start_timestamp: query date range;
@param end_timestamp: query date range;
@return: TRC10 token transfers list;

# 42
**/api/token_trc20/transfers**
Desc: List the transfers related to a specified TRC20 token(only display the latest 2,000 data records in the query time range)
Demo: curl -X Get  https://apilist.tronscan.org/api/token_trc20/transfers?limit=20&start=0&contract_address=TCN77KWWyUyi2A4Cu7vrh5dnmRyvUuME1E&start_timestamp=1529856000000&end_timestamp=1552550375474
@param limit: page size for pagination;
@param start: query index for pagination;
@param contract_address: contract address;
@param start_timestamp: query date range;
@param end_timestamp: query date range;
@return: TRC20 token transfers list;


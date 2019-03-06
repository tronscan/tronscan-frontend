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
Desc: List all the accounts in the blockchain  
Demo: curl -X Get  https://apilist.tronscan.org/api/account/list?sort=-balance&limit=20&start=0  
@param sort: define the sequence of the records return;  
@param limit: page size for pagination;  
@param start: query index for pagination;  
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
Demo: curl -X Get  https://apilist.tronscan.org/api/block?sort=-number&limit=20&count=true&start=0  
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
Desc: List the transactions in the blockchain(only support 7 days data query)  
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
Desc: List the transactions related to a specified account  
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
Desc: List the transactions related to an smart contract(only support 7 days data query)  
Demo: curl -X Get  https://apilist.tronscan.org/api/contracts/transaction?sort=-timestamp&count=true&limit=20&start=0&contract=TGfbkJww3x5cb9u4ekLtZ9hXvJo48nUSi4  
@param sort: define the sequence of the records return;  
@param limit: page size for pagination;  
@param start: query index for pagination;  
@param count: total number of records;  
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
Desc: List the transfers in the blockchain(only support 7 days data query)  
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
Desc: List the transfers related to an specified account  
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
@return: all the foundation addresses;  

# 17
**/api/funds**  
Desc: List TRX number overview info  
Demo: curl -X Get  https://apilist.tronscan.org/api/funds  
@param: null;  
@return: TRX number overview info;  

# 18
**/api/contracts**  
Desc: List all the contracts in the blockchain  
Demo: curl -X Get  https://apilist.tronscan.org/api/contracts?count=true&limit=20&start=0  
@param limit: page size for pagination;  
@param start: query index for pagination;  
@param count: total number of records;  
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
Desc: List all the triggers of the contracts in the blockchain(only support 7 days data query)  
Demo: curl -X Get  https://apilist.tronscan.org/api/contracts/trigger?sort=-timestamp&count=true&limit=20&start=0&start_timestamp=1548000000000&end_timestamp=1548060167540  
@param sort: define the sequence of the records return;  
@param limit: page size for pagination;  
@param start: query index for pagination;  
@param count: total number of records;  
@param start_timestamp: query date range;  
@param end_timestamp: query date range;  
@return: a single contract's trigger detail;  

# 22
**/api/token_trc20**  
Desc: List all the trc20 tokens in the blockchain  
Demo: curl -X Get  https://apilist.tronscan.org/api/token_trc20?sort=issue_time&limit=20&start=0  
@param sort: define the sequence of the records return;  
@param limit: page size for pagination;  
@param start: query index for pagination;  
@return: trc20 tokens list;  

# 23
**/api/token**  
Desc: List all the trc10 tokens in the blockchain  
Demo: curl -X Get  https://apilist.tronscan.org/api/token?sort=-name&limit=20&start=0&totalAll=1&status=ico  
@param sort: define the sequence of the records return;  
@param limit: page size for pagination;  
@param start: query index for pagination;  
@param totalAll: the total number of the trc10 tokens(audited and Unaudited tokens both included);  
@param status: if equals 'ico', only returns the tokens that can be participated;  
@return: trc10 tokens list(only audited tokens);  

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
Demo: curl -X Get  https://apilist.tronscan.org/api/exchanges/list?sort=-balance  
@param sort: define the sequence of the records return;  
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
Demo: curl -X Get  https://apilist.tronscan.org/api/exchange/transaction?sort=-timestamp&start=0&limit=15&exchangeID=9  
@param sort: define the sequence of the records return;  
@param limit: page size for pagination;  
@param start: query index for pagination;  
@param exchangeID: exchange id;  
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
**/api/exchange/kgraph**  
Desc: List a single the exchange pair's trade chart data  
Demo: curl -X Get  https://apilist.tronscan.org/api/exchange/kgraph?exchange_id=9&granularity=1h&time_start=1547510400&time_end=1548062933  
@param start_timestamp: query date range;  
@param end_timestamp: query date range;  
@param granularity: data statistics time interval;  
@param exchange_id: exchange id;  
@return: a single the exchange pair's trade chart data;  

# 37
**/api/stats/overview**  
Desc: Blockchain data overview in history  
Demo: curl -X Get  https://apilist.tronscan.org/api/stats/overview  
@param: null;  
@return: list of avgBlockTime, blockchainSize, newAddressSeen, newBlockSeen, newTransactionSeen, totalAddress, totalBlockCount, totalTransaction;  

# 38
**/api/broadcast**  
Desc: Broadcast a transaction to the blockchain  
Demo: curl -X Post  https://apilist.tronscan.org/api/broadcast  
@param: null;  
@return: broadcast result;  

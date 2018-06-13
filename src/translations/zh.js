
export const messages = {
/*
##################################################################################
#                                                                                #
#  $$$$$$$$\                                                                     #
#  \__$$  __|                                                                    #
#     $$ | $$$$$$\   $$$$$$\  $$$$$$$\   $$$$$$$\  $$$$$$$\$$$$$$\  $$$$$$$\     #
#     $$ |$$  __$$\ $$  __$$\ $$  __$$\ $$  _____|$$  _____\____$$\ $$  __$$\    #
#     $$ |$$ |  \__|$$ /  $$ |$$ |  $$ |\$$$$$$\  $$ /     $$$$$$$ |$$ |  $$ |   #
#     $$ |$$ |      $$ |  $$ |$$ |  $$ | \____$$\ $$ |    $$  __$$ |$$ |  $$ |   #
#     $$ |$$ |      \$$$$$$  |$$ |  $$ |$$$$$$$  |\$$$$$$$\$$$$$$$ |$$ |  $$ |   #
#     \__|\__|       \______/ \__|  \__|\_______/  \_______\_______|\__|  \__    #
#                                                                                #
##################################################################################
#                                                                                #
#         Template for translating the tronscan.org website                      #
#         Version: 1.3-13062018-1                                                #
#         Update Date: 13.06.2018                                                #
#         Language: Chinese                                                      #
#         Status: Second Draft                                                   #
#         Number of checks: 2                                                    #
#                                                                                #
##################################################################################
#                                                                                #
# description and structure of the template                                      #
#                                                                                #
# "<name of the variable>": "<corresponding translation>"                        #
#                                                                                #
# Note: please concentrate only on the value <corresponding translation>         #
#                                                                                #
##################################################################################
#                                                                                #
# global section                                                                 #
#                                                                                #
##################################################################################
*/
    // button description - OK (confirm)
    "ok": "确定",
    // title - Tron protocol
    "app_title": "波场协议",
    // description of an input field  (enter the password)
    "password": "密码",
    // description of a display field - price
    "money_price": "价格",
    // description of a display field - price
    "price": "价格",
    // blockchain -> blocks - plural
    "blocks": "区块",
    // blockchain -> block - singular
    "block": "区块",
    // description of a display field - name
    "name": "名称",
    // website
    "website": "网址",
    // Tron TRX address eg. TScGuWDzgLD2...opywfkDMCh77
    "address": "地址",
    // button description - sign out (account)
    "sign_out": "退出",
    // button description - sign in (account)
    "sign_in": "登录",
    // button description - Register / Log-in (account)
    "register_login": "注册 / 登录",
    // button description - Register (account)
    "register": "注册",
    // button description - Login (account)
    "login": "登录",
    // row description - height/size of a block
    "height": "高度",
    // row description - age of the block
    "age": "年龄",
    // row description - size of the block (bytes)
    "bytes": "字节",
    // row description - eg. produced by XXX
    "produced by": "出块者",
    // row description - which contract is assigned
    "contract": "合约",
    // text module (send XXX from ...to)
    "from": "发送人",
    // text module (send XXX from ...to)
    "to": "接收人",
    // userfield description
    "value": "价值",
    // statistic informations (total number of accounts)
    "total_accounts": "总账户数量",
    // button description - submit (confirm)
    "submit": "提交",
    // button description - send trx
    "send": "发送",
    // button description - receive trx
    "receive": "接收",
    // button description - supply
    "supply": "持有量",
    // button description - to view more informations
    "view": "查看",
    // button description - to view all informations
    "view_all": "查看全部",
    // button description - to create an account or token
    "create": "创建",
    // information field - country
    "country": "地区",
    // field description - eg. amout: 20 trx
    "amount": "数额",
    // button description (to show the own votes)
    "my_vote": "我的投票",
    // button description (to submit the vote)
    "submit_votes": "确认投票",
    // subtitle - statistic information - accounts(plural)
    "accounts": "账户",
    // description - created
    "created": "创建时间",
    // description field - name of the exchange
    "exchange": "交易所",
    // button description - next (go to the next step)
    "next": "下一步",
    // infomessage - button action message -> Copied to clipboard
    "copied_to_clipboard": "已复制到剪贴板",
    // button description - Cancel
    "cancel": "取消",
    // button description - Reset
    "reset": "清零",
    // error message title - Error
    "error": "错误",

/*
##################################################################################
#                                                                                #
# navigation section                                                             #
#                                                                                #
##################################################################################
*/
    // navigation bar -> topic - Blockchain
    "blockchain": "区块链",
    // navigation bar -> topic - Wallet
    "wallet": "钱包",
    // navigation bar -> topic - Home (main page)
    "home": "主页",
    // navigation bar -> topic - Transfers
    "transfers": "转账",
    // navigation bar -> topic - Live (view live information, current transfers)
    "live": "实时",
    // navigation bar -> topic - Statistics (statistic informations)
    "statistics": "数据",
    // navigation bar -> topic - "Markets" (trx exchanges and current prices)
    "markets": "市场信息",
    // navigation bar -> topic - Tools
    "tools": "工具",
    // navigation bar -> topic - Transaction Viewer (tool to get transaction informations)
    "transaction_viewer": "查看交易",
    // navigation bar -> topic - Node Tester (tool to test the tron node connectivity)
    "node_tester": "测试节点",
    // navigation bar -> topic - System (blockchain informationen)
    "system": "系统",
    // navigation bar -> topic News (to get current informations about tron and tronscan)
    "news": "新闻",
    // navigation bar -> topic - Help (report a bug and view the documentation)
    "help": "帮助",
    // navigation bar -> topic - Nodes (infomations about the active tron nodes)
    "nodes": "节点",
    // navigation bar -> topic - Votes (area to vote a SR)
    "votes": "投票",
    // navigation bar -> topic - Account (personal account area)
    "account": "账户",
    // navigation bar -> tokens
    "tokens": "通证",
    // navigation bar -> topic - Token->Overview (get an overview of the tokens)
    "overview": "概况",
    // navigation bar -> topic - Participate (buy a token)
    "participate": "参与",

/*
##################################################################################
#                                                                                #
# home dashboard                                                                 #
#                                                                                #
##################################################################################
*/
    // title of the main page
    "tron_main_message": "去中心化网络",
    // subtitle - realtime information - how many transactions last hour
    "transactions_last_hour": "过去一小时交易量",
    // subtitle - realtime information - current block height
    "block_height": "区块高度",
    // subtitle - realtime information - how many online nodes
    "online_nodes": "线上节点",
    // subtitle - realtime information - current price per 1000 trx
    "pice_per_1000trx": "价格（每1000TRX）",
    // hyperlink description - to vote for the super representatives
    "vote_for_super_representatives": "为超级代表投票",
    // hyperlink description - to view the super representatives
    "view_super_representatives": "查看超级代表",
    // hyperlink description - to create a new wallet
    "create_new_wallet": "创建新钱包",
    // hyperlink description - to view the tokens
    "view_tokens": "查看通证",

/*
##################################################################################
#                                                                                #
# tableinformations and statistics                                               #
#                                                                                #
##################################################################################
*/
    // button description -> table navigation -> first page
    "first_page": "第一页",
    // button description -> table navigation -> previous page
    "previous_page": "上一页",
    // button description -> table navigation -> next page
    "next_page": "下一页",
    // button description -> table navigation -> last page
    "last_page": "尾页",
    // table description -> Page 2 of 3
    "page": "第",
    // table description -> Page 2 of 3
    "of": "共",
    // information field - statistics - in which country are the most nodes e.g. USA ... Most Nodes
    "most_nodes": "最多节点",
    // status message - loading informations - loading Node informations
    "loading_nodes": "加载中节点",
    // table information - row title (hostname->Node)
    "Hostname": "主机名",
    // table information - row title (last update from tron node)
    "Last Update": "最近一次更新",
    // status message - waiting for syncing the first node
    "first_node_sync_message": "等待第一次节点同步，请几分钟后再次尝试。",
    // table information - row title - statistics -  last created block (blockchain)
    "last_block": "上一区块",
    // table information - row title - statistics - Blocks Produced (blockchain)
    "blocks_produced": "出块数量",
     // table information - row title - statistics - Blocks Missed (blockchain)
    "blocks_missed": "丢失区块数量",
    // table information - row title - statistics - productivity
    "productivity": "效率",
    // table information - row title - statistics - rewards
    "rewards": "奖励",

/*
##################################################################################
#                                                                                #
# blockchain - statistics                                                        #
#                                                                                #
##################################################################################
*/
    // subtitle - statistic information eg. diagram -> top 25 addresses
    "addresses": "地址",
    // subtitle - statistic information eg. diagram -> TRX transferred in the past hour
    "trx_transferred_past_hour": "过去一小时TRX转账额",
    // subtitle - statistic information eg. diagram -> Transactions in the past hour
    "transactions_past_hour": "过去一小时交易数目",
    // subtitle - statistic information eg. diagram -> Average Block Size
    "average_blocksize": "平均区块大小",
    // table header
    "rich_list": "富豪榜",

/*
##################################################################################
#                                                                                #
# account section                                                                #
#                                                                                #
##################################################################################
*/
    // title/headline of the form
    "set_name": "设置名称",
    // statusmessage
    "unique_account_message": "You may only set your account name once!",
    // button description
    "change_name": "Change Name",
    // placeholder message
    "account_name": "Account Name",
    // button description
    "show_qr_code": "显示二维码",
    // infomessage for the user
    "do_not_send_2": "请勿使用您的钱包或通过交易所对以上测试网地址转账",
    // subtitle - statistic information eg. 2 Bandwidth
    "bandwidth": "带宽",
    // subtitle - statistic information eg. 5 Balance
    "balance": "余额",
    // subtitle - statistic information eg. 100 Tron Power
    "tron_power": "Tron Power",
    // title/headline of the table
    "transactions": "交易",
    // infomessage - no transfers have been made yet
    "no_transfers": "无转账",
    // infomessage - no tokens present
    "no_tokens": "无通证",
    // subtitle - statistic information eg. 2  Free Bandwidth
    "free_bandwidth": "免费带宽",
    // field name - expires
    "expires": "失效",
    // infomessage - receive trx eg. 10 trx have been added to your account!
    "have_been_added_to_your_account": "已添加至账户！",
    // infomessage - Testnet informessage - receive 10000 TRX for testing
    "information_message_1": "申请TRX后，您可以领取10000TRX，用于在测试网进行测试。",
    // infomessage - Testnet informessage - limitation
    "information_message_2": "每个账户只能领取10次TRX.",
    // button description - Request TRX for testing
    "request_trx_for_testing": "申请测试TRX",
    // information - token balances
    "token_balances": "通证余额",
    // tableinformation - row name - produced blocks
    "produced_blocks": "出块数目",
    // tableinformation - row name - voters
    "voters": "选民",
    // statusinformation -  progress
    "progress": "进展",
    // statusinformation - transaction
    "transactions_count": "{transactions, plural, one {transaction} other {transactions}}",
     // tableinformation - row name - issuer
    "issuer": "发行者",
    // tableinformation - row name - network
    "network": "网络",
    // tableinformation - row name - current
    "current": "当前",
    // button description to receive test trx
    "trx_received": "已接收TRX",
    // errormessage - TRX for testing temporarily unavailable
    "test_trx_temporarily_unavailable_message": "暂时无法领取测试TRX,请稍后再试。",
    // errormessage - Not enough TRX to freeze
    "not_enough_trx": "TRX余额不足",
    // address title -> receive trx - TRX address
    "send_to_following_address": "对以下地址转账",

/*
##################################################################################
#                                                                                #
# account freeze                                                                 #
#                                                                                #
##################################################################################
*/
    // button description - to freeze trx
    "freeze": "冻结",
    // button description - to unfreez trx
    "unfreeze": "解冻",
    // infomessage - description
    "freeze_trx_least": "至少需要1TRX才能成功冻结。",
    // errormessage - message text
    "unable_unfreeze_trx_message": "解冻失败，可能尚未达到最低冻结期限。",
    // infomessage - text module 1
    "freeze_trx_premessage_0": `再次冻结/锁定TRX获得Tron Power并解锁其他功能。例如，使用Tron Power可以为超级代表投票。`,
    // link - text module 1
    "freeze_trx_premessage_link": "为超级代表投票。",
    // infomessage - text module 1 - I confirm to freeze XXX trx for at least of 3 days
    "freeze_trx_premessage_1": ` 冻结通证将会被“锁定”三天，在此期间冻结的TRX不能用于交易，三天过后可以解冻TRX并正常用于交易。`,
    // input field description
    "trx_amount": "TRX数额",
    // infomessage - text module 1 - I confirm to freeze XXX trx for at least of 3 days
    "token_freeze_confirm_message_0": "确认冻结",
    // infomessage - text module 2 - I confirm to freeze XXX trx for at least of 3 days
    "token_freeze_confirm_message_1": "至少3天",
    // table title - Frozen Supply
    "frozen_supply": "冻结数额",

/*
##################################################################################
#                                                                                #
# account superdelegates                                                         #
#                                                                                #
##################################################################################
*/
	// button description - apply for delegate
	"apply_for_delegate": "申请成为超级代表",
	// button description - Apply to be a Super Representative Candidate
	"apply_super_representative_candidate": "申请成为超级代表候选人",
	// inputfield description - Homepage
	"your_personal_website_address": "个人网页地址",
	// infomessage - predescription
	"apply_for_delegate_predescription": `每个代币持有者都有机会成为TRON超级代表。然而，为了让网络和社区更加平稳有效地运作，我们制定了一套标准和规定，让符合条件的候选人成为超级代表推荐人。我们以推荐超级代表的形式，增加他们当选的机会。新推荐的超级代表每周更新并发布一次。`,
	// infomessage - description
	"apply_for_delegate_description": `每个代币持有者都可以通过账户管理页面，申请成为超级代表，或是为候选人投票。每个账户均可以更新投票人信息，可以为多个候选人投票。用户的最高投票数必须少于或者等于持有TRX的数量。（如果持有一定数量的TRX，投票数量则小于或等于相应的TRX数量。）投票结果以每名用户最终投票结果为准，每轮投票时间为00：00至24：00。票数最高的用户可以成为超级代表。波场网络中每个交易都需要经由所有超级代表验证，超级代表可以获得一定奖励。申请超级代表及为其投票不消耗TRX。`,
	// errormessage - an unknown error occurred
	"unknown_error": "发生未知错误",
	// confirm - message
	"representative_understand": "我已了解如何成为波场超级代表",
	// button description - create address and password
	"generate_account": "点击生成账户密码及地址",
	// confirm message - part 1
	"create_account_confirm_1": "我已了解如果忘记或丢失密码，将不能登录账户查看资产。",
	// confirm message - part 2
	"create_account_confirm_2": "我已了解如果忘记或丢失密码，没有任何方式可以找回。",
	// confirm message - part 3
	"create_account_confirm_3": "我已经手写记录下密码。",
	// confirm message - submitting the vote
	"vote_thanks": "感谢您的投票！",
	"recent_transactions": "近期交易",
	"newest_account": "最新账户",
	"representatives": "超级代表",
	"most_votes": "最高得票",
	"start_end_time": "开始/结束时间",
	"scan_qr_code": "扫描二维码",
	"receive_trx": "接收TRX",
	"require_account_to_send": "发送TRX请先登录账户",
	"require_account_to_receive": "接收TRX请先登录账户",
	"successful_send": "转账成功！",
	"confirm_transaction": "确认交易",
	"last_confirmed": "最终确定",
	"trx_produced": "生成交易数量",
	"do_not_send_1": "请勿通过钱包或交易所对测试网地址转账！",
	// button description - Go to votelist
	"go_to_votelist": "前往投票列表",

/*
##################################################################################
#                                                                                #
# token creation formular                                                        #
#                                                                                #
##################################################################################
*/
	// description of an input field - Name of the token
	"name_of_the_token": "通证名称",
	// longdescription - additional userinfo - Name of the token
	"token_message": "通证名称",
	// description of an input field - token Abbreviation
	"token_abbr": "通证缩写",
	// longdescription - additional userinfo - token Abbreviation
	"abbr_message": "通证缩写",
	// field information - statistics - total supply of trx
	"total_supply": "发行量",
	// field information - issued token
	"issued_token": "已发行通证",
	// button description - Create Token
	"create_token": "发行通证",
	// description of an input field - Description
	"description": "描述",
	// description of an input field -  Description URL
	"description_url": "网站URL",
	// field information - Quote Token Amount
	"quote_token_amount": "二级通证数额",
	// field information - Base Token Amount
	"base_token_amount": "基本通证数额",
	// statusmessage - Creating a token
	"creating_a_token": "发行通证",
	// field information - available
	"available": "可供购买",
	// title - Testnet
	"testnet": "测试网",
	"days_to_freeze": "冻结天数",
	"trx_token_fee_message": "发行新通证将花费1024TRX",
	"trx_token_account_limit": "每个账户只能发行1种通证",
	"trx_token_wallet_requirement": "发行通证需要首先打开钱包",
	"invalid_address": "无效地址",
	"insufficient_tokens": "通证不足",
	"fill_a_valid_number": "Please fill a valid number",
	"fill_a_valid_address": "Please fill a valid address",
	"make_another_transaction": "发起其他交易",
	"token_exchange_confirm": "确认花费 {trx数额} 用于认购通证,总计获得{通证数额} 个代币.",
	"An_unknown_error_occurred,_please_try_again_in_a_few_minutes": "发生未知错误，请几分钟后再次尝试",
	"An_error_occurred": "发生错误",
	"create_a_token": "发行通证",
	"not_started_yet": "尚未开始",
	"participated": "成功参与通证发行！",
	"participated_error": "发生错误",

/*
##################################################################################
#                                                                                #
# token participate                                                              #
#                                                                                #
##################################################################################
*/
    // messagedialog - title
    "buy_confirm_message_0": "是否确定购买？",
    // messagedialog - maintext
    "how_much_buy_message": "您想购买多少数量的通证？",
    // infomessage - text module 1 - Are you sure you want to buy 1 <Tokenname> for 1 TRX
    "buy_confirm_message_1": "是否确定要购买通证",
    // infomessage - text module 1 - Are you sure you want to buy 1 <Tokenname> for 1 TRX
    "for": "共计",

/*
##################################################################################
#                                                                                #
# global messages                                                                #
#                                                                                #
##################################################################################
*/
	// error message - incorrect trx address
	"address_warning": "请输入正确的波场钱包地址，输入错误地址可能造成损失。",
	// statusmessage - search for address or URL
	"search_address_or_url": "查询地址或URL",
	// statusmessage
	"the_lunch_test": "上线测试网的目的在于测试区块浏览器以及钱包的所有功能。",
	// statusmessage
	"please_keep_in_mind": "请注意，您注册的账户地址只用于测试网，请勿通过钱包或交易所向测试网地址进行转账。",
	// statusmessage - title
	"tron_foundation": "波场基金会",
	// statusmessage
	"trx_for_testing": "在账户管理页面成功申请后，TRX将发送至您的测试账户。",
	// statusmessage
	"dear_users": "亲爱的用户,",
	// field information  - fin
	"finished": "结束",
	// field information  - token
	"token": "通证",
	// field information  - website url
	"url": "url",
	// infomessage - loggin is required
	"need_to_login": "查看账户页面请先登录账户",
	// confirm message - Thanks for applying!
	"thanks_for_applying": "感谢您的申请！",
	// errormessage - To many votes
	"to_much_votes": "票数过多",
	// errormessage - No TRX remaining
	"no_trx_remaining": "无TRX余额",
	// statusmessage - Produced by TRX address
	"produced_by": "出块者：{超级代表地址}",
	// infomessage .. Show XXX more
	"show_more": "展示{国家长度} 更多内容",
	// infomessage - vote guide
	"vote_guide_message": `使用TRX为超级代表投票。
	每一个TRX享有一次投票机会。
	投票不消耗TRX。可以为多个超级代表投票，投票不限次数。
	最终票数于每天24点统计并更新超级代表名单。`,
	// infofield
	"search_address": "搜索地址",
	// infofield - Token Transactions
	"token_transactions": "通证交易",
	// infofield - Token Holders
	"token_holders": "通证持有者",
	// infofield - Number of Transfers
	"nr_of_Transfers": "转账数量",
	// errormessage -> login required
	"not_signed_in": "使用此功能请先登录账户",
	// statusmessage - Loading Map
	"loading_map": "地图加载中",
	// statusmessage - loading Accounts
	"loading_accounts": "账户加载中",
	// table - row title - quantity
	"quantity": "数量",
	// table - row title - Percentage
	"percentage": "百分比",
	// statusmessage - loading token
	"loading_token": "通证加载中",

/*
##################################################################################
#                                                                                #
# transaction information                                                        #
#                                                                                #
##################################################################################
*/
    // statusmessage - No transactions found
    "no_transactions_found": "未查询到交易",
    // statusmessage - No tokens found
    "no_tokens_found": "未查询到通证",
    // statusmessage - No blocks found
    "no_blocks_found": "未查询到区块",
    // statusmessage - No votes found
    "no_votes_found": "未查询到投票",
    // statusmessage - No voters found
    "no_voters_found": "未查询到投票人",
    // statusmessage - Waiting for transactions ... still waiting
    "waiting_for_transactions": "等待交易结果",
    // statusmessage - Loading Address ... still waiting
    "loading_address": "地址加载中",

/*
##################################################################################
#                                                                                #
# token creation - default messages                                              #
#                                                                                #
##################################################################################
*/
	// button description - details
	"details": "详情",
	// button description - Issue a Token
	"issue_a_token": "发行通证",
	// table - row name - Issue Token
	"issue_token": "发行通证",
	// table - row name - token name
	"token_name": "通证名称",
	// table - row name - Total issued
	"total_issued": "认购量",
	// table - row name - Registered
	"registered": "注册日期",
	// table - row name - Abbreviations
	"abbreviation": "缩写",
	// title - Exchange Rate
	"exchange_rate": "汇率",
	// table - row name - Token Price
	"token_price": "通证价格",
	// usermessage - total amount of tokens
	"supply_message": "进入流通的通证数量",
	// field description - short description
	"description_message": "发行通证目的简述",
	// field description - website url
	"url_message": "用户可以查询到更多通证信息的网站",
	// usermessage - Token
	"exchange_rate_message_0": "规定单位通证的价值，明确每一TRX可以换取的通证数量。",
	// usermessage - text part 1 - Participants will receive 20 XXX for every 10 TRX
	"exchange_rate_message_1": "参与者可以获得",
	// usermessage - text part 2 - Participants will receive 20 XXX for every 10 TRX
	"exchange_rate_message_2": "每",
	// usermessage - text part 3 - Participants will receive 20 XXX for every 10 TRX
	"exchange_rate_message_3": "TRX",
	// usermessage - text part 1 - Participation Message
	"participation_message_0": "规定通证发行周期，在发行期间，参与者可以用TRX购买",
	// usermessage - text part 2 - Participation Message
	"participation_message_1": " 通证.",
	// usermessage - text part 1 - frozen supply message
	"frozen_supply_message_0": `可锁定部分通证。明确具体的锁定数额，并锁定至少一天。被锁定的通证可以在到达锁定期限后手动解冻，锁定并非强制。`,
	// statusmessage - Token successfully issued
	"token_issued_successfully": "通证发行成功！",
	// title - participation
	"participation": "参与",
	// description - date/time pannel - Start Date
	"start_date": "开始日期",
	// description - date/time pannel - End Date
	"end_date": "结束时期",
	// confirm message - token spend
	"token_spend_confirm": "我已获知发行通证需一次性缴纳1024TRX。",
	// userinfomation - token issue guide message - part 1
	"token_issue_guide_message_1":`用户账户中有至少1024TRX，就可以在波场协议上发行通证。`,
	// userinfomation - token issue guide message - part 2
	"token_issue_guide_message_2":`通证发行后，会在通证总览页面进行显示。,
	之后用户可以在发行期限内参与认购，用TRX兑换通证。`,
	// userinfomation - token issue guide message - part 3
	"token_issue_guide_message_3":`在发行通证后，您的账户将会收到全部的发行数额。
	当其他用户使用TRX兑换您发行的通证，兑换数额将从您的账户扣除，并以指定汇率获得相应数额的TRX。`,

/*
##################################################################################
#                                                                                #
# token creation - error messages                                                #
#                                                                                #
##################################################################################
*/
    // errormessage - startdate>= enddate
    "date_error": "结束日期早于开始日期，或与开始日期相同",
    // errormessage - an token name is required
    "no_name_error": "请填写名称",
    // errormessage - total supply > 0
    "no_supply_error": "发行总量至少为1",
    // errormessage - token amount musst be at least 1
    "coin_value_error": "单位通证数量对应的TRX价值至少为1",
    // errormessage - The amount of TRX per coin must be at least 1
    "tron_value_error": "The amount of TRX per coin must be at least 1",
    // errormessage - startdate is invalid
    "invalid_starttime_error": "所填写的开始日期无效",
    // errormessage - enddate is invalid
    "invalid_endtime_error": "所填写的结束日期无效",
    // errormessage - en tokendescription is required
    "no_description_error": "请填写描述",
    // errormessage - en URL (website) is required
    "no_url_error": "请填写网站URL",
    // errormessage - startdate < now
    "past_starttime_error": "开始日期早于今日日期",
    // statusmessage - no transactions available
    "no_transactions": "无交易",

/*
##################################################################################
#                                                                                #
# representatives section                                                        #
#                                                                                #
##################################################################################
*/
    // statistic dialog - Highest Productivity eg. tron node XXX Highest Productivity
    "Highest Productivity": "出块效率最高y",
    // statistic dialog - Highest Productivity eg. tron node YYY Lowest Productivity
    "Lowest Productivity": "出块效率最低",
    // title name - SR
    "Super Representatives": "超级代表",
    // title name - SRC
    "Super Representative Candidates": "超级代表候选人",
    // statusmessage -  loding Representatives informations
    "loading_representatives": "超级代表加载中",
    // errormessage - not a valid SR address
    "address_not_super_representative": "本地址非超级代表",
    // errormessage - unable to load SR page
    "unable_load_representatives_page_message": "页面加载失败，可能原因为地址无效、非超级代表地址或超级代表尚未设置此页面。",

/*
##################################################################################
#                                                                                #
# markets section                                                                #
#                                                                                #
##################################################################################
*/
    // statistic information (Average Price in USD)
    "average_price_usd": "平均价格（单位：美元）",
    // statistic information (Average Volume in USD)
    "average_volume_usd": "平均成交量（单位：美元）",
    // statistic information (Trade Volume)
    "Trade Volume": "交易量",
    // table - row titel - rank of exchanges (trading volume)
    "rank": "排名",
    // table - row titel - pair (trading pair TRX/USD)
    "pair": "交易对",
    // table - row titel - Volume (trading volume)
    "volume": "交易量",

/*
##################################################################################
#                                                                                #
# votes section                                                                  #
#                                                                                #
##################################################################################
*/
    // statistic information eg. 02:00 ..Next Round
    "next_round": "下一轮投票",
    // statistic information eg.23982829432 Total Votes
    "total_votes": "总票数",
    // statistic information eg. Most Ranks Gained This Round .. SR TEST
    "most_ranks": "排名上升最多",
    // button description - to View Live Ranking
    "view_live_ranking": "查看实时排名",
    // button description - to Open Team Page
    "open_team_page": "查看团队页面",
    // userinformation message - text section 1
    "warning_votes": "投票需要至少1单位Tron Power，Tron Power 可以通过在(账户页面)冻结TRX获得。",
    // userinformation message - HyperLink - text section 2
    "account_page": "账户页面",
    // loading message - to Loading Votes
    "loading_votes": "投票加载中",
    // chart title - 3 Days Ranking
    "3_day_ranking": "三日投票排名",
    // userinformation message 2 - title
    "live_ranking": "实时排名",
    // userinformation message 2 - description
    "live_ranking_msg": "票数每15秒刷新，新增票数可能需要1-2分钟才会计入总票数。",
    // table - row title - Candidate
    "candidate": "候选人",
    // table - row title - Current Votes
    "current_votes": "当前票数",
    // button description - to Click here to Start Voting
    "click_to_start_voting": "点击进行投票",
    // infomessage how many votes are available eg. 20 Votes Remaining
    "votes_remaining_message": "剩余票数",
    // errormessage - Open wallet to start voting
    "open_wallet_start_voting_message": "进入钱包开始投票",
    // infomessage - submitting vote
    "thanks_submitting_vote_message": "感谢您的投票!",
    // errormessage - You need at least 1 TRX to be able to vote
    "need_min_trx_to_vote_message": "您至少需要持有1TRX才能开始投票",
    // errormessage - voting - You spend to much votes
    "to_much_votes_massage": "投票数量过多!",
    // statusmessage - All votes are used!
    "all_votes_are_used_message": "您已用尽所有票数!",
    // statusmessage - title - Thank you for voting!
    "submissing_vote_message_title": "感谢您的投票!",
    // statusmessage - description - part 1
    "submissing_vote_message_0": "您已投票成功，将会在新一轮投票中生效。",
    // statusmessage - description - part 2
    "submissing_vote_message_1": "您可以随时重新分配您的票数",
    // errormessage - voting
    "submitting_vote_error_message": "提交投票时发生错误，请稍后再次尝试。",

/*
##################################################################################
#                                                                                #
# transaction Viewer                                                             #
#                                                                                #
##################################################################################
*/
    "info_tx_viewer": "在此处粘贴十六进制交易哈希值，查看交易内容，随后交易会进行全网广播。",
    "load_tx": "上传交易",
    "tx_qrcode": "交易二维码",
    "load_tx_qrcode": "扫描二维码上传交易",
    "transaction_load_error": "交易上传错误",
    "transaction_load_error_message": "上传交易时发生错误，请确认交易哈希值格式正确",
    "transaction_success_message": "交易广播成功",
    "transaction_success": "交易成功",
    "transaction_error_message": "广播交易过程中发生错误",
    "transaction_error": "交易错误",
    "confirm_transaction_message": "是否确认发送交易？",
    "broadcast_transaction_to_network": "全网交易广播",

/*
##################################################################################
#                                                                                #
# tools node tester                                                              #
#                                                                                #
##################################################################################
*/
    // field descritionp - enter a valid ip address
    "node_tester_msg": "输入节点IP测试GRPC连接状况",
    // button description - to stop the test
    "node_tester_stop": "请停止测试",
    // button description - to start the test
    "node_tester_test": "测试GRPC",
    // tableinformation - row title
    "node_tester_rt": "响应时间",
    // tableinformation - row title
    "confirmed_block": "已确认的区块",
    // status dialog ... to loding the test result
    "loading": "加载中",

/*
##################################################################################
#                                                                                #
# tools scanner                                                                  #
#                                                                                #
##################################################################################
*/
    // errormessage - No webcam found
    "no_webcam_found": "未发现网络摄像头",
    // errormessage - Error while trying to enable webcam.
    "trying_enable_webcam_message_0": "开启网络摄像头时发生错误。",
    // errormessage - Make sure camera permissions are enabled.
    "trying_enable_webcam_message_1": "请确认摄像头权限已开启。",

/*
##################################################################################
#                                                                                #
# help section                                                                   #
#                                                                                #
##################################################################################
*/
    // navigation bar - help - hyperlink - to get informations about tron
    "what_is_tron": "TRON是什么",
    // navigation bar - help - hyperlink - to get
    "tron_explorer_api": "波场浏览器API",
    // navigation bar - help - hyperlink - to get informations about the TRON Architecture
    "tron_architechure": "波场架构",
    // navigation bar - help - hyperlink - to get the TRON Protobuf Documentation
    "tron_protobuf_doc": "TRON Protobuf文档",
    // navigation bar - help - hyperlink - to Submit a bug / suggestion
    "report_an_error": "提交BUG/建议",

/*
##################################################################################
#                                                                                #
# wallet section                                                                 #
#                                                                                #
##################################################################################
*/
    // button description - to open a new wallet
    "open_wallet": "打开钱包",
    // input field description to enter the private key for the authentication
    "private_key": "私钥",
    // description to select the keystore file for the authentication
    "keystore_file": "密钥库文件",
    // button description - select the keystore file
    "select_file": "选择文档",
    // button description - Login with a mobile device
    "login_mobile": "使用移动设备登录",
    // button description - create wallet
    "create_wallet": "创建钱包",
    // errormessage - no wallet available - No open wallet to view
    "no_open_wallet": "未打开钱包以供查看",
    // wizzard dialog - create new wallet - title
    "new_wallet": "新钱包",
    // wizzard dialog - create new wallet - password information message 1
    "password_encr_key_message_0": "此密码用于加密私钥，不作为生成私钥的种子。",
    // wizzard dialog - create new wallet - password information message 1
    "password_encr_key_message_1": "您需要使用此密码及私钥才能解锁钱包。",
    // wizzard dialog - create new wallet - password field description
    "strong_password_info": "请使用高强度密码。",
    // wizzard dialog - create new wallet - title
    "save_keystore_file": "保存私钥库文件",
    // wizzard dialog - create new wallet - button description to download the keystore file
    "download_keystore_file": "下载密钥",
    // wizzard dialog - create new wallet - userinformation 1 prefix
    "do_not_lose_it": "请勿遗失！",
    // wizzard dialog - create new wallet - userinformation 1 text
    "do_not_lose_it_message_0": "波场基金将无法帮助您找回遗失的密钥。",
    // wizzard dialog - create new wallet - userinformation 2 prefix
    "do_not_share_it": "请勿向他人分享！",
    // wizzard dialog - create new wallet - userinformation 2 text
    "do_not_share_it_message_0": "如在恶意网站使用此文件，您的资金可能面临被盗窃的风险。",
    // wizzard dialog - create new wallet - userinformation 3 prefix
    "make_a_backup": "请制作备份！",
    // wizzard dialog - create new wallet - userinformation 3 text
    "make_a_backup_message_0": "以防您的电脑故障。",
    // wizzard dialog - create new wallet - inputfield title
    "save_private_key": "请保管好您的私钥",
    // wizzard dialog - create new wallet - button description to print an paper wallet
    "print_paper_wallet": "打印纸钱包",
    // wizzard dialog - create new wallet - statusmessage 1
    "new_wallet_ready_message": "新钱包已准备就绪",
    // wizzard dialog - create new wallet - button description
    "go_to_account_page": "进入账户页面",

};

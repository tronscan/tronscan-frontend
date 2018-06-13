
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
#         Version: 1.3-10062018-1                                                #
#         Update Date: 13.06.2018                                                #
#         Language: Dutch                                                        #
#         Status: First Draft                                                    #
#         Number of checks: 2                                                    #
#         Participants: Rovak,CryptoSpaces,PMD3VSolution                         #
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
    "ok": "OK",
    // title - Tron protocol
    "app_title": "Tron Protocol",
    // description of an input field  (enter the password)
    "password": "wachtwoord",
    // description of a display field - price
    "money_price": "prijs",
    // description of a display field - price
    "price": "price",
    // blockchain -> blocks - plural
    "blocks": "blokken",
    // blockchain -> block - singular
    "block": "blok",
    // description of a display field - name
    "name": "naam",
    // website
    "website": "webpagina",
    // Tron TRX address eg. TScGuWDzgLD2...opywfkDMCh77
    "address": "adres",
    // button description - sign out (account)
    "sign_out": "uitloggen",
    // button description - sign in (account)
    "sign_in": "inloggen",
    // button description - Register / Log-in (account)
    "register_login": "Registreren / Inloggen",
    // button description - Register (account)
    "register": "inschrijven",
    // button description - Login (account)
    "login": "inloggen",
    // row description - height/size of a block
    "height": "height",
    // row description - age of the block
    "age": "age",
    // row description - size of the block (bytes)
    "bytes": "bytes",
    // row description - eg. produced by XXX
    "produced by": "geproduceerd door",
    // row description - which contract is assigned
    "contract": "Contract",
    // text module (send XXX from ...to)
    "from": "van",
    // text module (send XXX from ...to)
    "to": "naar",
    // userfield description
    "value": "waarde",
    // statistic informations (total number of accounts)
    "total_accounts": "Totaal accounts",
    // button description - submit (confirm)
    "submit": "bevestig",
    // button description - send trx
    "send": "versturen",
    // button description - receive trx
    "receive": "ontvang",
    // button description - supply
    "supply": "lever",
    // button description - to view more informations
    "view": "bekijken",
    // button description - to view all informations
    "view_all": "View all",
    // button description - to create an account or token
    "create": "nieuw",
    // information field - country
    "country": "land",
    // field description - eg. amout: 20 trx
    "amount": "hoeveelheid",
    // button description (to show the own votes)
    "my_vote": "mijn stem",
    // button description (to submit the vote)
    "submit_votes": "Bevestig stemmen",
    // subtitle - statistic information - accounts(plural)
    "accounts": "accounts",
    // description - created
    "created": "gemaakt",
    // description field - name of the exchange
    "exchange": "Exchange",
    // button description - next (go to the next step)
    "next": "next",
    // infomessage - button action message -> Copied to clipboard
    "copied_to_clipboard": "Copied to clipboard",
    // button description - Cancel
    "cancel": "Cancel",
    // button description - Reset
    "reset": "Reset",
    // error message title - Error
    "error": "Error",

/*
##################################################################################
#                                                                                #
# navigation section                                                             #
#                                                                                #
##################################################################################
*/
    // navigation bar -> topic - Blockchain
    "blockchain": "Blockchain",
    // navigation bar -> topic - Wallet
    "wallet": "Wallet",
    // navigation bar -> topic - Home (main page)
    "home": "Home",
    // navigation bar -> topic - Transfers
    "transfers": "Transfers",
    // navigation bar -> topic - Live (view live information, current transfers)
    "live": "Live",
    // navigation bar -> topic - Statistics (statistic informations)
    "statistics": "Statistieken",
    // navigation bar -> topic -
    "markets": "Markten",
    // navigation bar -> topic - Tools
    "tools": "Gereedschap",
    // navigation bar -> topic - Transaction Viewer (tool to get transaction informations)
    "transaction_viewer": "Transaction Viewer",
    // navigation bar -> topic - Node Tester (tool to test the tron node connectivity)
    "node_tester": "Node Tester",
    // navigation bar -> topic - System (blockchain informationen)
    "system": "Systeem",
    // navigation bar -> topic News (to get current informations about tron and tronscan)
    "news": "Nieuws",
    // navigation bar -> topic - Help (report a bug and view the documentation)
    "help": "Help",
    // navigation bar -> topic - Nodes (infomations about the active tron nodes)
    "nodes": "Nodes",
    // navigation bar -> topic - Votes (area to vote a SR)
    "votes": "stemmen",
    // navigation bar -> topic - Account (personal account area)
    "account": "Account",
    // navigation bar -> tokens
    "tokens": "tokens",
    // navigation bar -> topic - Token->Overview (get an overview of the tokens)
    "overview": "Overzicht",
    // navigation bar -> topic - Participate (buy a token)
    "participate": "Doe mee",

/*
##################################################################################
#                                                                                #
# home dashboard                                                                 #
#                                                                                #
##################################################################################
*/
    // title of the main page
    "tron_main_message": "Decentraliseer het Web",
    // subtitle - realtime information - how many transactions last hour
    "transactions_last_hour": "Transacties gedurende laatste uur",
    // subtitle - realtime information - current block height
    "block_height": "Blokhoogte",
    // subtitle - realtime information - how many online nodes
    "online_nodes": "Online Nodes",
    // subtitle - realtime information - current price per 1000 trx
    "pice_per_1000trx": "Prijs (per 1000TRX)",
    // hyperlink description - to vote for the super representatives
    "vote_for_super_representatives": "Vote for Super Representatives",
    // hyperlink description - to view the super representatives
    "view_super_representatives": "View Super Representatives",
    // hyperlink description - to create a new wallet
    "create_new_wallet": "Create a new Wallet",
    // hyperlink description - to view the tokens
    "view_tokens": "View Tokens",

/*
##################################################################################
#                                                                                #
# tableinformations and statistics                                               #
#                                                                                #
##################################################################################
*/
    // button description -> table navigation -> first page
    "first_page": "eerste pagina",
    // button description -> table navigation -> previous page
    "previous_page": "vorige pagina",
    // button description -> table navigation -> next page
    "next_page": "volgende pagina",
    // button description -> table navigation -> last page
    "last_page": "laatste pagina",
    // table description -> Page 2 of 3
    "page": "pagina",
    // table description -> Page 2 of 3
    "of": "van",
    // information field - statistics - in which country are the most nodes e.g. USA ... Most Nodes
    "most_nodes": "Meeste nodes",
    // status message - loading informations - loading Node informations
    "loading_nodes": "Nodes worden geladen",
    // table information - row title (hostname->Node)
    "Hostname": "Hostname",
    // table information - row title (last update from tron node)
    "Last Update": "Laatste Update",
    // status message - waiting for syncing the first node
    "first_node_sync_message": "Wacht op eerste node sync, probeer het over enkele minuten nogmaals.",
    // table information - row title - statistics -  last created block (blockchain)
    "last_block": "laatste blok",
    // table information - row title - statistics - Blocks Produced (blockchain)
    "blocks_produced": "Geproduceerde Blokken",
     // table information - row title - statistics - Blocks Missed (blockchain)
    "blocks_missed": "Gemiste Blokken",
    // table information - row title - statistics - productivity
    "productivity": "productiviteit",
    // table information - row title - statistics - rewards
    "rewards": "beloning",

/*
##################################################################################
#                                                                                #
# blockchain - statistics                                                        #
#                                                                                #
##################################################################################
*/
    // subtitle - statistic information eg. diagram -> top 25 addresses
    "addresses": "adres",
    // subtitle - statistic information eg. diagram -> TRX transferred in the past hour
    "trx_transferred_past_hour": "Overgedragen TRX gedurende het laatste uur",
    // subtitle - statistic information eg. diagram -> Transactions in the past hour
    "transactions_past_hour": "Transacties gedurende het laatste uur",
    // subtitle - statistic information eg. diagram -> Average Block Size
    "average_blocksize": "Gemiddelde Blokgrootte",
    // table header
    "rich_list": "Rich List",

/*
##################################################################################
#                                                                                #
# account section                                                                #
#                                                                                #
##################################################################################
*/
    // title/headline of the form
    "set_name": "Stel naam in",
    // statusmessage
    "unique_account_message": "You may only set your account name once!",
    // button description
    "change_name": "Change Name",
    // placeholder message
    "account_name": "Account Name",
    // button description
    "show_qr_code": "Toon QR Code",
    // infomessage for the user
    "do_not_send_2": "Verstuur geen TRX van je portemonnee of exchange naar het bovenstaande testnet adres!",
    // subtitle - statistic information eg. 2 Bandwidth
    "bandwidth": "bandbreedte",
    // subtitle - statistic information eg. 5 Balance
    "balance": "balans",
    // subtitle - statistic information eg. 100 Tron Power
    "tron_power": "Tron Power",
    // title/headline of the table
    "transactions": "transacties",
    // infomessage - no transfers have been made yet
    "no_transfers": "Geen Transfers",
    // infomessage - no tokens present
    "no_tokens": "Geen Tokens",
    // subtitle - statistic information eg. 2  Free Bandwidth
    "free_bandwidth": "Gratis Bandbreedte",
    // field name - expires
    "expires": "verloopt",
    // infomessage - receive trx eg. 10 trx have been added to your account!
    "have_been_added_to_your_account": "zijn toegevoegd aan je account!",
    // infomessage - Testnet informessage - receive 10000 TRX for testing
    "information_message_1": "Wanneer je TRX aanvraagt, ontvangt 10000 TRX om mee te kunnen testen op het testnet.",
    // infomessage - Testnet informessage - limitation
    "information_message_2": "Je kunt per account slechts 10 keer TRX aanvragen.",
    // button description - Request TRX for testing
    "request_trx_for_testing": "Vraag TRX aan om mee te kunnen testen",
    // information - token balances
    "token_balances": "token balances",
    // tableinformation - row name - produced blocks
    "produced_blocks": "produced blocks",
    // tableinformation - row name - voters
    "voters": "voters",
    // statusinformation -  progress
    "progress": "Voortgang",
    // statusinformation - transaction
    "transactions_count": "{transactions, plural, one {transactie} other {transacties}}",
     // tableinformation - row name - issuer
    "issuer": "uitgever",
    // tableinformation - row name - network
    "network": "netwerk",
    // tableinformation - row name - current
    "current": "huidig",
    // button description to receive test trx
    "trx_received": "TRX received",
    // errormessage - TRX for testing temporarily unavailable
    "test_trx_temporarily_unavailable_message": "Test TRX is temporarily unavailable. Please try again later.",
    // errormessage - Not enough TRX to freeze
    "not_enough_trx": "Not enough TRX",
    // address title -> receive trx - TRX address
    "send_to_following_address": "Verstuur naar het volgende adres",

/*
##################################################################################
#                                                                                #
# account freeze                                                                 #
#                                                                                #
##################################################################################
*/
    // button description - to freeze trx
    "freeze": "bevriezen",
    // button description - to unfreez trx
    "unfreeze": "ondooi",
    // infomessage - description
    "freeze_trx_least": "Je hebt tenminsten 1 TRX nodig om te kunnen bevriezen",
    // errormessage - message text
    "unable_unfreeze_trx_message": "TRX ontdooien niet gelukt. Dit zou kunnen komen doordat de minimale bevriesperiode nog niet is berijkt.",
    // infomessage - text module 1
    "freeze_trx_premessage_0": `TRX kan bevroren/vastgezet worden om Tron Power te verwerven en andere functies te activeren.
     Bijvoorbeeld, met Tron Power kun je `,
    "freeze_trx_premessage_1": ` Bevroren token "staan vast" voor een periode van 3 dagen. Gedurende deze periode kunnen de bevroren TRX niet verhandeld worden.
     Na deze periode kun je de TRX ontdooien en de tokens verhandelen.`,
    "freeze_trx_premessage_link": "stem op een Super Vertegenwoordiger.",
    "trx_amount": "TRX Amount",
    // infomessage - text module 1 - I confirm to freeze XXX trx for at least of 3 days
    "token_freeze_confirm_message_0": "I confirm to freeze ",
    // infomessage - text module 2 - I confirm to freeze XXX trx for at least of 3 days
    "token_freeze_confirm_message_1": "for at least of 3 days",
    // table title - Frozen Supply
    "frozen_supply": "Bevroren voorraad",

/*
##################################################################################
#                                                                                #
# account superdelegates                                                         #
#                                                                                #
##################################################################################
*/
	// button description - apply for delegate
    "apply_for_delegate": "solliciteer voor afgevaardigde",
	// button description - Apply to be a Super Representative Candidate
    "apply_super_representative_candidate": "Solliciteer voor Super Vertegenwoordiger Kandidaat",
	// inputfield description - Homepage
    "your_personal_website_address": "uw persoonlijke website URL",
	// infomessage - predescription
    "apply_for_delegate_predescription": `Elke tokenhouder heeft de mogelijkheid om TRON Super Vertegenwoordiger te worden.
     Echter, voor verkiesbare kandidaten hebben wij een aantal standaarden en regulaties gecreëerd,
     om het netwerk en de gemeenschap soepeler en effieciznter te laten lopen,
     om voorgedragen Super Vertegenwoordig te kunnen worden. Wij zullen de voorgedragen Super Vertegenwoordigers
     promoten om de kans dat ze worden gekozen te vergroten. Een keer per week worden nieuw voorgedragen Super
     Vertegenwoordigers geüpdatet en gepost.`,
	// infomessage - description
    "apply_for_delegate_description": `TRX holders can apply to become a super delegate by using the account management function, and vote for candidates.
     Each account can update current voter information and also is allowed to vote for multiple candidates.
     The maximum number of votes is less than or equal to the number of TRX users hold each time.
     (If you have certain sum of TRX, you can vote less than or equal to certain number of votes).
     The result of votes will be calculated based on the final voter information of every account in each
     voting cycle of which the time is from 00:00 to 24:00. TRX holders with the most votes will become super delegate.
     Every transaction made in the network is required to be validated by all SuperDelegates, and some bonuses will be getted.
     TRX will not be consumed in the process of super delegate application and voting.`,
	// errormessage - an unknown error occurred
    "unknown_error": "er is een onbekende fout opgetreden",
	// confirm - message
    "representative_understand": "Ik begrijp hoe ik een TRON vertegenwoordige kan zijn",
	// button description - create address and password
    "generate_account": "Genereer een nieuw account en wachtwoord",
	// confirm message - part 1
    "create_account_confirm_1": "Ik begrijp dat ik nooit meer toegang tot mijn assets heb wanneer ik mijn wachtwoord kwijtraak",
	// confirm message - part 2
    "create_account_confirm_2": "Ik begrijp dat niemand mij kan helpen mijn wachtwoord te herstellen wanneer ik deze kwijtraak",
	// confirm message - part 3
    "create_account_confirm_3": "Ik heb mijn wachtwoord opgeschreven",
	// confirm message - submitting the vote
    "vote_thanks": "Bedankt voor het stemmen!",
    "recent_transactions": "recente transacties",
    "newest_account": "nieuwste account",
    "representatives": "vertegenwoordigers",
    "most_votes": "meeste stemmen",
    "start_end_time": "Start- / Eindtijd",
    "scan_qr_code": "Scan de code met een QR Code scanner",
    "receive_trx": "ontvang trx",
    "require_account_to_send": "Om munten te kunnen versturen dien je ingelogd zijn",
    "require_account_to_receive": "Om munten te kunnen ontvangen dien je ingelogd zijn",
    "successful_send": "Versturen gelukt!",
  	"confirm_transaction": "Bevestig transactie",
  	"last_confirmed": "Laatst bevestigd",
    "trx_produced": "Geproduceerde Transacties",
    "do_not_send_1": "Verstuur geen TRX van je portemonnee of exchange naar je testnetadres!",
	// button description - Go to votelist
	"go_to_votelist": "Go to votelist",

/*
##################################################################################
#                                                                                #
# token creation formular                                                        #
#                                                                                #
##################################################################################
*/
    // description of an input field - Name of the token
    "name_of_the_token": "Naam van de token",
    // longdescription - additional userinfo - Name of the token
    "token_message": "Naam van de token",
    // description of an input field - token Abbreviation
    "token_abbr": "token afkorting",
    // longdescription - additional userinfo - token Abbreviation
    "abbr_message": "Afkorting voor de token",
    // field information - statistics - total supply of trx
    "total_supply": "totale voorraad",
    // field information - issued token
    "issued_token": "Uitgegeven token",
    // button description - Create Token
    "create_token": "Maak Token",
    // description of an input field - Description
    "description": "Omschrijving",
    // description of an input field -  Description URL
    "description_url": "Omschrijving URL",
    // field information - Quote Token Amount
    "quote_token_amount": "Quote Token Amount",
    // field information - Base Token Amount
    "base_token_amount": "Base Token Amount",
    // statusmessage - Creating a token
    "creating_a_token": "Token wordt gemaakt",
    // field information - available
    "available": "beschikbaar",
    // title - Testnet
    "testnet": "Testnet",
    "days_to_freeze": "Dagen om te bevriezen",
    "trx_token_fee_message": "Er is 1024 TRX nodig om een nieuwe token uittegeven",
    "trx_token_account_limit": "U mag slechts één token per account aanmaken",
    "trx_token_wallet_requirement": "Je dient een portemonee te hebben om een token te kunnen maken",
    "invalid_address": "ongeldig adres",
    "insufficient_tokens": "Onvoldoende tokens",
    "fill_a_valid_number": "Please fill a valid number",
    "fill_a_valid_address": "Please fill a valid address",
    "make_another_transaction": "Maak nog een transactie aan",
    "token_exchange_confirm": "I've confirmed to spend {trxAmount} on token distribution, and get a total of {tokenAmount} tokens.",
    "An_unknown_error_occurred,_please_try_again_in_a_few_minutes": "Er is een onbekende fout opgetreden. Probeer het over enkele minuten nogmaals",
    "An_error_occurred": "Er is een onbekende fout opgetreden",
    "create_a_token": "Maak een token",
    "not_started_yet": "Nog niet begonnen",
    "participated": "Je neemt deel!",
    "participated_error": "Er is een fout opgetreden",

/*
##################################################################################
#                                                                                #
# token participate                                                              #
#                                                                                #
##################################################################################
*/
    // messagedialog - title
    "buy_confirm_message_0": "Are you sure?",
    // messagedialog - maintext
    "how_much_buy_message": "How much tokens do you want to buy?",
    // infomessage - text module 1 - Are you sure you want to buy 1 <Tokenname> for 1 TRX
    "buy_confirm_message_1": "Are you sure you want to buy",
    // infomessage - text module 1 - Are you sure you want to buy 1 <Tokenname> for 1 TRX
    "for": "for",

/*
##################################################################################
#                                                                                #
# global messages                                                                #
#                                                                                #
##################################################################################
*/
	// error message - incorrect trx address
    "address_warning": "Voer alleen een geldig TRON portemonnee adres in. Een ongeldig adres kan tot verlies van TRX leiden.",
	// statusmessage - search for address or URL
    "search_address_or_url": "Zoek op adres of URL",
	// statusmessage
    "the_lunch_test": "The launch of testnet aims to test all the features of our blockchain explorer and wallet.",
	// statusmessage
    "please_keep_in_mind": "Please keep in mind, that since your registered account address is only used for testnet, do not send TRX from your own wallet or exchange to the account address of testnet.",
	// statusmessage - title
    "tron_foundation": "TRON Foundation",
	// statusmessage
    "trx_for_testing": "TRX for testing will be sent to your testing account once you successfully apply through account management.",
	// statusmessage
    "dear_users": "Dear users,",
	// field information  - fin
    "finished": "Finished",
	// field information  - token
    "token": "token",
	// field information  - website url
    "url": "url",
	// infomessage - loggin is required
    "need_to_login": "You must be logged in to access to account page",
	// confirm message - Thanks for applying!
    "thanks_for_applying": "Thanks for applying!",
	// errormessage - To many votes
    "to_much_votes": "To much votes",
	// errormessage - No TRX remaining
    "no_trx_remaining": "No TRX remaining",
	// statusmessage - Produced by TRX address
    "produced_by": "Produced by {witnessAddress}",
	// infomessage .. Show XXX more
    "show_more": "Show {countriesLength} More",
	// infomessage - vote guide
    "vote_guide_message": `Use your TRX to vote for Super Representatives.
      For every TRX you hold in your account you have one vote to spend.
      TRX will not be consumed. You can vote as many times for the several representatives as you like.
      The final votes will be tallied at 24 o'clock and the list of delegates will be updated.`,
	// infofield
    "search_address": "Search for address",
	// infofield - Token Transactions
    "token_transactions": "Token Transactions",
	// infofield - Token Holders
    "token_holders": "Token Holders",
	// infofield - Number of Transfers
    "nr_of_Transfers": "Nr. of Transfers",
	// errormessage -> login required
    "not_signed_in": "U dient ingelogd zijn om gebruik te maken van deze functionaliteit",
	// statusmessage - Loading Map
    "loading_map": "Laart wordt geladem",
	// statusmessage - loading Accounts
    "loading_accounts": "Accounts worden geladen",
	// table - row title - quantity
    "quantity": "quantity",
	// table - row title - Percentage
    "percentage": "Percentage",
	// statusmessage - loading token
    "loading_token": "Loading Token",

/*
##################################################################################
#                                                                                #
# transaction information                                                        #
#                                                                                #
##################################################################################
*/
    // statusmessage - No transactions found
    "no_transactions_found": "Geen transacties gevonden",
    // statusmessage - No tokens found
    "no_tokens_found": "Geen tokens gevonden",
    // statusmessage - No blocks found
    "no_blocks_found": "Geen blokken gevonden",
    // statusmessage - No votes found
    "no_votes_found": "Geen stemmen gevonden",
    // statusmessage - No voters found
    "no_voters_found": "Geen stemmers gevonden",
    // statusmessage - Waiting for transactions ... still waiting
    "waiting_for_transactions": "Wacht op transacties",
    // statusmessage - Loading Address ... still waiting
    "loading_address": "Adres wordt geladen",

/*
##################################################################################
#                                                                                #
# token creation - default messages                                              #
#                                                                                #
##################################################################################
*/
    // button description - details
    "details": "gegevens",
    // button description - Issue a Token
    "issue_a_token": "Maak een token",
    // table - row name - Issue Token
    "issue_token": "Maak Token",
    // table - row name - token name
    "token_name": "token naam",
    // table - row name - Total issued
    "total_issued": "Totaal uitgegeven",
    // table - row name - Registered
    "registered": "Geregistreerd",
    // table - row name - Abbreviations
    "abbreviation": "Afkortingen",
    // title - Exchange Rate
    "exchange_rate": "Wisselkoers",
    // table - row name - Token Price
    "token_price": "Token prijs",
	// usermessage - total amount of tokens
    "supply_message": "Het totaal aantal tokens in omloop",
	// field description - short description
    "description_message": "Een korte omschrijving van het doel van deze token",
	// field description - website url
    "url_message": "Een website met meer informatie over deze token",
	// usermessage - Token
    "exchange_rate_message_0": "Bepaal de prijs van een enkele token, dit doe je door aan te geven hoeveel tokens een deelnemer krijgt voor elke TRX",
	// usermessage - text part 1 - Participants will receive 20 XXX for every 10 TRX
    "exchange_rate_message_1": "Een deelnemer ontvangt",
	// usermessage - text part 2 - Participants will receive 20 XXX for every 10 TRX
    "exchange_rate_message_2": "voor elke",
	// usermessage - text part 3 - Participants will receive 20 XXX for every 10 TRX
	"exchange_rate_message_3": "TRX",
	// usermessage - text part 1 - Participation Message
    "participation_message_0": "Bepaal de deelnameperiode waarin tokens zullen worden uitgegeven. Deelnemers kunnen gedurende deze deelnameperiode TRX inwisselen voor ",
	// usermessage - text part 2 - Participation Message
    "participation_message_1": " tokens.",
	// usermessage - text part 1 - frozen supply message
    "frozen_supply_message_0": `A part of the supply can be frozen. The amount of supply can be specified and must be frozen
     for a minimum of 1 day. The frozen supply can manually be unfrozen after start date + frozen
     days has been reached. Freezing supply is not required.`,
	// statusmessage - Token successfully issued
    "token_issued_successfully": "Token aangemaakt",
	// title - participation
    "participation": "Deelname",
	// description - date/time pannel - Start Date
    "start_date": "Begindatum",
	// description - date/time pannel - End Date
    "end_date": "Einddatum",
	// confirm message - token spend
    "token_spend_confirm": "Ik bevestig dat ik op de hoogte ben van het feit dat het maken van de gehele voorraad van mijn tokens 1024 TRX kost.",
	// userinfomation - token issue guide message - part 1
    "token_issue_guide_message_1": `Issuing a token on the Tron Protocol can be done
      by anyone who has at least 1024 TRX in their account.`,
	// userinfomation - token issue guide message - part 2
    "token_issue_guide_message_2": `When a token is issued it will be shown on the token overview page.
      Users can then participate within the participation period and exchange their TRX for tokens.`,
	// userinfomation - token issue guide message - part 3
    "token_issue_guide_message_3": `After issuing the token your account will receive the amount of tokens equal to the total supply.
      When other users exchange their TRX for tokens then the tokens will be withdrawn from your account and you will
      receive TRX equal to the specified exchange rate.`,

/*
##################################################################################
#                                                                                #
# token creation - error messages                                                #
#                                                                                #
##################################################################################
*/
    // errormessage - startdate>= enddate
    "date_error": "De einddatum ligt voor of is gelijk aan de startdatum",
    // errormessage - an token name is required
    "no_name_error": "Er is geen naam opgegeven",
    // errormessage - total supply > 0
    "no_supply_error": "Er is een negatieve waarde of nul opgegeven voor de voorraad van deze token",
    // errormessage - token amount musst be at least 1
    "coin_value_error": "De waarde van de munt dient meer dan 0 te zijn",
    // errormessage - The amount of TRX per coin must be at least 1
    "tron_value_error": "De waarde van TRX tegenover de token dient meer dan 0 te zijn",
    // errormessage - startdate is invalid
    "invalid_starttime_error": "De startdatum is onjuist ingevuld",
    // errormessage - enddate is invalid
    "invalid_endtime_error": "De einddatum is onjuist ingevuld",
    // errormessage - en tokendescription is required
    "no_description_error": "Er is geen omschrijving van uw token opgegeven",
    // errormessage - en URL (website) is required
    "no_url_error": "Er is geen website opgegeven",
    // errormessage - startdate < now
    "past_starttime_error": "De opgegeven startdatum ligt in het verleden",
    // statusmessage - no transactions available
    "no_transactions": "Geen Transacties",

/*
##################################################################################
#                                                                                #
# representatives section                                                        #
#                                                                                #
##################################################################################
*/
    // statistic dialog - Highest Productivity eg. tron node XXX Highest Productivity
    "Highest Productivity": "Hoogste Productiviteit",
    // statistic dialog - Highest Productivity eg. tron node YYY Lowest Productivity
    "Lowest Productivity": "Laagste Productiviteit",
    // title name - SR
    "Super Representatives": "Super Vertegenwoordiger",
    // title name - SRC
    "Super Representative Candidates": "Super Vertegenwoordiger Kandidaten",
    // statusmessage -  loding Representatives informations
    "loading_representatives": "Vertegenwoordigers worden geladen",
    // errormessage - not a valid SR address
    "address_not_super_representative": "Dit adres is geen Super Vertegenwoordiger",
    // errormessage - unable to load SR page
    "unable_load_representatives_page_message": "Niet mogelijk de pagina te laden. Dit kan gebeuren doordat het adres ongeldig is, niet van een vertegenwoordiger of de vertegenwoordiger heeft deze pagina nog niet ingesteld",

/*
##################################################################################
#                                                                                #
# markets section                                                                #
#                                                                                #
##################################################################################
*/
    // statistic information (Average Price in USD)
    "average_price_usd": "Gemiddelde Prijs in USD",
    // statistic information (Average Volume in USD)
    "average_volume_usd": "Gemiddelde Volume in USD",
    // statistic information (Trade Volume)
    "Trade Volume": "Handelsvolume",
    // table - row titel - rank of exchanges (trading volume)
    "rank": "plek",
    // table - row titel - pair (trading pair TRX/USD)
    "pair": "paar",
    // table - row titel - Volume (trading volume)
    "volume": "Volume",

/*
##################################################################################
#                                                                                #
# votes section                                                                  #
#                                                                                #
##################################################################################
*/
    // statistic information eg. 02:00 ..Next Round
    "next_round": "Volgende Ronde",
    // statistic information eg.23982829432 Total Votes
    "total_votes": "Stemmen Totaal",
    // statistic information eg. Most Ranks Gained This Round .. SR TEST
    "most_ranks": "Meeste Plekken Gewonnen Deze Ronde",
    // button description - to View Live Ranking
    "view_live_ranking": "Bekijk live stand",
    // button description - to Open Team Page
    "open_team_page": "Open Team Pagina",
    // userinformation message - text section 1
    "warning_votes": "Om te kunnen stemmen is tenminsten 1 Tron Power nodig. Je kunt Tron Power verkrijgen door TRX te bevriezen op",
    // userinformation message - HyperLink - text section 2
    "account_page": "Account Pagina",
    // loading message - to Loading Votes
    "loading_votes": "Stemmen worden geladen",
    // chart title - 3 Days Ranking
    "3_day_ranking": "3 Dagen Stand",
    // userinformation message 2 - title
    "live_ranking": "Live Stand",
    // userinformation message 2 - description
    "live_ranking_msg": "Ververst elke 15 seconden. Het kan 1-2 minuten duren voordat nieuwe stemmen worden geteld",
    // table - row title - Candidate
    "candidate": "kandidaat",
    // table - row title - Current Votes
    "current_votes": "Huidige Stemmen",
    // button description - to Click here to Start Voting
    "click_to_start_voting": "Click here to Start Voting",
    // infomessage how many votes are available eg. 20 Votes Remaining
    "votes_remaining_message": "Votes Remaining",
    // errormessage - Open wallet to start voting
    "open_wallet_start_voting_message": "Open wallet to start voting",
    // infomessage - submitting vote
    "thanks_submitting_vote_message": "Thanks for submitting your vote!",
    // errormessage - You need at least 1 TRX to be able to vote
    "need_min_trx_to_vote_message": "You need at least 1 TRX to be able to vote",
    // errormessage - voting - You spend to much votes
    "to_much_votes_massage": "You spend to much votes!",
    // statusmessage - All votes are used!
    "all_votes_are_used_message": "All votes are used!",
    // statusmessage - title - Thank you for voting!
    "submissing_vote_message_title": "Thank you for voting!",
    // statusmessage - description - part 1
    "submissing_vote_message_0": "Your votes are successfully submitted, they will take effect when the next voting cycle starts.",
    // statusmessage - description - part 2
    "submissing_vote_message_1": "You may redistribute your votes anytime you like",
    // errormessage - voting
    "submitting_vote_error_message": "Something went wrong while submitting your votes. Please try again later.",

/*
##################################################################################
#                                                                                #
# transaction Viewer                                                             #
#                                                                                #
##################################################################################
*/
    "info_tx_viewer": "Here you can paste a transaction hex to inspect the contents of a transaction. The transaction can then be broadcasted to the network",
    "load_tx": "Laad Transacties",
    "tx_qrcode": "Transactie QR Code",
    "load_tx_qrcode": "Laad Transacties met QR Code",
    "transaction_load_error": "Fout opgetreden tijdens laden Transactie",
    "transaction_load_error_message": "Er is iets misgegaan tijdens het laden van de transactie. Zorg ervoor dat de HEX het juiste formaat heeft",
    "transaction_success_message": "Transactie naar het netwerk gebroadcast",
    "transaction_success": "Transactie gelukt",
    "transaction_error_message": "Er is iets misgegaan tijdens het broadcasten van deze transactie",
    "transaction_error": "Transactie Fout",
    "confirm_transaction_message": "Weet je zeker dat je deze transcatie wilt versturen?",
    "broadcast_transaction_to_network": "Broadcast Transactie naar het Netwerk",

/*
##################################################################################
#                                                                                #
# tools node tester                                                              #
#                                                                                #
##################################################################################
*/
    // field descritionp - enter a valid ip address
    "node_tester_msg": "Vul het IP van jouw node in om de GRPC verbinding te testen",
    // button description - to stop the test
    "node_tester_stop": "Stop met testen",
    // button description - to start the test
    "node_tester_test": "Test GRPC",
    // tableinformation - row title
    "node_tester_rt": "Responstijd",
    // tableinformation - row title
    "confirmed_block": "Bevestigd Blok",
    // status dialog ... to loding the test result
    "loading": "Aan het laden...",

/*
##################################################################################
#                                                                                #
# tools scanner                                                                  #
#                                                                                #
##################################################################################
*/
    // errormessage - No webcam found
    "no_webcam_found": "Geen webcam gevonden",
    // errormessage - Error while trying to enable webcam.
    "trying_enable_webcam_message_0": "Er is een fout opgetreden tijdens het activeren van de webcam.",
    // errormessage - Make sure camera permissions are enabled.
    "trying_enable_webcam_message_1": "Zorg ervoor dat camera toegang is toegestaan.",

/*
##################################################################################
#                                                                                #
# help section                                                                   #
#                                                                                #
##################################################################################
*/
    // navigation bar - help - hyperlink - to get informations about tron
    "what_is_tron": "Wat is TRON",
    // navigation bar - help - hyperlink - to get
    "tron_explorer_api": "Tron Explorer API",
    // navigation bar - help - hyperlink - to get informations about the TRON Architecture
    "tron_architechure": "TRON Architectuur",
    // navigation bar - help - hyperlink - to get the TRON Protobuf Documentation
    "tron_protobuf_doc": "TRON Protobuf Documentatie",
    // navigation bar - help - hyperlink - to Submit a bug / suggestion
    "report_an_error": "Geef een bug / suggestie door",

/*
##################################################################################
#                                                                                #
# wallet section                                                                 #
#                                                                                #
##################################################################################
*/
    // button description - to open a new wallet
    "open_wallet": "Open Portemonnee",
    // input field description to enter the private key for the authentication
    "private_key": "Private Key",
    // description to select the keystore file for the authentication
    "keystore_file": "Keystore Bestand",
    // button description - select the keystore file
    "select_file": "Selecteer Bestand",
    // button description - Login with a mobile device
    "login_mobile": "Login met een mobieltoestel",
    // button description - create wallet
    "create_wallet": "Maak een portemonnee aan",
    // errormessage - no wallet available - No open wallet to view
    "no_open_wallet": "Geen open portemonnee om te tonen",
    // wizzard dialog - create new wallet - title
    "new_wallet": "Nieuwe Portemonnee",
    // wizzard dialog - create new wallet - password information message 1
    "password_encr_key_message_0": "Dit wachtwoord versluitelt jouw private key. Je wachtwoord doet GEEN dienst als seed om je keys me te genereren.",
    // wizzard dialog - create new wallet - password information message 1
    "password_encr_key_message_1": "Je hebt dit wachtwoord en je private key nodig om je portemonnee te kunnen ontgrendelen.",
    // wizzard dialog - create new wallet - password field description
    "strong_password_info": "Een sterk wachtwoord is vereist",
    // wizzard dialog - create new wallet - title
    "save_keystore_file": "Sla je Keystore bestand op",
    // wizzard dialog - create new wallet - button description to download the keystore file
    "download_keystore_file": "Download Versleutelde Key",
    // wizzard dialog - create new wallet - userinformation 1 prefix
    "do_not_lose_it": "Niet verliezen!",
    // wizzard dialog - create new wallet - userinformation 1 text
    "do_not_lose_it_message_0": "Tron Foundation kan je niet helpen met het herstellen van een verloren key.",
    // wizzard dialog - create new wallet - userinformation 2 prefix
    "do_not_share_it": "Niet delen!",
    // wizzard dialog - create new wallet - userinformation 2 text
    "do_not_share_it_message_0": "Je fondsen kunnen gestolen worden wanneer je dit bestand op een kwaadaardige site gebruikt.",
    // wizzard dialog - create new wallet - userinformation 3 prefix
    "make_a_backup": "Maak een backup!",
    // wizzard dialog - create new wallet - userinformation 3 text
    "make_a_backup_message_0": "In geval dat je laptop in brand vliegt.",
    // wizzard dialog - create new wallet - inputfield title
    "save_private_key": "Sla je Private Key op",
    // wizzard dialog - create new wallet - button description to print an paper wallet
    "print_paper_wallet": "Print Papieren Portemonnee",
    // wizzard dialog - create new wallet - statusmessage 1
    "new_wallet_ready_message": "Je nieuwe portemonnee is beschikbaar",
    // wizzard dialog - create new wallet - button description
    "go_to_account_page": "Ga naar account pagina",

};

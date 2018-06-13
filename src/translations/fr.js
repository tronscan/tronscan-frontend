
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
#         Version: 1.2-13062018                                                  #
#         Update Date: 13.06.2018                                                #
#         Language: French                                                       #
#         Status: Second Draft                                                   #
#         Number of checks: 3                                                    #
#         Participants: El Petito Nicolas, Dev Obs                               #
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
    "app_title": "Protocole Tron",
    // description of an input field  (enter the password)
    "password": "mot de passe",
    // description of a display field - price
    "money_price": "prix",
    // description of a display field - price
    "price": "prix",
    // blockchain -> blocks - plural
    "blocks": "blocs",
    // blockchain -> block - singular
    "block": "bloc",
    // description of a display field - name
    "name": "nom",
    // website
    "website": "website",
    // Tron TRX address eg. TScGuWDzgLD2...opywfkDMCh77
    "address": "adresse",
    // button description - sign out (account)
    "sign_out": "déconnexion",
    // button description - sign in (account)
    "sign_in": "connexion",
    // button description - Register / Log-in (account)
    "register_login": "Inscription / Connexion",
    // button description - Register (account)
    "register": "S'inscrire",
    // button description - Login (account)
    "login": "s'identifier",
    // row description - height/size of a block
    "height": "Hauteur",
    // row description - age of the block
    "age": "âge",
    // row description - size of the block (bytes)
    "bytes": "bytes",
    // row description - eg. produced by XXX
    "produced by": "produit par",
    // row description - which contract is assigned
    "contract": "Contrat",
    // text module (send XXX from ...to)
    "from": "de",
    // text module (send XXX from ...to)
    "to": "vers",
    // userfield description
    "value": "valeur",
    // statistic informations (total number of accounts)
    "total_accounts": "Nombre total de comptes",
    // button description - submit (confirm)
    "submit": "soumettre",
    // button description - send trx
    "send": "envoyer",
    // button description - receive trx
    "receive": "recevoir",
    // button description - supply
    "supply": "offre",
    // button description - to view more informations
    "view": "vue",
    // button description - to view all informations
    "view_all": "tout voir",
    // button description - to create an account or token
    "create": "créer",
    // information field - country
    "country": "pays",
    // field description - eg. amout: 20 trx
    "amount": "montant",
    // button description (to show the own votes)
    "my_vote": "mon vote",
    // button description (to submit the vote)
    "submit_votes": "soumettre les votes",
    // subtitle - statistic information - accounts(plural)
    "accounts": "comptes",
    // description - created
    "created": "créé",
    // description field - name of the exchange
    "exchange": "Exchange",
    // button description - next (go to the next step)
    "next": "suivante",
    // infomessage - button action message -> Copied to clipboard
    "copied_to_clipboard": "Copié dans le presse-papiers",
    // button description - Cancel
    "cancel": "Annuler",
    // button description - Reset
    "reset": "Réinitialiser",
    // error message title - Error
    "error": "Erreur",

/*
##################################################################################
#                                                                                #
# navigation section                                                             #
#                                                                                #
##################################################################################
*/
    // navigation bar -> topic - Blockchain
    "blockchain": "blockchain",
    // navigation bar -> topic - Wallet
    "wallet": "portefeuille",
    // navigation bar -> topic - Home (main page)
    "home": "Home",
    // navigation bar -> topic - Transfers
    "transfers": "transferts",
    // navigation bar -> topic - Live (view live information, current transfers)
    "live": "En direct",
    // navigation bar -> topic - Statistics (statistic informations)
    "statistics": "statistiques",
    // navigation bar -> topic -
    "markets": "marchés",
    // navigation bar -> topic - Tools
    "tools": "outils",
    // navigation bar -> topic - Transaction Viewer (tool to get transaction informations)
    "transaction_viewer": "Visionneur de transactions",
    // navigation bar -> topic - Node Tester (tool to test the tron node connectivity)
    "node_tester": "Testeur de nœud",
    // navigation bar -> topic - System (blockchain informationen)
    "system": "système",
    // navigation bar -> topic News (to get current informations about tron and tronscan)
    "news": "actualités",
    // navigation bar -> topic - Help (report a bug and view the documentation)
    "help": "aide",
    // navigation bar -> topic - Nodes (infomations about the active tron nodes)
    "nodes": "noeuds",
    // navigation bar -> topic - Votes (area to vote a SR)
    "votes": "votes",
    // navigation bar -> topic - Account (personal account area)
    "account": "compte",
    // navigation bar -> tokens
    "tokens": "jetons",
    // navigation bar -> topic - Token->Overview (get an overview of the tokens)
    "overview": "Aperçu",
    // navigation bar -> topic - Participate (buy a token)
    "participate": "participer",

/*
##################################################################################
#                                                                                #
# home dashboard                                                                 #
#                                                                                #
##################################################################################
*/
    // title of the main page
    "tron_main_message": "Décentraliser le Web",
    // subtitle - realtime information - how many transactions last hour
    "transactions_last_hour": "TRX transféré pendant la dernière heure",
    // subtitle - realtime information - current block height
    "block_height": "Block Height",
    // subtitle - realtime information - how many online nodes
    "online_nodes": "Online Nodes",
    // subtitle - realtime information - current price per 1000 trx
    "pice_per_1000trx": "Price (per 1000TRX)",
    // hyperlink description - to vote for the super representatives
    "vote_for_super_representatives": "voter pour  Super Representatives",
    // hyperlink description - to view the super representatives
    "view_super_representatives": "View Super Representatives",
    // hyperlink description - to create a new wallet
    "create_new_wallet": "Créer un nouveau portefeuille",
    // hyperlink description - to view the tokens
    "view_tokens": "Afficher les jetons",

/*
##################################################################################
#                                                                                #
# tableinformations and statistics                                               #
#                                                                                #
##################################################################################
*/
    // button description -> table navigation -> first page
    "first_page": "première page",
    // button description -> table navigation -> previous page
    "previous_page": "page précédente",
    // button description -> table navigation -> next page
    "next_page": "page suivante",
    // button description -> table navigation -> last page
    "last_page": "dernière page",
    // table description -> Page 2 of 3
    "page": "page",
    // table description -> Page 2 of 3
    "of": "sur",
    // information field - statistics - in which country are the most nodes e.g. USA ... Most Nodes
    "most_nodes": "Le plus de nœuds",
    // status message - loading informations - loading Node informations
    "loading_nodes": "loading Nodes",
    // table information - row title (hostname->Node)
    "Hostname": "Hôte",
    // table information - row title (last update from tron node)
    "Last Update": "Dernière MAJ",
    // status message - waiting for syncing the first node
    "first_node_sync_message": "En attente de la synchronisation du premier noeud, veuillez réessayer dans quelques minutes.",
    // table information - row title - statistics -  last created block (blockchain)
    "last_block": "dernier bloc",
    // table information - row title - statistics - Blocks Produced (blockchain)
    "blocks_produced": "Blocs produits",
     // table information - row title - statistics - Blocks Missed (blockchain)
    "blocks_missed": "Blocs manqués",
    // table information - row title - statistics - productivity
    "productivity": "productivité",
    // table information - row title - statistics - rewards
    "rewards": "récompenses",

/*
##################################################################################
#                                                                                #
# blockchain - statistics                                                        #
#                                                                                #
##################################################################################
*/
    // subtitle - statistic information eg. diagram -> top 25 addresses
    "addresses": "adresses",
    // subtitle - statistic information eg. diagram -> TRX transferred in the past hour
    "trx_transferred_past_hour": "TRX transférés dans l'heure passée",
    // subtitle - statistic information eg. diagram -> Transactions in the past hour
    "transactions_past_hour": "Transactions dans l'heure passée",
    // subtitle - statistic information eg. diagram -> Average Block Size
    "average_blocksize": "Average Block Size",
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
    "set_name": "Définir le nom",
    // statusmessage
    "unique_account_message": "You may only set your account name once!",
    // button description
    "change_name": "nom du changement",
    // placeholder message
    "account_name": "nom du compte",
    // button description
    "show_qr_code": "Afficher le QR Code",
    // infomessage for the user
    "do_not_send_2": "n'envoyez pas de TRX depuis votre porte-feuille ou un site d'échange à l'adresse de compte ci-dessus de testnet!",
    // subtitle - statistic information eg. 2 Bandwidth
    "bandwidth": "bande passante",
    // subtitle - statistic information eg. 5 Balance
    "balance": "solde",
    // subtitle - statistic information eg. 100 Tron Power
    "tron_power": "Tron Power",
    // title/headline of the table
    "transactions": "transactions",
    // infomessage - no transfers have been made yet
    "no_transfers": "Aucun transfert",
    // infomessage - no tokens present
    "no_tokens": "Pas de jetons",
    // subtitle - statistic information eg. 2  Free Bandwidth
    "free_bandwidth": "Bande passante libre",
    // field name - expires
    "expires": "expires",
    // infomessage - receive trx eg. 10 trx have been added to your account!
    "have_been_added_to_your_account": "ont été ajoutés à votre compte!",
    // infomessage - Testnet informessage - receive 10000 TRX for testing
    "information_message_1": "Lorsque vous demanderez des TRX, vous recevrez 10000 TRX que vous pouvez utiliser sur le testnet.",
    // infomessage - Testnet informessage - limitation
    "information_message_2": "Vous ne pouvez demander des TRX que 10 fois par compte.",
    // button description - Request TRX for testing
    "request_trx_for_testing": "Demander des TRX pour les tests",
    // information - token balances
    "token_balances": "token balances",
    // tableinformation - row name - produced blocks
    "produced_blocks": "produced blocks",
    // tableinformation - row name - voters
    "voters": "voters",
    // statusinformation -  progress
    "progress": "progression",
    // statusinformation - transaction
    "transactions_count": "{transactions, plural, one {transaction} other {transactions}}",
     // tableinformation - row name - issuer
    "issuer": "émetteur",
    // tableinformation - row name - network
    "network": "réseau",
    // tableinformation - row name - current
    "current": "courant",
    // button description to receive test trx
    "trx_received": "TRX reçu",
    // errormessage - TRX for testing temporarily unavailable
    "test_trx_temporarily_unavailable_message": "Test TRX est temporairement indisponible. Veuillez réessayer plus tard.",
    // errormessage - Not enough TRX to freeze
    "not_enough_trx": "Pas assez de TRX",
    // address title -> receive trx - TRX address
    "send_to_following_address": "envoyez à l'adresse suivante",

/*
##################################################################################
#                                                                                #
# account freeze                                                                 #
#                                                                                #
##################################################################################
*/
    // button description - to freeze trx
    "freeze" : "Gel",
    // button description - to unfreez trx
    "unfreeze" : "débloquer",
    // infomessage - description
    "freeze_trx_least": "Vous avez besoin d'au moins 1 TRX pour pouvoir en geler",
    // errormessage - message text
    "unable_unfreeze_trx_message": "Impossible de débloquer les TRX. Cela pourrait être dû au fait que la période de gel minimale n'a pas encore été atteinte.",
    // infomessage - text module 1
    "freeze_trx_premessage_0": "TRX peut être gelé / verrouillé pour obtenir du Tron Power et activer des fonctionnalités supplémentaires. Par exemple, avec Tron Power vous pouvez",
    // link - text module 1
    "freeze_trx_premessage_link": "vote pour les Super Représentants.",
    // infomessage - text module 2
    "freeze_trx_premessage_1": "Les jetons gelés sont verrouillés pour une période de 3 jours. Durant cette période, les TRX gelés ne peuvent pas être échangé. Après cette période, vous pouvez débloquer les TRX et échanger les jetons.",
    // input field description
    "trx_amount": "TRX Amount",
    // infomessage - text module 1 - I confirm to freeze XXX trx for at least of 3 days
    "token_freeze_confirm_message_0": "Je confirme de geler ",
    // infomessage - text module 2 - I confirm to freeze XXX trx for at least of 3 days
    "token_freeze_confirm_message_1": "pendant au moins 3 jours",
    // table title - Frozen Supply
    "frozen_supply": "Frozen Supply",

/*
##################################################################################
#                                                                                #
# account superdelegates                                                         #
#                                                                                #
##################################################################################
*/
    // button description - apply for delegate
    "apply_for_delegate": "postuler pour être délégué",
    // button description - Apply to be a Super Representative Candidate
    "apply_super_representative_candidate": "Apply to be a Super Representative Candidate",
    // inputfield description - Homepage
    "your_personal_website_address": "l'adresse de votre site web personnel",
    // infomessage - predescription
    "apply_for_delegate_predescription": `Chaque détenteur de jeton a la possibilité de devenir un super représentant TRON.
     Néanmoins, pour que le réseau et la communauté fonctionnent de manière plus fluide et efficace, nous avons créé un
     ensemble de normes et de règlements pour les candidats éligibles à devenir des Super Représentants recommandés.
     Nous promouvrons les SR recommandés pour augmenter leurs chances d'être élus. Les nouveaux Super Représentants
     recommandés sont mis à jour et affichés une fois par semaine.`,
    // infomessage - description
    "apply_for_delegate_description": `
     Les détenteurs de TRX peuvent postuler pour devenir un super délégué en utilisant la fonction de gestion de compte, et voter pour les candidats.
     Chaque compte peut mettre à jour les informations actuelles des électeurs et il est également autorisé à voter pour plusieurs candidats.
     Le nombre maximum de votes est inférieur ou égal au nombre de TRX détenus à chaque fois par les utilisateurs.
     (Si vous avez une certaine somme de TRX, vous pouvez voter moins ou égal à un certain nombre de votes).
     Le résultat des votes sera calculé en fonction de l'information finale sur l'électeur de chaque compte dans chaque
     cycle de vote compris de 00:00 à 24:00. Les détenteurs de TRX avec le plus de votes deviendront super délégués.
     Chaque transaction effectuée sur le réseau doit être validée par tous les Super Délégués, et certains bonus seront crédités.
     TRX ne sera pas utilisé dans le processus de demande de super délégué et de vote.`,
    // errormessage - an unknown error occurred
    "unknown_error": "une erreur inconnue est survenue",
    // confirm - message
    "representative_understand": "Je comprends comment être un représentant de TRON",
    // button description - create address and password
    "generate_account": "Cliquez pour générer votre adresse de compte et votre mot de passe",
    // confirm message - part 1
    "create_account_confirm_1": "Je comprends que si je perds mon mot de passe, je n'aurai jamais accès à mes actifs",
    // confirm message - part 2
    "create_account_confirm_2": "Je comprends que si j'oublie ou perd mon mot de passe, personne ne pourra m'aider à le récupérer",
    // confirm message - part 3
    "create_account_confirm_3": "J'ai écrit mon mot de passe sur papier",
    // confirm message - submitting the vote
    "vote_thanks": "Merci d'avoir envoyé votre vote!",
    "recent_transactions": "transactions récentes",
    "newest_account": "nouveau compte",
    "representatives": "représentants",
    "most_votes": "plus de votes",
    "start_end_time": "Heure de début / fin",
    "scan_qr_code": "Scannez le code avec un lecteur QR Code",
    "receive_trx": "recevoir trx",
    "require_account_to_send": "Vous devez être connecté pour envoyer des coins",
    "require_account_to_receive": "Vous devez être connecté pour recevoir des coins",
    "successful_send": "Envoyé avec succès!",
    "confirm_transaction": "Confirmer la transaction",
    "last_confirmed": "Dernier confirmé",
    "trx_produced": "Transactions Produites",
    "do_not_send_1": "n'envoyez pas de TRX depuis votre porte-monnaie ou un site d'échange vers votre adresse testnet!",
    // button description - Go to votelist
    "go_to_votelist": "aller à la liste de vote",

/*
##################################################################################
#                                                                                #
# token creation formular                                                        #
#                                                                                #
##################################################################################
*/
    // description of an input field - Name of the token
    "name_of_the_token": "Nom du jeton",
    // longdescription - additional userinfo - Name of the token
    "token_message": "Nom du token",
    // description of an input field - token Abbreviation
    "token_abbr": "abréviation du jeton",
    // longdescription - additional userinfo - token Abbreviation
    "abbr_message": "Abbreviation for the token",
    // field information - statistics - total supply of trx
    "total_supply": "offre totale",
    // field information - issued token
    "issued_token": "jeton émis",
    // button description - Create Token
    "create_token": "Créer un jeton",
    // description of an input field - Description
    "description": "Description",
    // description of an input field -  Description URL
    "description_url": "Url de la description",
    // field information - Quote Token Amount
    "quote_token_amount": "Donnez la quantité de Jetons",
    // field information - Base Token Amount
    "base_token_amount": "Quantité de Jetons de Base",
    // statusmessage - Creating a token
    "creating_a_token": "Créer un jeton",
    // field information - available
    "available": "disponible",
    // title - Testnet
    "testnet": "Testnet",
    "days_to_freeze": "Jours d'immobilité",
    "trx_token_fee_message": "1024 TRX sont nécessaires pour créer un nouveau token",
    "trx_token_account_limit": "You may create only one token per account",
    "trx_token_wallet_requirement": "Vous avez besoin d'un portefeuille ouvert pour pouvoir créer un token",
    "invalid_address": "adresse invalide",
    "insufficient_tokens": "Nombre de jetons insuffisant",
    "fill_a_valid_number": "Please fill a valid number",
    "fill_a_valid_address": "Please fill a valid address",
    "make_another_transaction": "Faire une autre transaction",
    "token_exchange_confirm": "Je confirme l'envoi de {trxAmount}. Je reçois en retour {tokenAmount}.",
    "An_unknown_error_occurred,_please_try_again_in_a_few_minutes": "Une erreur inconnue s'est produite, veuillez réessayer dans quelques minutes",
    "An_error_occurred": "Une erreur est survenue",
    "create_a_token": "Créer un jeton",
    "not_started_yet": "Pas encore commencé",
    "participated": "Vous avez participé avec succès!",
    "participated_error": "Une erreur est survenue",

/*
##################################################################################
#                                                                                #
# token participate                                                              #
#                                                                                #
##################################################################################
*/
    // messagedialog - title
    "buy_confirm_message_0": "Vous êtes sûr ?",
    // messagedialog - maintext
    "how_much_buy_message": "Combien de jetons voulez-vous acheter ?",
    // infomessage - text module 1 - Are you sure you want to buy 1 <Tokenname> for 1 TRX
    "buy_confirm_message_1": "Vous êtes sûr de vouloir acheter ?",
    // infomessage - text module 1 - Are you sure you want to buy 1 <Tokenname> for 1 TRX
    "for": "à",

/*
##################################################################################
#                                                                                #
# global messages                                                                #
#                                                                                #
##################################################################################
*/
    // error message - incorrect trx address
    "address_warning": "Saisissez uniquement une adresse valide d'un portefeuille TRON. Des adresses incorrectes peuvent entraîner une perte de TRX.",
    // statusmessage - search for address or URL
    "search_address_or_url": "Recherche d'adresse ou d'URL",
    // statusmessage
    "the_lunch_test": "The launch of testnet aims to test all the features of our blockchain explorer and wallet.",
    // statusmessage
    "please_keep_in_mind": "Veuillez gardez à l'esprit, que puisque votre adresse de compte enregistrée est utilisée uniquement pour le testnet, ne pas envoyeer de TRX de votre portefeuille ou un site d'échange vers le testnet.",
    // statusmessage - title
    "tron_foundation": "TRON Foundation",
    // statusmessage
    "trx_for_testing": "Les TRX pour les tests seront envoyés à votre compte de test une fois que vous aurez fait la demande puis l'écran de gestion de compte.",
    // statusmessage
    "dear_users": "Chers utilisateurs,",
    // field information  - fin
    "finished": "Terminé",
    // field information  - token
    "token": "token",
    // field information  - website url
    "url": "url",
    // infomessage - loggin is required
    "need_to_login": "Vous devez être connecté pour accéder à la page du compte ",
    // confirm message - Thanks for applying!
    "thanks_for_applying": "Merci pour l’appliquation!",
    // errormessage - To many votes
    "to_much_votes": "Trop de votes",
    // errormessage - No TRX remaining
    "no_trx_remaining": "Aucuns TRX restant",
    // statusmessage - Produced by TRX address
    "produced_by": "Produit par {witnessAddress}",
    // infomessage .. Show XXX more
    "show_more": "Afficher {countriesLength} de plus",
    // infomessage - vote guide
    "vote_guide_message": `Utilisez vos TRX pour voter pour les Super Représentants.
     Pour chaque TRX que vous détenez dans votre compte, vous avez un vote à dépenser.
     Les TRX ne seront pas consommés. Vous pouvez voter autant de fois que vous le souhaitez pour plusieurs représentants.
     Les votes finaux seront comptés à 24 heures et la liste des délégués sera mise à jour.`,
    // infofield
    "search_address": "Rechercher une adresse",
    // infofield - Token Transactions
    "token_transactions": "Transactions du jeton",
    // infofield - Token Holders
    "token_holders": "Détenteurs de jetons",
    // infofield - Number of Transfers
    "nr_of_Transfers": "Nr. of Transfers",
    // errormessage -> login required
    "not_signed_in": "Vous devrez vous connecter pour utiliser cette fonctionnalité",
    // statusmessage - Loading Map
    "loading_map": "Loading Map",
    // statusmessage - loading Accounts
    "loading_accounts": "loading Accounts",
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
    "no_transactions_found": "Aucune transaction trouvée",
    // statusmessage - No tokens found
    "no_tokens_found": "Aucun jeton trouvé",
    // statusmessage - No blocks found
    "no_blocks_found": "Aucun bloc trouvé",
    // statusmessage - No votes found
    "no_votes_found": "Aucun vote trouvé",
    // statusmessage - No voters found
    "no_voters_found": "Aucun électeur trouvé",
    // statusmessage - Waiting for transactions ... still waiting
    "waiting_for_transactions": "En attente de transactions",
    // statusmessage - Loading Address ... still waiting
    "loading_address": "Loading Address",

/*
##################################################################################
#                                                                                #
# token creation - default messages                                              #
#                                                                                #
##################################################################################
*/
    // button description - details
    "details": "détails",
    // button description - Issue a Token
    "issue_a_token": "émettre un jeton",
    // table - row name - Issue Token
    "issue_token": "émission d'un jeton",
    // table - row name - token name
    "token_name": "Nom du jeton",
    // table - row name - Total issued
    "total_issued": "Total issued",
    // table - row name - Registered
    "registered": "Registered",
    // table - row name - Abbreviations
    "abbreviation": "Abbreviations",
    // title - Exchange Rate
    "exchange_rate": "taux de change",
    // table - row name - Token Price
    "token_price": "prix du jeton",
    // usermessage - total amount of tokens
    "supply_message": "quantité totale de jetons qui seront en circulation",
    // field description - short description
    "description_message": "une brève description de l'objectif du jeton",
    // field description - website url
    "url_message": "Un site web où les utilisateurs peuvent trouver plus d'informations sur le jeton",
    // usermessage - Token
    "exchange_rate_message_0": "Indiquez le prix d'un seul jeton en définissant le nombre de jetons qu'un participant recevra pour chaque TRX dépensé.",
    // usermessage - text part 1 - Participants will receive 20 XXX for every 10 TRX
    "exchange_rate_message_1": "Les participants recevront",
    // usermessage - text part 2 - Participants will receive 20 XXX for every 10 TRX
    "exchange_rate_message_2": "pour chaque",
    // usermessage - text part 3 - Participants will receive 20 XXX for every 10 TRX
    "exchange_rate_message_3": "TRX",
    // usermessage - text part 1 - Participation Message
    "participation_message_0": "Indiquez la période de participation pendant laquelle les jetons seront émis. Pendant la période de participation, les utilisateurs peuvent échanger des TRX contre ",
    // usermessage - text part 2 - Participation Message
    "participation_message_1": " jetons.",
    // usermessage - text part 1 - frozen supply message
    "frozen_supply_message_0": `A part of the supply can be frozen. The amount of supply can be specified and must be frozen
     for a minimum of 1 day. The frozen supply can manually be unfrozen after start date + frozen
     days has been reached. Freezing supply is not required.`,
    // statusmessage - Token successfully issued
    "token_issued_successfully": "Jeton émis avec succès",
    // title - participation
    "participation": "participation",
    // description - date/time pannel - Start Date
    "start_date": "Date de début",
    // description - date/time pannel - End Date
    "end_date": "Date de fin",
    // confirm message - token spend
    "token_spend_confirm": "Je confirme que la création de l'offre totale de jetons aura pour coût unique 1024 TRX.",
    // userinfomation - token issue guide message - part 1
    "token_issue_guide_message_1":`L'émission d'un jeton sur le protocole Tron peut être faite
     par n'importe qui qui a au moins 1024 TRX dans son compte.`,
    // userinfomation - token issue guide message - part 2
    "token_issue_guide_message_2":`Lorsqu'un jeton est émis, il apparaît sur la page de présentation des jetons.
     Les utilisateurs peuvent alors participer à la période de participation et échanger leur TRX contre des jetons.`,
    // userinfomation - token issue guide message - part 3
	"token_issue_guide_message_3":`Après l'émission du jeton, votre compte recevra le nombre de jetons égal à la quantité totale.
     Lorsque d'autres utilisateurs échangent leur TRX contre des jetons, les jetons seront retirés de votre compte et vous
     recevez un nombre de TRX égal au taux de change spécifié.`,

/*
##################################################################################
#                                                                                #
# token creation - error messages                                                #
#                                                                                #
##################################################################################
*/
    // errormessage - startdate>= enddate
    "date_error": "La date de fin est antérieure ou identique à la date de début",
    // errormessage - an token name is required
    "no_name_error": "Le nom est requis",
    // errormessage - total supply > 0
    "no_supply_error": "L'offre totale doit être d'au moins 1",
    // errormessage - token amount musst be at least 1
    "coin_value_error": "Le montant du jeton doit être d'au moins 1",
    // errormessage - The amount of TRX per coin must be at least 1
    "tron_value_error": "Le montant de TRX par pièce doit être d'au moins 1",
    // errormessage - startdate is invalid
    "invalid_starttime_error": "La date de début fournie est invalide",
    // errormessage - enddate is invalid
    "invalid_endtime_error": "La date de fin fournie est invalide",
    // errormessage - en tokendescription is required
    "no_description_error": "La description est requise",
    // errormessage - en URL (website) is required
    "no_url_error": "L'URL est requise",
    // errormessage - startdate < now
    "past_starttime_error": "La date de début est antérieure à la date du jour",
    // statusmessage - no transactions available
    "no_transactions": "Aucune transaction",

/*
##################################################################################
#                                                                                #
# representatives section                                                        #
#                                                                                #
##################################################################################
*/
    // statistic dialog - Highest Productivity eg. tron node XXX Highest Productivity
    "Highest Productivity": "Productivité la plus élevée",
    // statistic dialog - Highest Productivity eg. tron node YYY Lowest Productivity
    "Lowest Productivity": "Productivité la plus faible",
    // title name - SR
    "Super Representatives": "Super Représentants",
    // title name - SRC
    "Super Representative Candidates": "Candidats super-représentatifs",
    // statusmessage -  loding Representatives informations
    "loading_representatives": "Loading Representatives",
    // errormessage - not a valid SR address
    "address_not_super_representative": "This address is not a Super Representative",
    // errormessage - unable to load SR page
    "unable_load_representatives_page_message": "Unable to load page, this may happen if the address is invalid, the address is not a representative or the representative did not configure this page yet",

/*
##################################################################################
#                                                                                #
# markets section                                                                #
#                                                                                #
##################################################################################
*/
    // statistic information (Average Price in USD)
    "average_price_usd": "Prix moyen en USD",
    // statistic information (Average Volume in USD)
    "average_volume_usd": "Volume moyen en USD",
    // statistic information (Trade Volume)
    "Trade Volume": "Trade Volume",
    // table - row titel - rank of exchanges (trading volume)
    "rank": "rang",
    // table - row titel - pair (trading pair TRX/USD)
    "pair": "paire",
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
    "next_round": "Tour suivant",
    // statistic information eg.23982829432 Total Votes
    "total_votes": "Total des votes",
    // statistic information eg. Most Ranks Gained This Round .. SR TEST
    "most_ranks": "Meilleure progression pendant ce tour",
    // button description - to View Live Ranking
    "view_live_ranking": "Voir le classement en direct",
    // button description - to Open Team Page
    "open_team_page": "Ouvrir la page de l'équipe",
    // userinformation message - text section 1
    "warning_votes": "Au moins 1 Tron Power est nécessaire pour commencer à voter. Tron Power est obtenu en gelant des TRX dans la",
    // userinformation message - HyperLink - text section 2
    "account_page": "page de votre compte",
    // loading message - to Loading Votes
    "loading_votes": "Loading Votes",
    // chart title - 3 Days Ranking
    "3_day_ranking": "Classement de 3 jours",
    // userinformation message 2 - title
    "live_ranking": "Classement en direct",
    // userinformation message 2 - description
    "live_ranking_msg": "Rafraîchissement toutes les 15 secondes. Les nouveaux votes peuvent prendre jusqu'à 1-2 minutes avant d'être comptés",
    // table - row title - Candidate
    "candidate": "Candidat",
    // table - row title - Current Votes
    "current_votes": "Votes courants",
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
    "info_tx_viewer": "Vous pouvez coller un HEX de transaction pour consulter son contenu. La transaction peut ensuite être diffusé sur le réseau",
    "load_tx": "Charger la transaction",
    "tx_qrcode": "QR Code d'une transaction ",
    "load_tx_qrcode": "Charger une transaction depuis un QR Code",
    "transaction_load_error": "Transaction Load Error",
    "transaction_load_error_message": "Something went wrong while trying to load the transaction. Make sure the HEX is in a correct format",
    "transaction_success_message": "Transaction successfully broadcasted to the network",
    "transaction_success": "Transaction Success",
    "transaction_error_message": "Something went wrong while trying to broadcast the transaction",
    "transaction_error": "Transaction Error",
    "confirm_transaction_message": "Are you sure you want to send the transaction?",
    "broadcast_transaction_to_network": "Broadcast Transaction to Network",

/*
##################################################################################
#                                                                                #
# tools node tester                                                              #
#                                                                                #
##################################################################################
*/
    // field descritionp - enter a valid ip address
    "node_tester_msg": "Insérer l'IP de votre noeud afin de tester la connexion GRPC",
    // button description - to stop the test
    "node_tester_stop": "arrêter les tests",
    // button description - to start the test
    "node_tester_test": "Tester GRPC",
    // tableinformation - row title
    "node_tester_rt": "Temps de réponse",
    // tableinformation - row title
    "confirmed_block": "Blocs confirmés",
    // status dialog ... to loding the test result
    "loading": "chargement...",

/*
##################################################################################
#                                                                                #
# tools scanner                                                                  #
#                                                                                #
##################################################################################
*/
    // errormessage - No webcam found
    "no_webcam_found": "Aucune webcam trouvée",
    // errormessage - Error while trying to enable webcam.
    "trying_enable_webcam_message_0": "Erreur lors de l'activation de la webcam.",
    // errormessage - Make sure camera permissions are enabled.
    "trying_enable_webcam_message_1": "Assurez-vous que les autorisations de caméra sont activées.",

/*
##################################################################################
#                                                                                #
# help section                                                                   #
#                                                                                #
##################################################################################
*/
    // navigation bar - help - hyperlink - to get informations about tron
    "what_is_tron": "What is TRON",
    // navigation bar - help - hyperlink - to get
    "tron_explorer_api": "Tron Explorer API",
    // navigation bar - help - hyperlink - to get informations about the TRON Architecture
    "tron_architechure": "TRON Architecture",
    // navigation bar - help - hyperlink - to get the TRON Protobuf Documentation
    "tron_protobuf_doc": "TRON Protobuf Documentation",
    // navigation bar - help - hyperlink - to Submit a bug / suggestion
    "report_an_error": "Submit a bug / suggestion",

/*
##################################################################################
#                                                                                #
# wallet section                                                                 #
#                                                                                #
##################################################################################
*/
    // button description - to open a new wallet
    "open_wallet": "Ouvrir le portefeuille",
    // input field description to enter the private key for the authentication
    "private_key": "Clé privée",
    // description to select the keystore file for the authentication
    "keystore_file": "fichier Keystore",
    // button description - select the keystore file
    "select_file": "Sélectionner un fichier",
    // button description - Login with a mobile device
    "login_mobile": "Connectez-vous avec un appareil mobile",
    // button description - create wallet
    "create_wallet": "créer un portefeuille",
    // errormessage - no wallet available - No open wallet to view
    "no_open_wallet": "Aucun portefeuille ouvert à afficher",
    // wizzard dialog - create new wallet - title
    "new_wallet": "New Wallet",
    // wizzard dialog - create new wallet - password information message 1
    "password_encr_key_message_0": "This password encrypts your private key. This does not act as a seed to generate your keys.",
    // wizzard dialog - create new wallet - password information message 1
    "password_encr_key_message_1": "You will need this password and your private key to unlock your wallet.",
    // wizzard dialog - create new wallet - password field description
    "strong_password_info": "A strong password is required",
    // wizzard dialog - create new wallet - title
    "save_keystore_file": "Save Your Keystore File",
    // wizzard dialog - create new wallet - button description to download the keystore file
    "download_keystore_file": "Download Encrypted Key",
    // wizzard dialog - create new wallet - userinformation 1 prefix
    "do_not_lose_it": "Do not lose it!",
    // wizzard dialog - create new wallet - userinformation 1 text
    "do_not_lose_it_message_0": "Tron Foundation cannot help you recover a lost key.",
    // wizzard dialog - create new wallet - userinformation 2 prefix
    "do_not_share_it": "Do not share it!",
    // wizzard dialog - create new wallet - userinformation 2 text
    "do_not_share_it_message_0": "Your funds may be stolen if you use this file a malicious site.",
    // wizzard dialog - create new wallet - userinformation 3 prefix
    "make_a_backup": "Make a backup!",
    // wizzard dialog - create new wallet - userinformation 3 text
    "make_a_backup_message_0": "Just in case your laptop is set on fire.",
    // wizzard dialog - create new wallet - inputfield title
    "save_private_key": "Save Your Private Key",
    // wizzard dialog - create new wallet - button description to print an paper wallet
    "print_paper_wallet": "Print Paper Wallet",
    // wizzard dialog - create new wallet - statusmessage 1
    "new_wallet_ready_message": "Your new wallet is ready",
    // wizzard dialog - create new wallet - button description
    "go_to_account_page": "Go to account page",

};

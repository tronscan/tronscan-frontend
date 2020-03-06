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
    #         Version: 2019 Q4                                                       #
    #         Update Date: 12.2019                                                   #
    #         Language:  Russian 俄语                                                 #
    #         Status: Approved Version                                               #
    #         Number of checks: 5                                                    #
    #                                                                                #
    ##################################################################################
*/
export const lang19Q4 = {
    /*
    ##################################################################################
    #                                                                                #
    # 191210     token optimization                                                  #
    #                                                                                #
    ##################################################################################
    */
    "FinalResult": "Результат",
    "distributionTitle": "Распределение Активов по Держателям",
    "assetsPercent": "Топ {first}~{end} держателейL:{portion}%",
    "assetsPercentshow": "Общее количество активов топ {first}~{end} держателей：{usdt} {unit}",
    "holders": "Держатели",
    "transfersDetailContractAddress": "Адрес контракта",
    "transfersDetailHolder": "Держатель",
    "transfersDetailQuantity": "Количество",
    "transfersDetailPercentage": "Процент",
    "transfersDetailValue": "Значение",

    'contract_code_overview_name':'имя',
    'contract_code_overview_creator':'творец',
    'contract_code_overview_account':'УЧЕТНЫЕ ЗАПИСИ',

    // 2019-12-10
    "token_basic_view": "Обзор",
    "token_additional_materials": "Информация Профиля",
    "token_hold_user": "Держатели",
    "token_capitalization": "Marketcap/Общее",
    "token_credit_rating": "Рейтинг",
    "token_contract": "Контракт",
    "token_price_new": "Цена",
    "token_website": "Веб-сайт",
    "token_social_link": "Медиаш",
    "token_credit_rating_rule": "Посмотреть Систему Репутации",
    "token_issuance_info": "Информация о выпуске",
    "token_market": "Рынок",
    "token_contract_tab": "Контракт Токена",
    "token_price_issue": "Цена",
    "token_Participants": "Участники",
    "token_rating_rule": "TRONSCAN Reputation System",
    "token_rating_rule_title": "Currently, TRONSCAN classifies tokens into five levels of reputation based on information completeness, community feedback and whether they are exchangeable on POLONIDEX.   ",
    "token_rating_rule_title_p1_title": "Unknown",
    "token_rating_rule_title_p1": "Unknown is set as the default reputation for a newly added token. A token will be classified as unknown if no updates but mandatory information is provided after a successful token issuance. Mandatory information includes the token name, token abbreviation, token overview, total supply, decimals and issuer; for TRC20 tokens, information on the contract, time of contract creation and contract creator should also be provided.     ",
    "token_rating_rule_title_p2_title": "Neutral",
    "token_rating_rule_title_p2": "Tokens assessed as neutral have their information added or updated after a successful token issuance. The information includes: official website, logo, white paper address and social profile link(s).",
    "token_rating_rule_title_p3_title": "OK",
    "token_rating_rule_title_p3": "Tokens listed and openly traded on POLONIDEX will be given the OK reputation.   ",
    "token_rating_rule_title_p3_1": "Please apply through TRONSCAN for listing tokens on POLONIDEX. Before you submit the request, note:   ",
    "token_rating_rule_title_p3_2": "1) First, log into TRONSCAN and make sure you have at least one already-issued TRC10/TRC20 token in your account.   ",
    "token_rating_rule_title_p3_3": "2) Select the token you want to list on POLONIDEX and fill in some basic information. This will allow users to search for your token and start trading.    ",
    "token_rating_rule_title_p3_4": "3) If you want to list the token on the trading pairs list, please provide more information to be reviewed by trained personnel. Once your application is approved, you will receive an Email from POLONIDEX in one week. Only reviewed tokens are eligible for receiving an OK reputation.   ",
    "token_rating_rule_title_p4_title": "Suspicious",
    "token_rating_rule_title_p4": "There have been reports of scam/phishing/fraud/spam or misrepresentation of information related to this token that has not been adequately addressed and/or other 'red' flags. Such token is assessed as suspicious by TRONSCAN and cannot be found on the search page.   ",
    "token_rating_rule_title_p5_title": "Scam",
    "token_rating_rule_title_p5": "Tokens given a scam reputation have the following attributes: there have been substantial reports of scam/phishing/fraud/spam or misrepresentation of information related to this token that has not been adequately addressed and/or large amounts of other red 'flags', or there have been cases where the project team is disbanded, the official website and community are left long unmaintained, or the project team is charged with gross violation of laws and regulations. TRONSCAN sees such token as highly risky and won’t display them on the search page.   ",
    "token_rating_rule_title_end_title": "Disclaimer",
    "token_rating_rule_title_end_1": "TRONSCAN is a block explorer of the TRON ecosystem. It serves only as a platform to display and search for information in the ecosystem. Please note that all information about the token is uploaded by the issuer at his/her sole discretion and TRONSCAN is not involved in token issuance or its development. TRONSCAN does not vouch for the authenticity or validity of any tokens. Users should always do their own research before taking any actions.   ",
    "token_rating_rule_title_end_2": "Reputation merely serves as a reference for users. It may not be accurate and should not be taken as a definite value judgment since it only considers the completeness of token information and community feedback. TRONSCAN makes no warranties as to the accuracy and reliability of the reputation score, and accepts no direct or indirect liability for any losses caused or claimed to be caused by this.   ",
    "token_rating_rule_title_end_3": "TRONSCAN reserves the right to update the reputation score, and has no obligation to give any explanation for how it determines and updates the token reputation. Tokens found to be fraudulent or detrimental to other users’ rights and interests will be blacklisted or further disciplined.   ",
    "token_rating_rule_title_end_4": "TRONSCAN will update the Token Reputation System as it sees fit for the ecosystem. The updated policy will take effect once published on the official website.    ",
    "token_cau_risk": "Пожалуйста, будьте осторожны с рисками!",
    //2019-12-10  leon
    "token_overview": "Токен Трекер",
    "token_rank": "Ранг",
    "gain_tip": "24-часовое изменение по сравнению с TRX",
    "total_supply_tip1": "Рассчитывается путем умножения общего предложения в циркуляции на текущую цену каждого токена. Токены с 24-часовым объемом торгов ниже ",
    "total_supply_tip2": " TRX исключаются.",
    "market_capitalization_t": "Рыночная кепка",
    "token_tron_total": "Общее Количество Токенов TRON",
    "token_week": "Последние 7 дней",
    "token_scan_total": "Всего на TRONSCAN",
    "create_token_btn": "Выданные Токены",
    "token_exchange": "Биржа",
    "token_exchange_pair": "Торговая Пара",
    "token_exchange_price": "Цена",
    "token_exchange_24h_vol": "24-часовой Объем",
    "token_exchange_vol_rate": "Процент",
    "token_exchange_total1": "",
    "token_exchange_total2": " торговых пар в общей сложности",
    "token_exchange_rate_tip": "24-часовой объем торговой пары / 24-часовой объем токена",
    "contract_available_energy": "Доступно",
    "token_list_count": "Количество списков",
    //2019-12-15
    "token_estimated_cost": "Ориентировочная Стоимость",
    "token_enter_number": "Пожалуйста, введите сумму, которую вы хотите купить",
    "token_rules_0": "Неизвестный",
    "token_rules_1": "Нейтральный",
    "token_rules_2": "OK",
    "token_rules_3": "Подозрительный",
    "token_rules_4": "Скам",
    /*
        ##################################################################################
        #                                                                                #
        # Charts 2019-12-13                            #
        #                                                                                #
        ##################################################################################
    */
    "charts_transaction": "Транзакции",
    "charts_circulation": "Циркуляция",
    "charts_address": "Адрес",
    "charts_block": "Блок",
    "charts_contract": "Контракт",
    "charts_SR": "SR",
    "charts_daily_transactions": "Ежедневные транзакции",
    "charts_total_transactions": "Общее количество транзакций",
    "charts_volume_24": "Ежедневный объем транзакции",
    "charts_total_TRX_supply":"Циркуляция TRX в реальном времени и рыночная капитализация",
    "charts_total_TRX_supply_vote":"Вознаграждения голосования",
    "charts_average_blocksize":"Среднесуточный размер блока",
    "charts_total_average_blocksize":"Совокупность размера блока",
    "charts_daily_energy_consumption": "Ежедневное потребление Энергии",
    "charts_daily_energy_contracts": "Ежедневное потребление Энергии контрактами",
    "charts_daily_contract_calling_profile": "Ежедневный контракт, вызывающий профиль",
    "charts_overall_freezing_rate": "Общий коэффициент заморозки",
    "charts_new_addresses": "Рост аккаунта",
    "charts_contract_calling": "Вызов контракта",
    "charts_average_price":"Средняя цена TRX",
    "freezing_column_time": "Время（UTC）",
    "freezing_column_total_circulation": "Общая циркуляция TRX",
    "freezing_column_total_frozen": "Всего замороженных TRX",
    "freezing_column_freezing_rate": "Коэффициент заморозки",
    "freezing_column_freezing_rate_highest": "Коэффициент заморозки:",
    "freezing_column_energy_ratio": "TRX-for-Energy ratio",
    "freezing_column_bandwidth_ratio": "TRX-for-bandwidth ratio",
    "freezing_column_freezing_rate_tip": "количество замороженного TRX / общее количество TRX в циркуляции;",
    "freezing_column_energy_ratio_tip": "Замороженный TRX для энергии / Общее количество замороженного TRX",
    "freezing_column_bandwidth_ratio_tip": "Замороженный TRX для пропускной способности / Общее количество замороженного TRX",
    "freezing_column_more": "Больше",
    "freezing_column_total_circulation_chart": "Общая циркуляция（TRX）",
    "freezing_column_total_frozen_chart": "Всего замороженных（TRX）",
    "freezing_rangeSelector_botton_text_1y": "1 год",
    "freezing_rangeSelector_botton_text_6m": "6 месяцев",
    "freezing_rangeSelector_botton_text_3m": "3 месяцев",
    "freezing_rangeSelector_botton_text_1m": "1 месяцев",
    "freezing_column_a_total": "Данные замороженных TRX и находятся в циркуляции ",
    "freezing_column_calls": " результатов",
    "TRX_historical_data":"TRX balance historical data in the contract",
    "TRX_historical_data_y_text":"Amount（TRX）",
    "TRX_historical_data_tip":"TRX Amount",
    "transaction_rewards_distribution_ratio":"Коэффициент распределения вознаграждений",
    "transaction_energy_cap":"Предел энергии",
    "transaction_enrgy_cap_tip":"Максимальная Энергия, предоставляемая выпуску контракта",
    "signature_list":"Список подписей",
        /*
    ##################################################################################
    #                                                                                #
    # 191230     page index optimization                                             #
    #                                                                                #
    ##################################################################################
    */
   "index_page_menu_more_dev_resources":"Ресурсы развития",
   "index_page_search_placeholder":"Поиск по Адресу/Хэшу Транзакции/Токену/Блоку",
   "index_page_footer_team_info":"Информация о команде",
   "index_page_footer_feedback":"Обратная связь",
   "index_page_footer_expand":"Расширить",
   "index_page_footer_donate_address":"Адрес принадлежит TRON. Ваш донат помогает построить лучшую экосистему TRON.",
   "index_page_confirmed_blocks":"блоки",
   "index_page_confirmed_blocks_tips":"Блоки подтверждены более чем 19 SR",
   "index_page_switch_tokens":"Поменять токены",
   "index_page_tronscan_info":"TRONSCAN, лучший blockchain explorer Tron.",
   "index_page_down_excel_tips":"Измените десятичные дроби вручную при открытии файла в Excel.",
   "index_page_pane_current":"Tок",
   "index_page_pane_MaxTPS":"наивысший TPS",
   "index_page_idebar_expand":"Expand",
   "index_page_search_input": "Поиск",

    /*
        ##################################################################################
        #                                                                                #
        # Charts 2019-12-30                           #
        #                                                                                #
        ##################################################################################
    */
   "account_details_contracts":"Contracts Published",
   "account_details_contracts_no":"No contracts found",
   "Supply_TRX_total_chart":"Общее количество TRX",
   "Supply_total_y_title":"Общая циркуляция",
   "Supply_amount_TRX":"Количество TRX",
   "Supply_TRX_supply_records":"Циркуляция TRX: всего ",
   "Supply_TRX_supply_records_total":" записей",
   "Supply_TRX_total":"TRX общий тираж",
   "Supply_TRX_total_tip":"Накопленная ежедневная чистая стоимость + выпуск блока Genesis (100 000 000 000 TRX)",
   "Supply_amount_TRX_produced":"Произведено",
   "Supply_amount_TRX_produced_tip":"Вознаграждения блока + Вознаграждения голосования",
   "Supply_voting_rewards":"Вознаграждения голосования",     
   "Supply_block_rewards":"Вознаграждения блока", 
   "Supply_amount_TRX_burned":"Cожженного",
   "Supply_amount_TRX_burned_y_title":"Сумма уничтожения (TRX)",
   "Supply_amount_TRX_burned_tip1":"Не День Независимости: сумма TRX сожжена = комиссия сожжена",    
   "Supply_amount_TRX_burned_tip2":" День независимости: количество сожженного TRX = сожженная комиссия + сожженное кол-во TRX в день независимости (1 000 000 000 TRX)",    
   "Supply_amount_net_new":"Чистое количество",
   "Supply_amount_net_new_highest":"Чистое количество:",
   "Supply_amount_net_new_y_title":"Доходность / Чистая стоимость (TRX)",
   "Supply_amount_net_new_tip":"TRX поколение + TRX уничтожение",
   "votes_num":"голосов",
   /*
        ##################################################################################
        #                                                                                #
        # txns type chart  2020-01-09                           #
        #                                                                                #
        ##################################################################################
    */
   "txns_contract_calls":"Вызов контракта",
   "txns_TRX_transfers":"TRX переводы",
   "txns_TRC10_transfers":"TRC10 переводы",
   "txns_frozen_transactions":"Замороженные Транзакции",
   "txns_votes_transactions":"Голоса",
   "txns_other_transactions":"Другие транзакции",
   "txns_shielded_transactions":"Анонимные транзакции",
   "chart_network_resources":"Сетевые ресурсы",
   "chart_active_accounts":"Активные аккаунты",
   "chart_network":"Сеть",
  

    // 2019-12-25 xyy
    "transaction_hash":"Хэш",
    "transaction_status_tip":'Транзакции, подтвержденные более чем 19 SR, будут помечены как «подтвержденные».',
    "transaction_type": "Тип транзакции",
    "transaction_owner_address":"Адрес владельца",
    "transaction_receiver_address":"Адрес получения ресурсов",
    "transaction_freeze_num":"Замороженное количество",
    "transaction_get_resourse":"Полученные ресурсы",
    "transaction_recycling_address":"Адрес утилизации ресурса",
    "transaction_unfreeze_num":"Размороженное количество",
    "transaction_fee":"Комиссия",
    "transaction_consumed_bandwidth_cap_per":"Личный лимит потребления",
    "transaction_consumed_bandwidth_cap_all":"Общий предел потребления",
    "transaction_frozen_day":"Дни заморожены",
    "transaction_frozen_number":"Замороженное количество",
    "transaction_unfreeze_time":"Время разморозки",
    "transaction_consumed_bandwidth_cap_per_tip":"Предел потребления пропускной способности держателя токена для одного пользователя в переводе TRC10",
    "transaction_consumed_bandwidth_cap_all_tip":"Общий предел потребления пропускной способности держателя токена в переводе TRC10",
    "transaction_activate_account":"Активированный адрес",
    "transaction_TRANSFERCONTRACT":"Перевод TRX",
    "transaction_FREEZEBALANCECONTRACT":"Заморозить TRX",
    "transaction_UNFREEZEBALANCECONTRACT":"Разморозить TRX",
    "transaction_TRANSFERASSETCONTRACT":"Перевод TRC10",
    "transaction_ASSETISSUECONTRACT":"Выпуск токенов TRC10",
    "transaction_PARTICIPATEASSETISSUECONTRACT":"Подписаться за токены TRC10",
    "transaction_UNFREEZEASSETCONTRACT":"Разморозить токены TRC10",
    "transaction_UPDATEASSETCONTRACT":"Обновить параметры токена TRC10",
    "transaction_ACCOUNTCREATECONTRACT":"Активировать аккаунт",
    "transaction_WITHDRAWBALANCECONTRACT":"Получить вознагрождение",
    "transaction_TRIGGERSMARTCONTRACT":"Запустить Смарт Контракт",
    "transaction_VOTEWITNESSCONTRACT":"Голосовать",
    "transaction_WITNESSCREATECONTRACT":"Стать SR кандидатом",
    "transaction_WITNESSUPDATECONTRACT":"Обновить информацию о SR кандидате",
    "transaction_ACCOUNTUPDATECONTRACT":"Обновить имя аккаунта",
    "transaction_PROPOSALCREATECONTRACT":"Создать Предложение",
    "transaction_PROPOSALAPPROVECONTRACT":"Проголосовать за Предложение",
    "transaction_PROPOSALDELETECONTRACT":"Отозвать предложение",
    "transaction_SETACCOUNTIDCONTRACT":"Установить ID Аккаунта",
    "transaction_CREATESMARTCONTRACT":"Создать Смарт Контракт",
    "transaction_UPDATESETTINGCONTRACT":"Обновить параметры контракта",
    "transaction_EXCHANGECREATECONTRACT":"Создать Bancor транзакцию",
    "transaction_EXCHANGEINJECTCONTRACT":"Финансировать Bancor транзакцию",
    "transaction_EXCHANGEWITHDRAWCONTRACT":"Сокращать финансирование Bancor транзакции",
    "transaction_EXCHANGETRANSACTIONCONTRACT":"Выполнить Bancor транзакцию",
    "transaction_ACCOUNTPERMISSIONUPDATECONTRACT":"Обновить разрешение аккаунта",
    "transaction_UPDATEENERGYLIMITCONTRACT":"Обновить лимит Энергии контракта",
    "transaction_UPDATEBROKERAGECONTRACT":"Обновить соотношение комиссионных SR",
    "transaction_CLEARABICONTRACT":"Очистить ABI контракта",
    "transaction_token_holder_address":"Адрес владельца токена",
    "transaction_issue_address":"Адрес эмитента",
    "only_show_sinatures":"Отображать адреса только с подписями",

     // transaction info  2019-12-25  leon
     "consume_bandwidth":"Потребляет пропускную способность",
     "consume_energy":"Потребляет Энергию",
     "net_free":"Потребление замороженной / свободной пропускной способности",
     "net_burn":"Сжигает {num} TRX для пропускной способности",
     "energy_burn":"Сжигает {num} TRX для энергии",
     "initiate_address":"Адрес владельца",
     "candidate_address":"Адрес кандидата",
     "votes_count":"Счет",
     "sr_fee":"Комиссия",
     "sr_url":"Ссылка",
     "proposal_ID":"ID предложения",
     "proposal_content":"Содержание",
     "vote_proposal":"Проголосовать за предложение",
     "vote_yes":"Здесь",
     "vote_no":"нет",
     "account_id":"Аккаунт ID",
     "trans_ticket":"голосов",
     "trans_tickets":"голосов",

    // account tab transfers transactions  internal-transactions
    "account_tab_transactions_token_info":"如果交易中不包含通证信息，则展示“—”"


}
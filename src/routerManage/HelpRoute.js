import {
    FaqAsync,
    AboutAsync,
    LedgerHelpAsync
} from "../components/async";

export const HelpRoutes = [

    {
        path: "/help",
        label: "help",
        icon: "fa fa-question",
        component: null,
        showInMenu: false,
        routes: [
            "TRON",
            {
                url: "https://dn-peiwo-web.qbox.me/What_is_TRON1.4.pdf",
                label: "what_is_tron"
            },
            "-",
            "Tronscan",
            {
                label: "frequently_asked_questions",
                component: FaqAsync,
                path: "/help/faq"
            },
            // {
            //   label: "copyright",
            //   component: CopyrightAsync,
            //   path: "/help/copyright",
            //   showInMenu: false
            // },
            {
                label: "about",
                component: AboutAsync,
                path: "/help/about",
                showInMenu: false
            },
            {
                label: "ledger_guide",
                component: LedgerHelpAsync,
                path: "/help/ledger"
            },
            {
                url: "https://t.me/tronscan",
                label: "telegram_updates"
            },
            "-",
            "Community",
            {
                url: "https://www.reddit.com/r/tronix",
                label: "reddit"
            },
            {
                url: "https://t.me/tronscantalk",
                label: "telegram"
            },
            "-",
            "Development",
            {
                url: "https://github.com/tronscan/tronscan-frontend/blob/dev2019/document/api.md",
                label: "tron_explorer_api"
            },
            {
                url: "https://dn-peiwo-web.qbox.me/Design_Book_of_TRON_Architecture1.4.pdf",
                label: "tron_architechure"
            },
            {
                url: "https://dn-peiwo-web.qbox.me/TRON%20Protobuf%20Protocol%20Document.pdf",
                label: "tron_protobuf_doc"
            },
            "-",
            "Feedback",
            {
                url: "https://github.com/tronscan/tronscan-frontend/issues/new",
                label: "report_an_error"
            }
        ]
    },
]
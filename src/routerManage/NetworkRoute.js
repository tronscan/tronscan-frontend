import {
    NETURL
} from "../constants";
export const NetworkRoutes = [

    {
        path: "/network",
        label: "nav_network",
        icon: "fas fa-project-diagram",
        routes: [
            [
                "sun_network_product",
                {
                    url: NETURL.SUNNET,
                    icon: "fas fa-columns",
                    label: "sun_network_DAppChain"
                }
            ],
            [
                "sun_network_relevant_information",
                {
                    url: "https://tron.network/sunnetwork/#/",
                    icon: "fa fa-globe",
                    label: "sun_network_project_introduction"
                },
                {
                    url: "https://tron.network/sunnetwork/doc/guide/",
                    icon: "fa fa-book",
                    label: "sun_network_development_document"
                },
                {
                    url: "https://support.tronscan.org/hc/en-us/articles/360035944072-SUN-Network-Developer-Challenge-Starts",
                    icon: "fas fa-award",
                    label: "developer_challenge"
                }
            ]
        ]
    },

]
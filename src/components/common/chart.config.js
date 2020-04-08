export default {
    pieChart: {
        color: [
            '#98C8EB',
            '#1A3964',
            '#2A4994',
            '#3665B0',
            '#205097',
            '#3A69C4'
        ],
        title: {
            text: '',
            x: 'center',
            link: '',
            target: 'self'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} %"
        },

        series: [{
            name: '',
            type: 'pie',
            radius: ['45%', '70%'],
            center: ['50%', '60%'],
            data: [],
            "label": {
                "normal": {
                    "show": true,
                    "formatter": "{c}%"
                },
                "emphasis": {
                    "show": true
                }
            },
            "labelLine": {
                "normal": {
                    "show": true,
                    "smooth": false,
                    "length": 20,
                    "length2": 10
                },
                "emphasis": {
                    "show": true
                }
            },
        }]
    },
    representPieChart: {
        color: [
            '#424246',
            '#96EE80',
            '#F4A45D',
            '#8085ED',
            '#F25C81',
            '#E5D355',
            '#348188',
            '#F25C81',
            '#8FCACE',
            '#7CB5EC'
        ],
        title: {
            text: '',
            subtext: '',
            x: 'center',
            link: '',
            target: 'self'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{b}: {c} ({d}%)"
        },
        toolbox: {
            x2: 5,
            y: -5,
            feature: {
                restore: {
                    title: 'restore'
                },
                saveAsImage: {
                    show: true,
                    title: 'save'
                }
            }
        },
        legend: {
            type: 'scroll',
            show: false,
            orient: 'vertical',
            left: 'right',
            top: 35,
            selectedMode: 'false',
            data: []
        },
        series: [{
            name: '',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [],
            "label": {
                "normal": {
                    "show": true,
                    "formatter": "{b}"
                },
                "emphasis": {
                    "show": true
                }
            },
            "labelLine": {
                "normal": {
                    "show": true,
                    "smooth": false,
                    "length": 20,
                    "length2": 10
                },
                "emphasis": {
                    "show": true
                }
            },
        }]
    },
    supplyTypesTRXPieChart: {
        color: [
            '#c84a45',
            '#e7afad',
            '#e19b98',
            '#da8683'
        ],
        title: {
            text: '',
            subtext: '',
            x: 'center',
            link: '',
            target: 'self'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{b}: {c} ({d}%)"
        },
        toolbox: {
            x2: 5,
            y: -5,
            feature: {
                restore: {
                    title: 'restore'
                },
                saveAsImage: {
                    show: true,
                    title: 'save'
                }
            }
        },
        legend: {
            type: 'plain',
            show: false,
            orient: 'horizontal',
            bottom: 0,
            left: 'center',
            selectedMode: 'false',
            itemGap: 20,
            data: []
        },
        series: [{
            name: '',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: [],
            "label": {
                "normal": {
                    "show": true,
                    "formatter": "{b}"
                },
                "emphasis": {
                    "show": true
                }
            },
            "labelLine": {
                "normal": {
                    "show": true,
                    "smooth": false,
                    "length": 10,
                    "length2": 5
                },
                "emphasis": {
                    "show": true
                }
            },
        }]
    },
    lineChart: {
        title: {
            text: '',
            x: 'center',
            link: '',
            target: 'self'

        },
        grid: {
            left: '5%',
            right: '7%',
            bottom: '5%',
            containLabel: true
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            data: [],
            axisTick: {
                alignWithLabel: true
            }
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: [],
            type: 'line',
            // smooth: true
        }]
    },

    ringPieChart: {
        title: {
            text: '',
            x: 'center'
        },
        color: [
            '#F25C81',
            '#7CB5EC',
            '#F4A45D',
            '#8085ED',
            '#8FCACE',
            '#424246',
            '#348188',
            '#F25C81',
            '#E5D355',
            '#96EE80',
        ],
        legend: {
            type: 'scroll',
            orient: 'vertical',
            x: 'right',
            selected: {
                'Bancor Network': false,
                'Gatecoin': false,
                'BitFlip': false,
                'Braziliex': false,
                'Cobinhood': false,
                'CoinExchange': false,
                'CoinFalcon': false,
                'Cryptomate': false,
                // 'Gatecoin': false,
                'IDEX': false,
                'LiteBit.eu': false,
                'Stocks.Exchange': false,
                'Tidex': false
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: "{b}: {c} ({d}%)"
        },

        series: [{
                name: '',
                type: 'pie',
                selectedMode: 'single',
                radius: [0, '30%'],
                center: ['50%', '50%'],
                label: {
                    normal: {
                        position: 'inner',
                        show: false
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: []
            },
            {
                name: '',
                type: 'pie',
                radius: ['40%', '55%'],
                center: ['50%', '50%'],
                data: []
            }
        ]
    },
    multiLineChart: {
        title: {
            text: '',
            x: 'center'
        },
        legend: {
            type: 'scroll',
            data: []
        },
        grid: {
            left: '3%',
            right: '3%',
            bottom: '5%',
            containLabel: true
        },
        tooltip: {
            trigger: 'axis'
                // position:function(p){   //其中p为当前鼠标的位置
                //   return [p[0] + 10, p[1] - 10];
                //  }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: []
        },
        yAxis: {
            type: 'value'
        },
        series: []
    },
    mapChart: {
        color: ['gold'],
        series: [{
                name: '',
                type: 'map',
                roam: true,
                hoverable: false,
                mapType: 'none',
                itemStyle: {
                    normal: {
                        borderColor: 'rgba(100,149,237,1)',
                        borderWidth: 0.5,
                        areaStyle: {
                            color: '#1b1b1b'
                        }
                    }
                },
                data: [],
                geoCoord: {}
            },
            {
                name: '',
                type: 'map',
                mapType: 'none',
                data: [],
                markPoint: {
                    symbol: 'emptyCircle',
                    symbolSize: function(v) {
                        return 1 + v / 10
                    },
                    effect: {
                        show: true,
                        shadowBlur: 0
                    },
                    itemStyle: {
                        normal: {
                            label: {
                                show: false
                            }
                        },
                        emphasis: {
                            label: {
                                position: 'top'
                            }
                        }
                    },
                    data: []
                }
            }
        ]
    },
    barChart: {
        // color: ['#3398DB'],
        title: {
            text: 'Ranking'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },

        grid: {
            left: 150
        },

        xAxis: {
            type: 'value',
            name: '',
            axisLabel: {
                formatter: '{value}'
            }
        },
        yAxis: {
            type: 'category',
            inverse: true,
            data: []
        },
        series: [

            {
                name: '',
                type: 'bar',
                data: [],
                label: {
                    normal: {
                        show: true,
                        textBorderWidth: 0
                    }
                },
                itemStyle: {}

            }
        ]
    },
    overviewChart: {
        title: {
            text: '',
            x: 'center',
            link: '',
            target: 'self',
            padding: [
                0,
                0,
                10,
                0
            ]
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                animation: false
            }
        },

        toolbox: {
            x2: 5,
            y: -5,
            feature: {
                restore: {
                    title: 'restore'
                },
                saveAsImage: {
                    show: true,
                    title: 'save'
                }
            }
        },
        axisPointer: {
            link: {
                xAxisIndex: 'all'
            }
        },
        dataZoom: [{
                start: 0,
                end: 100,
            },
            {
                type: 'inside'
            }
        ],
        grid: [{
            top: 80,
            left: '10%',
            right: 80,
            containLabel: true
        }],
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            axisLine: {
                onZero: true
            },
            data: []
        }],

        yAxis: [{
            name: '',
            nameGap: 20,
            type: 'value'
        }],
        series: [{
            name: '',
            type: 'line',

            markPoint: {
                data: [{
                    type: 'max',
                    name: 'max'
                }, {
                    type: 'min',
                    name: 'min'
                }]
            },
            data: []
        }]
    },
    overviewHighChart: {
        chart: {
            zoomType: '',
            spacingTop: 5,
            spacingBottom: 0,
            spacingLeft: 0,
            spacingRight: 0,
            resetZoomButton: {
                position: {
                    align: 'right', // right by default
                    verticalAlign: 'top',
                    x: -55,
                    y: 0
                },
                relativeTo: 'chart',
                theme: {
                    fill: 'white',
                    stroke: 'silver',
                    r: 0,
                    states: {
                        hover: {
                            fill: '#eeeeee',
                            style: {
                                color: 'red'
                            }
                        }
                    }
                }

            }
        },
        title: {
            text: '',
            style:{
                color: '#c23631',
                fontSize:"16px"
            }
        },
        credits: {
            enabled: false
        },
        colors: [
            '#c84a45',
            '#e7afad'
        ],
        exporting: {
            enabled: true,
            sourceWidth: 1072,
            sourceHeight: 500,
            filename: ''
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            type: 'datetime',
            ordinal: false,
            dateTimeLabelFormats: {
                millisecond: '%H:%M:%S.%L',
                second: '%H:%M:%S',
                minute: '%H:%M',
                hour: '%H:%M',
                day: '%m-%d',
                week: '%m-%d',
                month: '%Y-%m',
                year: '%Y'
            },
            gridLineColor: '#eeeeee',
            labels: {
                style: {
                    color: "#999999"
                },
                autoRotation: [-10, -20, -30, -40, -50, -60, -70, -80, -90]
            }
        },
        tooltip: {
            dateTimeLabelFormats: {
                millisecond: '%H:%M:%S.%L',
                second: '%H:%M:%S',
                minute: '%H:%M',
                hour: '%H:%M',
                day: '%Y-%m-%d',
                week: '%m-%d',
                month: '%Y-%m',
                year: '%Y'
            }
        },
        yAxis: {
            title: {
                // align: 'high',
                // offset: 0,
                text: '',
                // rotation: 0,
                // x:100,
                // y: -10
            },
            // min: 0,
            //minTickInterval:5
            tickPixelInterval: 30,
            labels: {
                style: {
                    color: "#999999"
                }
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, '#ECC2C1'],
                        [1, '#ffffff']
                    ]
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 2
                    }
                },
                threshold: null,
                column: {
                    pointPadding: 0.1,
                    borderWidth: 0
                }
            }
        },
        series: [{
            type: 'area',
            name: '',
            data: [],
            //turboThreshold: 7000,
            //allowPointSelect: false,
            marker: {
                enabled: true,
                //enabledThreshold: '7'
            }
        }]
    },
    HomeHighChart: {
        chart: {
            zoomType: '',
            spacingTop: 5,
            spacingBottom: 0,
            spacingLeft: 0,
            spacingRight: 0,
            resetZoomButton: {
                position: {
                    align: 'right', // right by default
                    verticalAlign: 'top',
                    x: -55,
                    y: 0
                },
                relativeTo: 'chart',
                theme: {
                    fill: 'white',
                    stroke: 'silver',
                    r: 0,
                    states: {
                        hover: {
                            fill: '#eeeeee',
                            style: {
                                color: 'red'
                            }
                        }
                    }
                }

            }
        },
        title: {
            text: '',
            style: {
                color: '#c23631',
                fontSize:'16px'
            }
        },
        credits: {
            enabled: false
        },
        colors: [
            '#c84a45',
            '#e7afad'
        ],
        exporting: {
            enabled: true,
            sourceWidth: 1072,
            sourceHeight: 500,
            filename: ''
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            type: 'datetime',
            ordinal: false,
            dateTimeLabelFormats: {
                millisecond: '%H:%M:%S.%L',
                second: '%H:%M:%S',
                minute: '%H:%M',
                hour: '%H:%M',
                day: '%m-%d',
                week: '%m-%d',
                month: '%Y-%m',
                year: '%Y'
            },
            gridLineColor: '#eeeeee',
            labels: {
                style: {
                    color: "#999999"
                },
                autoRotation: [-10, -20, -30, -40, -50, -60, -70, -80, -90]
            }
        },
        tooltip: {
            // shared: true,
            dateTimeLabelFormats: {
                millisecond: '%H:%M:%S.%L',
                second: '%H:%M:%S',
                minute: '%H:%M',
                hour: '%H:%M',
                day: '%Y-%m-%d',
                week: '%m-%d',
                month: '%Y-%m',
                year: '%Y'
            }
        },
        yAxis: [{
                title: {
                    // align: 'high',
                    // offset: 0,
                    text: '',
                    // rotation: 0,
                    // x:100,
                    // y: -10
                },
                // min: 0,
                //minTickInterval:5
                tickPixelInterval: 30,
                labels: {
                    style: {
                        color: "#c23631",
                    }
                },
                gridLineWidth: 0
            },
            { // Secondary yAxis
                title: {
                    // align: 'high',
                    // offset: 0,
                    text: '',
                    // rotation: 0,
                    // x:100,
                    // y: -10
                },
                // min: 0,
                //minTickInterval:5
                tickPixelInterval: 30,
                labels: {
                    style: {
                        color: "#333333",
                    }
                },
                opposite: true,
                gridLineWidth: 0

            }
        ],
        legend: {
            // layout: 'vertical',
            align: 'center',
            //x: 80,
            verticalAlign: 'bottom',
            //y: 55,
            floating: false,
            backgroundColor: '#FFFFFF'
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, '#ECC2C1'],
                        [1, '#ffffff']
                    ]
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 2
                    }
                },
                threshold: null,
                column: {
                    pointPadding: 0.1,
                    borderWidth: 0
                }
            }
        },
        series: [{
                type: 'spline',
                name: '',
                data: [],
                //turboThreshold: 7000,
                //allowPointSelect: false,
                color: "#c23631",
                marker: {
                    enabled: false,
                    radius: 1
                        //enabledThreshold: '7'
                }

            },
            {
                type: 'spline',
                name: '',
                data: [],
                //turboThreshold: 7000,
                //allowPointSelect: false,
                color: "#FFAA38",
                marker: {
                    enabled: false,
                    radius: 1
                        //enabledThreshold: '7'
                },
                visible: false
            },
            {
                type: 'spline',
                name: '',
                data: [],
                //turboThreshold: 7000,
                //allowPointSelect: false,
                color: "#FF8A84",
                yAxis: 1,
                marker: {
                    enabled: false,
                    radius: 1
                        //enabledThreshold: '7'
                },
                visible: false
            }
        ]
    },
    ringPieHighChart3D: {
        chart: {
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 45
            },
            spacingTop: 5,
            spacingBottom: 0,
            spacingLeft: 0,
            spacingRight: 0,
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        exporting: {
            enabled: true,
            sourceWidth: 1072,
            sourceHeight: 500,
            filename: ''
        },
        credits: {
            enabled: false
        },
        colors: [
            '#424246',
            '#96EE80',
            '#F4A45D',
            '#8085ED',
            '#F25C81',
            '#E5D355',
            '#348188',
            '#F25C81',
            '#8FCACE',
            '#7CB5EC'
        ],
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                showInLegend: true,
                innerSize: 100,
                depth: 60,
            }
        },
        legend: {
            // itemDistance: 20,
            // symbolWidth: 20,
            // symbolHeight: 12,
            // symbolRadius: 0
            itemStyle: {
                fontWeight: 'normal',
                color: '#666666'
            }
        },
        tooltip: {
            dateTimeLabelFormats: {
                millisecond: '%H:%M:%S.%L',
                second: '%H:%M:%S',
                minute: '%H:%M',
                hour: '%H:%M',
                day: '%Y-%m-%d',
                week: '%m-%d',
                month: '%Y-%m',
                year: '%Y'
            }
        },
        series: [{
            name: '',
            data: []
        }]
    },
    supplyPieHighChart: {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: ''
        },
        credits: {
            enabled: false
        },
        exporting: {
            enabled: true,
            sourceWidth: 562,
            sourceHeight: 400,
            filename: ''
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        colors: [
            '#c84a45',
            '#e7afad'
        ],
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true
                },
                showInLegend: true
            }
        },
        series: [{
            name: '',
            colorByPoint: true,
            data: []
        }]
    },

    supplyAreaHighChart: {
        chart: {
            type: 'area'
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        credits: {
            enabled: false
        },
        xAxis: {
            type: 'datetime',
            ordinal: false,
            dateTimeLabelFormats: {
                millisecond: '%H:%M:%S.%L',
                second: '%H:%M:%S',
                minute: '%H:%M',
                hour: '%H:%M',
                day: '%m-%d',
                week: '%m-%d',
                month: '%Y-%m',
                year: '%Y'
            },
            gridLineColor: '#eeeeee',
            labels: {
                style: {
                    color: "#999999"
                },
                autoRotation: [-10, -20, -30, -40, -50, -60, -70, -80, -90]
            },
            tickmarkPlacement: 'on',
            title: {
                enabled: false
            },
            //categories: ['1750', '1800', '1850', '1900', '1950', '1999', '2050'],
        },

        yAxis: {
            title: {
                text: ''
            },
            labels: {
                style: {
                    color: "#999999"
                }
            },
        },
        tooltip: {
            shared: true,
            valueSuffix: '%',
        },
        exporting: {
            enabled: true,
            sourceWidth: 1072,
            sourceHeight: 500,
            filename: ''
        },
        plotOptions: {
            area: {
                stacking: 'normal',
                lineColor: '#666666',
                lineWidth: 1,
                marker: {
                    lineWidth: 1,
                    lineColor: '#666666',
                    radius: 1
                }
            },

        },
        series: []


    },



    OverallFreezingRateChart: {
        chart: {
            type: '',
            zoomType: 'xy'
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: true,
            align: 'center',
        },
        xAxis: {
            type: 'datetime',
            ordinal: false,
            dateTimeLabelFormats: {
                millisecond: '%H:%M:%S.%L',
                second: '%H:%M:%S',
                minute: '%H:%M',
                hour: '%H:%M',
                day: '%Y-%m-%d',
                week: '%m-%d',
                month: '%Y-%m',
                year: '%Y'
            },
            gridLineColor: '#eeeeee',
            labels: {
                style: {
                    color: "#999999"
                },
                autoRotation: [-10, -20, -30, -40, -50, -60, -70, -80, -90],
                //x:55
            },
            // tickmarkPlacement: 'on',
            // tickPixelInterval: 50,
            title: {
                enabled: false
            },

        },
        yAxis: [

        ],
        tooltip: {

        },
        exporting: {
            enabled: true,
            sourceWidth: 1072,
            sourceHeight: 500,
            filename: ''
        },
        plotOptions: {

        },
        series: []
    },

    HoldTrxAccountChart: {
        chart: {
            type: '',
            zoomType: 'xy'
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: true,
            align: 'center',
        },
        xAxis: {
            type: 'datetime',
            ordinal: false,
            dateTimeLabelFormats: {
                millisecond: '%H:%M:%S.%L',
                second: '%H:%M:%S',
                minute: '%H:%M',
                hour: '%H:%M',
                day: '%Y-%m-%d',
                week: '%m-%d',
                month: '%Y-%m',
                year: '%Y'
            },
            gridLineColor: '#eeeeee',
            labels: {
                style: {
                    color: "#999999"
                },
                autoRotation: [-10, -20, -30, -40, -50, -60, -70, -80, -90],
                //x:55
            },
            // tickmarkPlacement: 'on',
            // tickPixelInterval: 50,
            title: {
                enabled: false
            },

        },
        yAxis: [

        ],
        tooltip: {

        },
        exporting: {
            enabled: true,
            sourceWidth: 1072,
            sourceHeight: 500,
            filename: ''
        },
        plotOptions: {

        },
        series: []
    }

};
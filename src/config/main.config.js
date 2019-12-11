let config = {
    curEnv:'production',
    networkUrl : `https://api.trongrid.io`,
    api:{
        mutiSign:{
            apiPostMutiSignedTansaction:'https://list.tronlink.org/api/wallet/multi/transaction'
        }
    }
}
console.log('----config',config)
if (process.env.RUN_ENV === 'production') { //生产环境
    console.log('>>>Use production config!');
} else if (process.env.RUN_ENV === 'development' ) { //开发环境
    config = Object.assign(config, require('./shasta.config.js'));
} else { // 测试网
    config = Object.assign(config, require('./test.config.js'));
}

module.exports = config;
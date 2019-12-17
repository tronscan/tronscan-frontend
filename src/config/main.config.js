
let config = {
    curEnv:'production',
    networkUrl : `https://api.trongrid.io`,
    api:{
        mutiSign:{
            apiPostMutiSignedTansaction:'https://list.tronlink.org/api/wallet/multi/transaction'
        }
    }
}
console.log('process.env.NODE_ENV',process.env.NODE_ENV)
if (process.env.NODE_ENV === 'production') { //生产环境
    console.log('>>>Use production config!');
} else if (process.env.NODE_ENV === 'development' ) { //开发环境
    config = Object.assign(config, require('./shasta.config.js'));
} else { // 测试网
    config = Object.assign(config, require('./test.config.js'));
}

module.exports = config;
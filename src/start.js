const config = require('../config.json')
const {INSTAGRAM_PARSER} = require('./userListGeter')
const parser = new INSTAGRAM_PARSER(config.ParseConfig.nameOrId,null,config.ParseConfig.proxyConfig);
const start = async ()=>{
    const result = await  parser.init();
    console.log("Done :"+result)
}
start()

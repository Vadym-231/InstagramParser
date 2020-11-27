const fs = require('fs')
const Instagram = require('instagram-web-api')
const config = require('../config.json')
const mongoModel = require('./Mongo/mongo_model')
const mongo = require('./Mongo/Mongo')

class INSTAGRAM_PARSER {
    constructor(nameOrId,numb=20,proxy=null) {
        this.nameOrId = nameOrId;
        this.instagram = null;
        this.id=0;
        this.proxy = proxy;
        this.numb = numb;
        this.mongo = null;
    }
     #checkUserData=async()=>{
        try {
            if(typeof this.nameOrId==='string') {
                const instagram =  new Instagram({proxy:this.proxy||null,username: config.Auth.username, password: config.Auth.password})
                const auth = await instagram.login();
                if(auth.authenticated){
                    const id = await instagram.getUserByUsername({username:this.nameOrId})
                    this.id = Number(id.id);
                    this.instagram =instagram;
                    return true;
                }
                else {
                    return false;
                }
            }
        }catch (e) {
            console.log(e)
            return false;
        }
    }
    async init(){
        const check_config_data= await this.#checkUserData();
        let buff ={},callback;
        if(check_config_data){
           switch (config.Output.type) {
               case 'mongo':
                   callback = await this.#writeData(config.Output.dbUrl,this.#mongoInit)
                    buff = await this.#getUsersData(callback,'',this.id,[])
                   break;
               case 'json':
                     callback = await this.#writeData(config.Output.dirJson,this.#jsonWrite)
                    buff = await this.#getUsersData(callback,'',this.id,[])
                   break;
               default:
                   throw new Error('Type ${this.output.dbUrl} is bad')
           }
            return typeof buff.err === 'undefined';
        }
    }
    #writeData=async(str,func)=>{
        return (any)=>func(str,any);
    }
    #jsonWrite=(dir,data)=>{
        let result = JSON.stringify({data:data})
        fs.writeFileSync(dir, result);
    }
    #mongoInit=async (url,data)=>{
        if(this.mongo===null){
            this.mongo=  new mongo(url)
        }
        let result = await this.mongo.insertData(mongoModel,JSON.parse(data).data)
    }
    #getUsersData=async (callback,after,userId,data)=> {
        try {
            let data_user = await this.instagram.getFollowers({userId: userId, first: 100, after: after})
            if (data_user.page_info.has_next_page) {
                try {
                    this.#getUsersData( callback, data_user.page_info.end_cursor,userId, data.concat(data_user.data))
                } catch (e) {
                    let result = JSON.stringify({data:data})
                    callback(result)
                    return {err:e}
                }
            } else {
                let result = JSON.stringify({data:data})
                callback(result)
                return {};
            }
        }catch (e) {
            let result = JSON.stringify({data:data})
            callback(result)
            return {err:e}
        }
    }
}
module.exports={INSTAGRAM_PARSER}
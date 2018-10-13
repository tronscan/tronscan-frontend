
const getCompiler = function(){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            window.BrowserSolc.loadSolcJson('',(compiler)=>{
                if(compiler){
                    resolve(compiler.compile)
                }else{
                    reject('it is an error')
                }
            })

        },3000)

    })
}


export default getCompiler;

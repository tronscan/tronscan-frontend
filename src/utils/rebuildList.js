export default (list, tokenId, amount) =>{
  let IDmap = {}
  let newList = list.map(item => item)

  const tokenmap = localStorage.getItem('tokensMap')
  IDmap = tokenmap?JSON.parse(tokenmap): {}

  
  if(newList){
    newList.map(item => {
      const id = item[tokenId]
      
      if(!(IDmap[id] || id == "_")){
        console.log('版本没有更新')
        return
      }

      if(id == '_'){
        item.map_token_name = 'TRX'
        item.map_token_id = id
        item.map_token_precision = 6
        item.map_amount = amount?item[amount] / Math.pow(10,6): 0
      }else{
        const list = IDmap[id].split('_')

        item.map_token_name = list[0]
        item.map_token_id = list[1]
        item.map_token_precision = list[2]
        item.map_amount = amount? item[amount] / Math.pow(10,list[2]): 0
      }
     
      return item
    })
    console.log(newList)
    return newList
    
    
  }else{
    console.log('token id is undefined!!')
  }
}
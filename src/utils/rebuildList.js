import {upperCase} from 'lodash'
import {tokensMap} from "./tokensMap.js";
import xhr from "axios/index";
import {API_URL} from '../constants.js'

export default (list = [], tokenId, amount, infolist=false) => {
  let IDmap = {};
  let newList = list.map(item => item);

  const tokenmap = localStorage.getItem('tokensMap');
  IDmap = JSON.parse(tokenmap);


  if(!IDmap){
    getTokensMap().then( date => {
      IDmap = date
      return reSetData()
    })
  }else{
    return reSetData()
  }

  function reSetData(){
    if (newList) {
      if (typeof tokenId === 'string'&& !infolist) {
        newList.map(item => {

          const id = item[tokenId]
          
          if(id == '_' || upperCase(id) == "TRX" || id == ''){
            setItem(item, 'TRX', id, 6, amount?item[amount] / Math.pow(10,6): 0,'TRX')
          }
          if(IDmap[id]){
            const list = IDmap[id].split('_')
            setItem(item, list[0], list[1], list[2], amount? item[amount] / Math.pow(10,list[2]): 0,list[3])
          }
          if(!IDmap[id] && id != "_" && upperCase(id) != "TRX" && id != ''){
            setItem(item, item[tokenId], item[tokenId], 0, item[amount],item[tokenId])
          }
          return item
        })
      } else if(infolist){
        newList.map(obj => {
          obj[infolist].map(item =>{
            const id = item[tokenId]
          
            if(id == '_' || upperCase(id) == "TRX" || id == ''){
              setItem(item, 'TRX', id, 6, amount?item[amount] / Math.pow(10,6): 0,'TRX')
            }
            if(IDmap[id]){
              const list = IDmap[id].split('_')
              setItem(item, list[0], list[1], list[2], amount? item[amount] / Math.pow(10,list[2]): 0,list[3])
            }
            if(!IDmap[id] && id != "_" && upperCase(id) != "TRX" && id != ''){
              setItem(item, item[tokenId], item[tokenId], 0, item[amount],item[tokenId])
            }
            return item
          })
          return obj
        })
      }else {
        newList.map(item => {
          tokenId.map((tid,index) => {
            const id = item[tid]
            
            if(id == '_' || upperCase(id) == "TRX" || id == ''){
              setItem(item, 'TRX', id, 6, amount[index]?item[amount[index]] / Math.pow(10,6): 0,'TRX',index)
            }
            if(IDmap[id]){
              const list = IDmap[id].split('_')
              setItem(item, list[0], list[1], list[2], amount[index]? item[amount[index]] / Math.pow(10,list[2]): 0,list[3],index)
            }
            if(!IDmap[id] && id != "_" && upperCase(id) != "TRX"){
              setItem(item, item[tid], 0, 0, item[amount[index]],item[tid],index)
            }
          });

          return item
        })
      }
      return newList

    } else {
      console.log('token id is undefined!!')
    }
  }
}


function setItem(item,name,id,pre,amount,abbr,index=''){
  index = index == 0? '': index
  item['map_token_name'+index] = name
  item['map_token_name_abbr'+index] = abbr
  item['map_token_id'+index] = id
  item['map_token_precision'+index] = pre
  item['map_amount'+index] =amount

  return item
}

async function  getTokensMap() {
    let {data} = await xhr.get(`${API_URL}/api/token?showAll=1&limit=4000`);
    for (var i = 0; i < data.data.length; i++) {
      if (!tokensMap[data.data[i].id]) {
        tokensMap[data.data[i].id] = data.data[i].name + '_' + data.data[i].id + '_' + data.data[i].precision+'_'+data.data[i].abbr;
      }
    }
    return tokensMap
  }
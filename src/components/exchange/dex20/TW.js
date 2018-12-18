const contranctAddress = 'TGq7uRgKED5G8kYpEoQybR9p9xtcVa5GTD' //'TFFzJbnqNuochqPQtLrJgtJ695aRakfKiW' //'TPXkfbV6tdvbWt5vA261yNC3NCR6QHsrQe'
/**
 * 获取合约
 */
export async function getContract() {
  return await window.tronWeb.contract().at(contranctAddress)
  // return await tronWeb.contract().at(contranctAddress)
}

/**
 * 撤单
 */
export async function cancelOrder(_id) {
    const contract = await getContract()
  
    const transactionID = contract
      .cancelOrder(_id)
      .send()
      .catch(e => {})
    return transactionID
  }





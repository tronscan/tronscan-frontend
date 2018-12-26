//根据priceTickSize 0.00001 返回保留几位小数
export function getDecimalsNum(priceTickSize) {
    let m = priceTickSize.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/)
    let price = priceTickSize.toFixed(Math.max(0, (m[1] || '').length - m[2]))
    if (price.lastIndexOf('.') == -1) {
      return 0
    } else {
      return price.toString().split('.')[1].length
    }
  }

  //只能输入 数字小数点 限定小数点位数  第一位不能是小数点
export function onlyInputNumAndPoint(data, pointLong) {
    var regExp = new RegExp('^(\\-)*(\\d+)\\.(\\d{' + pointLong + '}).*$')
    data = data.replace(/[^\d.]/g, '') //只能输入数字和小数
    data = data.replace(/^\./g, '') //第一位不能输入.
    data = data.replace(/\.{2,}/g, '.') //只保留第一个. 清除多余的
    data = data
      .replace('.', '$#$')
      .replace(/\./g, '')
      .replace('$#$', '.')
    data = data.replace(regExp, '$1$2.$3') //只能输入X个小数
    return data
  }
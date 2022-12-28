//根据priceTickSize 0.00001 返回保留几位小数
export function getDecimalsNum(priceTickSize) {
    let m = priceTickSize.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
    let price = priceTickSize.toFixed(Math.max(0, (m[1] || "").length - m[2]));
    if (price.lastIndexOf(".") == -1) {
        return 0;
    } else {
        return price.toString().split(".")[1].length;
    }
}

//只能输入 数字小数点 限定小数点位数  第一位不能是小数点
export function onlyInputNumAndPoint(data, pointLong) {
    var regExp = new RegExp("^(\\-)*(\\d+)\\.(\\d{" + pointLong + "}).*$");
    data = data.replace(/[^\d.]/g, ""); //只能输入数字和小数
    data = data.replace(/^\./g, ""); //第一位不能输入.
    data = data.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
    data = data
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".");
    data = data.replace(regExp, "$1$2.$3"); //只能输入X个小数
    return data;
}

export function FormatNumberByDecimals(number, decimals) {
    let Newnumber = 0;
    if (!number) {
        return 0;
    }

    if (decimals) {
        const numberString = number.toString();
        const arr = numberString.split(".");
        const cerrentLength = arr[0].length;
        const newString = arr.join("");
        let result = "";
        const diffLenght = cerrentLength - decimals;
        if (diffLenght > 0) {
            let newNum = newString.slice(0, diffLenght);
            while (newNum.length > 3) {
                result = "," + newNum.slice(-3) + result;
                newNum = newNum.slice(0, newNum.length - 3);
            }
            if (newNum) {
                result = newNum + result;
            }
            Newnumber = result + "." + newString.slice(diffLenght);
        } else {
            let dudo = "";
            for (let i = 0; i < Math.abs(diffLenght); i++) {
                dudo += "0";
            }
            Newnumber = "0." + dudo + newString;
        }
        Newnumber = Newnumber.replace(/(\.0+|0+)$/, "");
    } else {
        Newnumber = number;
    }
    return Newnumber;
}

export function FormatNumberByDecimalsBalance(number, decimals) {
    let Newnumber = 0;
    if (!number) {
        return 0;
    }
    let curDecimals = Number(decimals)
    if (curDecimals) {
        const numberString = number.toString();
        const arr = numberString.split(".");
        const cerrentLength = arr[0].length;
        const newString = arr.join("");

        const diffLenght = cerrentLength - decimals;
        if (diffLenght > 0) {
            Newnumber =
                newString.slice(0, diffLenght) + "." + newString.slice(diffLenght);
        } else {
            let dudo = "";
            for (let i = 0; i < Math.abs(diffLenght); i++) {
                dudo += "0";
            }
            Newnumber = "0." + dudo + newString;
        }
        Newnumber = Newnumber.replace(/(\.0+|0+)$/, "");
    } else {
        Newnumber = number;
    }
    return Newnumber;
}

export function toThousands(num) {
    let NUM = (num || 0).toString();
    let arr = NUM.split(".");
    let number = (arr[0] || 0).toString(),
    result = "";
    while (number.length > 3) {
        result = "," + number.slice(-3) + result;
        number = number.slice(0, number.length - 3);
    }
    if (number) {
        if (arr[1]) {
            result = number + result + "." + arr[1];
        } else {
            result = number + result;
        }
    }
    return result;
}

export function toNumber(value) {
    const regNum = /^[1-9][0-9]*$/;
    if ((!Number.isNaN(value) && regNum.test(value))) {
        if (parseInt(value) === 0) {
            return 1;
        } else {
            return parseInt(value);
        }
    } else {
        return '';
    }
}
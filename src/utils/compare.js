function compare(property, type) {
    return function(a, b) {
        var value1 = parseInt(a[property])
        var value2 = parseInt(b[property])
        if (type == 'ascending') {
        return value1 - value2
        } else {
        return value2 - value1
        }
    }
}

exports.compare = compare

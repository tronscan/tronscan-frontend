/**
 * Handle floating point addition
 * @param a
 * @param b
 * @returns {number}
*/
export const add = (a, b) => {
    let c, d, e;
    try {
        c = a.toString().split('.')[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split('.')[1].length;
    } catch (f) {
        d = 0;
    }
    e = Math.pow(10, Math.max(c, d));
    return (mul(a, e) + mul(b, e)) / e;
};

/**
 * Handle floating-point subtraction
 * @param a
 * @param b
 * @returns {number}
*/
export const sub = (a, b) => {
    let c, d, e;
    try {
        c = a.toString().split('.')[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split('.')[1].length;
    } catch (f) {
        d = 0;
    }
    e = Math.pow(10, Math.max(c, d));
    return (mul(a, e) - mul(b, e)) / e;
};

/**
 * Handling floating point multiplication
 * @param a
 * @param b
 * @returns {number}
*/
export const mul = (a, b) => {
    let c = 0;
    let d = a.toString();
    let e = b.toString();
    try {
        c += d.split('.')[1].length;
    } catch (f) {
    }
    try {
        c += e.split('.')[1].length;
    } catch (f) {
    }
    return Number(d.replace('.', '')) * Number(e.replace('.', '')) / Math.pow(10, c);
};

/**
 * Handle floating-point division
 * @param a
 * @param b
 * @returns {number}
*/
export const division = (a, b) => {
    let c, d;
    let e = 0;
    let f = 0;
    try {
        e = a.toString().split('.')[1].length;
    } catch (g) {
    }
    try {
        f = b.toString().split('.')[1].length;
    } catch (g) {
    }
    c = Number(a.toString().replace('.', ''));
    d = Number(b.toString().replace('.', ''));
    return mul(c / d, Math.pow(10, f - e));
};

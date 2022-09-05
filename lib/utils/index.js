function getNowFmt(){
    const date = new Date();
    return `${date.getFullYear()}-${add0(date.getMonth() + 1)}-${add0(date.getDate() + 1)} ${add0(date.getHours())}:${add0(date.getMinutes())}:${add0(date.getSeconds())}`

    function add0(v){
        return v<10 ? `0${v}` : v;
    }
}

function isNil(x){
    return x === undefined || x === null
}

function isString(x){
    return typeof x === 'string'
}

function isFunction(x){
    return typeof x === 'function'
}

function pick(source,pickKeys){
    return pickKeys.reduce((acc,k)=>{
        acc[k] = source[k];
        return acc;
    },{})
}

function hasData(x){
    if(!Array.isArray(x)) return false;
    return x.length;
}

const utils = {
    isNil,
    isFunction,
    isString,
    hasData,
    pick,
    getNowFmt
}

module.exports = utils;

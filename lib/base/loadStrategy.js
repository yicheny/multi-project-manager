//dict 对象类型
const utils = require("../utils");

function curryLoadByExt(dict){
    return (resourcePath)=>{
        if(!utils.isString(resourcePath)) throw new Error('curryGetItemByExt Error: resourcePath must be of type string')
        const [k,v] = Object.entries(dict).find(([k])=>resourcePath.endsWith(k)) || [];
        return v;
    }
}

const loadStrategy = {
    curryLoadByExt
}


module.exports = loadStrategy

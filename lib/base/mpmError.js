const fs = require('fs');
const process = require('process');
const utils = require('../utils');
const {mpmErrorTypeEnum} = require('../shared/Enums')

class mpmError {
    constructor() {
        this._value = [];
        this._path = './';
    }

    hasError(){
        return this._value.some(x=>x.type === mpmErrorTypeEnum.error);
    }

    value() {
        return this._value;
    }

    setLogPath(value) {
        if(typeof value !== 'string') return null;
        this._path = value;
    }

    _output() {
        this.value().unshift({
            type:mpmErrorTypeEnum.normal,
            text:`Log output time：${utils.getNowFmt()}\r\n` //这里多空一行方便阅读
        })
        return this.value().map((data)=>data.text).join('\r\n')
    }

    createLog() {
        if(!this.hasError()) return null;
        const logName = `mpm_error_log_${Date.now()}.txt`;
        fs.writeFileSync(`${this._path}/${logName}`, this._output());
        process.exit();
    }

    addValues({type=mpmErrorTypeEnum.normal,texts}){
        texts.forEach((item)=>{
            const text = item instanceof Error ? item.stack : item;
            this.value().push({ type, text })
        })
    }
}

module.exports = new mpmError();

const utils = require("../utils");

//作为抽象类使用
//统一子类 构造函数和API的 入参和返回值
class Config{
    constructor(sourceConfig,classify) {
        this._value = {};
    }

    static create(sourceConfig,classify){
        return new Config(sourceConfig,classify)
    }

    getValue(){
        // throw new Error("此方法由子类实现，返回对象类型！")
        return this._value;
    }
}

class JsonConfig extends Config{
    static create(sourceConfig,classify){
        return new JsonConfig(sourceConfig,classify)
    }

    constructor(sourceConfig,classify) {
        super();
        this._sourceConfig = sourceConfig;
        this._value = utils.pick(this._sourceConfig,['isRecovery','scripts','errorLogPath'])
        this._value.classify = classify;
        Object.assign(this._value,this._sourceConfig.classifyConfig[this.value.classify])
    }
}

class JsConfig extends Config{
    static create(sourceConfig,classify){
        return new JsConfig(sourceConfig,classify)
    }

    constructor(source) {
        super();
        this._value = utils.isFunction(source) ? source() : source;
    }
}

module.exports = {
    JsConfig,
    JsonConfig
}

const utils = require("../utils");

//作为抽象类使用
//统一子类 构造函数和API的 入参和返回值
class Config{
    constructor(sourceConfig) {
        this._value = {};
    }

    static create(sourceConfig){
        return new Config(sourceConfig)
    }

    getValue(){
        // throw new Error("此方法由子类实现，返回对象类型！")
        return this._value;
    }
}

class JsonConfig extends Config{
    static create(sourceConfig){
        return new JsonConfig(sourceConfig)
    }

    constructor(sourceConfig) {
        super();
        this._value = sourceConfig;
    }
}

class JsConfig extends Config{
    static create(sourceConfig){
        return new JsConfig(sourceConfig)
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

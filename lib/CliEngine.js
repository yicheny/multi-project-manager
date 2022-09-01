const path = require('path');
const pathEnhance = require('../lib/pathEnhance')
const mpmError = require('../lib/mpmError')
const utils = require("./utils");
const log = require("./log");
const createExecOrder = require("../lib/createExecOrder")
const importFresh = require('import-fresh')

class CliEngine {
    constructor(classify, configPath) {
        this._pathControl = new PathControl(configPath)
        this._config = this._pathControl.getConfig(classify).value;

        this._setMpmError()
    }

    _setMpmError() {
        mpmError.setLogPath(this._pathControl.getNameResolveDir(this._config.errorLogPath))
    }

    async executeScripts() {
        const execOrder = createExecOrder(log)
        const hasScripts = Array.isArray(this._config.scripts) && (this._config.scripts.length > 0)
        if (!hasScripts) return null;
        log.primary("\nExecute custom scripts!\n");

        //串行
        for (const s of this._config.scripts) {
            await execOrder(s);
        }

        //并行
        // const orderList = this._config.scripts.map((s) => execOrder(s));
        // await Promise.all(orderList);

        log.success("Custom scripts executed successfully!\n")
    }
}

module.exports = CliEngine

//Helpers
class PathControl {
    constructor(originalPath) {
        this._originalPath = originalPath;
    }

    get _absolutePath() {
        return pathEnhance.getAbsoluteFilePath(this._originalPath)
    }

    get _dirName() {
        return path.dirname(this._absolutePath)
    }

    getConfig(classify) {
        const validateExt = ext =>  this._absolutePath.endsWith(ext);

        const sourceConfig = importFresh(this._absolutePath);
        if(validateExt('.json')) return new JsonConfig(sourceConfig,classify);
        if(validateExt('.js')) return new JsConfig(sourceConfig);
    }

    getNameResolveDir(filePath) {
        return path.resolve(this._dirName, filePath)
    }
}

class JsonConfig {
    constructor(sourceConfig,classify) {
        this._sourceConfig = sourceConfig;
        this.value = utils.pick(this._sourceConfig,['isRecovery','scripts','errorLogPath'])
        this.value.classify = classify;
        Object.assign(this.value,this._sourceConfig.classifyConfig[this.value.classify])
    }
}

class JsConfig{
    constructor(source) {
        this.value = utils.isFunction(source) ? source() : source;
    }
}

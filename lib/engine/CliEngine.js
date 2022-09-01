const path = require('path');
const importFresh = require('import-fresh')
const pathEnhance = require('../base/pathEnhance')
const mpmError = require('../base/mpmError')
const log = require("../base/log");
const createExecOrder = require("../createExecOrder")
const {JsonConfig, JsConfig} = require("./Config");
const loadStrategy = require("../base/loadStrategy");

class CliEngine {
    constructor(classify, configPath) {
        this._pathControl = new PathControl(configPath);
        this._config = this._pathControl.getConfig(classify).getValue();

        this._setMpmError();
    }

    async execute(){
        await this._executeBeforeWork();
        await this._executeCore();
        await this._executeAfterWork();
    }

    _setMpmError() {
        mpmError.setLogPath(this._pathControl.getNameResolveDir(this._config.errorLogPath));
    }

    async _executeCore(){
        console.log(this._config);
    }

    async _executeBeforeWork(){
        await this._executeScripts(this._config.beforeWork,'BeforeWork');
    }

    async _executeAfterWork(){
        await this._executeScripts(this._config.afterWork,'AfterWork');
    }

    async _executeScripts(scripts,hook) {
        const execOrder = createExecOrder(log);
        const hasScripts = Array.isArray(scripts) && (scripts.length > 0);
        if (!hasScripts) return null;
        log.primary(`\nExecute ${hook} scripts!\n`);

        //串行
        for (const s of scripts) {
            await execOrder(s);
        }

        //并行
        // const orderList = this._config.scripts.map((s) => execOrder(s));
        // await Promise.all(orderList);

        log.success(`${hook} scripts executed successfully!\n`);
    }
}

//Helpers
class PathControl {
    constructor(originalPath) {
        this._originalPath = originalPath;
    }

    getConfig(classify) {
        this._checkPath();
        const sourceConfig = importFresh(this._absolutePath);

        const dict = {
            '.json':JsonConfig,
            '.js':JsConfig
        }
        return loadStrategy.curryLoadByExt(dict)(this._absolutePath).create(sourceConfig,classify)
    }

    getNameResolveDir(filePath) {
        return path.resolve(this._dirName, filePath);
    }

    get _absolutePath() {
        return pathEnhance.getAbsoluteFilePath(this._originalPath);
    }

    get _dirName() {
        return path.dirname(this._absolutePath);
    }

    _checkPath (){
        if(['.json','.js'].some(ext=>this._absolutePath.endsWith(ext))) return
        throw new Error('The config suffix is abnormal, it must be one of .js and .json!')
    }
}

module.exports = CliEngine



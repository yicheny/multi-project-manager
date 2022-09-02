const path = require('path');
const importFresh = require('import-fresh')
const {JsonConfig, JsConfig} = require("./Config");
const {executeScripts,loadStrategy,pathEnhance,mpmError} = require('../base')

class CliEngine {
    constructor(configPath) {
        this._pathControl = new PathControl(configPath);
        this._config = this._pathControl.getConfig().getValue();

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
        const {operations,projects} = this._config
        // console.log(branch,operation,projects);
        for(const project of projects){
            const absPath = this._pathControl.getNameResolveDir(project)
            // const scripts = [`cd ${absPath}`].concat(operations);
            // const scripts = [`cd ${absPath}`];
            // console.log(scripts)

            //需要切换执行时的上下文目录
            process.chdir(absPath)
            await executeScripts(operations,`${absPath} Scripts`)
            //执行结束后需要切回原目录
            process.chdir(this._pathControl.dirName)
        }
    }

    async _executeBeforeWork(){
        await executeScripts(this._config.beforeWork,'BeforeWork');
    }

    async _executeAfterWork(){
        await executeScripts(this._config.afterWork,'AfterWork');
    }
}

//Helpers
class PathControl {
    constructor(originalPath) {
        this._originalPath = originalPath;
        this.filePath = pathEnhance.getAbsoluteFilePath(this._originalPath)
        this.dirName = path.dirname(this.filePath)
    }

    getConfig() {
        this._checkPath();
        const sourceConfig = importFresh(this.filePath);

        const dict = {
            '.json':JsonConfig,
            '.js':JsConfig
        }
        return loadStrategy.curryLoadByExt(dict)(this.filePath).create(sourceConfig)
    }

    getNameResolveDir(filePath) {
        return path.resolve(this.dirName, filePath);
    }

    _checkPath (){
        if(['.json','.js'].some(ext=>this.filePath.endsWith(ext))) return
        throw new Error('The config suffix is abnormal, it must be one of .js and .json!')
    }
}

module.exports = CliEngine



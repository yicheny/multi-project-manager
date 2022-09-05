const createExecOrder = require("./createExecOrder");
const log = require("./log");
const utils = require('../utils')

async function executeScripts(scripts,hook) {
    const execOrder = createExecOrder(log);
    if (!utils.hasData(scripts)) return null;
    log.primary(`\nExecute ${hook} scripts!\n`);

    //串行
    for (const s of scripts) {
        log.primary(`"${s}" command starts to execute\n`)
        await execOrder(s);
        log.success(`"${s}" executed successfully!\n`)
    }

    //并行
    // const orderList = this._config.scripts.map((s) => execOrder(s));
    // await Promise.all(orderList);

    log.success(`${hook} scripts executed successfully!\n`);
}

module.exports = executeScripts

const createExecOrder = require("./createExecOrder");
const log = require("./log");

async function executeScripts(scripts,hook) {
    const execOrder = createExecOrder(log);
    const hasScripts = Array.isArray(scripts) && (scripts.length > 0);
    if (!hasScripts) return null;
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

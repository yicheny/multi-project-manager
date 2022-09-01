const colors = require('colors/safe');
const mpmError = require('./mpmError');
const { mpmErrorTypeEnum } = require("../shared/Enums");

const log = {
    info(...text) {
        mpmError.addValues({ texts: [text] });
        console.log(...text)
    },
    primary(coreInfo, ...normalInfo) {
        mpmError.addValues({ texts: [coreInfo, ...normalInfo] });
        console.log(colors.blue(coreInfo), ...normalInfo);
    },
    error(coreInfo, ...normalInfo) {
        mpmError.addValues({ type: mpmErrorTypeEnum.error, texts: [coreInfo, ...normalInfo] });
        console.log(colors.red(coreInfo), ...normalInfo)
    },
    success(coreInfo, ...normalInfo) {
        mpmError.addValues({ texts: [coreInfo, ...normalInfo] });
        console.log(colors.green(coreInfo), ...normalInfo)
    }
}

module.exports = log;

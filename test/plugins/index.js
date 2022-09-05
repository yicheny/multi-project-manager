const DirE = require('../../lib/base/DirEnhance')

function testPlugin(){
    return ({absPath}) => {
        console.log('testPlugin',absPath)
    }
}

function deleteGitPlugin(open=false){
    return ({absPath}) => {
        if(!open) return null;
        DirE.deleteDirSync(`${absPath}/.git`)
    }
}

module.exports = {
    testPlugin,
    deleteGitPlugin
}

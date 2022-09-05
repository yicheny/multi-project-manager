const dirE = require('../../../lib/base/DirEnhance')

const project1Path ='F:/Work/multi-project-manager/test/project1/.git'

const readRecursion = dirE.createRecursion(
    filePath=>console.log('filePath',filePath),
        dirPath=>console.log('dirPath',dirPath)
)

// readRecursion(project1Path)

// dirE.deleteDirSync(project1Path)


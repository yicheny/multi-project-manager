const fs = require( 'fs' );

const alertError = console.error;

/*
 * 复制目录、子目录，及其中的文件
 * @param source {String} 要复制的目录
 * @param target {String} 复制到目标目录
 * @param ignoreList {Array} 忽略复制目录的数组
 */
function copyDirSync(source, target, ignoreList=[]) {
    try{
        fs.accessSync(target);
    }catch (e) {
        fs.mkdirSync(target);
    }finally{
        _copy(null, source, target);
    }

    function _copy(err, source, target) {
        if(err) return alertError(err);
        try{
            const paths = fs.readdirSync(source);
            paths.forEach(function(path) {
                const _source = ''.concat(source,'/',path);
                const _target = ''.concat(target,'/',path);
                if(ignoreList.includes(_source)) return;
                try{
                    const stat = fs.statSync(_source);
                    if(stat.isFile()) return fs.writeFileSync(_target, fs.readFileSync(_source));
                    if(stat.isDirectory()) return copyDirSync(_source, _target, ignoreList);
                }catch (e) {
                    alertError(e);
                }
            })
        }catch(e){
            alertError(e);
        }
    }
}

/*
 * 删除指定目录或文件
 * @param path {String} 要删除的路径
 */
const deleteDirSync = createRecursion(fs.unlinkSync,fs.rmdirSync)

/*
 * 复制源目录至多个指定目录下【先删除再复制】
 * @param source {String} 源目录
 * @param targetList {Array} 指定目录数组
 * @param ignoreList {Array} 忽略复制目录的数组
 */
function copyListSync(source,targetList,ignoreList=[]){
    if(!Array.isArray(targetList)) return console.log('copyListSync Error: targetList must be an array!');
    targetList.forEach(target=>{
        deleteDirSync(target);
        copyDirSync(source,target,ignoreList);
    });
    console.log(`Successfully copied to all specified directories!`);
}

/*
*   递归遍历某个目录
* */
function createRecursion(fileCallback,dirCallback,Seq='/'){
    return function recursion(path){
        if( fs.existsSync(path) ) {
            const files = fs.readdirSync(path);
            files.forEach((file,index) => {
                const curPath = ''.concat(path,Seq,file);
                if(fs.statSync(curPath).isDirectory()) {
                    recursion(curPath);
                } else {
                    fileCallback(curPath)
                }
            });
            dirCallback(path);
        }
    }
}

const dirEnhance = {
    copyDirSync,
    deleteDirSync,
    copyListSync,
    createRecursion
}

module.exports = dirEnhance;

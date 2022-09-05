const {testPlugin,deleteGitPlugin} = require('./plugins')

module.exports = function createConfig() {
    return {
        "createLog":false,
        "errorLogPath": "./logs",
        "operations": [
            // 'git init',
            // "git add .",
            // "git status",
            // "git commit -m \"this is commit 1\"",
            // "git log",
            // "git branch 0.0.1",
            // "git branch -a"
        ],
        "plugins":[
            testPlugin(),
            deleteGitPlugin(),
            // deleteGitPlugin(true)
        ],
        "projects": [
            './project1',
            './project2',
            './project3'
        ],
        "beforeWork": [
            // 'mpm -v'
        ],
        "afterWork": [
            // 'mpm -v'
        ],
        "noneScripts": [
            "mpm --time=5",
            "mpm --time=4",
            "mpm --read=./test/packInfo.json",
            "mpm -v",
            "mpm -h",
            "mpm --test",
            "mockMpm --test"
        ]
    }

}



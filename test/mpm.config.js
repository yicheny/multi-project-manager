module.exports = function createConfig(){
  return {
    "errorLogPath": "./logs",
    "branch": "0.0.1",
    "type": "add",
    "projects": [

    ],
    "beforeWork": [
        'mpm -v'
    ],
    "afterWork": [
      'mpm -v'
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

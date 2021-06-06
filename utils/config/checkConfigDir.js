const fs = require('fs');

function checkConfigDir(configDir) {
    if (!fs.existsSync(configDir)){
        fs.mkdirSync(configDir);
    }
}

module.exports.checkConfigDir = checkConfigDir;
const fs = require('fs');

async function setChannelPointsSounds(soundsSettingsFilePath, newSettings) {
    try {
        fs.writeFileSync(soundsSettingsFilePath,JSON.stringify(newSettings));
        return true;
    }
    catch(error) {
        console.log(error);
        return false;
    }
}

module.exports.setChannelPointsSounds = setChannelPointsSounds;
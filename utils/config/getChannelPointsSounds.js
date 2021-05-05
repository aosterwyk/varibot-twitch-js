const fs = require('fs');
const util = require('util');

async function getChannelPointsSounds(soundsSettingsFilePath) {
    let botSettings = {};
    const readFile = util.promisify(fs.readFile);
    if(fs.existsSync(soundsSettingsFilePath)) {     
        try {
            const settingsFile = await readFile(soundsSettingsFilePath);
            botSettings = JSON.parse(settingsFile);
        }
        catch(error) {
            console.log(error);
            return undefined;
        }
    }
    else {
        let errorMsg = `Could not load file: ${soundsSettingsFilePath}`;
        console.error(errorMsg);
        return undefined;
    }
    return botSettings;
}

module.exports.getChannelPointsSounds = getChannelPointsSounds;

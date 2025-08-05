const fs = require('fs');
const util = require('util');

async function getChannelPointsSounds(soundsSettingsFilePath) {
    let botSettings = {};
    const readFile = util.promisify(fs.readFile);
    if(fs.existsSync(soundsSettingsFilePath)) {     
        try {
            const settingsFile = await readFile(soundsSettingsFilePath);
            let rawSettings = JSON.parse(settingsFile);
            // Convert to {rewardName: [filenames]} format
            for(let key in rawSettings) {
                if(rawSettings[key] && Array.isArray(rawSettings[key].filename)) {
                    botSettings[key] = rawSettings[key].filename;
                } else if(rawSettings[key] && typeof rawSettings[key].filename === 'string') {
                    botSettings[key] = [rawSettings[key].filename];
                } else if(Array.isArray(rawSettings[key])) {
                    botSettings[key] = rawSettings[key];
                } else {
                    botSettings[key] = [];
                }
            }
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

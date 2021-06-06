const fs = require('fs');
const { getBotSettings } = require('./getBotSettings');

async function setBotSettings(botSettingsFilePath, setting, newValue) {
    let newSettings = {}; 
    if(fs.existsSync(botSettingsFilePath)) {
        let foundSetting = false;
        const oldSettings = await getBotSettings(botSettingsFilePath);
        for(let key in oldSettings) {
            if(key == setting) { 
                newSettings[key] = newValue;
                foundSetting = true;
            }
            else {
                newSettings[key] = oldSettings[key];
            }
        }
        if(!foundSetting) {
            newSettings[setting] = newValue;
        }
    }
    else {
        newSettings[setting] = newValue;
    }
    try {
        fs.writeFileSync(botSettingsFilePath,JSON.stringify(newSettings));
        return true;
    }
    catch(error) {
        console.log(error);
        return false;
    }
}

module.exports.setBotSettings = setBotSettings;
const fs = require('fs');
const { getBotSettings } = require('./getBotSettings');

async function setBotSettings(botSettingsFile, setting, newValue) {

    let newSettings = {}; 
    if(fs.existsSync(botSettingsFile)) {
        let foundSetting = false;
        const oldSettings = await getBotSettings(botSettingsFile);
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
        fs.writeFileSync(botSettingsFile,JSON.stringify(newSettings));
        return true;
    }
    catch(error) {
        console.log(error);
        return false;
    }
}

module.exports.setBotSettings = setBotSettings;
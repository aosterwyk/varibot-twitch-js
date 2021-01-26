const { getBotSettings } = require('./getBotSettings');
const fs = require('fs');

async function setBotSettings(botSettingsFilePath, newSettings) {
    // let oldBotSettings = await getBotSettings(botSettingsFilePath);
    // let newBotSettings = {};
    // loop through settings and replace value if key exists in new settings

    newSettings = JSON.stringify(newSettings);
    fs.writeFile(botSettingsFilePath, newSettings, 'utf8', (error) => {
        if(error) {
            console.error(error);
            return false;
        }
    },);
    return true;
}

module.exports.setBotSettings = setBotSettings;
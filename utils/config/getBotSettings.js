const fs = require('fs');
const util = require('util');

async function getBotSettings(botSettingsFilePath) {
    let botSettings = {};
    const readFile = util.promisify(fs.readFile);
    if(fs.existsSync(botSettingsFilePath)) {     
        try {
            const settingsFile = await readFile(botSettingsFilePath);
            botSettings = JSON.parse(settingsFile);
            botSettings.successful = true;
            // console.log(botSettings);
        }
        catch(error) {
            console.log(error);
            botSettings.error = error;
            botSettings.successful = false;
        }
    }
    else {
        let errorMsg = `Could not load file: ${botSettingsFilePath}`;
        console.error(errorMsg);
        botSettings.error = errorMsg;
        botSettings.successful = false;
    }
    return botSettings;
}

module.exports.getBotSettings = getBotSettings;

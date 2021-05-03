const { getBotSettings } = require('./getBotSettings');
const fs = require('fs');

async function setBotSettings(botSettingsFilePath, option, newValue) {
    let oldBotSettings = await getBotSettings(botSettingsFilePath);
    let newBotSettings = {};
    // loop through settings and replace value if key exists in new settings

    console.log(`Setting ${option} to ${newValue}`);
    console.log(oldBotSettings);

    if(oldBotSettings.successful) {
        let valueUpdated = false;
        for(let key in oldBotSettings) {
            if(option == key) {
                newBotSettings[option] = newValue;
                console.log(`found ${option} in old bot settings, changing from ${oldBotSettings[option]} to ${newValue}`);
                valueUpdated = true;
            }
        }
        if(!valueUpdated) {
            console.log(`did not find ${option} in old bot settings, creating new key`);
            newBotSettings[option] = newValue;
        }
    }
    else { // config file doesn't exist. you should only get here once.
        newBotSettings[option] = newValue;
    }

    fs.writeFile(botSettingsFilePath, JSON.stringify(newBotSettings), 'utf8', (error) => {
        if(error) {
            // console.error(error);
            console.log(`error!`);
            return false;
        }
    },
    console.log(`Wrote file ${botSettingsFilePath}`)
    );
    return true;
}

module.exports.setBotSettings = setBotSettings;
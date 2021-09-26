const fs = require('fs');
const util = require('util');

async function getLightChannelPointRewards(lightRewardsSettingsFilePath) {
    let botSettings = {};
    const readFile = util.promisify(fs.readFile);
    if(fs.existsSync(lightRewardsSettingsFilePath)) {     
        try {
            const settingsFile = await readFile(lightRewardsSettingsFilePath);
            botSettings = JSON.parse(settingsFile);
        }
        catch(error) {
            console.log(error);
            return undefined;
        }
    }
    else {
        let errorMsg = `Could not load file: ${lightRewardsSettingsFilePath}`;
        console.error(errorMsg);
        return undefined;
    }
    return botSettings;
}

module.exports.getLightChannelPointRewards = getLightChannelPointRewards;

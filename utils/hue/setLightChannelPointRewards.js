const fs = require('fs');

async function setLightChannelPointRewards(lightRewardsSettingsFilePath, newSettings) {
    try {
        fs.writeFileSync(lightRewardsSettingsFilePath,JSON.stringify(newSettings));
        return true;
    }
    catch(error) {
        console.log(error);
        return false;
    }
}

module.exports.setLightChannelPointRewards = setLightChannelPointRewards;
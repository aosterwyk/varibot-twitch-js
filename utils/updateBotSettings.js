const { botSettingsDB } = require('./db/botSettingsDB');

async function updateBotSettings(option, newValue) { 
    await botSettingsDB.sync();
    await botSettingsDB.update({
        [option]: newValue,
    }, {
        where: {
            id: 1
        }
    });  
}

module.exports.updateBotSettings = updateBotSettings;
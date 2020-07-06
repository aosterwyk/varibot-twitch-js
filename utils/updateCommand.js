const { commandsDB } = require('./db/commandsDB');

async function updateCommand(command, option, newValue) {
    await commandsDB.sync();
    await commandsDB.update({
        [option]: newValue,
    }, {
        where: {
            name: command
        }
    });    
}

module.exports.updateCommand = updateCommand;
const Sequelize = require('sequelize');
const { db } = require("./db");

const commandsDB = db.define('commands', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    scope: {
        type: Sequelize.STRING,
        allowNull: true
    },
    cooldown: {
        type: Sequelize.STRING,
        allowNull: true
    },
    enabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    result: {
        type: Sequelize.STRING,
        allowNull: true
    },
    cmdType: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    // sequelize options
});

module.exports.commandsDB = commandsDB;

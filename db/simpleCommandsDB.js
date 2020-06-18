const Sequelize = require('sequelize');
const { db } = require("./db");

const simpleCommandsDB = db.define('simpleCommands', {
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
    }
}, {
    // sequelize options
});

module.exports.simpleCommandsDB = simpleCommandsDB; 

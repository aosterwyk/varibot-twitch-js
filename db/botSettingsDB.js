const Sequelize = require('sequelize');
const { db } = require("./db");

const botSettingsDB = db.define('botSettings', {
    username: {
        type: Sequelize.STRING,
        allowNull: true
    },
    token: {
        type: Sequelize.STRING,
        allowNull: true
    },
    clientId: {
        type: Sequelize.STRING,
        allowNull: true
    },
    channel: {
        type: Sequelize.STRING,
        allowNull: true
    },
    cooldown: {
        type: Sequelize.FLOAT,
        allowNull: true
    },
    soundsDir: {
        type: Sequelize.STRING,
        allowNull: true
    },
    googleSheetsClientEmail: { 
        type: Sequelize.STRING,
        allowNull: true
    },
    googleSheetsPrivateKey: { 
        type: Sequelize.STRING,
        allowNull: true
    },
    beatSheetID: { 
        type: Sequelize.STRING,
        allowNull: true
    },
    beatSpreadSheetID: { 
        type: Sequelize.STRING,
        allowNull: true
    },
    beatGameSound: { 
        type: Sequelize.STRING,
        allowNull: true
    },
    ownedGamesSpreadSheetID: { 
        type: Sequelize.STRING,
        allowNull: true
    }
}, {
    // sequelize options
});

module.exports.botSettingsDB = botSettingsDB; 


const Sequelize = require('sequelize');
const { db } = require("./db");

const botSettingsDB = db.define('botSettings', {
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    token: {
        type: Sequelize.STRING,
        allowNull: false
    },
    clientId: {
        type: Sequelize.STRING,
        allowNull: false
    },
    channel: {
        type: Sequelize.STRING,
        allowNull: false
    },
    cooldown: {
        type: Sequelize.FLOAT,
        allowNull: false
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


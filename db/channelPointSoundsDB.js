const Sequelize = require('sequelize');
const { db } = require("./db");

const channelPointsSoundsDB = db.define('channelPointsSounds', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    filename: {
        type: Sequelize.STRING,
        allowNull: true
    }
}, {
    // sequelize options
});

module.exports.channelPointsSoundsDB = channelPointsSoundsDB;

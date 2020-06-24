const Sequelize = require('sequelize');
const { app } = require('electron');

const dbPath = `${app.getPath('appData')}\\varibot\\varibot.sqlite`;

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: false
  });

module.exports.db = sequelize;

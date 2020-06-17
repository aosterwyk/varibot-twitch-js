const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'varibot.sqlite',
    logging: false
  });

module.exports.db = sequelize;

const sequelize = require("sequelize");

const db = new sequelize("arkademy", "root", "", {
    dialect: "postgres"
});

db.sync({});

module.exports = db;
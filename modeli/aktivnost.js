const Sequelize = require("sequelize");
const sequelize = require("../baza.js");

module.exports = function (sequelize) {
const Aktivnost = sequelize.define('Aktivnost', {
    naziv: {
        type: Sequelize.STRING,
    },

    pocetak: {
        type: Sequelize.FLOAT,
    },

    kraj: {
        type: Sequelize.FLOAT,
    }

 })
 return Aktivnost;
}
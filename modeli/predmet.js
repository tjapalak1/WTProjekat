const Sequelize = require("sequelize");
const sequelize = require("../baza.js");
module.exports = function (sequelize) {
const Predmet = sequelize.define('Predmet', {
    naziv: {
        type: Sequelize.STRING,
    }
 })
 return Predmet;
}
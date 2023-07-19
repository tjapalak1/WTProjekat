const Sequelize = require("sequelize");
const sequelize = require("../baza.js");

module.exports = function (sequelize) {
const Tip = sequelize.define('Tip', {
    naziv: {
        type: Sequelize.STRING,
    }
 })
 return Tip;
}
const Sequelize = require("sequelize");
const sequelize = require("../baza.js");

module.exports = function (sequelize) {
const Dan = sequelize.define('Dan', {
    naziv: {
        type: Sequelize.STRING,
    }
 })
 return Dan;
}
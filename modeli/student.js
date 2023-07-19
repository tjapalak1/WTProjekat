const Sequelize = require("sequelize");
const sequelize = require("../baza.js");

module.exports = function (sequelize) {
const Student = sequelize.define('Student', {
    ime: {
        type: Sequelize.STRING,
    },

    index: {
        type: Sequelize.STRING,
    }

 })
 return Student;
}
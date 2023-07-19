const Sequelize = require("sequelize");
const sequelize = require("../baza.js");

module.exports = function (sequelize) {
    const Grupa = sequelize.define('Grupa', {
        // Model attributes are defined here
        naziv: {
            type: Sequelize.STRING,
            allowNull: false
        },
    }, {
        name: {
            singular: 'Grupa',
            plural: 'Grupe',
        }
    });
 return Grupa;
}
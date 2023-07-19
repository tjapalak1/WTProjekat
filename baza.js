const Sequelize = require("sequelize");
const sequelize = new Sequelize('wt2018202', 'root', 'root', { //promijeniti password u root
    host: 'localhost',
    dialect: 'mysql'
});


const Student = require("./modeli/student.js")(sequelize)
const Tip = require("./modeli/tip.js")(sequelize)
const Dan = require("./modeli/dan.js")(sequelize)
const Aktivnost = require("./modeli/aktivnost.js")(sequelize)
const Grupa = require("./modeli/grupa.js")(sequelize)
const Predmet = require("./modeli/predmet.js")(sequelize)

module.exports=sequelize;
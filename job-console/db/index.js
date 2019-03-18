const Knex = require('knex');
const config = require('../knexfile');

const knex = Knex(config);
module.exports = knex;
module.exports.testConnection = () => knex.select(1).then(() => knex.migrate.latest());

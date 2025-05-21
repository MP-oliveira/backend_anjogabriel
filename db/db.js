const { Sequelize } = require('sequelize');
require('pg'); // Explicitly require pg

const db = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Necessário para alguns provedores
    }
  }
})

console.log('Conectando ao banco:', process.env.DATABASE_URL);

try {
  db.authenticate()
  console.log('Connection has been established successfully.');
} catch (error) {
  console.log(error)
}

module.exports = db
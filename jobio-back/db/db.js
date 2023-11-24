const { Pool } = require('pg');
require('dotenv').config()

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'jobio',
    password: process.env.DB_PASSWORD,
    port: 5432,
});


module.exports = {
    pool,
}
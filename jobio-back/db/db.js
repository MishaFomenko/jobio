

const { Client } = require('pg');

const pool = new Client({
    connectionString: process.env.DB_URI,

    ssl: {
        rejectUnauthorized: false
    },
    keepAlive: true,
});

pool.connect(err => {
    if (err) {
        console.error('Database connection error', err.message);
    } else {
        console.log('Connected to the database successfully');
    }
});

module.exports = {
    pool,
}
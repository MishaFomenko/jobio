// const { Pool } = require('pg');
// require('dotenv').config()

// const pool = new Pool({
//     user: 'uvrbaxglnemtdl',
//     host: 'ec2-44-213-228-107.compute-1.amazonaws.com',
//     database: 'd5qlerqgoilt8v',
//     password: '57107fff514145ef583405e0fe1cf1c57d6bce6471635f12596dfab5e3d4a25f',
//     port: '5432',
// })

const { Client } = require('pg');

const pool = new Client({
    connectionString: 'postgres://uvrbaxglnemtdl:57107fff514145ef583405e0fe1cf1c57d6bce6471635f12596dfab5e3d4a25f@ec2-44-213-228-107.compute-1.amazonaws.com:5432/d5qlerqgoilt8v',
    ssl: {
        rejectUnauthorized: false
    }
});

pool.connect();

// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'jobio',
//     password: process.env.DB_PASSWORD,
//     port: 5432,
// });


module.exports = {
    pool,
}



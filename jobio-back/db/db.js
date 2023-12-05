// const { Pool } = require('pg');
// require('dotenv').config()

// const pool = new Pool({
//     user: 'uvrbaxglnemtdl',
//     host: 'ec2-44-213-228-107.compute-1.amazonaws.com',
//     database: 'd5qlerqgoilt8v',
//     password: ,
//     port: '5432',
// })

const { Client } = require('pg');

const pool = new Client({
    connectionString: 'postgres://fbbsbmuesmeehe:2a9e6e7d0e1fda006d54c5f1710aad18fdc252179ca55454b93526cf166f3b2a@ec2-52-4-153-146.compute-1.amazonaws.com:5432/d3camim106q0du',
    ssl: {
        rejectUnauthorized: false
    },
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
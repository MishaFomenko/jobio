

const { Client } = require('pg');

const pool = new Client({
    connectionString: 'postgres://hvfripepccnawv:2426fb55c4b196b93f89a55b8fbc7692b04b8996e607ca9f35adb3cdd3763aaa@ec2-54-211-177-159.compute-1.amazonaws.com:5432/d2553m0gp4m87n',

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
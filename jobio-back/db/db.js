

const { Client } = require('pg');

const pool = new Client({
    connectionString: 'postgres://bknoexmyzbmblz:be9bfec117febf9c6fa4d393883144a8396c5ed40637303e2f6f649b60f6235b@ec2-3-233-79-30.compute-1.amazonaws.com:5432/d6rmmrgvpjv0c8',

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
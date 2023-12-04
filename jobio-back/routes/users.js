const express = require('express');
const usersRoutes = express.Router();
const { custom_queries } = require('../utils/queries');
const { pool } = require('../db/db');
const { formatDate } = require('../utils/functions');

usersRoutes.post('/signUp', (req, res) => {
    const { role, uid } = req.body;
    let userRole;
    role === 'Organization' ? userRole = 'org' : userRole = 'seeker';
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);

    pool.query(custom_queries.addNewUserToUniqueUserId, [uid, userRole])
    userRole === 'seeker'
        ?
        pool.query(custom_queries.addNewSeeker, [uid, '', '', '', '', '', '', '', '', '', 0, '', formattedDate])
        :
        pool.query(custom_queries.addNewOrg, [uid, '', '', '', '', 0, '', '', formattedDate]);
})

module.exports = usersRoutes;
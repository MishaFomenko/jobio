import express from 'express'
import custom_queries from '../utils/queries'
import pool from '../db/db'
import formatDate from '../utils/functions'
import dbFailureException from '../utils/dbFailureException'

const usersRoutes = express.Router();

usersRoutes.post('/signUp', (req, res) => {
    const { role, uid } = req.body;
    let userRole;
    role === 'Organization' ? userRole = 'org' : userRole = 'seeker';
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);

    pool.query(custom_queries.addNewUserToUniqueUserId, [uid, userRole])
    userRole === 'seeker'
        ?
        pool.query(custom_queries.addNewSeeker, [uid, '', '', '', '', '', '', '', '', '', 0, '', formattedDate], (err, dbRes) => dbFailureException(err, dbRes, res))
        :
        pool.query(custom_queries.addNewOrg, [uid, '', '', '', '', 0, '', '', formattedDate], (err, dbRes) => dbFailureException(err, dbRes, res));
})


export default usersRoutes;
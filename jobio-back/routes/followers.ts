import express from 'express'
import custom_queries from '../utils/queries'
import pool from '../db/db'
import formatDate from '../utils/functions'
import dbFailureException from '../utils/dbFailureException'

const followersRoutes = express.Router();

followersRoutes.get('/org', async (req, res) => {
    const { orgID } = req.query;
    pool.query(custom_queries.getOrgFollowers, [orgID], (err, dbRes) => dbFailureException(err, dbRes, res));
})

followersRoutes.get('/seeker', async (req, res) => {
    const { seekerID } = req.query;
    pool.query(custom_queries.getSeekerFollowing, [seekerID], (err, dbRes) => dbFailureException(err, dbRes, res));
})

followersRoutes.get('/check', async (req, res) => {
    const { orgID, userID } = req.query;
    pool.query(custom_queries.checkIfFollowing, [userID, orgID], (err, dbRes) => dbFailureException(err, dbRes, res));
})

followersRoutes.post('/addNew', (req, res) => {
    const { following, follower } = req.body;
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);
    pool.query(custom_queries.addNewFollower, [formattedDate, following, follower], (err, dbRes) => dbFailureException(err, dbRes, res))
})

followersRoutes.delete('/unsubscribe', async (req, res) => {
    const { following, follower } = req.query;
    pool.query(custom_queries.unsubscribe, [following, follower], (err, dbRes) => dbFailureException(err, dbRes, res))
})

export default followersRoutes
import express from 'express'
import custom_queries from '../utils/queries'
import pool from '../db/db'
import formatDate from '../utils/functions'
import dbFailureException from '../utils/dbFailureException'

const profileDataRoutes = express.Router();

profileDataRoutes.get('/org', async (req, res) => {
    const { orgID } = req.query;
    pool.query(custom_queries.getOrgData, [orgID], (err, dbRes) => dbFailureException(err, dbRes, res));
})

profileDataRoutes.get('/seeker', async (req, res) => {
    const { seekerID } = req.query;
    pool.query(custom_queries.getSeekerData, [seekerID], (err, dbRes) => dbFailureException(err, dbRes, res));
})

profileDataRoutes.get('/jobPost', async (req, res) => {
    const { jobPostID } = req.query;
    pool.query(custom_queries.getJobPostData, [jobPostID], (err, dbRes) => dbFailureException(err, dbRes, res));
})

profileDataRoutes.get('/userRole', async (req, res) => {
    const { userID } = req.query;
    pool.query(custom_queries.getUserRole, [userID], (err, dbRes) => dbFailureException(err, dbRes, res));
})

profileDataRoutes.post('/updateOrgInfo', (req, res) => {
    const body = req.body;
    pool.query(custom_queries.updateOrgInfo, body, (err, dbRes) => dbFailureException(err, dbRes, res));
})

profileDataRoutes.post('/updateSeekerInfo', (req, res) => {
    const body = req.body;
    pool.query(custom_queries.updateSeekerInfo, body, (err, dbRes) => dbFailureException(err, dbRes, res));
})

profileDataRoutes.post('/createNewJobPost', (req, res) => {
    const body = req.body;
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);
    pool.query(custom_queries.createNewJobPost, [...body, formattedDate], (err, dbRes) => dbFailureException(err, dbRes, res));
})

profileDataRoutes.delete('/deleteJobPost', (req, res) => {
    const { orgID, jobPostID } = req.query;
    pool.query(custom_queries.deleteJobPost, [jobPostID, orgID], (err, dbRes) => dbFailureException(err, dbRes, res));
})

profileDataRoutes.delete('/deleteAccount', (req, res) => {
    const { userID } = req.query;
    pool.query(custom_queries.deleteUser, [userID], (err, dbRes) => dbFailureException(err, dbRes, res))
})

export default profileDataRoutes;
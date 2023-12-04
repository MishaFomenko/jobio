const express = require('express');
const profileDataRoutes = express.Router();
const { custom_queries } = require('../utils/queries');
const { pool } = require('../db/db');
const { formatDate } = require('../utils/functions');

profileDataRoutes.get('/org', async (req, res) => {
    const { orgID } = req.query;
    const orgData = await pool.query(custom_queries.getOrgData, [orgID]);
    res.status(200).json(orgData);
})

profileDataRoutes.get('/seeker', async (req, res) => {
    const { seekerID } = req.query;
    const seekerData = await pool.query(custom_queries.getSeekerData, [seekerID]);
    res.status(200).json(seekerData);
})

profileDataRoutes.get('/jobPost', async (req, res) => {
    const { jobPostID } = req.query;
    const jobPostData = await pool.query(custom_queries.getJobPostData, [jobPostID]);
    res.status(200).json(jobPostData);
})

profileDataRoutes.get('/userRole', async (req, res) => {
    const { userID } = req.query;
    const userRole = await pool.query(custom_queries.getUserRole, [userID]);
    res.status(200).json(userRole);
})

profileDataRoutes.post('/updateOrgInfo', (req, res) => {
    const body = req.body;
    pool.query(custom_queries.updateOrgInfo, body);
})

profileDataRoutes.post('/updateSeekerInfo', (req, res) => {
    const body = req.body;
    pool.query(custom_queries.updateSeekerInfo, body);
})

profileDataRoutes.post('/createNewJobPost', (req, res) => {
    const body = req.body;
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);
    pool.query(custom_queries.createNewJobPost, [...body, formattedDate]);
})

module.exports = profileDataRoutes;
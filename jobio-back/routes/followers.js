const express = require('express');
const followersRoutes = express.Router();
const { custom_queries } = require('../utils/queries');
const { pool } = require('../db/db');
const { formatDate } = require('../utils/functions');

followersRoutes.get('/org', async (req, res) => {
    const { orgID } = req.query;
    const orgFollowers = await pool.query(custom_queries.getOrgFollowers, [orgID]);
    res.status(200).json(orgFollowers);
})

followersRoutes.get('/seeker', async (req, res) => {
    const { seekerID } = req.query;
    const seekerFollowing = await pool.query(custom_queries.getSeekerFollowing, [seekerID]);
    res.status(200).json(seekerFollowing);
})

followersRoutes.get('/check', async (req, res) => {
    const { orgID, userID } = req.query;
    const userRole = await pool.query(custom_queries.checkIfFollowing, [userID, orgID]);
    res.status(200).json(userRole);
})

followersRoutes.post('/addNew', (req, res) => {
    const { following, follower } = req.body;
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);
    pool.query(custom_queries.addNewFollower, [formattedDate, following, follower])
})

module.exports = followersRoutes;
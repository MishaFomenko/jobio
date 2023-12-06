const express = require('express');
const searchInfoRoutes = express.Router();
const { custom_queries } = require('../utils/queries');
const { pool } = require('../db/db');

searchInfoRoutes.get('/Orgs', async (req, res) => {
    const pooledData = await pool.query(custom_queries.getOrgSearchInfo)
    res.status(200).json(pooledData);
})

searchInfoRoutes.get('/Seekers', async (req, res) => {
    const pooledData = await pool.query(custom_queries.getSeekerSearchInfo)
    res.status(200).json(pooledData);
})

searchInfoRoutes.get('/JobPosts', async (req, res) => {
    const pooledData = await pool.query(custom_queries.getJobPostSearchInfo)
    res.status(200).json(pooledData);
})

searchInfoRoutes.get('/JobPostsForOrg', async (req, res) => {
    const { orgID } = req.query;
    const orgJobPosts = await pool.query(custom_queries.getJobPostsForOrg, [orgID]);
    res.status(200).json(orgJobPosts);
})

searchInfoRoutes.get('/creatorName', async (req, res) => {
    const { orgID } = req.query;
    const orgName = await pool.query(custom_queries.getOrgName, [orgID]);
    res.status(200).json(orgName);
})

module.exports = searchInfoRoutes;
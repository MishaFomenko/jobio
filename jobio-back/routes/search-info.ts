import express from 'express'
import custom_queries from '../utils/queries'
import pool from '../db/db'
import dbFailureException from '../utils/dbFailureException'

const searchInfoRoutes = express.Router()

searchInfoRoutes.get('/Orgs', async (req, res) => {
    pool.query(custom_queries.getOrgSearchInfo, (err, dbRes) => dbFailureException(err, dbRes, res))
})

searchInfoRoutes.get('/Seekers', async (req, res) => {
    pool.query(custom_queries.getSeekerSearchInfo, (err, dbRes) => dbFailureException(err, dbRes, res))
})

searchInfoRoutes.get('/JobPosts', async (req, res) => {
    pool.query(custom_queries.getJobPostSearchInfo, (err, dbRes) => dbFailureException(err, dbRes, res))
})

searchInfoRoutes.get('/JobPostsForOrg', async (req, res) => {
    const { orgID } = req.query;
    pool.query(custom_queries.getJobPostsForOrg, [orgID], (err, dbRes) => dbFailureException(err, dbRes, res));
})

searchInfoRoutes.get('/creatorName', async (req, res) => {
    const { orgID } = req.query;
    pool.query(custom_queries.getOrgName, [orgID], (err, dbRes) => dbFailureException(err, dbRes, res));
})

export default searchInfoRoutes;
const { formatDate } = require('./utils/functions');
const { custom_queries } = require('./utils/queries');

const { pool } = require('./db/db');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors({ origin: "*" }));

app.listen(PORT, () => {
    console.log(`the server is listening to the port ${PORT}`)
})

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the database on', res.rows[0].now);
    }
});

app.get('/getOrgsNames', (req, res) => {
    pool.query(custom_queries.getOrgNames)
        .then(pooledData => { res.status(200).json(pooledData) })
})

app.get('/getSeekersNames', (req, res) => {
    pool.query(custom_queries.getSeekersNames)
        .then(pooledData => { res.status(200).json(pooledData) })
})

app.get('/getJobPostsNames', (req, res) => {
    pool.query(custom_queries.getJobPostsNames)
        .then(pooledData => { res.status(200).json(pooledData) })
})

app.post('/newUserSignUp', (req, res) => {
    const body = req.body;
    let user_role;
    body.role === 'Organization' ? user_role = 'org' : user_role = 'seeker';
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);

    pool.query(custom_queries.addNewUserToUniqueUserId, [body.uid, formattedDate, user_role])
    user_role === 'seeker'
        ?
        pool.query(custom_queries.addNewSeeker, [body.uid, '', '', '', '', '', '', '', '', '', 0, ''])
        :
        pool.query(custom_queries.addNewOrg, [body.uid, '', '', '', '', 0, '', '']);
})

app.get('/getOrgData', async (req, res) => {
    const { orgID } = req.query;
    const orgData = await pool.query(custom_queries.getOrgData, [orgID]);
    res.status(200).json(orgData);
})

app.get('/getSeekerData', async (req, res) => {
    const { seekerID } = req.query;
    const seekerData = await pool.query(custom_queries.getSeekerData, [seekerID]);
    res.status(200).json(seekerData);
})

app.get('/getJobPostData', async (req, res) => {
    const { jobPostID } = req.query;
    const jobPostData = await pool.query(custom_queries.getJobPostData, [jobPostID]);
    res.status(200).json(jobPostData);
})

app.get('/getOrgFollowers', async (req, res) => {
    const { orgID } = req.query;
    const orgFollowers = await pool.query(custom_queries.getOrgFollowers, [orgID]);
    res.status(200).json(orgFollowers);
})

app.get('/getSeekerFollowing', async (req, res) => {
    const { seekerID } = req.query;
    const seekerFollowing = await pool.query(custom_queries.getSeekerFollowing, [seekerID]);
    res.status(200).json(seekerFollowing);
})

app.get('/getJobPostsForOrg', async (req, res) => {
    const { orgID } = req.query;
    const orgJobPosts = await pool.query(custom_queries.getJobPostsForOrg, [orgID]);
    res.status(200).json(orgJobPosts);
})

app.get('/getUserRole', async (req, res) => {
    const { userID } = req.query;
    const userRole = await pool.query(custom_queries.getUserRole, [userID]);
    res.status(200).json(userRole);
})

app.get('/checkIfFollowing', async (req, res) => {
    const { orgID, userID } = req.query;
    const userRole = await pool.query(custom_queries.checkIfFollowing, [userID, orgID]);
    res.status(200).json(userRole);
})

app.post('/updateOrgInfo', (req, res) => {
    const body = req.body;
    pool.query(custom_queries.updateOrgInfo, body);
})

app.post('/updateSeekerInfo', (req, res) => {
    const body = req.body;
    pool.query(custom_queries.updateSeekerInfo, body);
})

app.post('/createNewJobPost', (req, res) => {
    const body = req.body;
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);
    pool.query(custom_queries.createNewJobPost, [...body, formattedDate]);
})

app.post('/addNewFollower', (req, res) => {
    const body = req.body;
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);
    pool.query(custom_queries.addNewFollower, [formattedDate, body.following, body.follower])
})
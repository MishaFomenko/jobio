const searchInfoRoutes = require('./routes/search-info');
const profileDataRoutes = require('./routes/profile-data');
const followersRoutes = require('./routes/followers');
const usersRoutes = require('./routes/users');
const checkAuth = require('./utils/checkAuth')

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors({ origin: "*" }));

app.listen(PORT, () => {
    console.log(`the server is listening to the port ${PORT}`)
})

app.use('/searchInfo', checkAuth, searchInfoRoutes);

app.use('/users', checkAuth, usersRoutes);

app.use('/profileData', checkAuth, profileDataRoutes);

app.use('/followers', checkAuth, followersRoutes);

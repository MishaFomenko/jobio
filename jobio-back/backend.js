const searchInfoRoutes = require('./routes/search-info');
const profileDataRoutes = require('./routes/profile-data');
const followersRoutes = require('./routes/followers');
const usersRoutes = require('./routes/users');

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors({ origin: "*" }));

app.listen(PORT, () => {
    console.log(`the server is listening to the port ${PORT}`)
})

app.use('/searchInfo', searchInfoRoutes);

app.use('/users', usersRoutes);

app.use('/profileData', profileDataRoutes);

app.use('/followers', followersRoutes);

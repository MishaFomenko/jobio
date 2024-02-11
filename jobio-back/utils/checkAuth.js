const admin = require('firebase-admin');
require('dotenv').config()

admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.SERVICE_ACCOUNT)),
});

const checkAuth = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    const idToken = authorizationHeader.split('Bearer ')[1];

    admin.auth().verifyIdToken(idToken)
        .then(decodedToken => {
            req.user = decodedToken; // Optional: Add decoded token to request object
            next();
        })
        .catch(error => {
            console.error('Error verifying ID token:', error);
            res.status(403).send({ message: 'Forbidden' });
        });
};

module.exports = checkAuth;

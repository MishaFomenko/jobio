import admin from 'firebase-admin'
import { Request, Response, NextFunction } from 'express';

require('dotenv').config()

process.env.SERVICE_ACCOUNT && admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.SERVICE_ACCOUNT)),
});

interface CustomRequest extends Request {
    user?: admin.auth.DecodedIdToken;
}

const checkAuth = (req: CustomRequest, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    const idToken = authorizationHeader.split('Bearer ')[1];

    admin.auth().verifyIdToken(idToken)
        .then(decodedToken => {
            req.user = decodedToken;
            next();
        })
        .catch(error => {
            console.error('Error verifying ID token:', error);
            res.status(403).send({ message: 'Forbidden' });
        });
};

export default checkAuth

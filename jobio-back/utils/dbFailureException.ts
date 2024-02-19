import { Response } from 'express'
import { QueryResult } from 'pg'

function dbFailureException(err: Error, dbRes: QueryResult, res: Response): Response {
    if (err) {
        console.error('Error executing query');
        return res.status(500).json({ message: 'Database connection failed' });
    }
    return res.status(200).json(dbRes);
}

export default dbFailureException

function dbFailureException(err, dbRes, res) {
    // if (err) {
    //     console.error('Error executing query');
    // return res.status(500).json({ message: 'Database connection failed' });
    // }
    res.status(200).json(dbRes);
}

module.exports = dbFailureException
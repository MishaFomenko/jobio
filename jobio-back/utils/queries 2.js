
const custom_queries = {
    getOrgSearchInfo: 'SELECT title, unique_id, industry, location FROM organization',
    getSeekersNames: 'SELECT first_name, last_name, unique_id FROM job_seeker',
    getJobPostsNames: 'SELECT title, id FROM job_post',
    addNewUserToUniqueUserId: 'INSERT INTO unique_user_id (id, role) VALUES ($1, $2)',
    addNewSeeker: 'INSERT INTO job_seeker (unique_id, first_name, last_name, skills, location, email, university, spec, degree, experience_company, experience_years, about, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
    addNewOrg: 'INSERT INTO organization (unique_id, title, industry, website, email, staff, about, location, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
    getOrgData: 'SELECT * FROM organization WHERE unique_id = $1',
    getSeekerData: 'SELECT * FROM job_seeker WHERE unique_id = $1',
    getJobPostData: 'SELECT * FROM job_post WHERE id = $1',
    getOrgFollowers: 'SELECT * FROM sub WHERE target = $1',
    getSeekerFollowing: 'SELECT * FROM sub WHERE follower = $1',
    getJobPostsForOrg: 'SELECT title, id FROM job_post WHERE created_by = $1',
    getUserRole: 'SELECT role FROM unique_user_id WHERE id = $1',
    checkIfFollowing: 'SELECT id FROM sub WHERE follower = $1 AND target = $2',
    updateOrgInfo: 'UPDATE organization SET title=$2, industry=$3, website=$4, email=$5, staff=$6, about=$7, location=$8 WHERE unique_id=$1',
    updateSeekerInfo: 'UPDATE job_seeker SET first_name=$2, last_name=$3, skills=$4, location=$5, email=$6, university=$7, spec=$8, degree=$9, experience_company=$10, experience_years=$11, about=$12 WHERE unique_id=$1',
    createNewJobPost: 'INSERT INTO job_post (created_by, title, about, requirements, created_at) VALUES ($1,$2,$3,$4,$5)',
    addNewFollower: 'INSERT INTO sub (created_at, target, follower) VALUES ($1, $2, $3)',
}

module.exports = {
    custom_queries,
}
'use client'
import { useEffect, useState } from 'react';
import { customGetter } from '../utils/fetch-requests';

const JobPost = ({ jobPostID }: { jobPostID: string }) => {

    const [jobPostInfo, setJobPostInfo] = useState([]);
    const fields = ['Created by', 'Title', 'About', 'Requirements', 'Created at'];

    useEffect(() => {
        const reqPath = 'getJobPostData';
        const queryString = `jobPostID=${jobPostID}`;
        customGetter(reqPath, queryString).then((data) => setJobPostInfo(Object.values(data[0])));
    }, [])

    return (
        <>
            {jobPostInfo.length !== 0 && fields.map((field, ind) =>
                <p key={ind}>{field} : {jobPostInfo[ind + 1]}</p>
            )}
        </>
    )
}

export default JobPost;
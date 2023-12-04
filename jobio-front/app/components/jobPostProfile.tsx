'use client'
import { useEffect, useState } from 'react';
import { customGetter } from '../utils/fetch-requests';
import { format } from 'date-fns';

const JobPost = ({ jobPostID }: { jobPostID: string }) => {

    const [jobPostInfo, setJobPostInfo] = useState([]);
    const fields = ['Created by', 'Title', 'About', 'Requirements', 'Created at'];

    useEffect(() => {
        const reqPath = 'profileData/jobPost';
        const queryString = `jobPostID=${jobPostID}`;
        customGetter(reqPath, queryString).then((data) => setJobPostInfo(Object.values(data[0])));
    }, [])

    return (
        <div className='m-4'>
            {jobPostInfo.length !== 0 && fields.map((field, ind) => (
                field === 'Created at' ?
                    <p className='text-xl my-2' key={ind}><span className='font-bold'>{field} :</span> {format(new Date(jobPostInfo[ind + 1]), ' MMMM do, Y')}</p>
                    :
                    <p className='text-xl my-2' key={ind}><span className='font-bold'>{field} :</span> {jobPostInfo[ind + 1]}</p>
            )
            )}
        </div>
    )
}

export default JobPost;
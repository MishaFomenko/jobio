'use client'
import { useEffect, useState } from 'react';
import { customGetter } from '../utils/fetch-requests';
import { format } from 'date-fns';
import { useUserContext } from '../context/userContext';
import { UserContext } from '../types'

const JobPost: React.FC<{ jobPostID: string }> = ({ jobPostID }) => {

    const [jobPostInfo, setJobPostInfo] = useState<string[]>([]);
    const [creator, setCreator] = useState<{ title: string }>({ title: '' });
    const fields = ['Created by', 'Title', 'About', 'Requirements', 'Created at'];
    const { idToken } = useUserContext() as UserContext

    useEffect(() => {
        const reqPathJob = 'searchInfo/creatorName';
        const queryStringJob = `orgID=${jobPostInfo[1]}`;
        jobPostInfo.length !== 0 && customGetter(idToken, reqPathJob, queryStringJob).then((data) => setCreator(data[0]));

        const reqPathCreator = 'profileData/jobPost';
        const queryStringCreator = `jobPostID=${jobPostID}`;
        jobPostInfo.length === 0 && customGetter(idToken, reqPathCreator, queryStringCreator).then((data) => setJobPostInfo(Object.values(data[0])));
    }, [jobPostInfo])


    return (
        <div className='m-4'>
            {jobPostInfo.length !== 0 && fields.map((field, ind) => (
                field === 'Created at'
                    ?
                    <p className='text-xl my-2' key={ind}><span className='font-bold'>{field} :</span> {format(new Date(jobPostInfo[ind + 1]), ' MMMM do, Y')}</p>
                    :
                    field === 'Created by'
                        ?
                        <p className='text-xl my-2' key={ind}><span className='font-bold'>{field} :</span> {creator.title}</p>
                        :
                        <p className='text-xl my-2' key={ind}><span className='font-bold'>{field} :</span> {jobPostInfo[ind + 1]}</p>
            )
            )}
        </div>
    )
}

export default JobPost;
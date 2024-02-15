'use client'
import { useEffect, useState } from 'react';
import { customGetter } from '../utils/fetch-requests';
import { format } from 'date-fns';
import { useUserContext } from '../context/userContext';
import { UserContext } from '../types';
import { useQuery } from '@tanstack/react-query';

const JobPost: React.FC<{ jobPostID: string }> = ({ jobPostID }) => {

    const fields = ['Created by', 'Title', 'About', 'Requirements', 'Created at'];

    const [jobPostInfo, setJobPostInfo] = useState<string[]>([]);
    const [creator, setCreator] = useState<{ title: string }>({ title: '' });
    const [pending, setPending] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const { idToken } = useUserContext() as UserContext

    const reqPathCreator = 'profileData/jobPost';
    const queryStringCreator = `jobPostID=${jobPostID}`;
    const jobPostInfoQuery = useQuery({
        queryKey: ['jobPostInfoQuery', idToken, reqPathCreator, queryStringCreator],
        queryFn: () => customGetter(idToken, reqPathCreator, queryStringCreator),
        enabled: Boolean(idToken)
    })

    const reqPathJob = 'searchInfo/creatorName';
    const queryStringJob = `orgID=${jobPostInfo[1]}`;
    const creatorQuery = useQuery({
        queryKey: ['creatorQuery', idToken, reqPathJob, queryStringJob],
        queryFn: () => customGetter(idToken, reqPathJob, queryStringJob),
        enabled: Boolean(jobPostInfo.length) && Boolean(idToken),
    })

    useEffect(() => {
        !creatorQuery.isPending && setCreator(creatorQuery.data[0]);
        !jobPostInfoQuery.isPending && setJobPostInfo(Object.values(jobPostInfoQuery.data[0]));

        setPending(creatorQuery.isPending || jobPostInfoQuery.isPending)
        setError(creatorQuery.error || jobPostInfoQuery.error)
    }, [creatorQuery.isPending, jobPostInfoQuery.isPending])

    if (pending) {
        return <p>Loading...</p>
    }
    if (error) {
        return <p>Error occured</p>
    }
    return (
        <div className='m-4'>
            {creator && jobPostInfo && jobPostInfo.length !== 0 && fields.map((field, ind) => (
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
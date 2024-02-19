'use client'
import { useEffect, useState } from 'react';
import { customGetter, customDeleter } from '../utils/fetch-requests';
import { format } from 'date-fns';
import { useUserContext } from '../context/userContext';
import { UserContext } from '../types';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Error from './error'
import Loading from './loading'

const JobPost: React.FC<{ jobPostID: string }> = ({ jobPostID }) => {

    const fields = ['Created by', 'Title', 'About', 'Requirements', 'Created at'];

    const [jobPostInfo, setJobPostInfo] = useState<string[]>([]);
    const [creator, setCreator] = useState<{ title: string }>({ title: '' });
    const [pending, setPending] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const { idToken, user } = useUserContext() as UserContext

    const router = useRouter();

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

    const handleDeleteJobPost = async (): Promise<void> => {
        const reqPath = 'profileData/deleteJobPost'
        const queryString = `orgID=${jobPostInfo[1]}&jobPostID=${jobPostID}`
        try {
            idToken && await customDeleter(idToken, reqPath, queryString)
            router.push('/user-account')
        } catch (deletingError) {
            setError(deletingError as Error)
        }
    }

    if (pending) {
        return <Loading />
    }
    if (error) {
        return <Error />
    }

    return (
        <div className='bg-gray-100 min-h-screen p-4'>

            {creator && jobPostInfo && jobPostInfo.length !== 0 && fields.map((field, ind) => (
                <div key={ind} className='bg-white shadow rounded-lg p-4 mb-6'>
                    <div className='text-lg font-semibold mb-4'>{field}</div>
                    {field === 'Created at' ? (
                        <p className='my-2'>
                            <span className='font-semibold'>Date: </span>{format(new Date(jobPostInfo[ind + 1]), 'MMMM do, yyyy')}
                        </p>
                    ) : field === 'Created by' ? (
                        <p className='my-2'>
                            <span className='font-semibold'>Creator: </span>{creator.title}
                        </p>
                    ) : (
                        <p className='my-2'>
                            <span className='font-semibold'>{field}: </span>{jobPostInfo[ind + 1]}
                        </p>
                    )}

                </div>

            ))}
            {jobPostInfo[1] === user?.uid &&
                <button className=' w-full bg-red-400 text-white font-semibold hover:bg-red-500 py-2 rounded transition duration-300' onClick={handleDeleteJobPost}>
                    Delete job post
                </button>
            }
        </div>




    )
}

export default JobPost;
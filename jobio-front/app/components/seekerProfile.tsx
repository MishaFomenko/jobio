'use client'
import { useEffect, useState } from 'react';
import { customGetter } from '../utils/fetch-requests';
import { format } from 'date-fns';
import { SeekersNames, SeekerInfo } from '../types';
import { useUserContext } from '../context/userContext';
import { UserContext } from '../types';
import { useQuery } from '@tanstack/react-query';
import Error from './error'
import Loading from './loading'

const JobSeekerProfile: React.FC<{ seekerID: string }> = ({ seekerID }) => {

    const fields = ['First name', 'Last name', 'Skills', 'Location', 'Email', 'University', 'Specialization', 'Degree', 'Experience (company)', 'Experience (years)', 'About', 'On the platform since'];

    const [seekerFollowing, setSeekerFollowing] = useState<SeekersNames[]>([]);
    const [seekerInfo, setSeekerInfo] = useState<SeekerInfo | {}>({});
    const [pending, setPending] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const { idToken } = useUserContext() as UserContext

    const reqPathInfo = 'profileData/seeker';
    const queryStringInfo = `seekerID=${seekerID}`;
    const seekerInfoQuery = useQuery({
        queryKey: ['seekerInfoQuery', idToken, reqPathInfo, queryStringInfo],
        queryFn: () => customGetter(idToken, reqPathInfo, queryStringInfo),
        enabled: Boolean(idToken)
    })

    const reqPathFollowing = 'followers/seeker';
    const queryStringFollowing = `seekerID=${seekerID}`;
    const seekerFollowingQuery = useQuery({
        queryKey: ['seekerInfoQuery', idToken, reqPathFollowing, queryStringFollowing],
        queryFn: () => customGetter(idToken, reqPathFollowing, queryStringFollowing),
        enabled: Boolean(idToken)
    })

    useEffect(() => {
        !seekerInfoQuery.isPending && setSeekerInfo(seekerInfoQuery.data[0]);

        !seekerFollowingQuery.isPending && setSeekerFollowing(seekerFollowingQuery.data);

        setError(seekerInfoQuery.error || seekerFollowingQuery.error)
        setPending(seekerInfoQuery.isPending || seekerFollowingQuery.isPending)
    }, [seekerInfoQuery.isPending, seekerFollowingQuery.isPending])

    if (pending) {
        return <Loading />
    }
    if (error) {
        return <Error />
    }

    return (
        <div className='bg-gray-50 min-h-screen p-4'>
            <div className=' mx-auto'>
                {seekerInfo && Object.values(seekerInfo).length !== 0 && (
                    <div className='bg-white rounded-lg shadow p-6 mb-6'>
                        <h2 className='text-lg font-semibold mb-4'>Seeker Information</h2>
                        {fields.map((field, ind) => (
                            <p key={ind} className='text-lg mb-2'>
                                <span className='font-medium'>{field}:</span>
                                {field === 'On the platform since' ? (
                                    ` ${format(new Date(Object.values(seekerInfo)[ind + 1]), 'MMMM do, yyyy')}`
                                ) : (
                                    ` ${Object.values(seekerInfo)[ind + 1]}`
                                )}
                            </p>
                        ))}
                    </div>
                )}

                <div className='bg-white rounded-lg shadow p-6'>
                    <h2 className='text-lg font-semibold mb-4'>Following</h2>
                    <p className='text-lg'>{seekerFollowing.length} organizations</p>
                </div>
            </div>
        </div>


    )
}

export default JobSeekerProfile;
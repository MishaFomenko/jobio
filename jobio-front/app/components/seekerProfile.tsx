'use client'
import { useEffect, useState } from 'react';
import { customGetter } from '../utils/fetch-requests';
import { format } from 'date-fns';
import { SeekersNames, SeekerInfo } from '../types';
import { useUserContext } from '../context/userContext';
import { UserContext } from '../types';
import { useQuery } from '@tanstack/react-query';

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
        return <p>Loading...</p>
    }
    if (error) {
        return <p>Error occured</p>
    }

    return (
        <div className='m-4'>
            {seekerInfo && Object.values(seekerInfo).length !== 0 && fields.map((field, ind) => (
                field === 'On the platform since' ?
                    <p className='text-xl my-2' key={ind}><span className='font-bold'>{field} : </span> {format(new Date(Object.values(seekerInfo)[ind + 1]), ' MMMM do, Y')}</p>
                    :
                    <p className='text-xl my-2' key={ind}><span className='font-bold'>{field} : </span> {Object.values(seekerInfo)[ind + 1]}</p>
            )
            )}
            <p className='text-xl my-2'><span className='font-bold'>Following:</span> {seekerFollowing.length}</p>
        </div>
    )
}

export default JobSeekerProfile;
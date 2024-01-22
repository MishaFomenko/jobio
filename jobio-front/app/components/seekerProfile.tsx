'use client'
import { useEffect, useState } from 'react';
import { customGetter } from '../utils/fetch-requests';
import { format } from 'date-fns';
import { SeekersNames, SeekerInfo } from '../types';

const JobSeekerProfile: React.FC<{ seekerID: string }> = ({ seekerID }) => {

    const [seekerFollowing, setSeekerFollowing] = useState<SeekersNames[]>([]);
    const [seekerInfo, setSeekerInfo] = useState<SeekerInfo | {}>({});
    const fields = ['First name', 'Last name', 'Skills', 'Location', 'Email', 'University', 'Specialization', 'Degree', 'Experience (company)', 'Experience (years)', 'About', 'On the platform since'];

    useEffect(() => {
        const reqPathInfo = 'profileData/seeker';
        const queryStringInfo = `seekerID=${seekerID}`;
        customGetter(reqPathInfo, queryStringInfo).then((data) => setSeekerInfo(data[0]));

        const reqPathFollowing = 'followers/seeker';
        const queryStringFollowing = `seekerID=${seekerID}`;
        customGetter(reqPathFollowing, queryStringFollowing).then((data) => setSeekerFollowing(data));
    }, [])

    return (
        <div className='m-4'>
            {Object.values(seekerInfo).length !== 0 && fields.map((field, ind) => (
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
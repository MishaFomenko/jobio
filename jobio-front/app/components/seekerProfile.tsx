'use client'
import { useEffect, useState } from 'react';
import { customGetter } from '../utils/fetch-requests';
import { format } from 'date-fns';

const JobSeekerProfile = ({ seekerID }: { seekerID: string }) => {

    const [seekerFollowing, setSeekerFollowing] = useState([]);
    const [seekerInfo, setSeekerInfo] = useState([]);
    const fields = ['First name', 'Last name', 'Skills', 'Location', 'Email', 'University', 'Specialization', 'Degree', 'Experience (company)', 'Experience (years)', 'About', 'On the platform since'];

    useEffect(() => {
        const reqPath = 'profileData/seeker';
        const queryString = `seekerID=${seekerID}`;
        customGetter(reqPath, queryString).then((data) => setSeekerInfo(Object.values(data[0])));
    }, [])

    useEffect(() => {
        const reqPath = 'followers/seeker';
        const queryString = `seekerID=${seekerID}`;
        customGetter(reqPath, queryString).then((data) => setSeekerFollowing(data));
    }, [])

    return (
        <div className='m-4'>
            {seekerInfo.length !== 0 && fields.map((field, ind) => (
                field === 'On the platform since' ?
                    <p className='text-xl my-2' key={ind}><span className='font-bold'>{field} : </span> {format(new Date(seekerInfo[ind + 1]), ' MMMM do, Y')}</p>
                    :
                    <p className='text-xl my-2' key={ind}><span className='font-bold'>{field} : </span> {seekerInfo[ind + 1]}</p>
            )
            )}
            <p className='text-xl my-2'><span className='font-bold'>Following:</span> {seekerFollowing.length}</p>
        </div>
    )
}

export default JobSeekerProfile;
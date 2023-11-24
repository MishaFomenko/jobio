'use client'
import { useEffect, useState } from 'react';
import { customGetter } from '../utils/fetch-requests';

const JobSeekerProfile = ({ seekerID }: { seekerID: string }) => {

    const [seekerFollowing, setSeekerFollowing] = useState([]);
    const [seekerInfo, setSeekerInfo] = useState([]);
    const fields = ['First name', 'Last name', 'Skills', 'Location', 'Email', 'University', 'Specialization', 'Degree', 'Experience (company)', 'Experience (years)', 'About'];

    useEffect(() => {
        const reqPath = 'getSeekerData';
        const queryString = `seekerID=${seekerID}`;
        customGetter(reqPath, queryString).then((data) => setSeekerInfo(Object.values(data[0])));
    }, [])

    useEffect(() => {
        const reqPath = 'getSeekerFollowing';
        const queryString = `seekerID=${seekerID}`;
        customGetter(reqPath, queryString).then((data) => setSeekerFollowing(data));
    }, [])

    return (
        <>
            {seekerInfo.length !== 0 && fields.map((field, ind) =>
                <p key={ind}>{field} : {seekerInfo[ind + 1]}</p>
            )}
            <p>Following: {seekerFollowing.length}</p>
        </>
    )
}

export default JobSeekerProfile;
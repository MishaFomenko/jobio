'use client'
import JobSeekerAccount from '../components/seekerAccount';
import OrgAccount from '../components/orgAccount';
import { useUserContext } from '../context/userContext';
import React, { useEffect } from 'react';
import { customGetter } from '../utils/fetch-requests';
import { UserContext } from '../types';
import { useRouter } from 'next/navigation';

const UserAccountPage: React.FC = () => {
    const router = useRouter();
    const { user, userRole, setUserRole } = useUserContext() as UserContext;

    useEffect(() => {
        const reqPath = 'profileData/userRole';
        const queryString = `userID=${user?.uid}`;
        customGetter(reqPath, queryString).then((data) => setUserRole(data[0].role))
    }, [])

    useEffect(() => {
        user === null && router.push('/signin');
    })

    return (
        <>
            {userRole === 'org' && <OrgAccount />}
            {userRole === 'seeker' && <JobSeekerAccount />}
        </>
    )
}

export default UserAccountPage
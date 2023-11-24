'use client'
import JobSeekerAccount from '../components/seekerAccount';
import OrgAccount from '../components/orgAccount';
import { useUserContext } from '../context/userContext';
import React, { useEffect } from 'react';
import { customGetter } from '../utils/fetch-requests';
import { UserContext } from '../types';

const UserAccountPage: React.FC = () => {
    const { user, userRole, setUserRole } = useUserContext() as UserContext;

    useEffect(() => {
        const reqPath = 'getUserRole';
        const queryString = `userID=${user?.uid}`;
        customGetter(reqPath, queryString).then((data) => setUserRole(data[0].role))
    }, [])

    return (
        <>
            {userRole === 'org' && <OrgAccount />}
            {userRole === 'seeker' && <JobSeekerAccount />}
        </>
    )
}

export default UserAccountPage
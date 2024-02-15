'use client'
import JobSeekerAccount from '../components/seekerAccount';
import OrgAccount from '../components/orgAccount';
import { useUserContext } from '../context/userContext';
import React, { useEffect, useState } from 'react';
import { customGetter } from '../utils/fetch-requests';
import { UserContext } from '../types';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

const UserAccountPage: React.FC = () => {

    const [pending, setPending] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const router = useRouter();

    const { user, userRole, setUserRole, idToken } = useUserContext() as UserContext;

    const reqPath = 'profileData/userRole';
    const queryString = `userID=${user?.uid}`;
    const userRoleQuery = useQuery({
        queryKey: ['userRoleQuery', idToken, reqPath, queryString],
        queryFn: () => customGetter(idToken, reqPath, queryString),
        enabled: Boolean(idToken) || Boolean(user)
    })

    useEffect(() => {
        !user && router.push('/signin')
        !userRoleQuery.isPending && setUserRole(userRoleQuery.data[0].role)

        setError(userRoleQuery.error)
        setPending(userRoleQuery.isPending)
    }, [userRoleQuery.isPending, user])

    if (pending) {
        return <p>Loading...</p>
    }
    if (error) {
        return <p>Error occured</p>
    }

    return (
        <>
            {userRole && userRole === 'org' && <OrgAccount />}
            {userRole && userRole === 'seeker' && <JobSeekerAccount />}
        </>
    )
}

export default UserAccountPage
'use client'
import OrgProfile from '../../components/orgProfile';
import { OrgPageProps, UserContext } from '../../types';
import { useRouter } from 'next/navigation';
import { useUserContext } from '../../context/userContext';
import { useEffect, useState } from 'react';
import { customGetter } from '../../utils/fetch-requests';
import { useQuery } from '@tanstack/react-query';
import Error from '../../components/error'
import Loading from '../../components/loading'

const OrgPage: React.FC<OrgPageProps> = ({ params }) => {
    const [pending, setPending] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const { user, setUserRole, idToken } = useUserContext() as UserContext;
    const router = useRouter();

    const reqPath = 'profileData/userRole';
    const queryString = `userID=${user?.uid}`;
    const userRoleQuery = useQuery({
        queryKey: ['userRoleQuery', idToken, reqPath, queryString],
        queryFn: () => customGetter(idToken, reqPath, queryString),
        enabled: Boolean(idToken) || Boolean(user)
    })

    useEffect(() => {
        !user && router.push('/signin')
        user && !userRoleQuery.isPending && setUserRole(userRoleQuery.data[0].role)

        setError(userRoleQuery.error)
        setPending(userRoleQuery.isPending)
    }, [userRoleQuery.isPending, user])

    if (pending) {
        return <Loading />
    }
    if (error) {
        return <Error />
    }

    return (
        <>
            <OrgProfile orgID={params.orgID} />
        </>
    )
}

export default OrgPage;
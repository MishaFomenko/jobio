'use client'
import OrgProfile from '../../components/orgProfile';
import { OrgPageProps, UserContext } from '../../types';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '../../context/userContext';

const OrgPage: React.FC<OrgPageProps> = ({ params }) => {
    const { user } = useUserContext() as UserContext;
    const router = useRouter();
    useEffect(() => {
        !user && router.push('/signin');
    })
    return (
        <>
            <OrgProfile orgID={params.orgID} />
        </>
    )
}

export default OrgPage;
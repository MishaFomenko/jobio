'use client'
import JobSeekerProfile from '../../components/seekerProfile';
import { SeekerPageProps, UserContext } from '../../types'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '../../context/userContext';

const JobSeekerPage: React.FC<SeekerPageProps> = ({ params }) => {
    const { user } = useUserContext() as UserContext;
    const router = useRouter();
    useEffect(() => {
        !user && router.push('/signin');
    })
    return (
        <>
            <JobSeekerProfile seekerID={params.seekerID} />
        </>
    )
}

export default JobSeekerPage;
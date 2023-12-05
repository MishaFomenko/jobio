'use client'
import JobPostProfile from '../../components/jobPostProfile';
import { JobPostPageProps, UserContext } from '../../types';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '../../context/userContext';

const JobPostPage: React.FC<JobPostPageProps> = ({ params }) => {
    const { user } = useUserContext() as UserContext;
    const router = useRouter();
    useEffect(() => {
        user === null && router.push('/signin');
    })
    return (
        <>
            <JobPostProfile jobPostID={params.jobPostID} />
        </>
    )
}

export default JobPostPage;
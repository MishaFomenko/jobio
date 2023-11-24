'use client'
import JobPostProfile from '../../components/jobPostProfile';
import { JobPostPageProps } from '../../types';

const JobPostPage: React.FC<JobPostPageProps> = ({ params }) => {
    return (
        <>
            <JobPostProfile jobPostID={params.jobPostID} />
        </>
    )
}

export default JobPostPage;
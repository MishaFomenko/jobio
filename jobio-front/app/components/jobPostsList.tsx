'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { customGetter } from '../utils/fetch-requests';
import { JobPost } from '../types';

const JobPostsList: React.FC = () => {

    const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
    const router = useRouter();

    useEffect(() => {
        const reqPath = 'getJobPostsNames';
        const queryString = '';
        customGetter(reqPath, queryString).then((data) => setJobPosts(data));
    })

    const handleJobPostClick = (event: any) => {
        router.push(`/job-post-page/${event.target.id}`);
    }

    return (
        <>
            <div className='flex flex-col justify-start'>
                {jobPosts.length !== 0 && jobPosts.map((jobPost) => (
                    <button className='text-start ml-4 mr-4 my-2 border-2 p-2' id={jobPost.id} key={jobPost.id} onClick={(event) => handleJobPostClick(event)} >{jobPost.title}</button>
                ))}
            </div>
        </>
    )
}

export default JobPostsList;
'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { customGetter } from '../utils/fetch-requests';
import { JobPost } from '../types';
import Form from 'react-bootstrap/Form';

const JobPostsList: React.FC = () => {

    const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
    const [jobPostDisplay, setJobPostDisplay] = useState<JobPost[]>([]);
    const router = useRouter();

    useEffect(() => {
        const reqPath = 'getJobPostsNames';
        const queryString = '';
        customGetter(reqPath, queryString).then((data) => (setJobPosts(data), setJobPostDisplay(data)));
    }, [])

    const handleJobPostClick = (event: any) => {
        router.push(`/job-post-page/${event.target.id}`);
    }

    const handleSearchChange = (event: any) => {
        const newJobPostDisplay = jobPosts.filter(jobPost => jobPost.title.toLowerCase().includes(event.target.value.toLowerCase()));
        setJobPostDisplay(newJobPostDisplay);
    }

    return (
        <>
            <Form className="d-flex">
                <Form.Control
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                    onChange={(event) => handleSearchChange(event)}
                />
            </Form>
            <div className='flex flex-col justify-start'>
                {jobPostDisplay.length !== 0 && jobPostDisplay.map((jobPost) => (
                    <button className='text-start ml-4 mr-4 my-2 border-2 p-2' id={jobPost.id} key={jobPost.id} onClick={(event) => handleJobPostClick(event)} >{jobPost.title}</button>
                ))}
            </div>
        </>
    )
}

export default JobPostsList;
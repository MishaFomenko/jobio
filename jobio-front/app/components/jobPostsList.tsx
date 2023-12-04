'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { customGetter } from '../utils/fetch-requests';
import { JobPost } from '../types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const JobPostsList: React.FC = () => {

    const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
    const [jobPostDisplay, setJobPostDisplay] = useState<JobPost[]>([]);
    const router = useRouter();

    useEffect(() => {
        const reqPath = 'searchInfo/JobPosts';
        const queryString = '';
        customGetter(reqPath, queryString).then((data) => (setJobPosts(data), setJobPostDisplay(data)));
    }, [])

    const handleJobPostClick = (id: string) => {
        router.push(`/job-post-page/${id}`);
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
                    className="mx-3"
                    aria-label="Search"
                    onChange={(event) => handleSearchChange(event)}
                />
            </Form>
            <div className='flex flex-col justify-start'>
                {jobPostDisplay.length !== 0 && jobPostDisplay.map((jobPost) => (
                    <Button variant='info' className='text-start ml-4 mr-4 my-2 border-2 p-2' id={jobPost.id} key={jobPost.id} onClick={() => handleJobPostClick(jobPost.id)} >
                        <div className='flex'>
                            <p className='mx-4'>{jobPost.title}</p>
                        </div>
                    </Button>
                ))}
            </div>
        </>
    )
}

export default JobPostsList;
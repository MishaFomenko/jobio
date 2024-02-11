'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { customGetter, customFilterOnEvent } from '../utils/fetch-requests';
import { JobPost } from '../types';
import Form from 'react-bootstrap/Form';
import { useUserContext } from '../context/userContext';
import { UserContext } from '../types'

const JobPostsList: React.FC = () => {

    const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
    const [jobPostDisplay, setJobPostDisplay] = useState<JobPost[]>([]);
    const { idToken } = useUserContext() as UserContext
    const router = useRouter();

    useEffect(() => {
        const reqPath = 'searchInfo/JobPosts';
        const queryString = '';
        customGetter(idToken, reqPath, queryString).then((data) => (setJobPosts(data), setJobPostDisplay(data)));
    }, [])

    const handleJobPostClick = (id: string): void => {
        router.push(`/job-post-page/${id}`);
    }

    const handleSearchChange = (event: React.ChangeEvent<any>): void => {
        // const newJobPostDisplay = jobPosts.filter(jobPost => jobPost.title.toLowerCase().includes(event.target.value?.toLowerCase()));
        const newJobPostDisplay = customFilterOnEvent(jobPosts, 'title', event)
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
                    <button className='text-start ml-4 mr-4 my-2 p-2 border-2 border-grey-300 hover:bg-gray-300 px-2 rounded-xl transition duration-300 focus:bg-grey-600' id={jobPost.id} key={jobPost.id} onClick={() => handleJobPostClick(jobPost.id)} >
                        <div className='flex'>
                            <p className='mx-4'>Job Title: {jobPost.title}</p>
                        </div>
                    </button>
                ))}
            </div>
        </>
    )
}

export default JobPostsList;
'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { customGetter, customFilterOnEvent } from '../utils/fetch-requests';
import { JobPost } from '../types';
import Form from 'react-bootstrap/Form';
import { useUserContext } from '../context/userContext';
import { UserContext } from '../types'
import { useQuery } from '@tanstack/react-query';
import Error from './error'
import Loading from './loading'

const JobPostsList: React.FC = () => {

    const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
    const [jobPostDisplay, setJobPostDisplay] = useState<JobPost[]>([]);
    const [pending, setPending] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const router = useRouter();

    const { idToken } = useUserContext() as UserContext

    const reqPath = 'searchInfo/JobPosts';
    const queryString = '';
    const jobPostDisplayQuery = useQuery({
        queryKey: ['jobPostDisplayQuery', idToken, reqPath, queryString],
        queryFn: () => customGetter(idToken, reqPath, queryString),
        enabled: Boolean(idToken)
    })

    useEffect(() => {
        !jobPostDisplayQuery.isPending && (setJobPosts(jobPostDisplayQuery.data), setJobPostDisplay(jobPostDisplayQuery.data));

        setError(jobPostDisplayQuery.error)
        setPending(jobPostDisplayQuery.isPending)
    }, [jobPostDisplayQuery.isPending])

    const handleJobPostClick = (id: string): void => {
        router.push(`/job-post-page/${id}`);
    }

    const handleSearchChange = (event: React.ChangeEvent<any>): void => {
        const newJobPostDisplay = customFilterOnEvent(jobPosts, 'title', event)
        setJobPostDisplay(newJobPostDisplay);
    }

    if (pending) {
        return <Loading />
    }
    if (error) {
        return <Error />
    }

    return (
        <div className='bg-white shadow rounded-lg min-h-screen'>
            <div className='flex justify-center pt-6'>
                <Form className="w-full max-w-md">
                    <Form.Control
                        type="search"
                        placeholder="Search job posts..."
                        className="form-control w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50"
                        aria-label="Search job posts"
                        onChange={(event) => handleSearchChange(event)}
                    />
                </Form>
            </div>

            <div className='flex flex-col items-center my-6'>
                {jobPostDisplay && jobPostDisplay.length > 0 ? jobPostDisplay.map((jobPost) => (
                    <button key={jobPost.id} onClick={() => handleJobPostClick(jobPost.id)} className='w-full max-w-4xl text-left bg-white shadow-md rounded-lg p-4 my-2 hover:shadow-lg transition-shadow duration-300'>
                        <div className='flex'>
                            <p className='mx-4 font-semibold'>Job Title: {jobPost.title}</p>
                        </div>
                    </button>
                )) : <p className="text-gray-500">No job posts found.</p>}
            </div>
        </div>

    )
}

export default JobPostsList;
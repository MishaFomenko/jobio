'use client'
import { useEffect, useState, ChangeEvent } from 'react';
import { useUserContext } from '../context/userContext';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useRouter } from 'next/navigation';
import { customGetter, customPoster } from '../utils/fetch-requests';
import { UserContext, JobPostForOrg, SeekersNames } from '../types';
import { useQuery } from '@tanstack/react-query';
import Error from './error'
import Loading from './loading'

const OrgAccount: React.FC = () => {

    const orgFields = ['Title', 'Industry', 'Website', 'Email', 'Staff', 'About', 'Location'];
    const jobPostFields = ['Title', 'About', 'Requirements'];

    const { user, idToken } = useUserContext() as UserContext;

    const [orgInfo, setOrgInfo] = useState<(string | number)[]>([]);
    const [orgFollowers, setOrgFollowers] = useState<SeekersNames[]>([]);
    const [editing, setEditing] = useState<boolean>(false);
    const [creatingJobPost, setCreatingJobPost] = useState<boolean>(false);
    const [newJobPost, setNewJobPost] = useState<(string | undefined)[]>([user?.uid]);
    const [jobPostsForOrg, setJobPostsForOrg] = useState<JobPostForOrg[]>([]);
    const [pending, setPending] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const router = useRouter();

    const reqPathInfo = 'profileData/org';
    const queryStringInfo = `orgID=${user?.uid}`;
    const orgInfoQuery = useQuery({
        queryKey: ['orgInfoQuery', idToken, reqPathInfo, queryStringInfo],
        queryFn: () => customGetter(idToken, reqPathInfo, queryStringInfo),
        enabled: Boolean(idToken) && Boolean(user)
    })

    const reqPathFollowers = 'followers/org';
    const queryStringFollowers = `orgID=${user?.uid}`;
    const orgFollowersQuery = useQuery({
        queryKey: ['orgFollowersQuery', idToken, reqPathFollowers, queryStringFollowers],
        queryFn: () => customGetter(idToken, reqPathFollowers, queryStringFollowers),
        enabled: Boolean(idToken) && Boolean(user)
    })

    const reqPathForOrg = 'searchInfo/JobPostsForOrg';
    const queryStringForOrg = `orgID=${user?.uid}`;
    let jobPostsForOrgQuery = useQuery({
        queryKey: ['jobPostsForOrgQuery', idToken, reqPathForOrg, queryStringForOrg],
        queryFn: () => customGetter(idToken, reqPathForOrg, queryStringForOrg),
        enabled: Boolean(idToken) && Boolean(user)
    })

    useEffect(() => {
        !orgInfoQuery.isPending && setOrgInfo(Object.values(orgInfoQuery.data[0]));

        !orgFollowersQuery.isPending && setOrgFollowers(orgFollowersQuery.data);

        !jobPostsForOrgQuery.isPending && setJobPostsForOrg(jobPostsForOrgQuery.data);

        setError(orgInfoQuery.error || orgFollowersQuery.error || jobPostsForOrgQuery.error)
        setPending(orgInfoQuery.isPending || orgFollowersQuery.isPending || jobPostsForOrgQuery.isPending)
    }, [orgInfoQuery.isPending, orgFollowersQuery.isPending, jobPostsForOrgQuery.isPending])

    const handleEditing = async () => {
        const reqPathEditing = 'profileData/updateOrgInfo';
        try {
            editing && idToken && customPoster(idToken, reqPathEditing, orgInfo.slice(0, -1))
        } catch (postingError) {
            setError(postingError as Error)
        }
        setEditing(!editing);
    }

    const handleCreatingJobPost = async () => {
        const reqPathCreating = 'profileData/createNewJobPost';
        try {
            await creatingJobPost && idToken && customPoster(idToken, reqPathCreating, newJobPost)
        } catch (postingError) {
            setError(postingError as Error)
        }
        setCreatingJobPost(!creatingJobPost);
        const updatedJobPostsForOrg = await customGetter(idToken, reqPathForOrg, queryStringForOrg)
        setJobPostsForOrg(updatedJobPostsForOrg)
    }

    const handleCancelCreating = (): void => {
        setCreatingJobPost(!creatingJobPost);
    }

    const handleAccountInputChange = (ind: number, event: React.ChangeEvent<any>): void => {
        const newInfoArray: Array<string | number> = orgInfo;
        newInfoArray[ind + 1] = event.target.value;
        setOrgInfo(newInfoArray);
    }

    const handleJobPostInputChange = (ind: number, event: ChangeEvent<any>): void => {
        const newInfoArray = newJobPost;
        newInfoArray[ind + 1] = event.target.value;
        setNewJobPost(newInfoArray);
    }

    const handleJobPostClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        router.push(`/job-post-page/${event.currentTarget.id}`);
    }

    if (pending) {
        return <Loading />
    }
    if (error) {
        return <Error />
    }

    return (
        <div className='max-w-4xl mx-auto p-4 bg-white shadow rounded-lg'>
            <button
                className='flex items-center justify-center mx-auto px-4 py-2 bg-blue-400 text-white font-semibold rounded hover:bg-blue-500 transition duration-300'
                onClick={handleEditing}
            >
                <span>{editing ? 'Save Changes' : 'Edit Organization'}</span>
                <img src='/images/pencil.png' alt='' className='ml-2 h-5 w-5' />
            </button>

            <Form className='mt-6'>
                {orgInfo && orgInfo.length !== 0 && orgFields.map((field, ind) => (
                    <Form.Group key={ind} as={Row} className="mb-4 items-center">
                        <Form.Label column sm="2" className='font-semibold'>
                            {field}:
                        </Form.Label>
                        <Col sm="10">
                            {!editing ? (
                                <span className='py-2 px-4 inline-block bg-gray-100 rounded'>{orgInfo[ind + 1] || 'empty'}</span>
                            ) : (
                                <Form.Control
                                    size="lg"
                                    className='border-gray-300'
                                    onChange={(e) => handleAccountInputChange(ind, e)}
                                    defaultValue={orgInfo[ind + 1]}
                                />
                            )}
                        </Col>
                    </Form.Group>
                ))}
            </Form>

            <p className='font-semibold mt-4'>Followers: {orgFollowers?.length || 0}</p>

            <div className='mt-4'>
                <p className='font-semibold mb-2'>Job Posts:</p>
                <div className='flex flex-wrap'>
                    {jobPostsForOrg && jobPostsForOrg.length !== 0 && jobPostsForOrg.map((jobPostForOrg) => (
                        <button
                            id={jobPostForOrg.id}
                            key={jobPostForOrg.id}
                            onClick={(event) => handleJobPostClick(event)}
                            className='flex items-center justify-center mx-2 px-4 py-2 bg-blue-400 text-white font-semibold rounded hover:bg-blue-500 transition duration-300 my-2'
                        >
                            {jobPostForOrg.title}
                        </button>
                    ))}
                </div>
            </div>

            {creatingJobPost && (
                <div className='my-4 p-4 border-4 border-green-400 rounded-lg'>
                    <Form>
                        {jobPostFields && jobPostFields.length !== 0 && jobPostFields.map((field, ind) => (
                            <Form.Group key={ind} as={Row} className="mb-3">
                                <Form.Label column sm="2" className='font-semibold'>
                                    {field}:
                                </Form.Label>
                                <Col sm="10">
                                    <Form.Control
                                        size='lg'
                                        className='border-gray-300'
                                        placeholder='empty'
                                        onChange={(event) => handleJobPostInputChange(ind, event)}
                                    />
                                </Col>
                            </Form.Group>
                        ))}
                    </Form>
                    <button
                        className='flex items-center justify-center mx-auto px-4 py-2 bg-red-400 text-white font-semibold rounded hover:bg-red-500 transition duration-300 mt-4'
                        onClick={handleCancelCreating}
                    >
                        Cancel

                    </button>
                </div>
            )}

            <button
                className='flex items-center justify-center mx-auto px-4 py-2 bg-green-400 text-white font-semibold rounded hover:bg-green-500 transition duration-300 mt-4'
                onClick={handleCreatingJobPost}
            >
                <span>{creatingJobPost ? 'Save New Job Post' : 'Create New Job Post'}</span>
                <img src='/images/pencil.png' alt='' className='ml-2 h-5 w-5' />
            </button>
        </div>

    )
}

export default OrgAccount;
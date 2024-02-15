'use client'
import { useEffect, useState } from 'react';
import { useUserContext } from '../context/userContext';
import Image from 'next/image';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useRouter } from 'next/navigation';
import { customGetter, customPoster } from '../utils/fetch-requests';
import { UserContext, JobPostForOrg, SeekersNames } from '../types';
import { useQuery } from '@tanstack/react-query';

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
        enabled: Boolean(idToken)
    })

    const reqPathFollowers = 'followers/org';
    const queryStringFollowers = `orgID=${user?.uid}`;
    const orgFollowersQuery = useQuery({
        queryKey: ['orgFollowersQuery', idToken, reqPathFollowers, queryStringFollowers],
        queryFn: () => customGetter(idToken, reqPathFollowers, queryStringFollowers),
        enabled: Boolean(idToken)
    })

    const reqPathForOrg = 'searchInfo/JobPostsForOrg';
    const queryStringForOrg = `orgID=${user?.uid}`;
    const jobPostsForOrgQuery = useQuery({
        queryKey: ['jobPostsForOrgQuery', idToken, reqPathForOrg, queryStringForOrg],
        queryFn: () => customGetter(idToken, reqPathForOrg, queryStringForOrg),
        enabled: Boolean(idToken)
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
        } catch (postingError: any) {
            setError(postingError)
        }
        setEditing(!editing);
    }

    const handleCreatingJobPost = async () => {
        const reqPathCreating = 'profileData/createNewJobPost';
        try {
            creatingJobPost && idToken && customPoster(idToken, reqPathCreating, newJobPost)
        } catch (postingError: any) {
            setError(postingError)
        }
        setCreatingJobPost(!creatingJobPost);
    }

    const handleCancelCreating = (): void => {
        setCreatingJobPost(!creatingJobPost);
    }

    const handleAccountInputChange = (ind: number, event: React.ChangeEvent<any>): void => {
        const newInfoArray: Array<string | number> = orgInfo;
        newInfoArray[ind + 1] = event.target.value;
        setOrgInfo(newInfoArray);
    }

    const handleJobPostInputChange = (ind: number, event: React.ChangeEvent<any>): void => {
        const newInfoArray = newJobPost;
        newInfoArray[ind + 1] = event.target.value;
        setNewJobPost(newInfoArray);
    }

    const handleJobPostClick = (event: React.ChangeEvent<any>) => {
        router.push(`/job-post-page/${event.target.id}`);
    }

    if (pending) {
        return <p>Loading...</p>
    }
    if (error) {
        return <p>Error occured</p>
    }

    return (
        <div className='m-4 pb-4'>
            <button className='flex m-2 p-2 border-2 border-orange-400 hover:bg-orange-400 px-2 my-3 rounded-xl transition duration-300' onClick={handleEditing}>
                <p className='mx-2'>{editing ? 'Save' : 'Edit'}</p>
                <Image alt='' src='/images/pencil.png' height={20} width={20} />
            </button>
            <Form>
                {
                    orgInfo && orgInfo.length !== 0 && orgFields.map((field, ind) =>
                        <Form.Group key={ind} as={Row} className="mb-3" controlId="orgAccountInfo">
                            <Form.Label column sm="2">
                                <p className='text-2xl m-2'>{field}</p>
                            </Form.Label>
                            <Col sm="10">
                                {!editing ?
                                    <Form.Control size='lg' plaintext readOnly placeholder='empty' defaultValue={orgInfo[ind + 1]} />
                                    :
                                    <Form.Control placeholder='empty' onChange={(event) => handleAccountInputChange(ind, event)} />
                                }
                            </Col>
                        </Form.Group>
                    )
                }
            </Form>
            <p className='text-2xl m-2'>Followers: {orgFollowers.length}</p>
            <div className='flex'>
                <p className='text-2xl m-2 p-2'>Job Posts:</p>
                {jobPostsForOrg.length !== 0 && jobPostsForOrg.map((jobPostForOrg) => (
                    <button className='flex mx-2 p-2 border-2 border-orange-400 hover:bg-orange-400 px-2 my-3 rounded-xl transition duration-300' id={jobPostForOrg.id} key={jobPostForOrg.id} onClick={(event) => handleJobPostClick(event)} >{jobPostForOrg.title}</button>
                ))}
            </div>

            {creatingJobPost
                ?
                <div className='my-4 p-4 border-4 border-green'>

                    <Form>
                        {
                            jobPostFields.map((field, ind) =>
                                <Form.Group key={ind} as={Row} className="mb-3" controlId="orgAccountInfo">
                                    <Form.Label column sm="2">
                                        <p className='text-2xl'>{field}</p>
                                    </Form.Label>
                                    <Col sm="10">

                                        <Form.Control size='lg' placeholder='empty' onChange={(event) => handleJobPostInputChange(ind, event)} />

                                    </Col>
                                </Form.Group>
                            )
                        }
                    </Form>
                    <button className='flex m-2 p-2 border-2 border-red-400 hover:bg-red-400 px-2 my-3 rounded-xl transition duration-300' onClick={handleCancelCreating}>Cancel X</button>
                </div>
                :
                <></>
            }
            <button className='flex m-2 p-2 border-2 border-green-400 hover:bg-green-400 px-2 my-3 rounded-xl transition duration-300' onClick={handleCreatingJobPost}>
                <p className='mx-2'>{creatingJobPost ? 'Save new job post' : 'Create new job post'}</p>
                <Image alt='' src='/images/pencil.png' height={20} width={20} />
            </button>
        </div>
    )
}

export default OrgAccount;
'use client'
import { useEffect, useState } from 'react';
import { useUserContext } from '../context/userContext';
import Image from 'next/image';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useRouter } from 'next/navigation';
import { customGetter, customPoster } from '../utils/fetch-requests';
import { UserContext, JobPostForOrg } from '../types';

const OrgAccount: React.FC = () => {

    const { user } = useUserContext() as UserContext;

    const [orgInfo, setOrgInfo] = useState<(string | number)[]>([]);
    const [orgFollowers, setOrgFollowers] = useState([]);
    const [editing, setEditing] = useState(false);
    const [creatingJobPost, setCreatingJobPost] = useState(false);
    const [newJobPost, setNewJobPost] = useState([user?.uid]);
    const [jobPostsForOrg, setJobPostsForOrg] = useState<JobPostForOrg[]>([]);

    const orgFields = ['Title', 'Industry', 'Website', 'Email', 'Staff', 'About', 'Location'];
    const jobPostFields = ['Title', 'About', 'Requirements'];
    const router = useRouter();


    useEffect(() => {
        const reqPath = 'getOrgData';
        const queryString = `orgID=${user?.uid}`;
        customGetter(reqPath, queryString).then((data) => setOrgInfo(Object.values(data[0])));
    }, [])

    useEffect(() => {
        const reqPath = 'getOrgFollowers';
        const queryString = `orgID=${user?.uid}`;
        customGetter(reqPath, queryString).then((data) => setOrgFollowers(data));
    }, [])

    useEffect(() => {
        const reqPath = 'getJobPostsForOrg';
        const queryString = `orgID=${user?.uid}`;
        customGetter(reqPath, queryString).then((data) => setJobPostsForOrg(data));
    }, [])

    const handleEditing = () => {
        const reqPath = 'updateOrgInfo';
        editing && customPoster(reqPath, orgInfo);
        setEditing(!editing);
    }

    const handleCreatingJobPost = () => {
        const reqPath = 'createNewJobPost';
        creatingJobPost && customPoster(reqPath, newJobPost);
        setCreatingJobPost(!creatingJobPost);
    }

    const handleAccountInputChange = (ind: number, event: any) => {
        const newInfoArray: Array<string | number> = orgInfo;
        newInfoArray[ind + 1] = event.target.value;
        setOrgInfo(newInfoArray);
    }

    const handleJobPostInputChange = (ind: number, event: any) => {
        const newInfoArray = newJobPost;
        newInfoArray[ind + 1] = event.target.value;
        setNewJobPost(newInfoArray);
    }

    const handleJobPostClick = (event: any) => {
        router.push(`/job-post-page/${event.target.id}`);
    }

    return (
        <>
            <button className='flex border-2 p-2 m-2' onClick={handleEditing}>
                <p className='mx-2'>{editing ? 'Save' : 'Edit'}</p>
                <Image alt='' src='/images/pencil.png' height={20} width={20} />
            </button>
            <Form>
                {
                    orgInfo.length !== 0 && orgFields.map((field, ind) =>
                        <Form.Group key={ind} as={Row} className="mb-3" controlId="orgAccountInfo">
                            <Form.Label column sm="2">
                                {field}
                            </Form.Label>
                            <Col sm="10">
                                {!editing ?
                                    <Form.Control plaintext readOnly placeholder='empty' defaultValue={orgInfo[ind + 1]} />
                                    :
                                    <Form.Control placeholder='empty' onChange={(event) => handleAccountInputChange(ind, event)} />
                                }
                            </Col>
                        </Form.Group>
                    )
                }
            </Form>
            <p>Followers: {orgFollowers.length}</p>
            <div>
                <p>Job Posts:</p>
                {jobPostsForOrg.length !== 0 && jobPostsForOrg.map((jobPostForOrg) => (
                    <button className='text-start ml-4 mr-4 my-2 border-2 p-2' id={jobPostForOrg.id} key={jobPostForOrg.id} onClick={(event) => handleJobPostClick(event)} >{jobPostForOrg.title}</button>
                ))}
            </div>
            <button className='flex border-2 p-2 m-2' onClick={handleCreatingJobPost}>
                <p className='mx-2'>{creatingJobPost ? 'Save new job post' : 'Create new job post'}</p>
                <Image alt='' src='/images/pencil.png' height={20} width={20} />
            </button>
            {creatingJobPost
                ?
                <Form>
                    {
                        jobPostFields.map((field, ind) =>
                            <Form.Group key={ind} as={Row} className="mb-3" controlId="orgAccountInfo">
                                <Form.Label column sm="2">
                                    {field}
                                </Form.Label>
                                <Col sm="10">

                                    <Form.Control placeholder='empty' onChange={(event) => handleJobPostInputChange(ind, event)} />

                                </Col>
                            </Form.Group>
                        )
                    }
                </Form>
                :
                <></>
            }
        </>
    )
}

export default OrgAccount;
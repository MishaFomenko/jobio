'use client'
import React, { useEffect, useState } from 'react';
import { useUserContext } from '../context/userContext';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { customGetter, customPoster } from '../utils/fetch-requests';
import { UserContext, OrgsSearchInfo } from '../types';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Error from './error'
import Loading from './loading'

const JobSeekerAccount: React.FC = () => {

    const fields = ['First name', 'Last name', 'Skills', 'Location', 'Email', 'University', 'Specialization', 'Degree', 'Experience (company)', 'Experience (years)', 'About'];

    const [seekerInfo, setSeekerInfo] = useState<(string | number)[]>([]);
    const [seekerFollowing, setSeekerFollowing] = useState<OrgsSearchInfo[]>([]);
    const [editing, setEditing] = useState<boolean>(false);
    const [pending, setPending] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const { user, idToken } = useUserContext() as UserContext;

    const router = useRouter();

    const reqPathInfo = 'profileData/seeker';
    const queryStringInfo = `seekerID=${user?.uid}`;
    const seekerInfoQuery = useQuery({
        queryKey: ['seekerInfoQuery', idToken, reqPathInfo, queryStringInfo],
        queryFn: () => customGetter(idToken, reqPathInfo, queryStringInfo),
        enabled: Boolean(idToken)
    })

    const reqPathFollowing = 'followers/seeker';
    const queryStringFollowing = `seekerID=${user?.uid}`;
    const seekerFollowingQuery = useQuery({
        queryKey: ['seekerFollowingQuery', idToken, reqPathFollowing, queryStringFollowing],
        queryFn: () => customGetter(idToken, reqPathFollowing, queryStringFollowing),
        enabled: Boolean(idToken)
    })

    useEffect(() => {
        !seekerInfoQuery.isPending && setSeekerInfo(Object.values(seekerInfoQuery.data[0]));

        !seekerFollowingQuery.isPending && setSeekerFollowing(seekerFollowingQuery.data);

        setError(seekerInfoQuery.error || seekerFollowingQuery.error)
        setPending(seekerInfoQuery.isPending || seekerFollowingQuery.isPending)
    }, [seekerInfoQuery.isPending, seekerFollowingQuery.isPending])

    const handleEditing = (): void => {
        const reqPath = 'profileData/updateSeekerInfo';
        try {
            editing && idToken && customPoster(idToken, reqPath, seekerInfo.slice(0, -1));
        } catch (postingError: any) {
            setError(postingError)
        }
        setEditing(!editing);
    }

    const handleInputChange = (ind: number, event: React.ChangeEvent<any>): void => {
        const newInfoArray: Array<string | number> = seekerInfo;
        newInfoArray[ind + 1] = event.target.value;
        setSeekerInfo(newInfoArray);
    }

    const handleOrgClick = (id: string): void => {
        router.push(`/organization-page/${id}`);
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
                <span>{editing ? 'Save Changes' : 'Edit Profile'}</span>
                <img src='/images/pencil.png' alt='' className='ml-2 h-5 w-5' />
            </button>

            <Form className='mt-6'>
                {seekerInfo && seekerInfo.length !== 0 && fields.map((field, ind) => (
                    <Form.Group key={ind} as={Row} className="mb-4 items-center">
                        <Form.Label column sm="2" className='font-semibold'>
                            {field}:
                        </Form.Label>
                        <Col sm="10">
                            {!editing ? (
                                <span className='py-2 px-4 inline-block bg-gray-100 rounded'>{seekerInfo[ind + 1] || 'empty'}</span>
                            ) : (
                                <Form.Control
                                    size="lg"
                                    className='border-gray-300'
                                    onChange={(e) => handleInputChange(ind, e)}
                                    defaultValue={seekerInfo[ind + 1]}
                                />
                            )}
                        </Col>
                    </Form.Group>
                ))}
            </Form>

            <div className='mt-4'>
                <p className='font-semibold'>Following: {seekerFollowing?.length || 0}</p>
                {seekerFollowing && seekerFollowing.length !== 0 && seekerFollowing.map((org) => (
                    <button
                        key={org.unique_id}
                        onClick={() => handleOrgClick(org.unique_id)}
                        className='flex items-center w-full text-left px-4 py-2 mt-2 border border-gray-300 rounded hover:bg-gray-100 transition duration-300'
                    >
                        <span>Company: {org.title}</span>
                    </button>
                ))}
            </div>
        </div>


    )
}

export default JobSeekerAccount;
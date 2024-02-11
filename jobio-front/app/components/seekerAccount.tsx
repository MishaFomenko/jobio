'use client'
import React, { useEffect, useState } from 'react';
import { useUserContext } from '../context/userContext';
import Image from 'next/image';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { customGetter, customPoster } from '../utils/fetch-requests';
import { UserContext, OrgsSearchInfo } from '../types';
import { useRouter } from 'next/navigation';

const JobSeekerAccount: React.FC = () => {

    const [seekerInfo, setSeekerInfo] = useState<(string | number)[]>([]);
    const [seekerFollowing, setSeekerFollowing] = useState<OrgsSearchInfo[]>([]);
    const [editing, setEditing] = useState<boolean>(false);
    const fields = ['First name', 'Last name', 'Skills', 'Location', 'Email', 'University', 'Specialization', 'Degree', 'Experience (company)', 'Experience (years)', 'About'];
    const { user, idToken } = useUserContext() as UserContext;

    const router = useRouter();

    useEffect(() => {
        const reqPathInfo = 'profileData/seeker';
        const queryStringInfo = `seekerID=${user?.uid}`;
        customGetter(idToken, reqPathInfo, queryStringInfo).then((data) => setSeekerInfo(Object.values(data[0])));

        const reqPathFollowing = 'followers/seeker';
        const queryStringFollowing = `seekerID=${user?.uid}`;
        customGetter(idToken, reqPathFollowing, queryStringFollowing).then((data) => setSeekerFollowing(data));
    }, [])

    const handleEditing = (): void => {
        const reqPath = 'profileData/updateSeekerInfo';
        editing && customPoster(idToken, reqPath, seekerInfo.slice(0, -1));
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

    return (
        <div className='m-4 pb-4'>
            <button className='flex m-2 p-2 border-2 border-orange-400 hover:bg-orange-400 px-2 my-3 rounded-xl transition duration-300' onClick={handleEditing}>
                <p className='mx-2'>{editing ? 'Save' : 'Edit'}</p>
                <Image alt='' src='/images/pencil.png' height={20} width={20} />
            </button>
            <Form>
                {
                    seekerInfo.length !== 0 && fields.map((field, ind) =>
                        <Form.Group key={ind} as={Row} className="mb-3" controlId="seekerAccountInfo">
                            <Form.Label column sm="2">
                                <p className='text-2xl'>{field}</p>
                            </Form.Label>
                            <Col>
                                {!editing ?
                                    <Form.Control size='lg' plaintext readOnly placeholder='empty' defaultValue={seekerInfo[ind + 1]} />
                                    :
                                    <Form.Control placeholder='empty' onChange={(event) => handleInputChange(ind, event)} />
                                }
                            </Col>
                        </Form.Group>
                    )
                }
            </Form>
            <p className='text-2xl'>Following: {seekerFollowing.length}</p>
            {seekerFollowing.length !== 0 && seekerFollowing.map((org) => (
                <button key={org.unique_id} onClick={() => handleOrgClick(org.unique_id)} className='text-start ml-4 mr-4 my-2 p-2 border-2 border-grey-300 hover:bg-gray-300 px-2 rounded-xl transition duration-300 focus:bg-grey-600' >
                    <div className='flex'>
                        <p className='mx-4 w-1/3'>Company: {org.title}</p>
                    </div>
                </button>
            ))}
        </div>
    )
}

export default JobSeekerAccount;
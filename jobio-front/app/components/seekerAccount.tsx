'use client'
import { useEffect, useState } from 'react';
import { useUserContext } from '../context/userContext';
import Image from 'next/image';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { customGetter, customPoster } from '../utils/fetch-requests';
import { UserContext } from '../types';

const JobSeekerAccount: React.FC = () => {

    const [seekerInfo, setSeekerInfo] = useState<(string | number)[]>([]);
    const [seekerFollowing, setSeekerFollowing] = useState([]);
    const [editing, setEditing] = useState(false);
    const fields = ['First name', 'Last name', 'Skills', 'Location', 'Email', 'University', 'Specialization', 'Degree', 'Experience (company)', 'Experience (years)', 'About'];
    const { user } = useUserContext() as UserContext;

    useEffect(() => {
        const reqPath = 'getSeekerData';
        const queryString = `seekerID=${user?.uid}`;
        customGetter(reqPath, queryString).then((data) => setSeekerInfo(Object.values(data[0])));
    }, [])

    useEffect(() => {
        const reqPath = 'getSeekerFollowing';
        const queryString = `seekerID=${user?.uid}`;
        customGetter(reqPath, queryString).then((data) => setSeekerFollowing(data));
    }, [])

    const handleEditing = () => {
        const reqPath = 'updateSeekerInfo';
        editing && customPoster(reqPath, seekerInfo);
        setEditing(!editing);
    }

    const handleInputChange = (ind: number, event: any) => {
        const newInfoArray: Array<string | number> = seekerInfo;
        newInfoArray[ind + 1] = event.target.value;
        setSeekerInfo(newInfoArray);
    }

    return (
        <>
            <button className='flex border-2 p-2 m-2' onClick={handleEditing}>
                <p className='mx-2'>{editing ? 'Save' : 'Edit'}</p>
                <Image alt='' src='/images/pencil.png' height={20} width={20} />
            </button>
            <Form>
                {
                    seekerInfo.length !== 0 && fields.map((field, ind) =>
                        <Form.Group key={ind} as={Row} className="mb-3" controlId="seekerAccountInfo">
                            <Form.Label column sm="2">
                                {field}
                            </Form.Label>
                            <Col sm="10">
                                {!editing ?
                                    <Form.Control plaintext readOnly placeholder='empty' defaultValue={seekerInfo[ind + 1]} />
                                    :
                                    <Form.Control placeholder='empty' onChange={(event) => handleInputChange(ind, event)} />
                                }
                            </Col>
                        </Form.Group>
                    )
                }
            </Form>
            <p>Following: {seekerFollowing.length}</p>
        </>
    )
}

export default JobSeekerAccount;
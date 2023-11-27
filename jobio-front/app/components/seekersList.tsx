'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { customGetter } from '../utils/fetch-requests';
import { SeekersNames } from '../types';
import Form from 'react-bootstrap/Form';

const SeekersList: React.FC = () => {

    const [seekers, setSeekers] = useState<SeekersNames[]>([]);
    const [seekerDisplay, setSeekerDisplay] = useState<SeekersNames[]>([]);
    const router = useRouter();


    useEffect(() => {
        const reqPath = 'getSeekersNames';
        const queryString = '';
        customGetter(reqPath, queryString).then((data) => (setSeekers(data), setSeekerDisplay(data)));
    }, [])

    const handleSeekerClick = (event: any) => {
        router.push(`/job-seeker-page/${event.target.id}`);
    }

    const handleSearchChange = (event: any) => {
        const newSeekerDisplay = seekers.filter(seeker => (seeker.first_name + ' ' + seeker.last_name).toLowerCase().includes(event.target.value.toLowerCase()));
        setSeekerDisplay(newSeekerDisplay);
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
                {seekerDisplay.length !== 0 && seekerDisplay.map((seeker) => (
                    <button className='text-start ml-4 mr-4 my-2 border-2 p-2' id={seeker.unique_id} key={seeker.unique_id} onClick={(event) => handleSeekerClick(event)} >{seeker.first_name + ' ' + seeker.last_name}</button>
                ))}
            </div>
        </>
    )
}

export default SeekersList;
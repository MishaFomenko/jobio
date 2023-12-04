'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { customGetter } from '../utils/fetch-requests';
import { SeekersNames } from '../types';
import Form from 'react-bootstrap/Form';
import SearchDropdown from './searchDropdown';
import Button from 'react-bootstrap/Button';

const SeekersList: React.FC = () => {

    const [seekersSearchInfo, setSeekersSearchInfo] = useState<SeekersNames[]>([]);
    const [seekerDisplay, setSeekerDisplay] = useState<SeekersNames[]>([]);
    const [locationFilter, setLocationFilter] = useState('');
    const [specFilter, setSpecFilter] = useState('');
    const router = useRouter();


    useEffect(() => {
        const reqPath = 'searchInfo/Seekers';
        const queryString = '';
        customGetter(reqPath, queryString).then((data) => (setSeekersSearchInfo(data), setSeekerDisplay(data)));
    }, [])

    const handleSeekerClick = (id) => {
        router.push(`/job-seeker-page/${id}`);
    }

    const handleSearchChange = (event: any) => {
        const newSeekerDisplay = seekersSearchInfo.filter(seeker => (seeker.first_name + ' ' + seeker.last_name).toLowerCase().includes(event.target.value.toLowerCase()));
        setSeekerDisplay(newSeekerDisplay);
    }

    useEffect(() => {
        const filteredSeekers = seekersSearchInfo.filter(byLoc => byLoc.location.toLowerCase().includes(locationFilter.toLowerCase())).filter(bySpec => bySpec.spec.toLowerCase().includes(specFilter.toLowerCase()));
        setSeekerDisplay(filteredSeekers);
    }, [locationFilter, specFilter])

    const handleFilterReset = () => {
        setLocationFilter('');
        setSpecFilter('');
        setSeekerDisplay(seekersSearchInfo);
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
            <div className='flex'>
                <SearchDropdown searchBy='location' data={seekersSearchInfo.map(item => item.location)} filterSetter={setLocationFilter} filter={locationFilter} />
                <SearchDropdown searchBy='industry' data={seekersSearchInfo.map(item => item.spec)} filterSetter={setSpecFilter} filter={specFilter} />
                <button className='border-2 border-orange-300 hover:bg-orange-300 px-2 my-3 rounded-xl transition duration-300' onClick={handleFilterReset}>Reset filters</button>
            </div>
            <div className='flex flex-col justify-start'>
                {seekerDisplay.length !== 0 && seekerDisplay.map((seeker) => (
                    <Button variant='info' className='text-start ml-4 mr-4 my-2 border-2 p-2' id={seeker.unique_id} key={seeker.unique_id} onClick={() => handleSeekerClick(seeker.unique_id)} >
                        <div className='flex'>
                            <p className='mx-4'>{seeker.first_name + ' ' + seeker.last_name}</p>
                            <p className='w-1/3 flex justify-center'>Location: {seeker.location}</p>
                            <p className='w-1/3 flex justify-center'>Specialization: {seeker.spec}</p>
                        </div>
                    </Button>
                ))}
            </div>
        </>
    )
}

export default SeekersList;
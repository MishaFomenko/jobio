'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { customGetter } from '../utils/fetch-requests';
import { SeekersNames } from '../types';
import Form from 'react-bootstrap/Form';
import SearchDropdown from './searchDropdown';
import { useUserContext } from '../context/userContext';
import { UserContext } from '../types'

const SeekersList: React.FC = () => {

    const [seekersSearchInfo, setSeekersSearchInfo] = useState<SeekersNames[]>([]);
    const [seekerDisplay, setSeekerDisplay] = useState<SeekersNames[]>([]);
    const [locationFilter, setLocationFilter] = useState<string>('');
    const [specFilter, setSpecFilter] = useState<string>('');
    const router = useRouter();
    const { idToken } = useUserContext() as UserContext


    useEffect(() => {
        const reqPathInfo = 'searchInfo/Seekers';
        const queryStringInfo = '';
        customGetter(idToken, reqPathInfo, queryStringInfo).then((data) => (setSeekersSearchInfo(data), setSeekerDisplay(data)));
    }, [])

    useEffect(() => {
        const filteredSeekers = seekersSearchInfo.filter(byLoc => byLoc.location.toLowerCase().includes(locationFilter.toLowerCase())).filter(bySpec => bySpec.spec.toLowerCase().includes(specFilter.toLowerCase()));
        setSeekerDisplay(filteredSeekers);
    }, [locationFilter, specFilter])

    const handleSeekerClick = (id: string): void => {
        router.push(`/job-seeker-page/${id}`);
    }

    const handleSearchChange = (event: React.ChangeEvent<any>): void => {
        const newSeekerDisplay = seekersSearchInfo.filter(seeker => (seeker.first_name + ' ' + seeker.last_name).toLowerCase().includes(event.target.value.toLowerCase()));
        setSeekerDisplay(newSeekerDisplay);
    }

    const handleFilterReset = (): void => {
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
                    <button className='text-start ml-4 mr-4 my-2 p-2 border-2 border-grey-300 hover:bg-gray-300 px-2 rounded-xl transition duration-300 focus:bg-grey-600' id={seeker.unique_id} key={seeker.unique_id} onClick={() => handleSeekerClick(seeker.unique_id)} >
                        <div className='flex'>
                            <p className='mx-4 w-1/3'>Name: {seeker.first_name + ' ' + seeker.last_name}</p>
                            <p className='w-1/3 flex justify-start'>Location: {seeker.location}</p>
                            <p className='w-1/3 flex justify-start'>Specialization: {seeker.spec}</p>
                        </div>
                    </button>
                ))}
            </div>
        </>
    )
}

export default SeekersList;
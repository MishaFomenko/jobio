'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { customGetter } from '../utils/fetch-requests';
import { SeekersNames } from '../types';
import Form from 'react-bootstrap/Form';
import SearchDropdown from './searchDropdown';
import { useUserContext } from '../context/userContext';
import { UserContext } from '../types';
import { useQuery } from '@tanstack/react-query';
import Error from './error'
import Loading from './loading'

const SeekersList: React.FC = () => {

    const [seekersSearchInfo, setSeekersSearchInfo] = useState<SeekersNames[]>([]);
    const [seekerDisplay, setSeekerDisplay] = useState<SeekersNames[]>([]);
    const [locationFilter, setLocationFilter] = useState<string>('');
    const [specFilter, setSpecFilter] = useState<string>('');
    const [pending, setPending] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const router = useRouter();

    const { idToken } = useUserContext() as UserContext

    const reqPathInfo = 'searchInfo/Seekers';
    const queryStringInfo = '';
    const seekerSearchInfoQuery = useQuery({
        queryKey: ['seekerSearchInfoQuery', idToken, reqPathInfo, queryStringInfo],
        queryFn: () => customGetter(idToken, reqPathInfo, queryStringInfo),
        enabled: Boolean(idToken)
    })

    useEffect(() => {
        !seekerSearchInfoQuery.isPending && (setSeekersSearchInfo(seekerSearchInfoQuery.data), setSeekerDisplay(seekerSearchInfoQuery.data));

        setError(seekerSearchInfoQuery.error)
        setPending(seekerSearchInfoQuery.isPending)
    }, [seekerSearchInfoQuery.isPending])

    useEffect(() => {
        const filteredSeekers = seekersSearchInfo && seekersSearchInfo.filter(byLoc => byLoc.location.toLowerCase().includes(locationFilter.toLowerCase())).filter(bySpec => bySpec.spec.toLowerCase().includes(specFilter.toLowerCase()));
        setSeekerDisplay(filteredSeekers);
    }, [locationFilter, specFilter, seekersSearchInfo])

    const handleSeekerClick = (id: string): void => {
        router.push(`/job-seeker-page/${id}`);
    }

    const handleSearchChange = (event: React.ChangeEvent<any>): void => {
        const newSeekerDisplay = seekersSearchInfo && seekersSearchInfo.filter(seeker => (seeker.first_name + ' ' + seeker.last_name).toLowerCase().includes(event.target.value.toLowerCase()));
        setSeekerDisplay(newSeekerDisplay);
    }

    const handleFilterReset = (): void => {
        setLocationFilter('');
        setSpecFilter('');
        setSeekerDisplay(seekersSearchInfo);
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
                <Form className="w-full max-w-lg">
                    <Form.Control
                        type="search"
                        placeholder="Search seekers..."
                        className="form-control w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50"
                        aria-label="Search"
                        onChange={(event) => handleSearchChange(event)}
                    />
                </Form>
            </div>

            <div className='flex justify-center gap-4 my-4'>
                <SearchDropdown searchBy='location' data={seekersSearchInfo?.map(item => item.location)} filterSetter={setLocationFilter} filter={locationFilter} />
                <SearchDropdown searchBy='industry' data={seekersSearchInfo?.map(item => item.spec)} filterSetter={setSpecFilter} filter={specFilter} />
                <button className='px-4 py-2 border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white rounded-md transition duration-300' onClick={handleFilterReset}>
                    Reset Filters
                </button>
            </div>

            <div className='flex flex-col items-center'>
                {seekerDisplay && seekerDisplay.length > 0 ? seekerDisplay.map((seeker) => (
                    <button key={seeker.unique_id} onClick={() => handleSeekerClick(seeker.unique_id)} className='w-full max-w-4xl text-left bg-white shadow-md rounded-lg p-4 my-2 hover:shadow-lg transition-shadow duration-300'>
                        <div className='flex justify-between'>
                            <p className='font-semibold'>Name: {seeker.first_name + ' ' + seeker.last_name}</p>
                            <p>Location: {seeker.location}</p>
                            <p>Specialization: {seeker.spec}</p>
                        </div>
                    </button>
                )) : <p className="text-gray-500">No seekers found.</p>}
            </div>
        </div>

    )
}

export default SeekersList;
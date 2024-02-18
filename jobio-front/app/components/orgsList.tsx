'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { customGetter } from '../utils/fetch-requests';
import { OrgsSearchInfo, UserContext } from '../types';
import Form from 'react-bootstrap/Form';
import SearchDropdown from './searchDropdown';
import { useUserContext } from '../context/userContext';
import { useQuery } from '@tanstack/react-query';
import Error from './error'
import Loading from './loading'

const OrgsList: React.FC = () => {

    const [orgsSearchInfo, setOrgs] = useState<OrgsSearchInfo[]>([]);
    const [orgDisplay, setOrgDisplay] = useState<OrgsSearchInfo[]>([]);
    const [locationFilter, setLocationFilter] = useState<string>('');
    const [industryFilter, setIndustryFilter] = useState<string>('');
    const [pending, setPending] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const { idToken } = useUserContext() as UserContext

    const router = useRouter();

    const reqPath = 'searchInfo/Orgs';
    const queryString = '';
    const orgDisplayQuery = useQuery({
        queryKey: ['orgDisplayQuery', idToken, reqPath, queryString],
        queryFn: () => customGetter(idToken, reqPath, queryString),
        enabled: Boolean(idToken)
    })

    useEffect(() => {
        !orgDisplayQuery.isPending && (setOrgs(orgDisplayQuery.data), setOrgDisplay(orgDisplayQuery.data));

        setError(orgDisplayQuery.error)
        setPending(orgDisplayQuery.isPending)
    }, [orgDisplayQuery.isPending])

    useEffect(() => {
        const filteredOrgs = orgsSearchInfo && orgsSearchInfo.filter(byLoc => byLoc.location.toLowerCase().includes(locationFilter.toLowerCase())).filter(byInd => byInd.industry.toLowerCase().includes(industryFilter.toLowerCase()));
        setOrgDisplay(filteredOrgs);
    }, [locationFilter, industryFilter, orgsSearchInfo])

    const handleOrgClick = (id: string): void => {
        router.push(`/organization-page/${id}`);
    }

    const handleSearchChange = (event: React.ChangeEvent<any>): void => {
        const newOrgDisplay = orgsSearchInfo && orgsSearchInfo.filter(org => org.title.toLowerCase().includes(event.target.value.toLowerCase()));
        setOrgDisplay(newOrgDisplay);
    }

    const handleFilterReset = (): void => {
        setLocationFilter('');
        setIndustryFilter('');
        setOrgDisplay(orgsSearchInfo);
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
                        placeholder="Search by title..."
                        className="form-control w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50"
                        aria-label="Search"
                        onChange={(event) => handleSearchChange(event)}
                    />
                </Form>
            </div>

            <div className='flex justify-center gap-6 my-6'>
                <SearchDropdown searchBy='location' data={orgsSearchInfo?.map(item => item.location)} filterSetter={setLocationFilter} filter={locationFilter} />
                <SearchDropdown searchBy='industry' data={orgsSearchInfo?.map(item => item.industry)} filterSetter={setIndustryFilter} filter={industryFilter} />
                <button className='px-4 py-2 border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white rounded-md transition duration-300' onClick={handleFilterReset}>
                    Reset Filters
                </button>
            </div>

            <div className='flex flex-col items-center pb-6'>
                {orgDisplay && orgDisplay.length > 0 ? orgDisplay.map((org) => (
                    <div key={org.unique_id} className='w-full max-w-4xl bg-white shadow-md rounded-lg p-4 mb-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer' onClick={() => handleOrgClick(org.unique_id)}>
                        <div className='flex justify-between text-gray-800'>
                            <p className='font-semibold'>Company: {org.title}</p>
                            <p>Location: {org.location}</p>
                            <p>Industry: {org.industry}</p>
                        </div>
                    </div>
                )) : (
                    <div className='text-gray-600'>No organizations found.</div>
                )}
            </div>
        </div>


    )
}

export default OrgsList;
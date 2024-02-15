'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { customGetter } from '../utils/fetch-requests';
import { OrgsSearchInfo, UserContext } from '../types';
import Form from 'react-bootstrap/Form';
import SearchDropdown from './searchDropdown';
import { useUserContext } from '../context/userContext';
import { useQuery } from '@tanstack/react-query';

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
        const filteredOrgs = orgsSearchInfo.filter(byLoc => byLoc.location.toLowerCase().includes(locationFilter.toLowerCase())).filter(byInd => byInd.industry.toLowerCase().includes(industryFilter.toLowerCase()));
        setOrgDisplay(filteredOrgs);
    }, [locationFilter, industryFilter, orgsSearchInfo])

    const handleOrgClick = (id: string): void => {
        router.push(`/organization-page/${id}`);
    }

    const handleSearchChange = (event: React.ChangeEvent<any>): void => {
        const newOrgDisplay = orgsSearchInfo.filter(org => org.title.toLowerCase().includes(event.target.value.toLowerCase()));
        setOrgDisplay(newOrgDisplay);
    }

    const handleFilterReset = (): void => {
        setLocationFilter('');
        setIndustryFilter('');
        setOrgDisplay(orgsSearchInfo);
    }

    if (pending) {
        return <p>Loading...</p>
    }
    if (error) {
        return <p>Error occured</p>
    }

    return (
        <>
            <Form className="d-flex">
                <Form.Control
                    type="search"
                    placeholder="Search by title"
                    className="mx-3"
                    aria-label="Search"
                    onChange={(event) => handleSearchChange(event)}
                />
            </Form>
            <div className='flex'>
                <SearchDropdown searchBy='location' data={orgsSearchInfo && orgsSearchInfo.map(item => item.location)} filterSetter={setLocationFilter} filter={locationFilter} />
                <SearchDropdown searchBy='industry' data={orgsSearchInfo && orgsSearchInfo.map(item => item.industry)} filterSetter={setIndustryFilter} filter={industryFilter} />
                <button className='border-2 border-orange-300 hover:bg-orange-100 px-2 my-3 rounded-xl transition duration-300' onClick={handleFilterReset}>Reset filters</button>
            </div>
            <div className='flex flex-col justify-start'>
                {orgDisplay && orgDisplay.length !== 0 && orgDisplay.map((org) => (
                    <button key={org.unique_id} onClick={() => handleOrgClick(org.unique_id)} className='text-start ml-4 mr-4 my-2 p-2 border-2 border-grey-300 hover:bg-gray-300 px-2 rounded-xl transition duration-300 focus:bg-grey-600' >
                        <div className='flex'>
                            <p className='mx-4 w-1/3'>Company: {org.title}</p>
                            <p className='w-1/3 flex justify-start'>Location: {org.location}</p>
                            <p className='w-1/3 flex justify-start'>Industry: {org.industry}</p>
                        </div>
                    </button>
                ))}
            </div>

        </>
    )
}

export default OrgsList;
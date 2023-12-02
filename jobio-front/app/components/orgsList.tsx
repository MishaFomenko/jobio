'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { customGetter } from '../utils/fetch-requests';
import { OrgsSearchInfo } from '../types';
import Form from 'react-bootstrap/Form';
import SearchDropdown from './searchDropdown';

const OrgsList: React.FC = () => {

    const [orgsSearchInfo, setOrgs] = useState<OrgsSearchInfo[]>([]);
    const [orgDisplay, setOrgDisplay] = useState<OrgsSearchInfo[]>([]);
    const [locationFilter, setLocationFilter] = useState('');
    const [industryFilter, setIndustryFilter] = useState('');

    const router = useRouter();

    useEffect(() => {
        const reqPath = 'getOrgsSearchInfo';
        const queryString = '';
        customGetter(reqPath, queryString).then((data) => (setOrgs(data), setOrgDisplay(data)));
    }, [])

    const handleOrgClick = (event: any) => {
        router.push(`/organization-page/${event.target.id}`);
    }

    const handleSearchChange = (event: any) => {
        const newOrgDisplay = orgsSearchInfo.filter(org => org.title.toLowerCase().includes(event.target.value.toLowerCase()));
        setOrgDisplay(newOrgDisplay);
    }

    useEffect(() => {
        const filteredOrgs = orgDisplay.filter(byLoc => byLoc.location.toLowerCase().includes(locationFilter.toLowerCase())).filter(byInd => byInd.industry.toLowerCase().includes(industryFilter.toLowerCase()));
        setOrgDisplay(filteredOrgs);
    }, [locationFilter, industryFilter])

    const handleFilterReset = () => {
        setLocationFilter('');
        setIndustryFilter('');
        setOrgDisplay(orgsSearchInfo);
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
            <div className='flex'>
                <SearchDropdown searchBy='location' data={orgsSearchInfo.map(item => item.location)} filterSetter={setLocationFilter} />
                <SearchDropdown searchBy='industry' data={orgsSearchInfo.map(item => item.industry)} filterSetter={setIndustryFilter} />
                <button className='bg-orange-300 p-2 rounded-xl' onClick={handleFilterReset}>Reset X</button>
            </div>
            <div className='flex flex-col justify-start'>
                {orgDisplay.length !== 0 && orgDisplay.map((org) => (
                    <button className='text-start ml-4 mr-4 my-2 border-2 p-2' id={org.unique_id} key={org.unique_id} onClick={(event) => handleOrgClick(event)} >{org.title}</button>
                ))}
            </div>

        </>
    )
}

export default OrgsList;
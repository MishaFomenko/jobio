'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { customGetter } from '../utils/fetch-requests';
import { OrgsSearchInfo } from '../types';
import Form from 'react-bootstrap/Form';
import SearchDropdown from './searchDropdown';
import Button from 'react-bootstrap/Button';

const OrgsList: React.FC = () => {

    const [orgsSearchInfo, setOrgs] = useState<OrgsSearchInfo[]>([]);
    const [orgDisplay, setOrgDisplay] = useState<OrgsSearchInfo[]>([]);
    const [locationFilter, setLocationFilter] = useState('');
    const [industryFilter, setIndustryFilter] = useState('');

    const router = useRouter();

    useEffect(() => {
        const reqPath = 'searchInfo/Orgs';
        const queryString = '';
        customGetter(reqPath, queryString).then((data) => (setOrgs(data), setOrgDisplay(data)));
    }, [])

    const handleOrgClick = (id: string) => {
        router.push(`/organization-page/${id}`);
    }

    const handleSearchChange = (event: any) => {
        const newOrgDisplay = orgsSearchInfo.filter(org => org.title.toLowerCase().includes(event.target.value.toLowerCase()));
        setOrgDisplay(newOrgDisplay);
    }

    useEffect(() => {
        const filteredOrgs = orgsSearchInfo.filter(byLoc => byLoc.location.toLowerCase().includes(locationFilter.toLowerCase())).filter(byInd => byInd.industry.toLowerCase().includes(industryFilter.toLowerCase()));
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
                    placeholder="Search by title"
                    className="mx-3"
                    aria-label="Search"
                    onChange={(event) => handleSearchChange(event)}
                />
            </Form>
            <div className='flex'>
                <SearchDropdown searchBy='location' data={orgsSearchInfo.map(item => item.location)} filterSetter={setLocationFilter} filter={locationFilter} />
                <SearchDropdown searchBy='industry' data={orgsSearchInfo.map(item => item.industry)} filterSetter={setIndustryFilter} filter={industryFilter} />
                <button className='border-2 border-orange-300 hover:bg-orange-300 px-2 my-3 rounded-xl transition duration-300' onClick={handleFilterReset}>Reset filters</button>
            </div>
            <div className='flex flex-col justify-start'>
                {orgDisplay.length !== 0 && orgDisplay.map((org) => (
                    <button key={org.unique_id} onClick={() => handleOrgClick(org.unique_id)} className='text-start ml-4 mr-4 my-2 p-2 border-2 border-cyan-300 hover:bg-cyan-300 px-2 rounded-xl transition duration-300' >
                        <div className='flex'>
                            <p className='mx-4'>{org.title}</p>
                            <p className='w-1/3 flex justify-center'>Location: {org.location}</p>
                            <p className='w-1/3 flex justify-center'>Industry: {org.industry}</p>
                        </div>
                    </button>
                ))}
            </div>

        </>
    )
}

export default OrgsList;
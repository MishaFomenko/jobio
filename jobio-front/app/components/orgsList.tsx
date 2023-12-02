'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { customGetter } from '../utils/fetch-requests';
import { OrgsNames } from '../types';
import Form from 'react-bootstrap/Form';

const OrgsList: React.FC = () => {

    const [orgs, setOrgs] = useState<OrgsNames[]>([]);
    const [orgDisplay, setOrgDisplay] = useState<OrgsNames[]>([]);
    const [check, setCheck] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const reqPath = 'getOrgsNames';
        const queryString = '';
        customGetter(reqPath, queryString).then((data) => (setOrgs(data), setOrgDisplay(data)));
    }, [])

    const handleOrgClick = (event: any) => {
        router.push(`/organization-page/${event.target.id}`);
    }

    const handleSearchChange = (event: any) => {
        const newOrgDisplay = orgs.filter(org => org.title.toLowerCase().includes(event.target.value.toLowerCase()));
        setOrgDisplay(newOrgDisplay);
    }

    const handleCheck = (event: any) => {
        setCheck(event.target.checked)
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
            {check && <p>checked</p>}
            <Form.Check // prettier-ignore
                type='checkbox'
                id={`default-check`}
                label={`default check`}

                onChange={(event) => handleCheck(event)}
            />
            <div className='flex flex-col justify-start'>
                {orgDisplay.length !== 0 && orgDisplay.map((org) => (
                    <button className='text-start ml-4 mr-4 my-2 border-2 p-2' id={org.unique_id} key={org.unique_id} onClick={(event) => handleOrgClick(event)} >{org.title}</button>
                ))}
            </div>

        </>
    )
}

export default OrgsList;
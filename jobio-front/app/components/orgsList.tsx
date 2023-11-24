'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { customGetter } from '../utils/fetch-requests';
import { OrgsNames } from '../types';

const OrgsList: React.FC = () => {

    const [orgs, setOrgs] = useState<OrgsNames[]>([]);
    const router = useRouter();

    useEffect(() => {
        const reqPath = 'getOrgsNames';
        const queryString = '';
        customGetter(reqPath, queryString).then((data) => setOrgs(data));
    })

    const handleOrgClick = (event: any) => {
        router.push(`/organization-page/${event.target.id}`);
    }

    return (
        <>
            <div className='flex flex-col justify-start'>
                {orgs.length !== 0 && orgs.map((org) => (
                    <button className='text-start ml-4 mr-4 my-2 border-2 p-2' id={org.unique_id} key={org.unique_id} onClick={(event) => handleOrgClick(event)} >{org.title}</button>
                ))}
            </div>

        </>
    )
}

export default OrgsList;
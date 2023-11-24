'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { customGetter } from '../utils/fetch-requests';
import { SeekersNames } from '../types';

const SeekersList: React.FC = () => {

    const [seekers, setSeekers] = useState<SeekersNames[]>([]);
    const router = useRouter();


    useEffect(() => {
        const reqPath = 'getSeekersNames';
        const queryString = '';
        customGetter(reqPath, queryString).then((data) => setSeekers(data));
    })

    const handleSeekerClick = (event: any) => {
        router.push(`/job-seeker-page/${event.target.id}`);
    }

    return (
        <>
            <div className='flex flex-col justify-start'>
                {seekers.length !== 0 && seekers.map((seeker) => (
                    <button className='text-start ml-4 mr-4 my-2 border-2 p-2' id={seeker.unique_id} key={seeker.unique_id} onClick={(event) => handleSeekerClick(event)} >{seeker.first_name + ' ' + seeker.last_name}</button>
                ))}
            </div>
        </>
    )
}

export default SeekersList;
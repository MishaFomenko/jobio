'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '../context/userContext';
import { customGetter, customPoster } from '../utils/fetch-requests';
import { UserContext, JobPostForOrg, OrgInfo, SeekersNames } from '../types';
import { format } from 'date-fns';
import Button from 'react-bootstrap/Button';

const OrganizationProfile: React.FC<{ orgID: string }> = ({ orgID }) => {

    const [orgInfo, setOrgInfo] = useState<OrgInfo | {}>({});
    const [orgFollowers, setOrgFollowers] = useState<SeekersNames[]>([]);
    const [jobPostsForOrg, setJobPostsForOrg] = useState<JobPostForOrg[]>([]);
    const [following, setFollowing] = useState<boolean>(false);
    const fields = ['Title', 'Industry', 'Website', 'Email', 'Staff', 'About', 'Location', 'On the platform since'];
    const router = useRouter();
    const { user, userRole } = useUserContext() as UserContext;

    useEffect(() => {
        const reqPathInfo = 'profileData/org';
        const queryStringInfo = `orgID=${orgID}`;
        customGetter(reqPathInfo, queryStringInfo).then((data) => setOrgInfo(data[0]));

        const reqPathFollowers = 'followers/org';
        const queryStringFollowers = `orgID=${orgID}`;
        customGetter(reqPathFollowers, queryStringFollowers).then((data) => setOrgFollowers(data));

        const reqPathForOrg = 'searchInfo/JobPostsForOrg';
        const queryStringForOrg = `orgID=${orgID}`;
        customGetter(reqPathForOrg, queryStringForOrg).then((data) => setJobPostsForOrg(data));

        const reqPathCheck = 'followers/check';
        const queryStringCheck = `orgID=${orgID}&userID=${user?.uid}`;
        customGetter(reqPathCheck, queryStringCheck).then((data) => data.length !== 0 && setFollowing(true));
    })

    const handleJobPostClick = (event: React.ChangeEvent<any>): void => {
        router.push(`/job-post-page/${event.target.id}`);
    }

    const handleNewSub = (): void => {
        const reqPath = 'followers/addNew';
        !following && customPoster(reqPath, {
            follower: user?.uid,
            following: orgID,
        })
    }

    return (
        <div className='m-4'>
            {userRole === 'seeker'
                &&
                <button className='m-2 p-2 border-2 border-green-400 hover:bg-green-400 px-2 my-3 rounded-xl transition duration-300' onClick={handleNewSub}>
                    <p className='mx-2'>Follow</p>
                </button>
            }
            {Object.values(orgInfo).length !== 0 && fields.map((field, ind) => (
                field === 'On the platform since' ?
                    <p className='text-xl my-2' key={ind}><span className='font-bold'>{field} : </span> {format(new Date(Object.values(orgInfo)[ind + 1]), ' MMMM do, Y')}</p>
                    :
                    <p className='text-xl my-2' key={ind}><span className='font-bold'>{field} : </span >{Object.values(orgInfo)[ind + 1]}</p>
            )
            )}
            <p className='text-xl my-2'>Followers: {orgFollowers.length}</p>
            <div className='flex'>
                <p className='text-xl my-2'>Job Posts:</p>
                {jobPostsForOrg.length !== 0 && jobPostsForOrg.map((jobPostForOrg) => (
                    <Button variant='info' className='mx-2' id={jobPostForOrg.id} key={jobPostForOrg.id} onClick={(event) => handleJobPostClick(event)} >{jobPostForOrg.title}</Button>
                ))}
            </div>
        </div>
    )
}

export default OrganizationProfile;
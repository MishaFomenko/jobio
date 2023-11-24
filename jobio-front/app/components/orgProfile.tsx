'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '../context/userContext';
import { customGetter, customPoster } from '../utils/fetch-requests';
import { UserContext, JobPostForOrg } from '../types';

const OrganizationProfile = ({ orgID }: { orgID: string }) => {

    const [orgInfo, setOrgInfo] = useState([]);
    const [orgFollowers, setOrgFollowers] = useState([]);
    const [jobPostsForOrg, setJobPostsForOrg] = useState<JobPostForOrg[]>([]);
    const [following, setFollowing] = useState(false);
    const fields = ['Title', 'Industry', 'Website', 'Email', 'Staff', 'About', 'Location'];
    const router = useRouter();
    const { user, userRole } = useUserContext() as UserContext;

    useEffect(() => {
        const reqPath = 'getOrgData';
        const queryString = `orgID=${orgID}`;
        customGetter(reqPath, queryString).then((data) => setOrgInfo(data[0]));
    }, [])

    useEffect(() => {
        const reqPath = 'getOrgFollowers';
        const queryString = `orgID=${orgID}`;
        customGetter(reqPath, queryString).then((data) => setOrgFollowers(data));
    }, [])

    useEffect(() => {
        const reqPath = 'getJobPostsForOrg';
        const queryString = `orgID=${orgID}`;
        customGetter(reqPath, queryString).then((data) => setJobPostsForOrg(data));
    })

    useEffect(() => {
        const reqPath = 'checkIfFollowing';
        const queryString = `orgID=${orgID}&userID=${user?.uid}`;
        customGetter(reqPath, queryString).then((data) => data.length !== 0 && setFollowing(true));
    })

    const handleJobPostClick = (event: any) => {
        router.push(`/job-post-page/${event.target.id}`);
    }

    const handleNewSub = () => {
        const reqPath = 'addNewFollower';
        !following && customPoster(reqPath, {
            follower: user?.uid,
            following: orgID,
        })
    }

    return (
        <>
            {userRole === 'seeker'
                &&
                <button className='flex border-2 p-2 m-2' onClick={handleNewSub}>
                    <p className='mx-2'>Follow</p>
                </button>
            }
            {orgInfo.length !== 0 && fields.map((field, ind) =>
                <p key={ind}>{field} : {Object.values(orgInfo)[ind + 1]}</p>
            )}
            <p>Followers: {orgFollowers.length}</p>
            <div>
                <p>Job Posts:</p>
                {jobPostsForOrg.length !== 0 && jobPostsForOrg.map((jobPostForOrg) => (
                    <button className='text-start ml-4 mr-4 my-2 border-2 p-2' id={jobPostForOrg.id} key={jobPostForOrg.id} onClick={(event) => handleJobPostClick(event)} >{jobPostForOrg.title}</button>
                ))}
            </div>
        </>
    )
}

export default OrganizationProfile;
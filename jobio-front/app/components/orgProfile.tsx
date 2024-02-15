'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '../context/userContext';
import { customGetter, customPoster } from '../utils/fetch-requests';
import { UserContext, JobPostForOrg, OrgInfo, SeekersNames } from '../types';
import { format } from 'date-fns';
import Button from 'react-bootstrap/Button';
import { useQuery } from '@tanstack/react-query';

const OrganizationProfile: React.FC<{ orgID: string }> = ({ orgID }) => {

    const fields = ['Title', 'Industry', 'Website', 'Email', 'Staff', 'About', 'Location', 'On the platform since'];

    const [orgInfo, setOrgInfo] = useState<OrgInfo | {}>({});
    const [orgFollowers, setOrgFollowers] = useState<SeekersNames[]>([]);
    const [jobPostsForOrg, setJobPostsForOrg] = useState<JobPostForOrg[]>([]);
    const [following, setFollowing] = useState<boolean>(false);
    const [pending, setPending] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const router = useRouter();

    const { user, userRole, idToken } = useUserContext() as UserContext;

    const reqPathInfo = 'profileData/org';
    const queryStringInfo = `orgID=${orgID}`;
    const orgDataQuery = useQuery({
        queryKey: ['orgDataQuery', idToken, reqPathInfo, queryStringInfo],
        queryFn: () => customGetter(idToken, reqPathInfo, queryStringInfo),
        enabled: Boolean(idToken)
    })
    const reqPathCheck = 'followers/check';
    const queryStringCheck = `orgID=${orgID}&userID=${user?.uid}`;
    const followerCheckQuery = useQuery({
        queryKey: ['followerCheckQuery', idToken, reqPathCheck, queryStringCheck],
        queryFn: () => customGetter(idToken, reqPathCheck, queryStringCheck),
        enabled: Boolean(idToken)
    })
    const reqPathFollowers = 'followers/org';
    const queryStringFollowers = `orgID=${orgID}`;
    const orgFollowersQuery = useQuery({
        queryKey: ['orgFollowersQuery', idToken, reqPathFollowers, queryStringFollowers],
        queryFn: () => customGetter(idToken, reqPathFollowers, queryStringFollowers),
        enabled: Boolean(idToken)
    })
    const reqPathForOrg = 'searchInfo/JobPostsForOrg';
    const queryStringForOrg = `orgID=${orgID}`;
    const jobPostsForOrgQuery = useQuery({
        queryKey: ['jobPostsForOrgQuery', idToken, reqPathForOrg, queryStringForOrg],
        queryFn: () => customGetter(idToken, reqPathForOrg, queryStringForOrg),
        enabled: Boolean(idToken)
    })

    useEffect(() => {
        !orgDataQuery.isPending && setOrgInfo(orgDataQuery.data[0])

        !orgFollowersQuery.isPending && setOrgFollowers(orgFollowersQuery.data);

        !jobPostsForOrgQuery.isPending && setJobPostsForOrg(jobPostsForOrgQuery.data);

        !followerCheckQuery.isPending && followerCheckQuery.data?.length && setFollowing(true)

        setError(orgDataQuery.error || followerCheckQuery.error || orgFollowersQuery.error || jobPostsForOrgQuery.error)

        setPending(orgDataQuery.isPending || followerCheckQuery.isPending || orgFollowersQuery.isPending || jobPostsForOrgQuery.isPending)

    }, [orgDataQuery.isPending, orgFollowersQuery.isPending, jobPostsForOrgQuery.isPending, followerCheckQuery.isPending])

    const handleJobPostClick = (event: React.ChangeEvent<any>): void => {
        router.push(`/job-post-page/${event.target.id}`);
    }

    const handleNewSub = (): void => {
        const reqPath = 'followers/addNew';
        try {
            !following && customPoster(idToken, reqPath, {
                follower: user?.uid,
                following: orgID,
            })
        } catch (postingError: any) {
            setError(postingError)
        }
    }

    if (pending) {
        return <p>Loading...</p>
    }
    if (error) {
        return <p>Error occured</p>
    }

    return (
        <>
            <div className='m-4'>
                {userRole === 'seeker'
                    ?
                    !following
                        ?
                        <button className='m-2 p-2 border-2 border-green-400 hover:bg-green-400 px-2 my-3 rounded-xl transition duration-300' onClick={handleNewSub}>
                            <p className='mx-2'>Follow</p>
                        </button>
                        :
                        <p className='text-center m-2 p-2 border-2 border-green-400 px-2 my-3 rounded-xl w-1/4'>You are following this organization</p>
                    :
                    <></>
                }
                {!orgDataQuery.isPending && orgInfo && Object.values(orgInfo).length !== 0 && fields.map((field, ind) => (
                    field === 'On the platform since' ?
                        <p className='text-xl my-2' key={ind}><span className='font-bold'>{field} : </span> {format(new Date(Object.values(orgInfo)[ind + 1]), ' MMMM do, Y')}</p>
                        :
                        <p className='text-xl my-2' key={ind}><span className='font-bold'>{field} : </span >{Object.values(orgInfo)[ind + 1]}</p>
                )
                )}
                <p className='text-xl my-2'>Followers: {orgFollowers.length}</p>
                <div className='flex'>
                    <p className='text-xl my-2'>Job Posts:</p>
                    {jobPostsForOrg && jobPostsForOrg.length !== 0 && jobPostsForOrg.map((jobPostForOrg) => (
                        <Button variant='info' className='mx-2' id={jobPostForOrg.id} key={jobPostForOrg.id} onClick={(event) => handleJobPostClick(event)} >{jobPostForOrg.title}</Button>
                    ))}
                </div>
            </div>
        </>
    )
}

export default OrganizationProfile;
'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '../context/userContext';
import { customGetter, customPoster, customDeleter } from '../utils/fetch-requests';
import { UserContext, JobPostForOrg, OrgInfo, SeekersNames } from '../types';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import Error from './error'
import Loading from './loading'

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

    const handleNewSub = async () => {
        const reqPath = 'followers/addNew';
        try {
            !following && await customPoster(idToken, reqPath, {
                follower: user?.uid,
                following: orgID,
            })
            setFollowing(true)
        } catch (postingError: any) {
            setError(postingError)
        }
    }

    const handleUnsubscribe = async () => {
        const reqPath = 'followers/unsubscribe'
        const queryString = `following=${orgID}&follower=${user?.uid}`
        try {
            following && idToken && await customDeleter(idToken, reqPath, queryString)
            setFollowing(false)
        } catch (unsubscribingError: any) {
            setError(unsubscribingError)
        }
    }

    if (pending) {
        return <Loading />
    }
    if (error) {
        return <Error />
    }

    return (
        <div className='bg-gray-100 min-h-screen p-4'>
            {userRole === 'seeker' && (
                <div className='bg-white shadow rounded-lg p-4 mb-6'>
                    <div className='text-lg font-semibold mb-4'>Subscribtion</div>
                    {!following ? (
                        <button className='w-full bg-green-400 text-white font-semibold hover:bg-green-500 py-2 rounded transition duration-300' onClick={handleNewSub}>
                            Subscribe
                        </button>
                    ) : (
                        <>
                            <div className='text-center bg-green-100 border border-green-400 text-green-700 py-2 rounded'>
                                You are following this organization
                            </div>
                            <button className='my-2 w-full bg-red-400 text-white font-semibold hover:bg-red-500 py-2 rounded transition duration-300' onClick={handleUnsubscribe}>
                                Unsubscribe
                            </button>
                        </>
                    )}
                </div>
            )}

            {!orgDataQuery.isPending && orgInfo && Object.values(orgInfo).length !== 0 && (
                <div className='bg-white shadow rounded-lg p-4 mb-6'>
                    <div className='text-lg font-semibold mb-4'>Organization Information</div>
                    {fields.map((field, ind) => (
                        <p className='my-2' key={ind}>
                            <span className='font-semibold'>{field}: </span>
                            {field === 'On the platform since' ? format(new Date(Object.values(orgInfo)[ind + 1]), 'MMMM do, yyyy') : Object.values(orgInfo)[ind + 1]}
                        </p>
                    ))}
                </div>
            )}

            <div className='bg-white shadow rounded-lg p-4 mb-6'>
                <div className='text-lg font-semibold mb-4'>Followers</div>
                <p>{orgFollowers.length}</p>
            </div>

            <div className='bg-white shadow rounded-lg p-4'>
                <div className='text-lg font-semibold mb-4'>Job Posts</div>
                <div className='flex flex-wrap'>
                    {jobPostsForOrg && jobPostsForOrg.length !== 0 ? jobPostsForOrg.map((jobPostForOrg) => (
                        <button id={jobPostForOrg.id} key={jobPostForOrg.id} onClick={(event) => handleJobPostClick(event)} className='m-2 bg-blue-500 text-white font-semibold hover:bg-blue-600 py-2 px-4 rounded transition duration-300'>
                            {jobPostForOrg.title}
                        </button>
                    )) : <p>No job posts available.</p>}
                </div>
            </div>
        </div>




    )
}

export default OrganizationProfile;
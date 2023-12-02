'use client'
import JobSeekerProfile from '../../components/seekerProfile';
import { SeekerPageProps } from '../../types'

const JobSeekerPage: React.FC<SeekerPageProps> = ({ params }) => {
    return (
        <>
            <JobSeekerProfile seekerID={params.seekerID} />
        </>
    )
}

export default JobSeekerPage;
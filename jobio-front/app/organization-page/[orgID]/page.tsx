'use client'
import OrgProfile from '../../components/orgProfile';
import { OrgPageProps } from '../../types';

const OrgPage: React.FC<OrgPageProps> = ({ params }) => {
    return (
        <>
            <OrgProfile orgID={params.orgID} />
        </>
    )
}

export default OrgPage;
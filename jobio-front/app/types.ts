import { Auth, User } from 'firebase/auth';

export interface UserContext {
    user: User | null;
    setUser: (user: User | null) => void;
    auth: Auth;
    userRole: string | null;
    setUserRole: (role: string | null) => void;
}

export interface OrgPageProps {
    params: {
        orgID: string,
    },
}

export interface SeekerPageProps {
    params: {
        seekerID: string,
    },
}

export interface JobPostPageProps {
    params: {
        jobPostID: string,
    },
}

export interface SeekersNames {
    unique_id: string,
    first_name: string,
    last_name: string,
    location: string,
    spec: string,
}

export interface OrgsSearchInfo {
    unique_id: string,
    title: string,
    location: string,
    industry: string,
}

export interface JobPostForOrg {
    id: string,
    title: string,
}

export interface JobPost {
    id: string,
    title: string,
}
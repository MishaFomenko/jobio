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

export interface OrgInfo {
    unique_id: string,
    title: string,
    industry: string,
    website: string,
    email: string,
    staff: number,
    about: string,
    location: string,
    created_at: Date,
}

export interface SeekerInfo {
    unique_id: string,
    first_name: string,
    last_name: string,
    skills: string,
    location: string,
    email: string,
    university: string,
    spec: string,
    degree: string,
    experience_company: string,
    experience_years: number,
    about: string,
    created_at: Date,
}

export interface JobPostForOrg {
    id: string,
    title: string,
}

export interface JobPost {
    id: string,
    title: string,
}

export interface CustomDropdownProps {
    searchBy: string,
    data: string[],
    filterSetter: (arg: string) => void,
    filter: string,
}

export interface CustomMenuProps {
    children: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
    'aria-labelledby'?: string;
}

export interface CustomToggleProps {
    children: React.ReactNode;
    onClick: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}  
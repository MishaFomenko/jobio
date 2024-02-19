'use client'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import OrgsList from './components/orgsList';
import SeekersList from './components/seekersList';
import JobPostsList from './components/jobPostsList';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from './context/userContext';
import { UserContext } from './types';

const HomePage: React.FC = () => {
  const { user } = useUserContext() as UserContext;
  const router = useRouter();
  useEffect(() => {
    !user && router.push('/signin');
  })
  return (
    <Tabs
      defaultActiveKey="orgs"
      id="justify-tab-example"
      className="mb-3 border-b border-gray-200"
      justify
    >
      <Tab
        eventKey="orgs"
        title={<span className="font-semibold text-gray-700 hover:text-gray-900">Organizations</span>}
        className="py-2"
      >
        <div className="p-4 bg-white shadow rounded-lg mt-2">
          <OrgsList />
        </div>
      </Tab>

      <Tab
        eventKey="seekers"
        title={<span className="font-semibold text-gray-700 hover:text-gray-900">Looking for a job</span>}
        className="py-2"
      >
        <div className="p-4 bg-white shadow rounded-lg mt-2">
          <SeekersList />
        </div>
      </Tab>

      <Tab
        eventKey="posts"
        title={<span className="font-semibold text-gray-700 hover:text-gray-900">Job Posts</span>}
        className="py-2"
      >
        <div className="p-4 bg-white shadow rounded-lg mt-2">
          <JobPostsList />
        </div>
      </Tab>
    </Tabs>

  );
}

export default HomePage;
'use client'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import OrgsList from './components/orgsList';
import SeekersList from './components/seekersList';
import JobPostsList from './components/jobPostsList';


const HomePage: React.FC = () => {
  return (
    <Tabs
      defaultActiveKey="orgs"
      id="justify-tab-example"
      className="mb-3"
      justify
    >
      <Tab eventKey="orgs" title="Organizations">
        <OrgsList />
      </Tab>
      <Tab eventKey="seekers" title="Looking for a job">
        <SeekersList />
      </Tab>
      <Tab eventKey="posts" title="Job posts">
        <JobPostsList />
      </Tab>
    </Tabs>
  );
}

export default HomePage;
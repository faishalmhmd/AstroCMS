import React, { useState } from 'react';
import { useGetData } from '@/hook/useGetData';
import { ModeToggle } from './ModeToggle';
import Pages from '../Dashboard/Pages';
import MongoDBTab from '../Dashboard/MongoDB';
import HostInfoTab from '../Dashboard/HostInfo';
import CurrentOpsTab from '../Dashboard/CurrentOps';
import Projects from '../Dashboard/Projects';
import TopbarProfile from '../Dashboard/TopbarProfile';
import Sidebar from '../Dashboard/Sidebar';

export default function Dashboard(): React.ReactElement {
  const [activeTab, setActiveTab] = useState('pages');
  const {
    pages,
    projects,
    setProjects,
    serverStatus,
    currentOps,
    hostInfo,
    loading,
    error,
  } = useGetData();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <h2 className="text-xl font-bold mb-2">Error Loading Data</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex text-black dark:text-white bg-zinc-100 dark:bg-neutral-950 transition-colors">
      <Sidebar active={activeTab} onChange={setActiveTab} />
      {/* Main Content */}
      <div className="flex-1 bg-zinc-50 dark:bg-neutral-950 h-screen overflow-hidden">
        <div className="dark:bg-black bg-white h-full flex flex-col">
          {/* Topbar */}
          <div className="border-b dark:border-zinc-700 flex justify-between items-center h-12">
            <div className="flex items-center justify-between gap-2">
              <div className="font-semibold ml-6 dark:text-white text-black">
                Dashboard
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ModeToggle />
              <TopbarProfile
                name="John Doe"
                email="john@example.com"
                onLogout={() => console.log('Logout')}
              />
            </div>
          </div>
          {/* Page Content */}
          <div className="flex-1 overflow-auto no-scrollbar p-6">
            {activeTab === 'pages' && <Pages pages={pages} />}
            {activeTab === 'projects' && (
              <Projects projects={projects} setProjects={setProjects} />
            )}
            {activeTab === 'mongodb' && (
              <MongoDBTab serverStatus={serverStatus} />
            )}
            {activeTab === 'hostInfo' && <HostInfoTab hostInfo={hostInfo} />}
            {activeTab === 'currentOps' && (
              <CurrentOpsTab currentOps={currentOps} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

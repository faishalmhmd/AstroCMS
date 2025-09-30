import React, { useState } from 'react';
import { useGetData } from '@/hook/useGetData';
import { ModeToggle } from './ModeToggle';
import Pages from '../Dashboard/Pages'
import MongoDBTab from '../Dashboard/MongoDB'
import HostInfoTab from '../Dashboard/HostInfo'
import CurrentOpsTab from '../Dashboard/CurrentOps'
import Projects from '../Dashboard/Projects'
import TopbarProfile from '../Dashboard/TopbarProfile'
import Sidebar from '../Dashboard/Sidebar'

export default function Dashboard(): React.ReactElement {
  const [activeTab, setActiveTab] = useState('pages');
  const {
    pages,
    projects,
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
      <div className="flex-1 bg-zinc-50 dark:bg-neutral-950 h-screen p-3 overflow-auto">
        <div className="bg-black h-full rounded-2xl">
          {/* Topbar */}
          <div className="border-b border-zinc-300 dark:border-zinc-700 flex justify-between items-center p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="font-semibold ml-2 text-white">
                {activeTab === 'pages'
                  ? 'Pages Dashboard'
                  : 'MongoDB Server Monitor'}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ModeToggle />
              <TopbarProfile
                name="John Doe"
                email="john@example.com"
                initials="JD"
                onProfile={() => console.log('Go to profile')}
                onLogout={() => console.log('Logout')}
              />
            </div>
          </div>
          {/* Page Content */}
          <div className="p-6 h-full overflow-auto">
            {{
              pages: <Pages pages={pages} />,
              projects: <Projects projects={projects} />,
              mongodb: <MongoDBTab serverStatus={serverStatus} />,
              hostInfo: <HostInfoTab hostInfo={hostInfo} />,
              currentOps: <CurrentOpsTab currentOps={currentOps} />,
            }[activeTab]}
          </div>
        </div>
      </div>
    </div>
  );
}

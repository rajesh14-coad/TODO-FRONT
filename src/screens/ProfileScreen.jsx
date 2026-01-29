import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ProfileView from '../components/ProfileView';

import MobileTabBar from '../components/MobileTabBar';

const ProfileScreen = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-transparent text-slate-900 dark:text-white overflow-hidden">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />
      <main className="flex-1 overflow-y-auto pb-32 md:pb-10" style={{ overscrollBehaviorY: 'contain' }}>
        <div className="p-6 md:p-10">
          <ProfileView />
        </div>
      </main>
      <MobileTabBar />
    </div>
  );
};

export default ProfileScreen;

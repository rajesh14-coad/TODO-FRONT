import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ProfileView from '../components/ProfileView';

const ProfileScreen = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-transparent text-slate-900 dark:text-white overflow-hidden">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        <ProfileView />
      </main>
    </div>
  );
};

export default ProfileScreen;

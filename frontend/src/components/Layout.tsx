import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const Layout: React.FC = () => {
  return (
    <div className="flex bg-slate-50 text-slate-900 min-h-screen font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-slate-50">
        <div className="flex-1 p-8 max-w-5xl w-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

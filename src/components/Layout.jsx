import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  return (
    <div className="flex h-screen bg-background overflow-hidden selection:bg-primary/20 selection:text-primaryHover">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

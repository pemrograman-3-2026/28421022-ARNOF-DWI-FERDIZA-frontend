'use client'
import Navbar from "@/Components/layouts/Navbar";
import Sidebar from "@/Components/layouts/Sidebar";
import UserTabBar from "@/Components/layouts/UserTabBar";
import React, { useState } from "react";

export default function UserLayout ({
    children
  }: Readonly<{
    children: React.ReactNode
  }>
) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="d-flex vh-100 overflow-hidden">
      <div
        className={`sidebar-backdrop ${sidebarOpen ? "show" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />
      
      <Sidebar
        isOpen={sidebarOpen}
        collapsed={collapsed}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-grow-1 d-flex flex-column main-content">
        <Navbar
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          onToggleCollapse={() => setCollapsed((prev) => !prev)}
        />

        <main className="p-4 flex-grow-1 bg-light overflow-y-auto" style={{ paddingBottom: '80px' }}>
          {children}
          {/* Spacer for mobile tab bar */}
          <div className="d-md-none" style={{ height: '60px' }}></div>
        </main>
        
        <UserTabBar />
      </div>
    </div>
  )
}

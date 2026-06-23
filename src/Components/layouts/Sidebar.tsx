'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminMenu } from "@/Components/menu/admin.menu";
import { userMenu } from "@/Components/menu/user.menu";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function Sidebar(
  { 
    isOpen, 
    collapsed,
    onClose 
  } : {
    isOpen: boolean,
    collapsed: boolean,
    onClose: () => void
  }
) {
  const pathname = usePathname() || '';
  const isAdmin = pathname.startsWith('/admin');
  const navItems = isAdmin ? adminMenu : userMenu;

  const [user, setUser] = useState<{username: string, role: string} | null>(null);

  useEffect(() => {
    const userStr = Cookies.get('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch(e){}
    }
  }, []);

  const getInitials = (name: string) => {
    if (!name) return "AD";
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div
      className={`sidebar ${isOpen ? "open" : ""} ${collapsed ? "collapsed" : ""}`}
    >
      <div className="sidebar-brand">
        {!collapsed && <span className="brand-name text-truncate">TOKO SEMBAKO</span>}
        <button
          className="btn d-md-none ms-auto"
          style={{ color: "white" }}
          onClick={onClose}
        >
        </button>
      </div>

  
      {user && (
        <div className="px-3 py-3 border-bottom border-secondary border-opacity-25 d-flex align-items-center" style={{ minHeight: '80px', transition: 'all 0.3s' }}>
          <div 
            className="rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" 
            style={{ 
              width: collapsed ? '40px' : '45px', 
              height: collapsed ? '40px' : '45px', 
              flexShrink: 0,
              backgroundColor: '#81b29a', 
              color: '#1a4331',
              fontSize: collapsed ? '0.9rem' : '1rem',
              transition: 'all 0.3s',
              margin: collapsed ? '0 auto' : '0'
            }}
            title={collapsed ? user.username : ""}
          >
            {getInitials(user.username)}
          </div>
          {!collapsed && (
            <div className="ms-3 overflow-hidden">
              <div className="fw-bolder text-white text-truncate" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>
                {user.role === 'ADMIN' ? 'SEMBAKO ADMIN' : 'TOKO SEMBAKO'}
              </div>
              <div className="text-white-50 text-truncate mt-1 fw-medium" style={{ fontSize: '0.8rem' }}>
                {user.role === 'ADMIN' ? 'Admin ' : ''}{user.username}
              </div>
            </div>
          )}
        </div>
      )}

      <nav className="mt-2">
        <ul className="nav flex-column">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li className="nav-item" key={item.to}>
                <Link
                  href={item.to}
                  className={`nav-link ${pathname === item.to ? 'active' : ''}`}
                  onClick={onClose}
                  title={collapsed ? item.label : ""}
                >
                  <span className="nav-icon"><Icon /></span>
                  {!collapsed && (
                    <span className="nav-label">
                      {item.label}
                      {(item as any).subtitle && (
                        <small 
                          className={`d-block ${pathname === item.to ? 'opacity-75' : 'text-white-50'}`} 
                          style={{fontSize: '0.7em'}}
                        >
                          {(item as any).subtitle}
                        </small>
                      )}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
'use client'

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Navbar(
  { 
    onToggleSidebar, 
    onToggleCollapse
  } : {
    onToggleSidebar: () => void,
    onToggleCollapse: () => void,
  }
) {
  const router = useRouter();

  
  const handleLogout = () => {
    Cookies.remove('user'); 
    router.push('/'); 
  };

  return (
    <nav className="navbar navbar-light bg-white border-bottom px-3">
      <div className="d-flex align-items-center gap-2">
        <button
          className="btn btn-sm btn-outline-secondary d-md-none"
          onClick={onToggleSidebar}
        >
          ☰
        </button>
        <button
          className="btn btn-sm btn-outline-secondary d-none d-md-inline-flex"
          onClick={onToggleCollapse}
        >
          ☰
        </button>
        <span className="text-muted small fw-semibold">Admin Toko Sembako</span>
      </div>

      <div className="d-flex align-items-center gap-2">
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
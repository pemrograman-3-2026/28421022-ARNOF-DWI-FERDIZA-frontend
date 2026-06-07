'use client'
export default function Navbar(
  { 
    onToggleSidebar, 
    onToggleCollapse
  } : {
    onToggleSidebar: () => void,
    onToggleCollapse: () => void,
  }
) {

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
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
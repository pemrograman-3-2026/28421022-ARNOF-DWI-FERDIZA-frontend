'use client'
import { Package, Tags, LayoutDashboard, ShoppingCart, Users, ReceiptText } from "lucide-react";
import Link from "next/link";

const navItems = [
  { to: "/admin", icon: <LayoutDashboard/>, label: "Dashboard" },
  { to: "/admin/kategori", icon: <Tags />, label: "Kategori" },
  { to: "/admin/produk", icon: <Package/>, label: "Produk" },
  { to: "/admin/transaksi", icon: <ShoppingCart />, label: "Transaksi" },
  { to: "/admin/detail-transaksi", icon: <ReceiptText  />, label: "Detail Transaksi" },
  { to: "/admin/pelanggan", icon: <Users />, label: "Pelanggan" },
];

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

      <nav className="mt-2">
        <ul className="nav flex-column">
          {navItems.map(({ to, icon, label }) => (
            <li className="nav-item" key={to}>
              <Link
                href={to}
                className={'nav-link'}
                onClick={onClose}
                title={collapsed ? label : ""}
              >
                <span className="nav-icon">{icon}</span>
                {!collapsed && <span className="nav-label">{label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
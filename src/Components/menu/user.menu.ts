import { LayoutDashboard, ShoppingBag, ShoppingCart, History } from "lucide-react";

export const userMenu = [
  { to: "/user/dashboard", icon: LayoutDashboard, label: "Dashboard", subtitle: "Promo & Quick Stats" },
  { to: "/user/katalog", icon: ShoppingBag, label: "Katalog Sembako", subtitle: "Belanja Kebutuhan Pokok" },
  { to: "/user/keranjang", icon: ShoppingCart, label: "Keranjang Belanja", subtitle: "Kelola & Bayar" },
  { to: "/user/riwayat", icon: History, label: "Riwayat Belanja", subtitle: "Lacak Pesanan" },
];
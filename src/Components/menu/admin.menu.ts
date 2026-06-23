import { Package, Tags, LayoutDashboard, ShoppingCart, Users, ReceiptText } from "lucide-react";

export const adminMenu = [
  { to: "/admin", icon: LayoutDashboard , label: "Dashboard" },
  { to: "/admin/kategori", icon: Tags , label: "Kategori" },
  { to: "/admin/produk", icon: Package , label: "Produk" },
  { to: "/admin/transaksi", icon: ShoppingCart, label: "Transaksi" },
  { to: "/admin/detail-transaksi", icon: ReceiptText, label: "Detail Transaksi" },
  { to: "/admin/pelanggan", icon: Users, label: "Pelanggan" },
];
import { LayoutDashboard, Users, UserPlus, Settings, UserCheck } from "lucide-react";

export const superAdminMenu = [
  { to: "/superadmin/dashboard", icon: LayoutDashboard, label: "Dashboard", subtitle: "Ringkasan Sistem" },
  { to: "/superadmin/kelola-admin", icon: Users, label: "Kelola Admin", subtitle: "Daftar Toko & Admin" },
  { to: "/superadmin/pantau-user", icon: UserCheck, label: "Pantau User", subtitle: "Daftar Akun Pengguna" },
  { to: "/superadmin/tambah-admin", icon: UserPlus, label: "Buat Admin Baru", subtitle: "Registrasi Toko Baru" },
  { to: "/superadmin/pengaturan", icon: Settings, label: "Pengaturan Sistem", subtitle: "Konfigurasi Global" },
];

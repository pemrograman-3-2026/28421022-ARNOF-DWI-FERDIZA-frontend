import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, ShoppingCart, Clock, Settings } from 'lucide-react';

export default function UserTabBar() {
  const pathname = usePathname();

  const tabs = [
    { name: 'Home', icon: Home, path: '/user/dashboard' },
    { name: 'Katalog', icon: ShoppingBag, path: '/user/katalog' },
    { name: 'Keranjang', icon: ShoppingCart, path: '/user/keranjang' },
    { name: 'Riwayat', icon: Clock, path: '/user/riwayat' },
    { name: 'Pengaturan', icon: Settings, path: '/user/pengaturan' },
  ];

  return (
    <div className="d-md-none fixed-bottom bg-white border-top shadow-lg d-flex justify-content-around align-items-center py-2" style={{ zIndex: 1050 }}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = pathname.startsWith(tab.path);
        
        return (
          <Link 
            key={tab.path} 
            href={tab.path}
            className={`text-decoration-none text-center d-flex flex-column align-items-center ${isActive ? 'text-primary' : 'text-muted'}`}
            style={{ width: '20%' }}
          >
            <Icon size={24} className={`mb-1 ${isActive ? 'fill-current' : ''}`} />
            <span style={{ fontSize: '12px', fontWeight: isActive ? '600' : '400' }}>
              {tab.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

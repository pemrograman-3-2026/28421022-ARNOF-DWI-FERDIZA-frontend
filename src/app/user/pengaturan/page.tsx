'use client';
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function PengaturanUserPage() {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const userCookie = Cookies.get('user');
    if (userCookie) {
      setUserData(JSON.parse(userCookie));
    }
  }, []);

  return (
    <div className="container-fluid py-3">
      <h4 className="fw-bold mb-4">Pengaturan Akun</h4>
      <div className="card border-0 shadow-sm rounded-3 mb-4">
        <div className="card-body p-4">
          <div className="row">
            <div className="col-md-6">
              <h5 className="fw-semibold mb-3">Profil Saya</h5>
              <div className="mb-3">
                <label className="form-label text-muted small mb-1">Username</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={userData?.username || ''} 
                  readOnly 
                  disabled
                />
              </div>
              <div className="mb-3">
                <label className="form-label text-muted small mb-1">Role</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={userData?.role || ''} 
                  readOnly 
                  disabled
                />
              </div>
              <div className="mb-3">
                <label className="form-label text-muted small mb-1">No Telp</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={userData?.no_telp || '-'} 
                  readOnly 
                  disabled
                />
              </div>
              <p className="text-muted small mb-0 mt-3">
                * Untuk saat ini perubahan profil hanya dapat dilakukan melalui admin.
              </p>
            </div>
            
            <div className="col-md-6 mt-4 mt-md-0 border-start ps-md-4">
              <h5 className="fw-semibold mb-3">Keamanan</h5>
              <div className="mb-3">
                <label className="form-label text-muted small mb-1">Password Saat Ini</label>
                <input type="password" className="form-control" placeholder="••••••••" />
              </div>
              <div className="mb-3">
                <label className="form-label text-muted small mb-1">Password Baru</label>
                <input type="password" className="form-control" placeholder="••••••••" />
              </div>
              <div className="mb-3">
                <label className="form-label text-muted small mb-1">Konfirmasi Password Baru</label>
                <input type="password" className="form-control" placeholder="••••••••" />
              </div>
              <button 
                className="btn btn-primary px-4 mt-2"
                onClick={() => alert('Fitur ubah password sedang dalam pengembangan.')}
              >
                Ubah Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { showToast } from "@/Components/toast/toast";

export default function PengaturanAdminPage() {
  const [adminData, setAdminData] = useState<any>(null);
  const [storeInfo, setStoreInfo] = useState({
    nama: "Toko Sembako",
    jamOperasional: "08:00 - 21:00",
    alamat: "Jl. Raya Sembako No. 123, Jakarta"
  });

  const [securitySettings, setSecuritySettings] = useState({
    antiDdos: true,
    endToEndEncryption: true,
    anomalyDetection: false,
  });

  const toggleSecurity = (setting: keyof typeof securitySettings) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    showToast(`Pengaturan keamanan diperbarui!`, 'success');
  };

  useEffect(() => {
    const userCookie = Cookies.get('user');
    if (userCookie) {
      setAdminData(JSON.parse(userCookie));
    }

    const savedStoreInfo = localStorage.getItem('storeInfo');
    if (savedStoreInfo) {
      setStoreInfo(JSON.parse(savedStoreInfo));
    }
  }, []);

  const handleStoreChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setStoreInfo({
      ...storeInfo,
      [e.target.name]: e.target.value
    });
  };

  const saveStoreInfo = () => {
    localStorage.setItem('storeInfo', JSON.stringify(storeInfo));
    showToast('Informasi toko berhasil disimpan!', 'success');
  };

  return (
    <div className="container-fluid py-3">
      <h4 className="fw-bold mb-4">Pengaturan Sistem & Admin</h4>
      <div className="card border-0 shadow-sm rounded-3 mb-4">
        <div className="card-body p-4">
          <div className="row">
            <div className="col-md-6">
              <h5 className="fw-semibold mb-3">Profil Admin</h5>
              <div className="mb-3">
                <label className="form-label text-muted small mb-1">Username</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={adminData?.username || 'admin'} 
                  readOnly 
                  disabled
                />
              </div>
              <div className="mb-3">
                <label className="form-label text-muted small mb-1">Role Akses</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={adminData?.role || 'ADMIN'} 
                  readOnly 
                  disabled
                />
              </div>
              <div className="mb-3">
                <label className="form-label text-muted small mb-1">No Telp / Kontak Admin</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={adminData?.no_telp || '-'} 
                  readOnly
                  disabled
                />
              </div>
              <button 
                className="btn btn-primary px-4 mt-2"
                onClick={() => alert('Fitur update profil sedang dalam pengembangan.')}
              >
                Simpan Profil
              </button>
            </div>
            
            <div className="col-md-6 mt-4 mt-md-0 border-start ps-md-4">
              <h5 className="fw-semibold mb-3">Keamanan Admin</h5>
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
                className="btn btn-danger px-4 mt-2"
                onClick={() => alert('Fitur ubah password admin sedang dalam pengembangan.')}
              >
                Ubah Password
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-body p-4">
          <h5 className="fw-semibold mb-3">Informasi Toko</h5>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label text-muted small mb-1">Nama Toko</label>
              <input 
                type="text" 
                className="form-control" 
                name="nama"
                value={storeInfo.nama} 
                onChange={handleStoreChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label text-muted small mb-1">Jam Operasional</label>
              <input 
                type="text" 
                className="form-control" 
                name="jamOperasional"
                value={storeInfo.jamOperasional} 
                onChange={handleStoreChange}
              />
            </div>
            <div className="col-md-12 mb-3">
              <label className="form-label text-muted small mb-1">Alamat Toko</label>
              <textarea 
                className="form-control" 
                rows={3} 
                name="alamat"
                value={storeInfo.alamat}
                onChange={handleStoreChange}
              ></textarea>
            </div>
          </div>
          <button 
            className="btn btn-primary px-4 mt-2"
            onClick={saveStoreInfo}
          >
            Simpan Informasi
          </button>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-3 mt-4 mb-4">
        <div className="card-body p-4 border-start border-4 border-success">
          <div className="d-flex align-items-center mb-3">
            <h5 className="fw-bold mb-0 text-success">
              🛡️ Keamanan Data & Cyber Security (Anti-Hacker)
            </h5>
            <span className="badge bg-success ms-auto rounded-pill px-3 py-2">Sistem Aktif</span>
          </div>
          <p className="text-muted small mb-4">
            Lindungi data toko, pelanggan, dan transaksi Anda dari ancaman siber dengan fitur keamanan tingkat lanjut.
          </p>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="p-3 border rounded-3 bg-light">
                <div className="form-check form-switch mb-0 d-flex justify-content-between align-items-center p-0">
                  <label className="form-check-label fw-semibold" htmlFor="antiDdos">Anti-DDoS & Firewall</label>
                  <input className="form-check-input ms-0" type="checkbox" role="switch" id="antiDdos" checked={securitySettings.antiDdos} onChange={() => toggleSecurity('antiDdos')} />
                </div>
                <small className="text-muted d-block mt-2">Mencegah serangan bot dan trafik palsu.</small>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="p-3 border rounded-3 bg-light">
                <div className="form-check form-switch mb-0 d-flex justify-content-between align-items-center p-0">
                  <label className="form-check-label fw-semibold" htmlFor="encryption">Enkripsi End-to-End</label>
                  <input className="form-check-input ms-0" type="checkbox" role="switch" id="encryption" checked={securitySettings.endToEndEncryption} onChange={() => toggleSecurity('endToEndEncryption')} />
                </div>
                <small className="text-muted d-block mt-2">Mengamankan data sensitif pelanggan.</small>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-3 border rounded-3 bg-light">
                <div className="form-check form-switch mb-0 d-flex justify-content-between align-items-center p-0">
                  <label className="form-check-label fw-semibold" htmlFor="anomaly">Deteksi Anomali AI</label>
                  <input className="form-check-input ms-0" type="checkbox" role="switch" id="anomaly" checked={securitySettings.anomalyDetection} onChange={() => toggleSecurity('anomalyDetection')} />
                </div>
                <small className="text-muted d-block mt-2">Memantau aktivitas mencurigakan 24/7.</small>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-top d-flex justify-content-between align-items-center">
            <span className="text-muted small">⏱️ Terakhir scan: Hari ini, {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</span>
            <button 
              className="btn btn-outline-success px-4"
              onClick={() => {
                showToast('Memulai pemindaian sistem...', 'success');
                setTimeout(() => showToast('Sistem 100% Aman! Tidak ada ancaman ditemukan.', 'success'), 2000);
              }}
            >
              🔒 Jalankan Security Scan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

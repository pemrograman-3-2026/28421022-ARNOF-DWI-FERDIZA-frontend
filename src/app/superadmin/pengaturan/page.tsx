'use client';
import { showToast } from '@/Components/toast/toast';
import { Settings, Shield, Server, Bell } from 'lucide-react';
import { useState } from 'react';

export default function PengaturanSuperAdminPage() {
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('Pengaturan sistem berhasil diperbarui!', 'success');
    }, 1000);
  };

  return (
    <div className="container-fluid py-3">
      <div className="mb-4">
        <h4 className="fw-bold mb-1">Pengaturan Sistem</h4>
        <p className="text-muted small mb-0">Konfigurasi global platform multi-toko (SaaS) Anda.</p>
      </div>

      <div className="row g-4">
        {/* Kolom Kiri */}
        <div className="col-md-7">
          {/* General Config */}
          <div className="card border-0 shadow-sm rounded-3 mb-4">
            <div className="card-header bg-white border-bottom py-3">
              <h6 className="fw-semibold mb-0 d-flex align-items-center">
                <Settings size={18} className="me-2 text-primary" /> Pengaturan Umum
              </h6>
            </div>
            <div className="card-body p-4">
              <div className="mb-3">
                <label className="form-label small fw-semibold">Nama Platform</label>
                <input type="text" className="form-control" defaultValue="Toko Sembako SaaS" />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Email Bantuan (Support)</label>
                <input type="email" className="form-control" defaultValue="support@tokosembako.com" />
              </div>
              <div className="mb-0">
                <label className="form-label small fw-semibold">Biaya Layanan Global (%)</label>
                <input type="number" className="form-control" defaultValue="2" />
                <div className="form-text small">Biaya potongan otomatis per transaksi yang dilakukan oleh setiap Admin (Toko).</div>
              </div>
            </div>
          </div>

          {/* Security Config */}
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-header bg-white border-bottom py-3">
              <h6 className="fw-semibold mb-0 d-flex align-items-center">
                <Shield size={18} className="me-2 text-success" /> Keamanan Global
              </h6>
            </div>
            <div className="card-body p-4">
              <div className="form-check form-switch mb-3">
                <input className="form-check-input" type="checkbox" id="requireMFA" />
                <label className="form-check-label" htmlFor="requireMFA">Wajibkan Verifikasi 2 Langkah untuk semua Admin</label>
              </div>
              <div className="form-check form-switch mb-3">
                <input className="form-check-input" type="checkbox" id="blockSuspicious" defaultChecked />
                <label className="form-check-label" htmlFor="blockSuspicious">Blokir otomatis alamat IP mencurigakan (Anti-DDoS)</label>
              </div>
              <div className="form-check form-switch mb-0">
                <input className="form-check-input" type="checkbox" id="encryptDb" defaultChecked disabled />
                <label className="form-check-label" htmlFor="encryptDb">Enkripsi Database End-to-End <span className="badge bg-success ms-1">Aktif Secara Bawaan</span></label>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan */}
        <div className="col-md-5">
          {/* Server Config */}
          <div className="card border-0 shadow-sm rounded-3 mb-4">
            <div className="card-header bg-white border-bottom py-3">
              <h6 className="fw-semibold mb-0 d-flex align-items-center">
                <Server size={18} className="me-2 text-warning" /> Status Database
              </h6>
            </div>
            <div className="card-body p-4">
              <ul className="list-group list-group-flush mb-0">
                <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2 border-0">
                  <span className="text-muted small">Versi Prisma</span>
                  <span className="fw-medium small">v7.8.0</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2 border-0">
                  <span className="text-muted small">Koneksi MySQL</span>
                  <span className="badge bg-success rounded-pill">Terhubung</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2 border-0">
                  <span className="text-muted small">Sinkronisasi Tabel</span>
                  <span className="badge bg-success rounded-pill">In Sync</span>
                </li>
                <li className="list-group-item px-0 pt-3 pb-0 border-0 mt-2">
                  <button className="btn btn-outline-warning w-100 btn-sm">Jalankan Database Sinkronisasi</button>
                </li>
              </ul>
            </div>
          </div>

          <button 
            className="btn btn-primary w-100 py-3 shadow-sm d-flex justify-content-center align-items-center"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <><span className="spinner-border spinner-border-sm me-2"></span>Menyimpan Perubahan...</>
            ) : (
              'Simpan Semua Pengaturan'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

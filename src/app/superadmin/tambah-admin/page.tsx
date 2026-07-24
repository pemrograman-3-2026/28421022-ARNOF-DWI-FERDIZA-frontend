'use client';
import { showToast } from '@/Components/toast/toast';
import { api } from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function TambahAdminPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    no_telp: '',
    role: 'ADMIN' // Pastikan rolenya ADMIN
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      showToast('Username dan password wajib diisi!', 'warning');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/user/register', formData);
      showToast(res.data?.message || 'Admin toko berhasil dibuat!', 'success');
      router.push('/superadmin/kelola-admin');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Gagal membuat admin', 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-3">
      <div className="mb-4 d-flex align-items-center">
        <Link href="/superadmin/kelola-admin" className="btn btn-light border p-2 me-3 shadow-sm rounded-circle text-secondary">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h4 className="fw-bold mb-1">Buat Admin Baru</h4>
          <p className="text-muted small mb-0">Daftarkan akun admin (toko) baru ke dalam sistem.</p>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Nama Toko / Username Admin <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control py-2"
                    placeholder="Contoh: toko_bintang_kejora"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                  <div className="form-text small text-muted">Akan digunakan untuk login oleh pemilik toko.</div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small">Password <span className="text-danger">*</span></label>
                  <input
                    type="password"
                    className="form-control py-2"
                    placeholder="Minimal 6 karakter"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold small">No. Telepon / WhatsApp</label>
                  <input
                    type="text"
                    className="form-control py-2"
                    placeholder="Contoh: 08123456789"
                    name="no_telp"
                    value={formData.no_telp}
                    onChange={handleChange}
                  />
                </div>

                <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                  <Link href="/superadmin/kelola-admin">
                    <button type="button" className="btn btn-light border px-4">Batal</button>
                  </Link>
                  <button type="submit" className="btn btn-primary px-4 shadow-sm" disabled={loading}>
                    {loading ? (
                      <><span className="spinner-border spinner-border-sm me-2"></span>Menyimpan...</>
                    ) : (
                      <><Save size={18} className="me-2" />Simpan Admin</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

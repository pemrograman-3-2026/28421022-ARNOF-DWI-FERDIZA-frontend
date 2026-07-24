'use client';
import { showToast } from '@/Components/toast/toast';
import { api } from '@/lib/axios';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect, use } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function EditAdminPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  
  const [formData, setFormData] = useState({
    username: '',
    password: '', // opsional
    no_telp: '',
    role: 'ADMIN'
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (id) {
      fetchAdminData();
    }
  }, [id]);

  const fetchAdminData = async () => {
    try {
      setFetching(true);
      const res = await api.get('/user');
      const users = res.data?.data || res.data;
      const adminData = users.find((u: any) => u.id === parseInt(id as string));
      
      if (adminData) {
        setFormData({
          username: adminData.username,
          password: '',
          no_telp: adminData.no_telp || '',
          role: adminData.role
        });
      } else {
        showToast('Data admin tidak ditemukan', 'danger');
        router.push('/superadmin/kelola-admin');
      }
    } catch (error) {
      showToast('Gagal memuat data admin', 'danger');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username) {
      showToast('Username wajib diisi!', 'warning');
      return;
    }

    try {
      setLoading(true);
      
      // Jika password kosong, tidak perlu dikirim
      const submitData = { ...formData };
      if (!submitData.password) {
        delete (submitData as any).password;
      }
      
      const res = await api.put(`/user/${id}`, submitData);
      showToast(res.data?.message || 'Data admin berhasil diperbarui!', 'success');
      router.push('/superadmin/kelola-admin');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Gagal memperbarui admin', 'danger');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="container-fluid py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="text-muted mt-2">Memuat data admin...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid py-3">
      <div className="mb-4 d-flex align-items-center">
        <Link href="/superadmin/kelola-admin" className="btn btn-light border p-2 me-3 shadow-sm rounded-circle text-secondary">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h4 className="fw-bold mb-1">Edit Admin</h4>
          <p className="text-muted small mb-0">Ubah informasi akun toko / admin.</p>
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
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small">Password Baru (Opsional)</label>
                  <input
                    type="password"
                    className="form-control py-2"
                    placeholder="Kosongkan jika tidak ingin mengubah password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold small">No. Telepon / WhatsApp</label>
                  <input
                    type="text"
                    className="form-control py-2"
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
                      <><Save size={18} className="me-2" />Simpan Perubahan</>
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

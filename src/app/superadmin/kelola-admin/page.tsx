'use client';
import { showToast } from '@/Components/toast/toast';
import { api } from '@/lib/axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Store, Trash2, Edit } from 'lucide-react';

interface IUser {
  id: number;
  username: string;
  role: string;
  no_telp?: string;
  is_active: boolean;
  created_at: string;
}

export default function KelolaAdminPage() {
  const [data, setData] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      setLoading(true);
      const res = await api.get<any>('/user'); 
      let allUsers = [];
      if (res.data.data) {
        allUsers = res.data.data;
      } else if (Array.isArray(res.data)) {
        allUsers = res.data;
      }
      
      // Filter hanya admin toko
      const adminsOnly = allUsers.filter((u: IUser) => u.role === 'ADMIN');
      setData(adminsOnly);
    } catch (error: any) {
      const err = error.response?.data?.message || 'Gagal mengambil data admin';
      showToast(err, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const deleteData = async (id: number) => {
    const isAgree = confirm('Peringatan: Menghapus admin ini akan menghapus akses tokonya. Lanjutkan?');

    if (isAgree) {
      try {
        const res = await api.delete<any>(`/user/${id}`);
        showToast(res.data?.message || 'Admin berhasil dihapus', 'success');
        getData();
      } catch (error: any) {
        showToast(error.response?.data?.message || 'Gagal menghapus admin', 'danger');
      }
    }
  };

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      setLoading(true);
      const res = await api.put(`/user/${id}`, { is_active: !currentStatus });
      showToast(res.data?.message || `Admin berhasil di${!currentStatus ? 'aktifkan' : 'nonaktifkan'}`, 'success');
      getData();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Gagal mengubah status', 'danger');
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Kelola Admin (Toko)</h4>
          <p className="text-muted small mb-0">Daftar semua admin toko yang terdaftar di sistem.</p>
        </div>
        <Link href={'/superadmin/tambah-admin'}>
          <button type="button" className="btn btn-primary px-4 shadow-sm">
            + Buat Admin Baru
          </button>
        </Link>
      </div>

      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="px-4 py-3">No</th>
                  <th className="py-3">Toko / Username</th>
                  <th className="py-3">No. Telepon</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Tgl Terdaftar</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-5">
                      <div className="spinner-border text-primary" role="status"></div>
                      <div className="mt-2 text-muted">Memuat data...</div>
                    </td>
                  </tr>
                ) : data?.length > 0 ? (
                  data.map((d, index) => (
                    <tr key={d.id}>
                      <td className="px-4 py-3 text-muted">{index + 1}</td>
                      <td className="py-3">
                        <div className="d-flex align-items-center">
                          <div className="bg-primary bg-opacity-10 rounded p-2 me-3">
                            <Store size={20} className="text-primary" />
                          </div>
                          <div>
                            <div className="fw-semibold text-dark">{d.username}</div>
                            <div className="text-muted small badge bg-secondary bg-opacity-10 text-secondary px-2 mt-1">Role: {d.role}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">{d.no_telp || '-'}</td>
                      <td className="py-3">
                        {d.is_active ? (
                          <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2 border border-success border-opacity-25">Aktif</span>
                        ) : (
                          <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-3 py-2 border border-danger border-opacity-25">Nonaktif</span>
                        )}
                      </td>
                      <td className="py-3">
                        {d.created_at ? new Date(d.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="d-flex gap-2 justify-content-center">
                          <button 
                            className={`btn btn-sm ${d.is_active ? 'btn-outline-danger' : 'btn-outline-success'} border`} 
                            title={d.is_active ? 'Nonaktifkan Admin' : 'Aktifkan Admin'}
                            onClick={() => toggleStatus(d.id, d.is_active)}
                            style={{ width: '80px', fontSize: '0.8rem', fontWeight: 600 }}
                          >
                            {d.is_active ? 'Matikan' : 'Aktifkan'}
                          </button>
                          <Link href={`/superadmin/edit-admin/${d.id}`}>
                            <button className="btn btn-light btn-sm text-primary border" title="Edit Admin">
                              <Edit size={16} />
                            </button>
                          </Link>
                          <button 
                            className="btn btn-light btn-sm text-danger border" 
                            title="Hapus Admin"
                            onClick={() => deleteData(d.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-5 text-muted">Belum ada data admin toko.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

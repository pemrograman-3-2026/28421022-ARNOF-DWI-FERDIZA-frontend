'use client';
import { showToast } from '@/Components/toast/toast';
import { api } from '@/lib/axios';
import { useEffect, useState } from 'react';
import { User, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';

interface IUser {
  id: number;
  username: string;
  role: string;
  no_telp?: string;
  is_active: boolean;
  created_at: string;
}

export default function PantauUserPage() {
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
      
      // Filter hanya user biasa (bukan ADMIN atau SUPER_ADMIN)
      const usersOnly = allUsers.filter((u: IUser) => u.role === 'USER');
      setData(usersOnly);
    } catch (error: any) {
      const err = error.response?.data?.message || 'Gagal mengambil data pengguna';
      showToast(err, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      setLoading(true);
      const res = await api.put(`/user/${id}`, { is_active: !currentStatus });
      showToast(res.data?.message || `Pengguna berhasil di${!currentStatus ? 'aktifkan' : 'nonaktifkan'}`, 'success');
      getData();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Gagal mengubah status', 'danger');
      setLoading(false);
    }
  };

  const deleteData = async (id: number) => {
    const isAgree = confirm('Peringatan: Menghapus akun pengguna ini bersifat permanen. Lanjutkan?');

    if (isAgree) {
      try {
        const res = await api.delete<any>(`/user/${id}`);
        showToast(res.data?.message || 'Pengguna berhasil dihapus', 'success');
        getData();
      } catch (error: any) {
        showToast(error.response?.data?.message || 'Gagal menghapus pengguna', 'danger');
      }
    }
  };

  return (
    <div className="container-fluid py-3">
      <div className="mb-4">
        <h4 className="fw-bold mb-1">Pantau Pengguna (User)</h4>
        <p className="text-muted small mb-0">Daftar semua pengguna biasa (pembeli) yang terdaftar di platform Anda.</p>
      </div>

      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="px-4 py-3">No</th>
                  <th className="py-3">Username Pelanggan</th>
                  <th className="py-3">No. Telepon</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Tgl Daftar</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-5">
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
                          <div className="bg-info bg-opacity-10 rounded p-2 me-3">
                            <User size={20} className="text-info" />
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
                          <Link href={`/superadmin/pantau-user/${d.id}`}>
                            <button className="btn btn-light btn-sm text-primary border" title="Detail Transaksi User">
                              <Eye size={16} />
                            </button>
                          </Link>
                          
                          <button 
                            className={`btn btn-sm ${d.is_active ? 'btn-outline-danger' : 'btn-outline-success'} border`} 
                            title={d.is_active ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}
                            onClick={() => toggleStatus(d.id, d.is_active)}
                            style={{ width: '80px', fontSize: '0.8rem', fontWeight: 600 }}
                          >
                            {d.is_active ? 'Blokir' : 'Buka Blokir'}
                          </button>
                          
                          <button 
                            className="btn btn-light btn-sm text-danger border" 
                            title="Hapus Akun"
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
                    <td colSpan={6} className="text-center py-5 text-muted">Belum ada data pelanggan yang mendaftar.</td>
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

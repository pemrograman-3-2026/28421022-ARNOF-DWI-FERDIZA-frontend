'use client';
import { showToast } from '@/Components/toast/toast';
import { api } from '@/lib/axios';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, History, CreditCard, Box } from 'lucide-react';
import Link from 'next/link';

export default function DetailUserPage() {
  const params = useParams();
  const id = params.id;
  
  const [userData, setUserData] = useState<any>(null);
  const [transaksiData, setTransaksiData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch user detail
      const resUser = await api.get('/user');
      const users = resUser.data?.data || resUser.data;
      const user = users.find((u: any) => u.id === parseInt(id as string));
      
      if (!user) {
        showToast('Data pelanggan tidak ditemukan', 'danger');
        return;
      }
      setUserData(user);

      // Fetch semua transaksi
      const resTx = await api.get('/transaksi');
      const allTx = resTx.data?.data || [];
      
      // Filter transaksi yang terkait dengan user ini (sebagai pelanggan atau user)
      const userTx = allTx.filter((tx: any) => tx.user_id === user.id || tx.pelanggan_id === user.id);
      setTransaksiData(userTx);
      
    } catch (error) {
      showToast('Gagal memuat data pelanggan', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalBelanja = () => {
    return transaksiData.reduce((sum, tx) => sum + (tx.total_harga || 0), 0);
  };

  if (loading) {
    return (
      <div className="container-fluid py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="text-muted mt-2">Memuat detail aktivitas...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid py-3">
      <div className="mb-4 d-flex align-items-center">
        <Link href="/superadmin/pantau-user" className="btn btn-light border p-2 me-3 shadow-sm rounded-circle text-secondary">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h4 className="fw-bold mb-1">Detail Pemantauan Pelanggan</h4>
          <p className="text-muted small mb-0">Riwayat transaksi dan aktivitas pembayaran pelanggan.</p>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* Profil Pelanggan */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 h-100">
            <div className="card-body p-4 text-center">
              <div className="bg-info bg-opacity-10 d-inline-block rounded-circle p-4 mb-3">
                <span className="fs-1 fw-bold text-info">{userData?.username?.charAt(0).toUpperCase()}</span>
              </div>
              <h5 className="fw-bold mb-1">{userData?.username}</h5>
              <p className="text-muted small mb-3">{userData?.no_telp || 'No Telp Belum Diisi'}</p>
              
              <div className="d-flex justify-content-center gap-2 mb-3">
                <span className={`badge ${userData?.is_active ? 'bg-success' : 'bg-danger'} rounded-pill px-3 py-2`}>
                  {userData?.is_active ? 'Status: Aktif' : 'Status: Nonaktif'}
                </span>
                <span className="badge bg-secondary rounded-pill px-3 py-2">Role: {userData?.role}</span>
              </div>
              <p className="text-muted small">Terdaftar sejak: {new Date(userData?.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        </div>

        {/* Ringkasan Belanja */}
        <div className="col-md-8">
          <div className="row g-3">
            <div className="col-sm-6">
              <div className="card border-0 shadow-sm rounded-3">
                <div className="card-body p-4 d-flex align-items-center">
                  <div className="bg-primary bg-opacity-10 text-primary rounded-circle p-3 me-3">
                    <History size={24} />
                  </div>
                  <div>
                    <h6 className="text-muted small fw-semibold mb-1">Total Transaksi</h6>
                    <h3 className="fw-bold mb-0">{transaksiData.length} <span className="fs-6 text-muted fw-normal">kali</span></h3>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-sm-6">
              <div className="card border-0 shadow-sm rounded-3">
                <div className="card-body p-4 d-flex align-items-center">
                  <div className="bg-success bg-opacity-10 text-success rounded-circle p-3 me-3">
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <h6 className="text-muted small fw-semibold mb-1">Total Pembayaran</h6>
                    <h3 className="fw-bold mb-0">Rp {calculateTotalBelanja().toLocaleString('id-ID')}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabel Riwayat Transaksi */}
      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-header bg-white border-bottom py-3">
          <h6 className="fw-semibold mb-0 d-flex align-items-center">
            <Box size={18} className="me-2 text-primary" /> Riwayat Transaksi Pelanggan
          </h6>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="px-4 py-3">ID Trx</th>
                  <th className="py-3">Tanggal</th>
                  <th className="py-3">Metode / Status</th>
                  <th className="py-3">Jumlah Item</th>
                  <th className="px-4 py-3 text-end">Total Pembayaran</th>
                </tr>
              </thead>
              <tbody>
                {transaksiData.length > 0 ? (
                  transaksiData.map((tx: any) => (
                    <tr key={tx.id}>
                      <td className="px-4 py-3 fw-medium">#TRX-{tx.id}</td>
                      <td className="py-3">{new Date(tx.tanggal_transaksi).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                      <td className="py-3">
                        <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3">Berhasil / Tunai</span>
                      </td>
                      <td className="py-3">{tx.detail_transaksi?.length || 0} Barang</td>
                      <td className="px-4 py-3 text-end fw-bold text-dark">Rp {tx.total_harga?.toLocaleString('id-ID')}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-5 text-muted">Belum ada riwayat transaksi dari pelanggan ini.</td>
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

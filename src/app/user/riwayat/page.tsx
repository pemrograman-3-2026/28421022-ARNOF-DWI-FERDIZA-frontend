'use client';
import { api } from '@/lib/axios';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

interface ITransaksi {
  id: number;
  nama_pelanggan?: string;
  pelanggan?: {
    nama: string;
  };
  total_harga: number;
  tanggal_transaksi: string;
  status?: string;
  user?: {
    id: number;
    username: string;
  };
}

export default function RiwayatPage() {
  const [riwayat, setRiwayat] = useState<ITransaksi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRiwayat = async () => {
      try {
        setLoading(true);
        
        const res = await api.get<any>('/transaksi');
        
        let data = [];
        if (res.data.data) {
          data = res.data.data;
        } else if (Array.isArray(res.data)) {
          data = res.data;
        }

        const userStr = Cookies.get('user');
        if (userStr) {
          try {
            const userData = JSON.parse(userStr);
            data = data.filter((trx: ITransaksi) => trx.user?.id === userData.id);
          } catch (e) {
            console.error('Error parsing user data', e);
          }
        }

        const sortedData = data.sort((a: ITransaksi, b: ITransaksi) => b.id - a.id);
        
        setRiwayat(sortedData);
      } catch (error) {
        console.error("Gagal mengambil data riwayat", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRiwayat();
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="container-fluid py-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      <div className="row mb-4">
        <div className="col-12">
          <div className="bg-white p-4 rounded-4 shadow-sm d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h3 className="fw-bolder text-dark mb-1">Riwayat Belanja</h3>
              <p className="text-muted mb-0">Pantau semua transaksi dan pesanan Anda di sini.</p>
            </div>
            <div>
              <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-4 py-2 fs-6 fw-bold border border-success border-opacity-25">
                Total: {riwayat.length} Transaksi
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {loading ? (
          <div className="col-12 text-center py-5 bg-white rounded-4 shadow-sm">
            <div className="spinner-border text-success mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted fw-medium mb-0">Memuat riwayat transaksi...</p>
          </div>
        ) : riwayat.length === 0 ? (
          <div className="col-12 text-center py-5 bg-white rounded-4 shadow-sm">
            <div style={{ fontSize: '60px' }}>🧾</div>
            <h5 className="fw-bold text-dark mt-3">Belum Ada Transaksi</h5>
            <p className="text-muted">Anda belum pernah melakukan pemesanan.</p>
          </div>
        ) : (
          <div className="col-12">
            <div className="bg-white rounded-4 shadow-sm overflow-hidden p-0">
              {riwayat.map((trx, index) => (
                <div 
                  key={trx.id} 
                  className={`p-4 ${index !== riwayat.length - 1 ? 'border-bottom' : ''} hover-bg-light`}
                  style={{ transition: 'background-color 0.2s' }}
                >
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                    <div className="d-flex align-items-center gap-4">
                      <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center text-success" style={{ width: '60px', height: '60px' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-bag-check-fill" viewBox="0 0 16 16">
                          <path fillRule="evenodd" d="M10.5 3.5a2.5 2.5 0 0 0-5 0V4h5v-.5zm1 0V4H15v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4h3.5v-.5a3.5 3.5 0 1 1 7 0zm-.646 5.354a.5.5 0 0 0-.708-.708L7.5 10.793 6.354 9.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"/>
                        </svg>
                      </div>
                      <div>
                        <h6 className="fw-bold text-dark mb-1">
                          Transaksi #{trx.id.toString().padStart(4, '0')}
                        </h6>
                        <p className="text-muted small mb-1">
                          {formatDate(trx.tanggal_transaksi)}
                        </p>
                        <p className="text-secondary mb-0 fw-medium" style={{ fontSize: '13px' }}>
                          Atas Nama: <span className="text-dark fw-bold">{trx.pelanggan?.nama || trx.nama_pelanggan || trx.user?.username || 'Guest'}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-md-end mt-3 mt-md-0 d-flex flex-column align-items-md-end">
                      <span className="badge bg-success rounded-pill px-3 py-1 mb-2 align-self-start align-self-md-end">
                        Berhasil
                      </span>
                      <p className="text-muted small mb-0">Total Belanja</p>
                      <h5 className="fw-bolder text-success mb-0 font-monospace">
                        Rp {trx.total_harga.toLocaleString('id-ID')}
                      </h5>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .hover-bg-light:hover {
          background-color: #f8f9fa !important;
        }
      `}</style>
    </div>
  );
}

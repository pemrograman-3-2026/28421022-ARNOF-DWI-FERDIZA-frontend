'use client';

import { api } from '@/lib/axios';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface IDetailTransaksi {
  id: number;
  barang_id: number;
  jumlah: number;
  harga_satuan: number;
  subtotal: number;
  barang: {
    nama_barang: string;
    kode_barang: string;
    satuan: string;
  };
}

interface ITransaksi {
  id: number;
  nama_pelanggan?: string;
  pelanggan?: {
    nama: string;
  };
  total_harga: number;
  tanggal_transaksi: string;
  detail_transaksi: IDetailTransaksi[];
  user?: {
    id: number;
    username: string;
  };
}

function ReceiptContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const router = useRouter();
  
  const [transaksi, setTransaksi] = useState<ITransaksi | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/transaksi/${id}`);
        setTransaksi(res.data.data);
      } catch (error) {
        console.error("Gagal mengambil detail transaksi", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

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

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="container-fluid py-4" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="col-12 text-center py-5 bg-white rounded-4 shadow-sm">
          <div className="spinner-border text-success mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted fw-medium mb-0">Memuat detail receipt...</p>
        </div>
      </div>
    );
  }

  if (!transaksi) {
    return (
      <div className="container-fluid py-4" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="col-12 text-center py-5 bg-white rounded-4 shadow-sm">
          <h5 className="fw-bold text-dark mt-3">Transaksi Tidak Ditemukan</h5>
          <p className="text-muted">ID Transaksi tidak valid atau tidak ditemukan.</p>
          <Link href="/user/riwayat" className="btn btn-success px-4 rounded-pill mt-3">
            Kembali ke Riwayat
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="row justify-content-center">
        <div className="col-lg-8">
          
          <div className="d-flex justify-content-between align-items-center mb-4 d-print-none">
            <button onClick={() => router.back()} className="btn btn-outline-secondary rounded-pill px-4">
              <i className="bi bi-arrow-left me-2"></i> Kembali
            </button>
            <button onClick={handlePrint} className="btn btn-success rounded-pill px-4">
              <i className="bi bi-printer me-2"></i> Cetak Struk
            </button>
          </div>

          <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm print-container">
            {/* Header Struk */}
            <div className="text-center mb-5 border-bottom pb-4">
              <h2 className="fw-bolder text-dark mb-1">TOKO SEMBAKO</h2>
              <p className="text-muted mb-0">Jl. Sembako No. 123, Jakarta Raya</p>
              <p className="text-muted mb-0">Telp: 0812-3456-7890</p>
            </div>

            {/* Info Transaksi */}
            <div className="row mb-4">
              <div className="col-sm-6 mb-3 mb-sm-0">
                <p className="text-muted small mb-1">Nomor Transaksi</p>
                <h6 className="fw-bold mb-0">#TRX-{transaksi.id.toString().padStart(6, '0')}</h6>
              </div>
              <div className="col-sm-6 text-sm-end">
                <p className="text-muted small mb-1">Tanggal & Waktu</p>
                <h6 className="fw-bold mb-0">{formatDate(transaksi.tanggal_transaksi)}</h6>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-muted small mb-1">Pelanggan</p>
              <h6 className="fw-bold mb-0">{transaksi.pelanggan?.nama || transaksi.nama_pelanggan || transaksi.user?.username || 'Guest'}</h6>
            </div>

            {/* Detail Item */}
            <div className="table-responsive mb-4">
              <table className="table table-borderless">
                <thead className="border-bottom">
                  <tr>
                    <th className="text-muted fw-medium py-3 px-0">Item</th>
                    <th className="text-muted fw-medium py-3 text-center">Qty</th>
                    <th className="text-muted fw-medium py-3 text-end">Harga</th>
                    <th className="text-muted fw-medium py-3 text-end px-0">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="border-bottom">
                  {transaksi.detail_transaksi?.map((detail, idx) => (
                    <tr key={idx}>
                      <td className="py-3 px-0">
                        <p className="fw-bold text-dark mb-0">{detail.barang?.nama_barang}</p>
                        {detail.barang?.kode_barang && (
                          <small className="text-muted">{detail.barang.kode_barang}</small>
                        )}
                      </td>
                      <td className="py-3 text-center align-middle">
                        {detail.jumlah} {detail.barang?.satuan}
                      </td>
                      <td className="py-3 text-end align-middle">
                        Rp {detail.harga_satuan.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 text-end align-middle px-0 fw-bold">
                        Rp {detail.subtotal.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div className="row justify-content-end mb-4">
              <div className="col-sm-6 col-md-5">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Total Pembayaran</span>
                  <span className="fw-bolder fs-5 text-success">
                    Rp {transaksi.total_harga.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Struk */}
            <div className="text-center pt-4 border-top">
              <p className="text-muted mb-1">Terima kasih atas kunjungan Anda!</p>
              <p className="text-muted small mb-0">Barang yang sudah dibeli tidak dapat ditukar/dikembalikan.</p>
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-container, .print-container * {
            visibility: visible;
          }
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
          }
          .d-print-none {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function ReceiptPage() {
  return (
    <Suspense fallback={
      <div className="container-fluid py-4">
        <div className="col-12 text-center py-5 bg-white rounded-4 shadow-sm">
          <div className="spinner-border text-success mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted fw-medium mb-0">Memuat halaman...</p>
        </div>
      </div>
    }>
      <ReceiptContent />
    </Suspense>
  );
}

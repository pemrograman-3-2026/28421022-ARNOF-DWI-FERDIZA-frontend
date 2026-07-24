'use client';
import { showToast } from '@/Components/toast/toast';
import { api } from '@/lib/axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface ITransaksi {
  id: number;
  nama_pelanggan?: string;
  pelanggan?: { nama: string };
  total_harga: number;
  tanggal_transaksi: string;
  user?: { username: string };
}

export default function TransaksiPage() {
  const [data, setData] = useState<ITransaksi[]>([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const res = await api.get<any>('/transaksi');
      setData(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteData = async (id: number) => {
    if (confirm('Yakin ingin menghapus transaksi ini?')) {
      try {
        const res = await api.delete(`/transaksi/${id}`);
        showToast(res.data?.message || 'Berhasil dihapus', 'success');
        getData();
      } catch (error: any) {
        showToast(error.response?.data?.message || 'Gagal menghapus', 'danger');
      }
    }
  };

  return (
    <div className="container-fluid py-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold m-0">Data Transaksi</h5>
        <Link href={'/admin/transaksi/create'} className="btn btn-primary btn-sm fw-bold">
          + Tambah Transaksi
        </Link>
      </div>

      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Pelanggan</th>
                  <th>Total Harga</th>
                  <th>Tanggal</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.map((d) => (
                  <tr key={d.id}>
                    <td className="ps-4 fw-medium">
                      {d.pelanggan?.nama || d.user?.username || d.nama_pelanggan || '-'}
                    </td>
                    <td className="text-success fw-bold">
                      Rp {d.total_harga.toLocaleString('id-ID')}
                    </td>
                    <td>{new Date(d.tanggal_transaksi).toLocaleDateString('id-ID')}</td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <Link href={`/admin/transaksi/edit?id=${d.id}`} className="btn btn-sm btn-outline-warning">
                          Edit
                        </Link>
                        <button onClick={() => deleteData(d.id)} className="btn btn-sm btn-outline-danger">
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
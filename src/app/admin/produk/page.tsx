'use client';
import { showToast } from '@/Components/toast/toast';
import { api } from '@/lib/axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface IBarang {
  id: number;
  nama_barang: string;
  harga: number;
  stok: number;
  kategori?: {
    id: number;
    nama_kategori: string;
  };
}

export default function BarangPage() {
  const [data, setData] = useState<IBarang[]>([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const res = await api.get<any>('/barang'); 
      if (res.data.data) {
        setData(res.data.data);
      } else if (Array.isArray(res.data)) {
        setData(res.data);
      }
    } catch (error: any) {
      console.log(error);
      const err = error.response?.data?.message || error.response?.data?.error || error.message || 'Gagal mengambil data barang';
      showToast(err, 'danger');
    }
  };

  const deleteData = async (id: number) => {
    const isAgree = confirm('Apakah Anda yakin ingin menghapus data ini?');

    if (isAgree) {
      try {
        const res = await api.delete<any>(`/barang/${id}`);
        showToast(res.data?.message || 'Berhasil dihapus', 'success');
        getData();
      } catch (error: any) {
        showToast(error.response?.data?.message || 'Gagal menghapus data', 'danger');
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h4>Data Barang</h4>
      </div>
      <Link href={'/admin/produk/create'}>
        <button
          type="button"
          className="btn btn-primary mt-2"
        >
          Tambah Barang
        </button>
      </Link>
      <table className="table table-hover mt-4 table-striped">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Barang</th>
            <th>Kategori</th>
            <th>Harga</th>
            <th>Stok</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((d, index) => {
            return (
              <tr key={d.id}>
                <td>{index + 1}</td>
                <td>{d.nama_barang}</td>
                <td>{d.kategori?.nama_kategori || '-'}</td>
                <td>Rp {d.harga.toLocaleString('id-ID')}</td>
                <td>{d.stok}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Link href={`/admin/produk/edit/${d.id}`}>
                      <button className="btn btn-warning btn-sm">Edit</button>
                    </Link>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteData(d.id)}>Hapus</button>
                  </div>
                </td>
              </tr>
            );
          })}
          {(!data || data.length === 0) && (
            <tr>
              <td colSpan={6} className="text-center">Belum ada data barang</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

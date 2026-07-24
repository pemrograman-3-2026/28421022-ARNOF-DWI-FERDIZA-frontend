'use client';
import { showToast } from '@/Components/toast/toast';
import { api } from '@/lib/axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface IKategori {
  id: number;
  nama_kategori: string;
  deskripsi: string;
}

export default function KategoriPage() {
  const [data, setData] = useState<IKategori[]>([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const res = await api.get<any>('/kategori'); 
      if (res.data.data) {
        setData(res.data.data);
      } else if (Array.isArray(res.data)) {
        setData(res.data);
      }
    } catch (error: any) {
      console.log(error);
      const err = error.response?.data?.message || error.response?.data?.error || error.message || 'Gagal mengambil data kategori';
      showToast(err, 'danger');
    }
  };

  const deleteData = async (id: number) => {
    const isAgree = confirm('Apakah Anda yakin ingin menghapus data ini?');

    if (isAgree) {
      try {
        const res = await api.delete<any>(`/kategori/${id}`);
        showToast(res.data?.message || 'Berhasil dihapus', 'success');
        getData();
      } catch (error: any) {
        const backendMessage = error.response?.data?.message || 'Gagal menghapus data';
        if (backendMessage === 'Terjadi kesalahan saat menghapus kategori') {
           showToast('Gagal menghapus kategori: Kategori ini sedang digunakan oleh produk/barang. Hapus atau ubah produk terkait terlebih dahulu.', 'danger');
        } else {
           showToast(backendMessage, 'danger');
        }
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h4>Data Kategori</h4>
      </div>
      <Link href={'/admin/kategori/create'}>
        <button
          type="button"
          className="btn btn-primary mt-2"
        >
          Tambah Kategori
        </button>
        
      </Link>
      <div className="table-responsive">
        <table className="table table-hover mt-1 table-striped">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Kategori</th>
              <th>Deskripsi</th>
              <th>Aksi</th>
              
            </tr>
          </thead>
          <tbody>
            {data?.map((d, index) => {
              return (
                <tr key={d.id}>
                  <td>{index + 1}</td>
                  <td>{d.nama_kategori}</td>
                  <td>{d.deskripsi || '-'}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link href={`/admin/kategori/edit?id=${d.id}`}>
                        <button className="btn btn-warning btn-sm">Edit</button>
                      
                      </Link>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteData(d.id)}>Hapus</button>
                      <button className="btn btn-warning btn-sm">Coba</button>
                      
                    </div>
                  </td>
                </tr>
              );
            })}
            {(!data || data.length === 0) && (
              <tr>
                <td colSpan={4} className="text-center">Belum ada data kategori</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

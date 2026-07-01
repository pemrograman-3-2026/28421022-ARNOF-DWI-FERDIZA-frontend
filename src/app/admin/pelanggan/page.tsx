'use client';
import { showToast } from '@/Components/toast/toast';
import { api } from '@/lib/axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface IPelanggan {
  id: number;
  nama: string;
  no_telp: string;
  alamat: string;
}

export default function PelangganPage() {
  const [data, setData] = useState<IPelanggan[]>([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const res = await api.get<any>('/pelanggan'); 
      if (res.data.data) {
        setData(res.data.data);
      } else if (Array.isArray(res.data)) {
        setData(res.data);
      }
    } catch (error: any) {
      console.log(error);
      const err = error.response?.data?.message || error.response?.data?.error || error.message || 'Gagal mengambil data pelanggan';
      showToast(err, 'danger');
    }
  };

  const deleteData = async (id: number) => {
    const isAgree = confirm('Apakah Anda yakin ingin menghapus data ini?');

    if (isAgree) {
      try {
        const res = await api.delete<any>(`/pelanggan/${id}`);
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
        <h4>Data Pelanggan</h4>
      </div>
      <Link href={'/admin/pelanggan/create'}>
        <button
          type="button"
          className="btn btn-primary mt-2"
        >
          Tambah Pelanggan
        </button>
      </Link>
      <table className="table table-hover mt-4 table-striped ">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>No Telp</th>
            <th>Alamat</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((d, index) => {
            return (
              <tr key={d.id}>
                <td>{index + 1}</td>
                <td>{d.nama}</td>
                <td>{d.no_telp}</td>
                <td>{d.alamat}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Link href={`/admin/pelanggan/edit?id=${d.id}`}>
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
              <td colSpan={5} className="text-center">Belum ada data pelanggan</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

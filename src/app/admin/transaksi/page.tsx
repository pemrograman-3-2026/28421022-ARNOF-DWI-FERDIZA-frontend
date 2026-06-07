'use client';
import { showToast } from '@/Components/toast/toast';
import { api } from '@/lib/axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface ITransaksi {
  id: number;
  nama_pelanggan?: string;
  pelanggan?: {
    nama: string;
  };
  total_harga: number;
  tanggal_transaksi: string;
  created_at: string;
  updated_at: string;
}

export default function TransaksiPage() {
  const [data, setData] = useState<ITransaksi[]>([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const res = await api.get<any>('/transaksi'); 
      
      
      setData(res.data.data); 
      
    } catch (error) {
      console.log(error);
    }
  };

  const deleteData = async (id: number) => {
    const isAgree = confirm('Are you sure?');

    if (isAgree) {
      try {
        
        const res = await api.delete<any>(`/transaksi/${id}`);
        showToast(res.data?.message || 'Berhasil dihapus', 'success');
        getData();
      } catch (error: any) {
        showToast(error.response?.data?.message || 'Error', 'danger');
      }
    }
  };
  return (
    <div>
      <h4> Data Transaksi </h4>
      <Link href={'/admin/transaksi/create'}>
        <button
          type="button"
          className="btn btn-primary"
        >
          Tambah Transaksi{' '}
        </button>
      </Link>
      <table className="table table-hover mt-4">
        <thead>
          <tr>
            <td>Nama Pelanggan</td>
            <td>Total Harga</td>
            <td>Tanggal Transaksi</td>
            <td>Aksi</td>
          </tr>
        </thead>
        <tbody>
          {data.map((d) =>   {
            return (
              <tr key={d.id}>
                <td>{d.pelanggan?.nama || d.nama_pelanggan || '-'}</td>
                <td>{d.total_harga}</td>
                <td>{d.tanggal_transaksi}</td>
                <td>
                  <div className="d-flex gap-1">
                    <button
                      type="button"
                      className="btn btn-warning"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteData(d.id)}
                      type="button"
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
'use client';
import { showToast } from '@/Components/toast/toast';
import { api } from '@/lib/axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface IUser {
  id: number;
  username: string;
  role: string;
  no_telp?: string;
}

export default function UserPage() {
  const [data, setData] = useState<IUser[]>([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const res = await api.get<any>('/user'); 
      if (res.data.data) {
        setData(res.data.data);
      } else if (Array.isArray(res.data)) {
        setData(res.data);
      }
    } catch (error: any) {
      console.log(error);
      const err = error.response?.data?.message || error.response?.data?.error || error.message || 'Gagal mengambil data user';
      showToast(err, 'danger');
    }
  };

  const deleteData = async (id: number) => {
    const isAgree = confirm('Apakah Anda yakin ingin menghapus data ini?');

    if (isAgree) {
      try {
        const res = await api.delete<any>(`/user/${id}`);
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
        <h4>Data User</h4>
      </div>
      <Link href={'/admin/user/create'}>
        <button
          type="button"
          className="btn btn-primary mt-2"
        >
          Tambah User
        </button>
      </Link>
      <table className="table table-hover mt-4 table-striped ">
        <thead>
          <tr>
            <th>No</th>
            <th>Username</th>
            <th>Role</th>
            <th>No Telp</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((d, index) => {
            return (
              <tr key={d.id}>
                <td>{index + 1}</td>
                <td>{d.username}</td>
                <td>{d.role}</td>
                <td>{d.no_telp || '-'}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Link href={`/admin/user/edit/${d.id}`}>
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
              <td colSpan={5} className="text-center">Belum ada data user</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

'use client';
import { showToast } from '@/Components/toast/toast';
import { api } from '@/lib/axios';
import { useEffect, useState } from 'react';

interface IDetailTransaksi {
  id: number;
  transaksi_id: number;
  barang_id: number;
  jumlah: number;
  harga_satuan: number;
  subtotal: number;
}

export default function DetailTransaksiPage() {
  const [data, setData] = useState<IDetailTransaksi[]>([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const res = await api.get<any>('/detail_transaksi'); 
      if (res.data.data) {
        setData(res.data.data);
      } else if (Array.isArray(res.data)) {
        setData(res.data);
      }
    } catch (error: any) {
      console.log(error);
      const err = error.response?.data?.message || error.response?.data?.error || error.message || 'Gagal mengambil data detail transaksi (cek backend)';
      showToast(err, 'danger');
    }
  };

  const deleteData = async (id: number) => {
    const isAgree = confirm('Are you sure?');

    if (isAgree) {
      try {
        const res = await api.delete<any>(`/detail_transaksi/${id}`);
        showToast(res.data?.message || 'Berhasil dihapus', 'success');
        getData();
      } catch (error: any) {
        showToast(error.response?.data?.message || 'Error', 'danger');
      }
    }
  };

  return (
    <div>
      <h4> Data Detail Transaksi </h4>
      <div className="table-responsive">
        <table className="table table-hover mt-4">
          <thead>
            <tr>
              <td>ID Transaksi</td>
              <td>ID Barang</td>
              <td>Jumlah</td>
              <td>Harga Satuan</td>
              <td>Subtotal</td>
            </tr>
          </thead>
          <tbody>
            {data?.map((d) =>   {
              return (
                <tr key={d.id}>
                  <td>{d.transaksi_id}</td>
                  <td>{d.barang_id}</td>
                  <td>{d.jumlah}</td>
                  <td>{d.harga_satuan}</td>
                  <td>{d.subtotal}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

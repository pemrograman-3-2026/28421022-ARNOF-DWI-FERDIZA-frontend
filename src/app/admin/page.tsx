'use client'

import { Package, ShoppingCart, Users, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/axios";

interface ITransaksi {
  id: number;
  total_harga: number;
  tanggal_transaksi: string;
  created_at: string;
  pelanggan?: {
    nama: string;
  };
  nama_pelanggan?: string;
}

export default function DashboardAdmin () {
    const [totalPendapatan, setTotalPendapatan] = useState(0);
    const [totalTransaksi, setTotalTransaksi] = useState(0);
    const [totalProduk, setTotalProduk] = useState(0);
    const [totalPelanggan, setTotalPelanggan] = useState(0);
    const [recentTransaksi, setRecentTransaksi] = useState<ITransaksi[]>([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch Produk
            const resProduk = await api.get('/barang');
            const produkData = resProduk.data?.data || resProduk.data || [];
            setTotalProduk(produkData.length);

            // Fetch Pelanggan
            const resPelanggan = await api.get('/pelanggan');
            const pelangganData = resPelanggan.data?.data || resPelanggan.data || [];
            setTotalPelanggan(pelangganData.length);

            
            const resTransaksi = await api.get('/transaksi');
            const transaksiData: ITransaksi[] = resTransaksi.data?.data || resTransaksi.data || [];
            setTotalTransaksi(transaksiData.length);

           
            const pendapatan = transaksiData.reduce((acc, curr) => acc + (curr.total_harga || 0), 0);
            setTotalPendapatan(pendapatan);

            
            const sorted = [...transaksiData].reverse();
            setRecentTransaksi(sorted);

        } catch (error) {
            console.log("Error fetching dashboard data", error);
        }
    }

    return (
        <div className="container-fluid">
            <h4 className="mb-4 fw-bold">Dashboard Toko Sembako</h4>
            
            <div className="row g-3">
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-3">
                        <div className="card-body p-3 d-flex align-items-center gap-3">
                            <div className="p-3 bg-primary bg-opacity-10 rounded-3 text-primary">
                                <DollarSign size={24} />
                            </div>
                            <div>
                                <p className="text-muted small mb-1">Total Pendapatan</p>
                                <h5 className="fw-bold mb-0">Rp {totalPendapatan.toLocaleString('id-ID')}</h5>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-3">
                        <div className="card-body p-3 d-flex align-items-center gap-3">
                            <div className="p-3 bg-success bg-opacity-10 rounded-3 text-success">
                                <ShoppingCart size={24} />
                            </div>
                            <div>
                                <p className="text-muted small mb-1">Total Transaksi</p>
                                <h5 className="fw-bold mb-0">{totalTransaksi}</h5>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-3">
                        <div className="card-body p-3 d-flex align-items-center gap-3">
                            <div className="p-3 bg-warning bg-opacity-10 rounded-3 text-warning">
                                <Package size={24} />
                            </div>
                            <div>
                                <p className="text-muted small mb-1">Total Produk</p>
                                <h5 className="fw-bold mb-0">{totalProduk}</h5>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-3">
                        <div className="card-body p-3 d-flex align-items-center gap-3">
                            <div className="p-3 bg-info bg-opacity-10 rounded-3 text-info">
                                <Users size={24} />
                            </div>
                            <div>
                                <p className="text-muted small mb-1">Total Pelanggan</p>
                                <h5 className="fw-bold mb-0">{totalPelanggan}</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-12">
                    <div className="card border-0 shadow-sm rounded-3">
                        <div className="card-header bg-white border-0 pt-4 pb-0">
                            <h6 className="fw-bold mb-0">Transaksi Terbaru</h6>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive" style={{ maxHeight: "300px", overflow: "auto" }}>
                                <table className="table table-hover align-middle text-nowrap">
                                    <thead className="table-light sticky-top">
                                        <tr>
                                            <th>ID Transaksi</th>
                                            <th>Pelanggan</th>
                                            <th>Tanggal</th>
                                            <th>Total</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentTransaksi.map((trx) => (
                                            <tr key={trx.id}>
                                                <td>#TRX-{trx.id.toString().padStart(3, '0')}</td>
                                                <td>{trx.pelanggan?.nama || trx.nama_pelanggan || '-'}</td>
                                                <td>{new Date(trx.tanggal_transaksi || trx.created_at || new Date()).toLocaleDateString('id-ID')}</td>
                                                <td>Rp {trx.total_harga.toLocaleString('id-ID')}</td>
                                                <td><span className="badge bg-success">Selesai</span></td>
                                            </tr>
                                        ))}
                                        {recentTransaksi.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="text-center">Belum ada transaksi terbaru</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
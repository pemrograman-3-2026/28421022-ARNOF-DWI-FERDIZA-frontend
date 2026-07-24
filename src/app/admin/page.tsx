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

export default function DashboardAdmin() {
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
            const [resProduk, resPelanggan, resTransaksi] = await Promise.all([
                api.get('/barang'),
                api.get('/pelanggan'),
                api.get('/transaksi')
            ]);
            
            const produkData = resProduk.data?.data || resProduk.data || [];
            const pelangganData = resPelanggan.data?.data || resPelanggan.data || [];
            const transaksiData: ITransaksi[] = resTransaksi.data?.data || resTransaksi.data || [];

            setTotalProduk(produkData.length);
            setTotalPelanggan(pelangganData.length);
            setTotalTransaksi(transaksiData.length);
            setTotalPendapatan(transaksiData.reduce((acc, curr) => acc + (curr.total_harga || 0), 0));
            setRecentTransaksi([...transaksiData].reverse().slice(0, 10)); 
        } catch (error) {
            console.error("Error fetching dashboard data", error);
        }
    }

    const StatCard = ({ title, value, icon: Icon, color }: any) => (
        <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm h-100 rounded-3">
                <div className="card-body p-3">
                    <div className={`d-inline-block p-2 rounded-2 bg-${color} bg-opacity-10 text-${color} mb-2`}>
                        <Icon size={20} />
                    </div>
                    <p className="text-muted small mb-0">{title}</p>
                    <h6 className="fw-bold mb-0 mt-1">{value}</h6>
                </div>
            </div>
        </div>
    );

    return (
        <div className="container-fluid py-3">
            <h5 className="mb-3 fw-bold">Dashboard Admin</h5>
            
            <div className="row g-2">
                <StatCard title="Pendapatan" value={`Rp ${totalPendapatan.toLocaleString('id-ID')}`} icon={DollarSign} color="primary" />
                <StatCard title="Transaksi" value={totalTransaksi} icon={ShoppingCart} color="success" />
                <StatCard title="Produk" value={totalProduk} icon={Package} color="warning" />
                <StatCard title="Pelanggan" value={totalPelanggan} icon={Users} color="info" />
            </div>

            <div className="card border-0 shadow-sm mt-3 rounded-3">
                <div className="card-body p-3">
                    <h6 className="fw-bold mb-3">Transaksi Terbaru</h6>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.85rem' }}>
                            <thead className="text-muted">
                                <tr>
                                    <th>ID</th>
                                    <th>Pelanggan</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentTransaksi.map((trx) => (
                                    <tr key={trx.id}>
                                        <td className="fw-bold">#{trx.id}</td>
                                        <td>{trx.pelanggan?.nama || trx.nama_pelanggan || '-'}</td>
                                        <td className="fw-bold text-success">Rp {trx.total_harga.toLocaleString('id-ID')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
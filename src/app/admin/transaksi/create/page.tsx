'use client'
import { showToast } from "@/Components/toast/toast"
import { api } from "@/lib/axios"
import React, { useEffect, useState } from "react"

interface IPelanggan {
  id: number;
  nama: string;
}

interface IBarang {
  id: number;
  nama_barang: string;
}

export default function CreateTransaksiPage (){
   
    const [userId, setUserId] = useState('')
    const [barangId, setBarangId] = useState('')
    const [jumlah, setJumlah] = useState('')
    const [pelangganId, setPelangganId] = useState('')
    const [pelanggans, setPelanggans] = useState<IPelanggan[]>([])
    const [barangs, setBarangs] = useState<IBarang[]>([])

    useEffect(() => {
        getPelanggan()
        getBarang()
    }, [])

    const getPelanggan = async () => {
        try {
            const res = await api.get<any>('/pelanggan')
            if (res.data.data) {
                setPelanggans(res.data.data)
            } else if (Array.isArray(res.data)) {
                setPelanggans(res.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getBarang = async () => {
        try {
            const res = await api.get<any>('/barang')
            if (res.data.data) {
                setBarangs(res.data.data)
            } else if (Array.isArray(res.data)) {
                setBarangs(res.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            
            const payload = {
                pelanggan_id: pelangganId ? parseInt(pelangganId) : undefined,
                user_id: parseInt(userId),
                items: [
                    {
                        barang_id: parseInt(barangId),
                        jumlah: parseInt(jumlah)
                    }
                ]
            }

            const res = await api.post<any>('/transaksi', payload)
            
            showToast(res.data.message || 'Transaksi berhasil!', 'success')
            
            setPelangganId('')
            setBarangId('')
            setJumlah('')
            setUserId('')

       } catch (error: any) {
           
            console.log("Detail Error Backend:", error.response?.data)
            
            const pesanErrorAsli = error.response?.data?.error || error.response?.data?.message || 'Gagal menyimpan data'
            
            showToast(pesanErrorAsli, 'danger')
        }
    }

    return(
        <div>
            <h4>Input Transaksi Baru</h4>
            <div className="row">
                <div className="col-md-6">
                    <form onSubmit={onSubmit}>
                        <div className="mb-3">
                            <label className="form-label small fw-semibold">Nama Pelanggan</label>
                            <select
                                className="form-select form-select-sm py-2"
                                value={pelangganId}
                                onChange={(e) => setPelangganId(e.target.value)}
                                required
                            >
                                <option value="">-- Pilih Pelanggan --</option>
                                {pelanggans.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.nama}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label small fw-semibold">ID User (Kasir/Admin)</label>
                            <input
                                type="number"
                                className="form-control form-control-sm py-2"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                placeholder="Masukkan ID User (misal: 1)"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label small fw-semibold">Nama Barang</label>
                            <select
                                className="form-select form-select-sm py-2"
                                value={barangId}
                                onChange={(e) => setBarangId(e.target.value)}
                                required
                            >
                                <option value="">-- Pilih Barang --</option>
                                {barangs.map((b) => (
                                    <option key={b.id} value={b.id}>
                                        {b.nama_barang}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label small fw-semibold">Jumlah Beli</label>
                            <input
                                type="number"
                                className="form-control form-control-sm py-2"
                                value={jumlah}
                                onChange={(e) => setJumlah(e.target.value)}
                                placeholder="Masukkan jumlah beli"
                                required
                            />
                        </div>
                        
                        <button type="submit" className="btn btn-primary"> Save Transaksi </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
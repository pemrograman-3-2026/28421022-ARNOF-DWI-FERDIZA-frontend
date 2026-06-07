'use client'
import { showToast } from "@/Components/toast/toast"
import { api } from "@/lib/axios"
import React, { useState } from "react"
import { useRouter } from "next/navigation"

export default function CreateDetailTransaksiPage (){
   
    const [transaksiId, setTransaksiId] = useState('')
    const [barangId, setBarangId] = useState('')
    const [jumlah, setJumlah] = useState('')
    const [hargaSatuan, setHargaSatuan] = useState('')
    const [subtotal, setSubtotal] = useState('')

    const router = useRouter()

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const payload = {
                transaksi_id: parseInt(transaksiId),
                barang_id: parseInt(barangId),
                jumlah: parseInt(jumlah),
                harga_satuan: parseInt(hargaSatuan),
                subtotal: parseInt(subtotal)
            }

            const res = await api.post<any>('/detail_transaksi', payload)
            
            showToast(res.data.message || 'Detail Transaksi berhasil ditambahkan!', 'success')
            
            router.push('/admin/detail-transaksi')

       } catch (error: any) {
            console.log("Detail Error Backend:", error.response?.data)
            const errorData = error.response?.data;
            let pesanErrorAsli = 'Gagal menyimpan data';
            if (errorData) {
                if (typeof errorData === 'string') pesanErrorAsli = errorData;
                else pesanErrorAsli = errorData.message || errorData.error || JSON.stringify(errorData);
            } else {
                pesanErrorAsli = error.message;
            }
            showToast(pesanErrorAsli, 'danger')
        }
    }

    return(
        <div>
            <h4>Input Detail Transaksi Baru</h4>
            <div className="row mt-4">
                <div className="col-md-6">
                    <form onSubmit={onSubmit}>
                        <div className="mb-3">
                            <label className="form-label small fw-semibold">ID Transaksi</label>
                            <input
                                type="number"
                                className="form-control form-control-sm py-2"
                                value={transaksiId}
                                onChange={(e) => setTransaksiId(e.target.value)}
                                placeholder="Misal: 1"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label small fw-semibold">ID Barang</label>
                            <input
                                type="number"
                                className="form-control form-control-sm py-2"
                                value={barangId}
                                onChange={(e) => setBarangId(e.target.value)}
                                placeholder="Misal: 5"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label small fw-semibold">Jumlah</label>
                            <input
                                type="number"
                                className="form-control form-control-sm py-2"
                                value={jumlah}
                                onChange={(e) => setJumlah(e.target.value)}
                                placeholder="Masukkan jumlah"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label small fw-semibold">Harga Satuan</label>
                            <input
                                type="number"
                                className="form-control form-control-sm py-2"
                                value={hargaSatuan}
                                onChange={(e) => setHargaSatuan(e.target.value)}
                                placeholder="Misal: 25000"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label small fw-semibold">Subtotal</label>
                            <input
                                type="number"
                                className="form-control form-control-sm py-2"
                                value={subtotal}
                                onChange={(e) => setSubtotal(e.target.value)}
                                placeholder="Misal: 50000"
                                required
                            />
                        </div>
                        
                        <button type="submit" className="btn btn-primary"> Save Detail Transaksi </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

'use client'
import { showToast } from "@/Components/toast/toast"
import { api } from "@/lib/axios"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface IKategori {
    id: number;
    nama_kategori: string;
}

export default function CreateProdukPage (){
   
    const [namaBarang, setNamaBarang] = useState('')
    const [harga, setHarga] = useState('')
    const [stok, setStok] = useState('')
    const [kategoriId, setKategoriId] = useState('')
    const [kategoris, setKategoris] = useState<IKategori[]>([])

    const router = useRouter()

    useEffect(() => {
        getKategori()
    }, [])

    const getKategori = async () => {
        try {
            const res = await api.get<any>('/kategori')
            if (res.data.data) {
                setKategoris(res.data.data)
            } else if (Array.isArray(res.data)) {
                setKategoris(res.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const payload = {
                nama_barang: namaBarang,
                harga: parseInt(harga),
                stok: parseInt(stok),
                kategori_id: parseInt(kategoriId)
            }

            const res = await api.post<any>('/barang', payload)
            
            showToast(res.data?.message || 'Produk berhasil ditambahkan!', 'success')
            
            router.push('/admin/produk')

       } catch (error: any) {
            console.log("Error Backend:", error.response?.data)
            const errorData = error.response?.data;
            let pesanErrorAsli = 'Gagal menyimpan data produk';
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
            <h4>Input Produk Baru</h4>
            <div className="row mt-4">
                <div className="col-md-6">
                    <form onSubmit={onSubmit}>
                        <div className="mb-3">
                            <label className="form-label small fw-semibold">Nama Produk</label>
                            <input
                                type="text"
                                className="form-control form-control-sm py-2"
                                value={namaBarang}
                                onChange={(e) => setNamaBarang(e.target.value)}
                                placeholder="Masukkan nama produk"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label small fw-semibold">Kategori</label>
                            <select
                                className="form-select form-select-sm py-2"
                                value={kategoriId}
                                onChange={(e) => setKategoriId(e.target.value)}
                                required
                            >
                                <option value="">-- Pilih Kategori --</option>
                                {kategoris.map((k) => (
                                    <option key={k.id} value={k.id}>
                                        {k.nama_kategori}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label small fw-semibold">Harga</label>
                            <input
                                type="number"
                                className="form-control form-control-sm py-2"
                                value={harga}
                                onChange={(e) => setHarga(e.target.value)}
                                placeholder="Misal: 15000"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label small fw-semibold">Stok</label>
                            <input
                                type="number"
                                className="form-control form-control-sm py-2"
                                value={stok}
                                onChange={(e) => setStok(e.target.value)}
                                placeholder="Misal: 50"
                                required
                            />
                        </div>
                        
                        <button type="submit" className="btn btn-primary"> Save Produk </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

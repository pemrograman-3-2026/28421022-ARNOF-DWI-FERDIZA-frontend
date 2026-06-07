'use client'
import { showToast } from "@/Components/toast/toast"
import { api } from "@/lib/axios"
import React, { useState } from "react"
import { useRouter } from "next/navigation"

export default function CreateKategoriPage() {
   
    const [namaKategori, setNamaKategori] = useState('')
    const [deskripsi, setDeskripsi] = useState('')

    const router = useRouter()

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const payload = {
                nama_kategori: namaKategori,
                deskripsi: deskripsi
            }

            const res = await api.post<any>('/kategori', payload)
            
            showToast(res.data?.message || 'Kategori berhasil ditambahkan!', 'success')
            
            router.push('/admin/kategori')

       } catch (error: any) {
            console.log("Error Backend:", error.response?.data)
            const errorData = error.response?.data;
            let pesanErrorAsli = 'Gagal menyimpan data kategori';
            if (errorData) {
                if (typeof errorData === 'string') pesanErrorAsli = errorData;
                else pesanErrorAsli = errorData.message || errorData.error || JSON.stringify(errorData);
            } else {
                pesanErrorAsli = error.message;
            }
            showToast(pesanErrorAsli, 'danger')
        }
    }

    return (
        <div>
            <h4>Input Kategori Baru</h4>
            <div className="row mt-4">
                <div className="col-md-6">
                    <form onSubmit={onSubmit}>
                        <div className="mb-3">
                            <label className="form-label small fw-semibold">Nama Kategori</label>
                            <input
                                type="text"
                                className="form-control form-control-sm py-2"
                                value={namaKategori}
                                onChange={(e) => setNamaKategori(e.target.value)}
                                placeholder="Masukkan nama kategori"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label small fw-semibold">Deskripsi</label>
                            <textarea
                                className="form-control form-control-sm py-2"
                                value={deskripsi}
                                onChange={(e) => setDeskripsi(e.target.value)}
                                placeholder="Masukkan deskripsi (opsional)"
                                rows={3}
                            />
                        </div>
                        
                        <button type="submit" className="btn btn-primary"> Save Kategori </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

'use client'
import { showToast } from "@/Components/toast/toast"
import { api } from "@/lib/axios"
import React, { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"

function EditKategoriForm() {
    const [namaKategori, setNamaKategori] = useState('')
    const [deskripsi, setDeskripsi] = useState('')

    const router = useRouter()
    const searchParams = useSearchParams()
    const id = searchParams.get('id')

    useEffect(() => {
        if (id) {
            getDetailKategori()
        }
    }, [id])

    const getDetailKategori = async () => {
        try {
            const res = await api.get<any>(`/kategori/${id}`)
            if (res.data.data) {
                setNamaKategori(res.data.data.nama_kategori)
                setDeskripsi(res.data.data.deskripsi || '')
            } else if (res.data) {
                setNamaKategori(res.data.nama_kategori)
                setDeskripsi(res.data.deskripsi || '')
            }
        } catch (error: any) {
            console.log(error)
            showToast('Gagal mengambil data kategori', 'danger')
        }
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!id) return;

        try {
            const payload = {
                nama_kategori: namaKategori,
                deskripsi: deskripsi
            }

            const res = await api.put<any>(`/kategori/${id}`, payload)
            
            showToast(res.data?.message || 'Kategori berhasil diupdate!', 'success')
            
            router.push('/admin/kategori')

       } catch (error: any) {
            console.log("Error Backend:", error.response?.data)
            const errorData = error.response?.data;
            let pesanErrorAsli = 'Gagal mengupdate data kategori';
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
            <h4>Edit Kategori</h4>
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
                        
                        <button type="submit" className="btn btn-primary" disabled={!id}> Update Kategori </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default function EditKategoriPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EditKategoriForm />
        </Suspense>
    )
}

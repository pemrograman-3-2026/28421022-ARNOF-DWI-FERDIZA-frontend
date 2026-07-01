'use client'
import { showToast } from "@/Components/toast/toast"
import { api } from "@/lib/axios"
import React, { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"

function EditPelangganForm() {
    const [nama, setNama] = useState('')
    const [noTelp, setNoTelp] = useState('')
    const [alamat, setAlamat] = useState('')

    const router = useRouter()
    const searchParams = useSearchParams()
    const id = searchParams.get('id')

    useEffect(() => {
        if (id) {
            getDetailPelanggan()
        }
    }, [id])

    const getDetailPelanggan = async () => {
        try {
            // Karena backend belum memiliki GET /pelanggan/:id, kita fetch semua pelanggan dan filter
            const res = await api.get<any>('/pelanggan')
            const pelangganList = res.data.data ? res.data.data : res.data;
            
            if (Array.isArray(pelangganList)) {
                const pelanggan = pelangganList.find((p: any) => p.id === parseInt(id!));
                if (pelanggan) {
                    setNama(pelanggan.nama || '');
                    setNoTelp(pelanggan.no_telp || '');
                    setAlamat(pelanggan.alamat || '');
                } else {
                    showToast('Data pelanggan tidak ditemukan', 'danger');
                }
            }
        } catch (error: any) {
            console.log(error)
            showToast('Gagal mengambil data pelanggan', 'danger')
        }
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!id) return;

        try {
            const payload = {
                nama: nama,
                no_telp: noTelp,
                alamat: alamat
            }

            const res = await api.put<any>(`/pelanggan/${id}`, payload)
            
            showToast(res.data?.message || 'Pelanggan berhasil diupdate!', 'success')
            
            router.push('/admin/pelanggan')

       } catch (error: any) {
            console.log("Error Backend:", error.response?.data)
            const errorData = error.response?.data;
            let pesanErrorAsli = 'Gagal mengupdate data pelanggan';
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
            <h4>Edit Pelanggan</h4>
            <div className="row mt-4">
                <div className="col-md-6">
                    <form onSubmit={onSubmit}>
                        <div className="mb-3">
                            <label className="form-label small fw-semibold">Nama</label>
                            <input
                                type="text"
                                className="form-control form-control-sm py-2"
                                value={nama}
                                onChange={(e) => setNama(e.target.value)}
                                placeholder="Masukkan nama pelanggan"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label small fw-semibold">No Telp</label>
                            <input
                                type="text"
                                className="form-control form-control-sm py-2"
                                value={noTelp}
                                onChange={(e) => setNoTelp(e.target.value)}
                                placeholder="Misal: 081234567890"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label small fw-semibold">Alamat</label>
                            <textarea
                                className="form-control form-control-sm py-2"
                                value={alamat}
                                onChange={(e) => setAlamat(e.target.value)}
                                placeholder="Masukkan alamat lengkap"
                                required
                            />
                        </div>
                        
                        <button type="submit" className="btn btn-primary" disabled={!id}> Update Pelanggan </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default function EditPelangganPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EditPelangganForm />
        </Suspense>
    )
}

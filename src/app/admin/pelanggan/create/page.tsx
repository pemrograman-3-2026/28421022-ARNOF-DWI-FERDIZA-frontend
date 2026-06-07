'use client'
import { showToast } from "@/Components/toast/toast"
import { api } from "@/lib/axios"
import React, { useState } from "react"
import { useRouter } from "next/navigation"

export default function CreatePelangganPage (){
   
    const [nama, setNama] = useState('')
    const [noTelp, setNoTelp] = useState('')
    const [alamat, setAlamat] = useState('')

    const router = useRouter()

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const payload = {
                nama: nama,
                no_telp: noTelp,
                alamat: alamat
            }

            const res = await api.post<any>('/pelanggan', payload)
            
            showToast(res.data.message || 'Pelanggan berhasil ditambahkan!', 'success')
            
            router.push('/admin/pelanggan')

       } catch (error: any) {
            console.log("Error Backend:", error.response?.data)
            const errorData = error.response?.data;
            let pesanErrorAsli = 'Gagal menyimpan data pelanggan';
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
            <h4>Input Pelanggan Baru</h4>
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
                        
                        <button type="submit" className="btn btn-primary"> Save Pelanggan </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

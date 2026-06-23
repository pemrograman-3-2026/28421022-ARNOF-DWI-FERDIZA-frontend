'use client'
import { showToast } from "@/Components/toast/toast"
import { api } from "@/lib/axios"
import React, { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"

interface IKategori {
    id: number;
    nama_kategori: string;
}

export default function EditProdukPage ({ params }: { params: Promise<{ id: string }> }) {
   

    const unwrappedParams = use(params);
    const id = unwrappedParams.id;

    const [namaBarang, setNamaBarang] = useState('')
    const [harga, setHarga] = useState('')
    const [stok, setStok] = useState('')
    const [kategoriId, setKategoriId] = useState('')
    const [kategoris, setKategoris] = useState<IKategori[]>([])
    const [image, setImage] = useState<File | null>(null)
    const [currentImage, setCurrentImage] = useState<string>('')

    const router = useRouter()

    useEffect(() => {
        getKategori()
        if (id) {
            getProduk(id)
        }
    }, [id])

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

    const getProduk = async (produkId: string) => {
        try {
            const res = await api.get<any>(`/barang/${produkId}`)
            const data = res.data?.data || res.data
            if (data) {
                setNamaBarang(data.nama_barang || '')
                setHarga(data.harga || '')
                setStok(data.stok || '')
                setKategoriId(data.kategori_id || data.kategori?.id || '')
                setCurrentImage(data.image || '')
            }
        } catch (error: any) {
            console.log(error)
            showToast('Gagal mengambil data produk', 'danger')
        }
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append('nama_barang', namaBarang)
            formData.append('harga', harga)
            formData.append('stok', stok)
            formData.append('kategori_id', kategoriId)
            if (image) {
                formData.append('image', image)
            }

            const res = await api.put<any>(`/barang/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            
            showToast(res.data?.message || 'Produk berhasil diubah!', 'success')
            
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
            <h4>Edit Produk</h4>
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
                        <div className="mb-3">
                            <label className="form-label small fw-semibold">Gambar Produk</label>
                            {currentImage && (
                                <div className="mb-2">
                                    <img src={`http://localhost:3100/image/${currentImage}`} alt="Current Image" width={100} height={100} style={{ objectFit: 'cover', borderRadius: '4px' }} />
                                </div>
                            )}
                            <input
                                type="file"
                                className="form-control form-control-sm py-2"
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setImage(e.target.files[0])
                                    }
                                }}
                            />
                            <small className="text-muted d-block mt-1">Biarkan kosong jika tidak ingin mengubah gambar.</small>
                        </div>
                        
                        <button type="submit" className="btn btn-primary"> Update Produk </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

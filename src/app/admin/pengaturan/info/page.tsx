'use client';
import { useState, useEffect } from "react";
import { showToast } from "@/Components/toast/toast";
import Link from "next/link";

export default function InfoTokoAdminPage() {
  const [storeData, setStoreData] = useState({
    nama: "Toko Sembako",
    deskripsi: "Pusat grosir dan eceran sembako murah dan lengkap.",
    alamat: "Jl. Raya Sembako No. 123, Jakarta",
    jamBuka: "08:00",
    jamTutup: "21:00",
    kontak: "081234567890",
    email: "admin@tokosembako.com"
  });

  useEffect(() => {
    const savedStoreData = localStorage.getItem('storeInfoExtended');
    if (savedStoreData) {
      setStoreData(JSON.parse(savedStoreData));
    }
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setStoreData({
      ...storeData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simpan ke localStorage
    localStorage.setItem('storeInfoExtended', JSON.stringify(storeData));
    
    setTimeout(() => {
      setIsLoading(false);
      showToast("Informasi toko berhasil diperbarui!", "success");
    }, 500);
  };

  return (
    <div className="container-fluid py-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold m-0">Informasi Toko</h4>
        <Link href="/admin/pengaturan">
          <button className="btn btn-outline-secondary btn-sm">
            Kembali ke Pengaturan
          </button>
        </Link>
      </div>

      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted small fw-semibold">Nama Toko</label>
                <input 
                  type="text" 
                  name="nama"
                  className="form-control" 
                  value={storeData.nama}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label text-muted small fw-semibold">Email Kontak</label>
                <input 
                  type="email" 
                  name="email"
                  className="form-control" 
                  value={storeData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label text-muted small fw-semibold">Nomor Telepon / WhatsApp</label>
                <input 
                  type="text" 
                  name="kontak"
                  className="form-control" 
                  value={storeData.kontak}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label text-muted small fw-semibold">Jam Buka</label>
                <input 
                  type="time" 
                  name="jamBuka"
                  className="form-control" 
                  value={storeData.jamBuka}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="col-md-3 mb-3">
                <label className="form-label text-muted small fw-semibold">Jam Tutup</label>
                <input 
                  type="time" 
                  name="jamTutup"
                  className="form-control" 
                  value={storeData.jamTutup}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-12 mb-3">
                <label className="form-label text-muted small fw-semibold">Deskripsi Singkat</label>
                <textarea 
                  name="deskripsi"
                  className="form-control" 
                  rows={2} 
                  value={storeData.deskripsi}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="col-md-12 mb-4">
                <label className="form-label text-muted small fw-semibold">Alamat Lengkap</label>
                <textarea 
                  name="alamat"
                  className="form-control" 
                  rows={3} 
                  value={storeData.alamat}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
            </div>

            <div className="d-flex justify-content-end">
              <button 
                type="submit" 
                className="btn btn-primary px-4 fw-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

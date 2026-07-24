'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { showToast } from '@/Components/toast/toast';

export default function KlaimPromoPage() {
  const [promoCode, setPromoCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleKlaim = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!promoCode.trim()) {
      showToast('Silakan masukkan kode voucher terlebih dahulu!', 'danger');
      return;
    }

    setIsLoading(true);

    
    setTimeout(() => {
      setIsLoading(false);
      const code = promoCode.toUpperCase().trim();
      const validCodes = ['BERAS40', 'FREEONGKIR', 'MINYAK50K', 'BUNDLINGHEMAT', 'WEEKEND15', 'NEWUSER20', 'SEMBAKOMURAH'];
      
      if (validCodes.includes(code)) {
        showToast(`Selamat! Voucher ${code} berhasil diklaim dan tersimpan.`, 'success');
        
        // Simpan ke local storage agar bisa digunakan di keranjang nantinya (simulasi)
        const savedVouchers = JSON.parse(localStorage.getItem('sembako_vouchers') || '[]');
        if (!savedVouchers.includes(code)) {
          savedVouchers.push(code);
          localStorage.setItem('sembako_vouchers', JSON.stringify(savedVouchers));
        }
        
        // Redirect ke katalog untuk belanja
        setTimeout(() => {
          router.push('/user/katalog');
        }, 1500);
      } else {
        showToast('Maaf, kode voucher tidak valid atau sudah kadaluarsa.', 'danger');
      }
    }, 1000);
  };

  return (
    <div className="container-fluid py-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="row justify-content-center mt-3">
        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
          <Link href="/user/dashboard" className="text-decoration-none d-inline-block mb-4 text-success fw-bold">
            &larr; Kembali ke Dashboard
          </Link>
          
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="card-header border-0 text-white p-5 text-center position-relative" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
              <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '150px', height: '150px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
              
              <div className="bg-white text-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow-sm position-relative" style={{ width: '80px', height: '80px', zIndex: 1 }}>
                <span style={{ fontSize: '36px' }}>🎟️</span>
              </div>
              <h2 className="fw-bolder position-relative" style={{ zIndex: 1 }}>Klaim Promo Anda</h2>
              <p className="mb-0 text-white-50 position-relative" style={{ zIndex: 1 }}>Masukkan kode voucher untuk mendapatkan potongan spesial dari Toko Sembako</p>
            </div>
            
            <div className="card-body p-4 p-md-5 bg-white">
              <form onSubmit={handleKlaim}>
                <div className="mb-4">
                  <label htmlFor="promoCode" className="form-label fw-bold text-dark mb-3 text-center w-100">Kode Voucher / Promo</label>
                  <input
                    type="text"
                    id="promoCode"
                    className="form-control form-control-lg bg-light border-0 shadow-none text-uppercase text-center fw-bold rounded-4 py-3"
                    placeholder="CONTOH: FREEONGKIR"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    style={{ letterSpacing: '3px', fontSize: '22px' }}
                    autoComplete="off"
                  />
                  <div className="form-text mt-3 text-muted text-center small fw-medium">
                    Pastikan Anda memasukkan kode dengan benar (tanpa spasi ekstra).
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-success btn-lg w-100 rounded-pill fw-bold shadow-sm py-3 mt-2"
                  disabled={isLoading}
                  style={{ transition: 'all 0.3s' }}
                >
                  {isLoading ? (
                    <span>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Memeriksa Kode...
                    </span>
                  ) : 'Klaim Sekarang'}
                </button>
              </form>
            </div>
            
            <div className="card-footer bg-light border-0 p-4 text-center">
              <p className="text-muted small mb-0 fw-medium">
                Belum tahu kodenya? <Link href="/user/dashboard/promo" className="text-success fw-bold text-decoration-none">Lihat daftar promo disini</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

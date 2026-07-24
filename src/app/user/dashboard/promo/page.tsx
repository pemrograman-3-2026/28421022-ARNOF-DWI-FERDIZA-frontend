'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { showToast } from '@/Components/toast/toast';

export default function PromoPage() {
  const router = useRouter();

  const promos = [
    {
      id: 1,
      title: 'Diskon 40% Beras Merah',
      description: 'Dapatkan diskon hingga 40% untuk pembelian Beras Merah Premium min. 5kg.',
      code: 'BERAS40',
      validUntil: '31 Agustus 2026',
      type: 'discount',
      gradient: 'linear-gradient(135deg, #ef4444, #b91c1c)'
    },
    {
      id: 2,
      title: 'Gratis Ongkir se-Kota',
      description: 'Gratis biaya pengiriman untuk semua pembelian tanpa minimum belanja.',
      code: 'FREEONGKIR',
      validUntil: '15 September 2026',
      type: 'shipping',
      gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
    },
    {
      id: 3,
      title: 'Cashback 50.000',
      description: 'Cashback langsung untuk pembelian minyak goreng kelapa sawit 2L.',
      code: 'MINYAK50K',
      validUntil: '10 Agustus 2026',
      type: 'cashback',
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)'
    },
    {
      id: 4,
      title: 'Paket Bundling Hemat',
      description: 'Beli paket bundling (Beras + Minyak + Telur) lebih murah 20% dari harga normal.',
      code: 'BUNDLINGHEMAT',
      validUntil: 'Akhir Bulan Ini',
      type: 'bundle',
      gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)'
    },
    {
      id: 5,
      title: 'Diskon Akhir Pekan',
      description: 'Potongan harga khusus 15% untuk semua kategori produk sembako setiap Sabtu dan Minggu.',
      code: 'WEEKEND15',
      validUntil: 'Setiap Akhir Pekan',
      type: 'discount',
      gradient: 'linear-gradient(135deg, #10b981, #059669)'
    },
    {
      id: 6,
      title: 'Promo Pengguna Baru',
      description: 'Nikmati voucher 20.000 khusus untuk Anda pengguna baru Toko Sembako.',
      code: 'NEWUSER20',
      validUntil: 'Tidak Terbatas',
      type: 'cashback',
      gradient: 'linear-gradient(135deg, #ec4899, #be185d)'
    }
  ];

  return (
    <div className="container-fluid py-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="p-4 p-md-5 rounded-4 shadow-sm text-white position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            <div className="position-relative" style={{ zIndex: 1 }}>
              <Link href="/user/dashboard" className="text-white text-decoration-none mb-3 d-inline-block fw-bold" style={{ opacity: 0.8 }}>
                &larr; Kembali ke Dashboard
              </Link>
              <h1 className="fw-bolder display-5 mb-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>Klaim Promo Spesialmu! 🎁</h1>
              <p className="lead mb-0 fw-medium" style={{ maxWidth: '600px', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                Berbagai voucher dan potongan harga eksklusif untuk belanja sembako yang lebih hemat.
              </p>
            </div>
            {/* Decorative circles */}
            <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '300px', height: '300px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
            <div style={{ position: 'absolute', bottom: '-50px', right: '150px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
          </div>
        </div>
      </div>

      {/* Promos Grid */}
      <div className="row g-4">
        {promos.map((promo) => (
          <div className="col-md-6 col-xl-4" key={promo.id}>
            <div 
              className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden promo-card" 
              style={{ transition: 'all 0.3s ease' }}
            >
              <div className="card-header border-0 text-white p-4 position-relative" style={{ background: promo.gradient }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="badge bg-white text-dark fw-bold rounded-pill px-3 py-2 shadow-sm">
                    {promo.type === 'discount' ? 'Diskon' : promo.type === 'shipping' ? 'Ongkir' : promo.type === 'cashback' ? 'Cashback' : 'Bundling'}
                  </span>
                  <span className="text-white-50 small fw-bold">s/d {promo.validUntil}</span>
                </div>
                <h4 className="fw-bold mb-0 mt-3 text-white" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>{promo.title}</h4>
              </div>
              <div className="card-body p-4 bg-white d-flex flex-column justify-content-between">
                <p className="text-muted fw-medium mb-4">{promo.description}</p>
                
                <div className="d-flex align-items-center justify-content-between mt-auto bg-light p-3 rounded-3 border border-dashed border-secondary border-opacity-25">
                  <div>
                    <span className="d-block small text-muted fw-bold mb-1">Kode Voucher</span>
                    <span className="fw-bolder font-monospace text-dark fs-5">{promo.code}</span>
                  </div>
                  <button 
                    className="btn btn-success fw-bold px-4 rounded-pill shadow-sm"
                    onClick={() => {
                      navigator.clipboard.writeText(promo.code);
                      showToast(`Kode ${promo.code} berhasil disalin!`, 'success');
                    }}
                  >
                    Salin
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .promo-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        .border-dashed {
          border-style: dashed !important;
        }
      `}</style>
    </div>
  );
}

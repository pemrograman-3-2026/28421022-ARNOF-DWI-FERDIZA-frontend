'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { showToast } from '@/Components/toast/toast';
import { api } from '@/lib/axios';
import Cookies from 'js-cookie';

interface ICartItem {
  id: number;
  nama_barang: string;
  harga: number;
  image?: string;
  qty: number;
  stok: number;
}

export default function PaymentPage() {
  const [cart, setCart] = useState<ICartItem[]>([]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedCart = localStorage.getItem('sembako_cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (parsed.length === 0) {
          router.push('/user/keranjang');
          return;
        }
        setCart(parsed);
      } catch (e) {
        router.push('/user/keranjang');
        return;
      }
    } else {
      router.push('/user/keranjang');
      return;
    }
    
    // Check if user has claimed any vouchers
    const savedVouchers = JSON.parse(localStorage.getItem('sembako_vouchers') || '[]');
    if (savedVouchers.length > 0) {
      setDiscountPercent(20);
    }
    
    setIsLoaded(true);
  }, [router]);

  const handlePayment = async () => {
    if (!selectedMethod) {
      showToast('Silakan pilih metode pembayaran terlebih dahulu!', 'warning');
      return;
    }

    setIsProcessing(true);

    try {
      const userStr = Cookies.get('user');
      if (!userStr) {
        showToast('Silakan login terlebih dahulu', 'danger');
        setIsProcessing(false);
        return;
      }
      const user = JSON.parse(userStr);

      const items = cart.map(item => ({
        barang_id: item.id,
        jumlah: item.qty
      }));

      // Simulate a small delay for payment processing UI
      await new Promise(resolve => setTimeout(resolve, 1500));

      await api.post('/transaksi', {
        user_id: user.id,
        items: items,
        diskon: discountPercent
      });

      showToast('Pembayaran Berhasil! Pesanan Anda segera diproses.', 'success');
      localStorage.removeItem('sembako_cart');
      
      // Optional: Clear voucher after use
      // localStorage.removeItem('sembako_vouchers');
      
      router.push('/user/riwayat'); // Halaman riwayat belanja
    } catch (error) {
      console.error('Payment error:', error);
      showToast('Gagal memproses pembayaran, silakan coba lagi.', 'danger');
      setIsProcessing(false);
    }
  };

  if (!isLoaded) return null;

  const totalBelanja = cart.reduce((acc, item) => acc + (item.harga * item.qty), 0);
  const discountAmount = (totalBelanja * discountPercent) / 100;
  const totalTagihan = totalBelanja - discountAmount;

  const paymentMethods = [
    { id: 'bca', name: 'BCA Virtual Account', icon: '🏦' },
    { id: 'mandiri', name: 'Mandiri Virtual Account', icon: '🏦' },
    { id: 'gopay', name: 'GoPay', icon: '📱' },
    { id: 'ovo', name: 'OVO', icon: '📱' },
    { id: 'qris', name: 'QRIS', icon: '📷' },
    { id: 'cod', name: 'Bayar di Tempat (COD)', icon: '💵' }
  ];

  return (
    <div className="container-fluid py-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <Link href="/user/keranjang" className="text-decoration-none d-inline-block mb-4 text-success fw-bold">
            &larr; Kembali ke Keranjang
          </Link>
          
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
            <div className="card-header bg-white border-bottom p-4">
              <h4 className="fw-bold text-dark mb-0">Pilih Metode Pembayaran</h4>
            </div>
            <div className="card-body p-4">
              <div className="row g-3">
                {paymentMethods.map(method => (
                  <div className="col-md-6" key={method.id}>
                    <div 
                      className={`p-3 border rounded-3 d-flex align-items-center gap-3 ${selectedMethod === method.id ? 'border-success bg-success bg-opacity-10 shadow-sm' : ''}`}
                      style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                      onClick={() => setSelectedMethod(method.id)}
                    >
                      <div className="form-check m-0">
                        <input 
                          className="form-check-input" 
                          type="radio" 
                          name="paymentMethod" 
                          checked={selectedMethod === method.id}
                          onChange={() => {}}
                          style={{ cursor: 'pointer' }}
                        />
                      </div>
                      <span style={{ fontSize: '24px' }}>{method.icon}</span>
                      <span className="fw-bold text-dark">{method.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <h5 className="fw-bold text-dark mb-4">Ringkasan Tagihan</h5>
              
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted fw-medium">Total Harga ({cart.reduce((a, b) => a + b.qty, 0)} Barang)</span>
                <span className="fw-bold text-dark">Rp {totalBelanja.toLocaleString('id-ID')}</span>
              </div>
              <div className="d-flex justify-content-between mb-4 border-bottom pb-3">
                <span className="text-muted fw-medium">
                  Diskon {discountPercent > 0 && <span className="badge bg-success ms-1">{discountPercent}%</span>}
                </span>
                <span className="fw-bold text-success">- Rp {discountAmount.toLocaleString('id-ID')}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-4">
                <h4 className="fw-bold text-dark mb-0">Total Tagihan</h4>
                <h3 className="fw-bolder text-success mb-0">Rp {totalTagihan.toLocaleString('id-ID')}</h3>
              </div>
              
              <button 
                className="btn btn-success btn-lg w-100 rounded-pill fw-bold shadow-sm py-3 mt-3"
                onClick={handlePayment}
                disabled={isProcessing || !selectedMethod}
                style={{ transition: 'all 0.3s' }}
              >
                {isProcessing ? (
                  <span>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Memproses Pembayaran...
                  </span>
                ) : (
                  `Bayar Rp ${totalTagihan.toLocaleString('id-ID')}`
                )}
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

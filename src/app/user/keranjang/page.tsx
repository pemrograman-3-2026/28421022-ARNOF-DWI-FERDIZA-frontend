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

export default function KeranjangPage() {
  const [cart, setCart] = useState<ICartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedCart = localStorage.getItem('sembako_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        setCart([]);
      }
    }
    setIsLoaded(true);
  }, []);

  const saveCart = (newCart: ICartItem[]) => {
    setCart(newCart);
    localStorage.setItem('sembako_cart', JSON.stringify(newCart));
  };

  const updateQty = (id: number, delta: number) => {
    const newCart = cart.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        if (newQty > 0 && newQty <= item.stok) {
          return { ...item, qty: newQty };
        }
      }
      return item;
    });
    saveCart(newCart);
  };

  const removeItem = (id: number) => {
    const newCart = cart.filter(item => item.id !== id);
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
    showToast('Keranjang berhasil dikosongkan', 'success');
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    try {
      const userStr = Cookies.get('user');
      if (!userStr) {
        showToast('Silakan login terlebih dahulu', 'danger');
        return;
      }
      const user = JSON.parse(userStr);

      const items = cart.map(item => ({
        barang_id: item.id,
        jumlah: item.qty
      }));

      await api.post('/transaksi', {
        user_id: user.id,
        items: items
      });

      showToast('Pesanan berhasil dibuat! Silakan cek menu Transaksi.', 'success');
      saveCart([]);
      router.push('/user/riwayat');
    } catch (error) {
      console.error('Checkout error:', error);
      showToast('Gagal membuat pesanan', 'danger');
    }
  };

  if (!isLoaded) return null;

  const totalBelanja = cart.reduce((acc, item) => acc + (item.harga * item.qty), 0);

  return (
    <div className="container-fluid py-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bolder text-dark mb-0">Keranjang Belanja</h3>
        {cart.length > 0 && (
          <button className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-bold" onClick={clearCart}>
            Kosongkan
          </button>
        )}
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          {cart.length === 0 ? (
            <div className="text-center py-5 bg-white rounded-4 shadow-sm border-0">
              <div style={{ fontSize: '60px' }}>🛒</div>
              <h5 className="fw-bold text-dark mt-3">Keranjang Masih Kosong</h5>
              <p className="text-muted">Yuk, mulai belanja sembako sekarang juga!</p>
              
              <Link href="/user/katalog">
                <button className="btn btn-success rounded-pill px-4 mt-2 fw-bold shadow-sm">
                  Ke Katalog Sembako
                </button>
              </Link>
            </div>
          ) : (
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                {cart.map((item, index) => (
                  <div key={item.id} className={`d-flex align-items-center gap-3 py-3 ${index !== cart.length - 1 ? 'border-bottom' : ''}`}>
                    <div className="bg-light rounded-3 d-flex justify-content-center align-items-center" style={{ width: '80px', height: '80px' }}>
                      {item.image ? (
                        <img 
                          src={`http://localhost:3100/image/${item.image}`} 
                          alt={item.nama_barang} 
                          style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                        />
                      ) : (
                        <span style={{ fontSize: '24px' }}>🛍️</span>
                      )}
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="fw-bold text-dark mb-1">{item.nama_barang}</h6>
                      <h6 className="fw-bolder text-success mb-2">Rp {item.harga.toLocaleString('id-ID')}</h6>
                      <div className="d-flex align-items-center gap-3">
                        <div className="d-flex align-items-center bg-light rounded-pill px-2 py-1 border">
                          <button 
                            className="btn btn-sm text-dark p-0 px-2 fw-bold" 
                            onClick={() => updateQty(item.id, -1)}
                            disabled={item.qty <= 1}
                          >
                            -
                          </button>
                          <span className="fw-bold px-2">{item.qty}</span>
                          <button 
                            className="btn btn-sm text-dark p-0 px-2 fw-bold" 
                            onClick={() => updateQty(item.id, 1)}
                            disabled={item.qty >= item.stok}
                          >
                            +
                          </button>
                        </div>
                        <span className="text-muted small">Sisa {item.stok}</span>
                      </div>
                    </div>
                    <div>
                      <h6 className="fw-bolder text-dark mb-3 text-end">
                        Rp {(item.harga * item.qty).toLocaleString('id-ID')}
                      </h6>
                      <div className="text-end">
                        <button className="btn btn-sm btn-light text-danger fw-bold rounded-pill px-3" onClick={() => removeItem(item.id)}>
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 position-sticky" style={{ top: '20px' }}>
            <div className="card-body p-4">
              <h5 className="fw-bold text-dark mb-4">Ringkasan Belanja</h5>
              
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted fw-medium">Total Harga ({cart.reduce((a, b) => a + b.qty, 0)} Barang)</span>
                <span className="fw-bold text-dark">Rp {totalBelanja.toLocaleString('id-ID')}</span>
              </div>
              <div className="d-flex justify-content-between mb-4 border-bottom pb-3">
                <span className="text-muted fw-medium">Diskon</span>
                <span className="fw-bold text-success">- Rp 0</span>
              </div>
              
              <div className="d-flex justify-content-between mb-4">
                <h5 className="fw-bold text-dark mb-0">Total Tagihan</h5>
                <h4 className="fw-bolder text-success mb-0">Rp {totalBelanja.toLocaleString('id-ID')}</h4>
              </div>

              <button 
                className="btn btn-success w-100 rounded-pill py-2 fw-bold shadow-sm"
                onClick={handleCheckout}
                disabled={cart.length === 0}
              >
                Beli Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

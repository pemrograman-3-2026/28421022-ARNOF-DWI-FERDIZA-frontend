'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
    setCart(savedCart ? JSON.parse(savedCart) : []);
    setIsLoaded(true);
  }, []);

  const updateQty = (id: number, delta: number) => {
    const newCart = cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, Math.min(item.qty + delta, item.stok));
        return { ...item, qty: newQty };
      }
      return item;
    });
    setCart(newCart);
    localStorage.setItem('sembako_cart', JSON.stringify(newCart));
  };

  const removeItem = (id: number) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    localStorage.setItem('sembako_cart', JSON.stringify(newCart));
  };

  if (!isLoaded) return null;

  const totalBelanja = cart.reduce((acc, item) => acc + (item.harga * item.qty), 0);

  return (
    <div className="container py-3">
      <h4 className="fw-bold mb-3">Keranjang Belanja</h4>

      {cart.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">Keranjang kosong</p>
          <Link href="/user/katalog" className="btn btn-primary rounded-2">Belanja Sekarang</Link>
        </div>
      ) : (
        <div className="row g-3">
          {/* List Produk */}
          <div className="col-12 col-lg-8">
            {cart.map((item) => (
              <div key={item.id} className="card p-2 mb-2 shadow-sm border-0 rounded-3">
                <div className="d-flex align-items-center">
                  <div style={{ width: '60px', height: '60px' }}>
                    <img src={`http://localhost:3100/image/${item.image}`} className="w-100 h-100" style={{ objectFit: 'contain' }} />
                  </div>
                  <div className="ms-3 flex-grow-1">
                    <div className="fw-bold" style={{ fontSize: '0.9rem' }}>{item.nama_barang}</div>
                    <div className="text-primary fw-bold" style={{ fontSize: '0.85rem' }}>Rp {item.harga.toLocaleString('id-ID')}</div>
                  </div>
                  <div className="d-flex align-items-center">
                    <button className="btn btn-sm btn-light" onClick={() => updateQty(item.id, -1)}>-</button>
                    <span className="px-2 fw-bold">{item.qty}</span>
                    <button className="btn btn-sm btn-light" onClick={() => updateQty(item.id, 1)}>+</button>
                  </div>
                  <button className="btn btn-sm text-danger ms-3" onClick={() => removeItem(item.id)}>Hapus</button>
                </div>
              </div>
            ))}
          </div>

          {/* Ringkasan */}
          <div className="col-12 col-lg-4">
            <div className="card p-3 shadow-sm border-0 rounded-3">
              <h6 className="fw-bold mb-3">Ringkasan</h6>
              <div className="d-flex justify-content-between mb-3">
                <span>Total</span>
                <span className="fw-bold">Rp {totalBelanja.toLocaleString('id-ID')}</span>
              </div>
              <button 
                className="btn btn-primary w-100 fw-bold rounded-2" 
                onClick={() => router.push('/user/keranjang/payment')}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
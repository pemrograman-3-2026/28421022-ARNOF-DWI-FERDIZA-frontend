'use client';
import { api } from '@/lib/axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface IBarang {
  id: number;
  nama_barang: string;
  harga: number;
  stok: number;
  image?: string;
  kategori?: {
    id: number;
    nama_kategori: string;
  };
}

export default function UserDashboard() {
  const [products, setProducts] = useState<IBarang[]>([]);
  const router = useRouter();

  const handleAddToCart = (product: IBarang, redirect: boolean = true) => {
    const savedCart = localStorage.getItem('sembako_cart');
    let cart = savedCart ? JSON.parse(savedCart) : [];

    const existingIndex = cart.findIndex((item: any) => item.id === product.id);
    if (existingIndex >= 0) {
      if (cart[existingIndex].qty < product.stok) {
        cart[existingIndex].qty += 1;
      }
    } else {
      cart.push({ ...product, qty: 1 });
    }

    localStorage.setItem('sembako_cart', JSON.stringify(cart));
    if (redirect) {
      router.push('/user/keranjang');
    } else {
      try {
        const { showToast } = require('@/Components/toast/toast');
        showToast(`${product.nama_barang} ditambahkan ke keranjang`, 'success');
      } catch (e) {
        alert(`${product.nama_barang} ditambahkan ke keranjang`);
      }
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get<any>('/barang');
        if (res.data.data) {
          const sorted = res.data.data.sort((a: IBarang, b: IBarang) => b.id - a.id);
          setProducts(sorted);
        } else if (Array.isArray(res.data)) {
          const sorted = res.data.sort((a: IBarang, b: IBarang) => b.id - a.id);
          setProducts(sorted);
        }
      } catch (error) {
        console.error('Failed to fetch products', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="container-fluid py-4" style={{ fontFamily: "'Inter', sans-serif" }}>

      <div className="row mb-4">
        <div className="col-12">
          <div className="p-5 rounded-4 shadow-sm text-white position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            <div className="position-relative" style={{ zIndex: 1 }}>
              <Link href="/user/dashboard/promo" className="text-decoration-none d-inline-block mb-3">
                <span
                  className="badge bg-white text-success px-3 py-2 rounded-pill fw-bold shadow-sm"
                  style={{ transition: 'all 0.2s', cursor: 'pointer' }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  Promo Jumat Berkat Sembako &rarr;
                </span>
              </Link>
              <h1 className="fw-bolder display-5 mb-3" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>Sembako Lengkap, Pengiriman Kilat!</h1>
              <p className="lead mb-4 fw-medium" style={{ maxWidth: '600px', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                Temukan beras premium, telur segar, minyak goreng jernih, dan aneka bumbu pokok dengan harga grosir langsung di genggaman Anda.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link href="/user/katalog">
                  <button
                    className="btn btn-light btn-lg px-4 fw-bold text-success shadow rounded-pill"
                    style={{ transition: 'all 0.3s' }}
                    onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    Mulai Belanja Sembako
                  </button>
                </Link>
                <Link href="/user/dashboard/promo/klaim">
                  <button
                    className="btn btn-outline-light btn-lg px-4 fw-bold shadow-sm rounded-pill"
                    style={{ transition: 'all 0.3s' }}
                    onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    Klaim promo anda disini
                  </button>
                </Link>
              </div>
            </div>
            <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '300px', height: '300px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
            <div style={{ position: 'absolute', bottom: '-50px', right: '150px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden" style={{ background: 'linear-gradient(135deg, #ef4444, #b91c1c)' }}>
            <div className="card-body p-4 text-white d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0">⚡ Flash Sale</h5>
                  <span className="badge bg-white text-danger fw-bold rounded-pill px-3 py-2">Diskon s/d 40%</span>
                </div>
                <p className="mb-4 text-white-50 fw-medium">Beras Merah Premium & Telur Gurih Organik pilihan terbaik.</p>
              </div>
              <Link href="/user/dashboard/promo" style={{ textDecoration: 'none' }}>
                <div className="bg-white bg-opacity-25 rounded-4 p-3 text-center" style={{ backdropFilter: 'blur(10px)' }}>
                  <span className="fw-bolder fs-5 text-white">Lihat Semua Promo &rarr;</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 h-100" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
            <div className="card-body p-4 text-white d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm" style={{ width: '45px', height: '45px', fontSize: '20px' }}>
                    ⭐
                  </div>
                  <h5 className="fw-bold mb-0">Poin SembakoKlub</h5>
                </div>
                <h2 className="fw-bolder mb-2 display-6">12.540 pts</h2>
                <p className="mb-4 text-white-50 fw-medium">Dapatkan 500 poin lagi untuk voucher Rp 10rb !</p>
              </div>
              <div className="d-flex gap-2 mt-auto">
                <button className="btn btn-light text-primary rounded-pill fw-bold px-4 shadow-sm w-50">Tukarkan Poin</button>
                <button className="btn btn-outline-light rounded-pill fw-bold px-4 w-50">Info Poin</button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
            <div className="card-body p-4 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold text-dark mb-0">Pesanan Aktif</h5>
                  <span className="badge bg-warning bg-opacity-25 text-warning-emphasis border border-warning rounded-pill fw-bold px-3 py-2">1 Pengiriman</span>
                </div>
                <div className="d-flex align-items-center mb-4 p-3 bg-light rounded-4">
                  <div className="bg-white rounded-circle p-3 me-3 text-center shadow-sm d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px', fontSize: '24px' }}>
                    🚚
                  </div>
                  <div>
                    <p className="mb-1 text-muted small fw-bold text-uppercase">Status</p>
                    <p className="mb-0 fw-bold text-dark" style={{ lineHeight: '1.4' }}>Kurir SembakoKita sedang menuju ke lokasi Anda.</p>
                  </div>
                </div>
              </div>
              <button className="btn btn-outline-primary w-100 rounded-pill fw-bold py-2 mt-auto">Lacak Pengiriman Sembako →</button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <h4 className="fw-bold text-dark mb-1">Kupon Voucher Spesial</h4>
            <p className="text-muted small mb-0 fw-medium">Klik untuk salin kode dan nikmati potongannya.</p>
          </div>
          <Link href="/user/dashboard/promo" className="btn btn-outline-success btn-sm rounded-pill px-3 fw-bold shadow-sm">
            Lihat Semua
          </Link>
        </div>
        <div className="row g-4">


          <div className="col-md-4">
            <div
              className="card border-0 shadow-sm rounded-4 overflow-hidden"
              style={{ cursor: 'pointer', transition: 'all 0.3s', borderLeft: '6px solid #f97316' }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.classList.add('shadow-lg'); }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.classList.remove('shadow-lg'); }}
            >
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h2 className="fw-bolder text-orange mb-0" style={{ color: '#f97316' }}>10%</h2>
                  <span className="badge bg-orange bg-opacity-10 text-orange rounded-pill" style={{ color: '#f97316', backgroundColor: '#fff7ed' }}>Berlaku Hari Ini</span>
                </div>
                <h6 className="fw-bold text-dark mb-2">Voucher Sembako Murah</h6>
                <p className="text-muted small mb-4" style={{ minHeight: '40px' }}>Potongan harga 10% untuk semua jenis pesanan sembako!</p>
                <div className="bg-light border border-dashed border-2 rounded-3 p-2 text-center" style={{ borderColor: '#fdba74' }}>
                  <span className="fw-bold text-dark font-monospace" style={{ letterSpacing: '2px' }}>SEMBAKOMURAH</span>
                </div>
              </div>
            </div>
          </div>


          <div className="col-md-4">
            <div
              className="card border-0 shadow-sm rounded-4 overflow-hidden"
              style={{ cursor: 'pointer', transition: 'all 0.3s', borderLeft: '6px solid #14b8a6' }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.classList.add('shadow-lg'); }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.classList.remove('shadow-lg'); }}
            >
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h2 className="fw-bolder text-teal mb-0" style={{ color: '#14b8a6' }}>5%</h2>
                  <span className="badge bg-teal bg-opacity-10 text-teal rounded-pill" style={{ color: '#14b8a6', backgroundColor: '#f0fdfa' }}>Berlaku Hari Ini</span>
                </div>
                <h6 className="fw-bold text-dark mb-2">Diskon Berkah Jumat</h6>
                <p className="text-muted small mb-4" style={{ minHeight: '40px' }}>Khusus hari berkah, dapatkan potongan 5% tanpa batas minimum pembelanjaan.</p>
                <div className="bg-light border border-dashed border-2 rounded-3 p-2 text-center" style={{ borderColor: '#5eead4' }}>
                  <span className="fw-bold text-dark font-monospace" style={{ letterSpacing: '2px' }}>BERKAHJUMAT</span>
                </div>
              </div>
            </div>
          </div>


          <div className="col-md-4">
            <div
              className="card border-0 shadow-sm rounded-4 overflow-hidden"
              style={{ cursor: 'pointer', transition: 'all 0.3s', borderLeft: '6px solid #8b5cf6' }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.classList.add('shadow-lg'); }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.classList.remove('shadow-lg'); }}
            >
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h2 className="fw-bolder text-purple mb-0" style={{ color: '#8b5cf6' }}>15%</h2>
                  <span className="badge bg-purple bg-opacity-10 text-purple rounded-pill" style={{ color: '#8b5cf6', backgroundColor: '#f5f3ff' }}>Berlaku Hari Ini</span>
                </div>
                <h6 className="fw-bold text-dark mb-2">Voucher Pelanggan Baru</h6>
                <p className="text-muted small mb-4" style={{ minHeight: '40px' }}>Potongan harga super hemat sebesar 15% untuk transaksi pertamamu.</p>
                <div className="bg-light border border-dashed border-2 rounded-3 p-2 text-center" style={{ borderColor: '#c4b5fd' }}>
                  <span className="fw-bold text-dark font-monospace" style={{ letterSpacing: '2px' }}>BARUMENANG</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold text-dark mb-0">Katalog Produk</h4>
          <Link href="/user/katalog">
            <button className="btn btn-light text-success fw-bold rounded-pill px-4 shadow-sm border">Lihat Semua</button>
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-4 shadow-sm">
            <div className="spinner-border text-success mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted fw-medium mb-0">Memuat katalog produk...</p>
          </div>
        ) : (
          <div className="row g-2 g-md-4">
            {products.slice(0, 8).map((product) => (
              <div key={product.id} className="col-6 col-sm-4 col-md-3 col-lg-2 mb-2">
                <div
                  className="card h-100 border rounded-3 bg-white"
                  style={{ borderColor: '#e0e0e0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', transition: 'all 0.3s' }}
                  onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)'; }}
                  onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)'; }}
                >
                  <div className="position-relative p-2 text-center bg-white rounded-top-3" style={{ aspectRatio: '1/1' }}>
                    {product.image ? (
                      <img
                        src={`http://localhost:3100/image/${product.image}`}
                        alt={product.nama_barang}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    ) : (
                      <div className="d-flex align-items-center justify-content-center w-100 h-100 text-muted">
                        <span style={{ fontSize: '3rem' }}>🛍️</span>
                      </div>
                    )}
                    {product.stok === 0 && (
                      <span className="badge bg-danger position-absolute top-0 start-0 m-2 rounded-2 px-2 py-1 shadow-sm fw-bold" style={{ fontSize: '0.65rem' }}>Habis</span>
                    )}
                  </div>

                  <div className="bg-danger text-white text-center py-1 mx-auto" style={{ width: '90%', borderRadius: '12px', fontSize: '0.6rem', fontWeight: 'bold', marginTop: '-12px', zIndex: 2, position: 'relative', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingLeft: '4px', paddingRight: '4px' }}>
                    {product.kategori?.nama_kategori || 'Sembako'}
                  </div>

                  <div className="card-body p-2 d-flex flex-column mt-1">
                    <h6 className="card-title text-dark mb-1" style={{ fontSize: '0.8rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.3' }}>
                      {product.nama_barang}
                    </h6>

                    <div className="fw-bold text-dark mb-1" style={{ fontSize: '1rem' }}>
                      Rp {product.harga.toLocaleString('id-ID')}
                    </div>

                    <div className="d-flex align-items-center flex-wrap gap-1 mb-2">
                      <span className="bg-danger text-white fw-bold px-1 rounded" style={{ fontSize: '0.55rem' }}>
                        15%
                      </span>
                      <span className="text-muted text-decoration-line-through" style={{ fontSize: '0.65rem' }}>
                        Rp {Math.round(product.harga * 1.15).toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="mb-2 d-flex align-items-center gap-1">
                      <span style={{ color: '#eab308', fontSize: '0.7rem' }}>⚡</span>
                      <span className="text-danger fw-bold" style={{ fontSize: '0.6rem' }}>Pengiriman Instan</span>
                    </div>

                    <div className="mt-auto">
                      <button
                        className="btn w-100 rounded-2 fw-bold text-white shadow-sm"
                        style={{ backgroundColor: '#0057b8', borderColor: '#0057b8', fontSize: '0.75rem', padding: '0.3rem' }}
                        onClick={() => handleAddToCart(product, false)}
                        disabled={product.stok === 0}
                      >
                        {product.stok === 0 ? 'Habis' : '+ Keranjang'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

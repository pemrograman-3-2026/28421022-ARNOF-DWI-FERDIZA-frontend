'use client';
import { api } from '@/lib/axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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

const CATEGORIES = [
  "Semua Barang Sembako",
  "Beras & Biji-bijian",
  "Minyak & Mentega",
  "Gula, Garam & Bumbu",
  "Susu, Telur & Protein",
  "Makanan Instan",
  "Minuman & Teh"
];

export default function KatalogPage() {
  const [products, setProducts] = useState<IBarang[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState("Semua Barang Sembako");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const handleAddToCart = (product: IBarang) => {
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
    router.push('/user/keranjang');
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get<any>('/barang');
        if (res.data.data) {
          setProducts(res.data.data);
        } else if (Array.isArray(res.data)) {
          setProducts(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nama_barang.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesCategory = true;
    if (activeCategory !== "Semua Barang Sembako") {
      const productCat = product.kategori?.nama_kategori?.toLowerCase() || '';
      const selectedCat = activeCategory.toLowerCase();
      matchesCategory = productCat === selectedCat || selectedCat.includes(productCat) || productCat.includes(selectedCat.split(' ')[0]);
    }

    return matchesSearch && matchesCategory;
  });

  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCategory]);

  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  return (
    <div className="container-fluid py-4" style={{ fontFamily: "'Inter', sans-serif" }}>

      <div className="row mb-4">
        <div className="col-12">
          <div className="bg-white p-4 rounded-4 shadow-sm d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <h3 className="fw-bolder text-dark mb-0">Katalog Sembako</h3>
            <div className="position-relative" style={{ width: '100%', maxWidth: '450px' }}>
              <span className="position-absolute top-50 start-0 translate-middle-y ms-3 fs-5">🔍</span>
              <input
                type="text"
                className="form-control form-control-lg bg-light border-0 ps-5 rounded-pill shadow-none"
                placeholder="Cari kebutuhan pokok..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex gap-2 overflow-auto pb-2 category-scroll" style={{ scrollbarWidth: 'none' }}>
            {CATEGORIES.map((category, index) => (
              <button
                key={index}
                onClick={() => setActiveCategory(category)}
                className={`btn rounded-pill px-4 py-2 fw-semibold text-nowrap transition-all shadow-sm ${activeCategory === category
                    ? 'btn-success text-white'
                    : 'bg-white text-secondary border-0 hover-bg-light'
                  }`}
                style={{
                  transition: 'all 0.2s',
                  transform: activeCategory === category ? 'scale(1.02)' : 'scale(1)'
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="row g-4">
        {loading ? (
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-success mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted fw-medium mb-0">Memuat katalog sembako...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="col-12 text-center py-5 bg-white rounded-4 shadow-sm">
            <div style={{ fontSize: '60px' }}>🛒</div>
            <h5 className="fw-bold text-dark mt-3">Produk Tidak Ditemukan</h5>
            <p className="text-muted">Coba cari dengan kata kunci lain atau pilih kategori yang berbeda.</p>
            <button
              className="btn btn-outline-success rounded-pill px-4 mt-2 fw-bold"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('Semua Barang Sembako');
              }}
            >
              Reset Pencarian
            </button>
          </div>
        ) : (
          currentProducts.map((product) => (
            <div key={product.id} className="col-6 col-md-4 col-lg-4">
              <div
                className="card h-100 border-0 shadow-sm rounded-4 bg-white p-3 product-card"
                style={{ transition: 'all 0.3s' }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.classList.add('shadow'); }}
                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.classList.remove('shadow'); }}
              >



                <div className="position-relative bg-light rounded-4 d-flex justify-content-center align-items-center mb-3" style={{ height: '160px' }}>
                  {product.image ? (
                    <img
                      src={`http://localhost:3100/image/${product.image}`}
                      alt={product.nama_barang}
                      style={{ width: '140px', height: '140px', objectFit: 'contain' }}
                    />
                  ) : (
                    <div className="d-flex flex-column align-items-center justify-content-center text-muted" style={{ width: '140px', height: '140px' }}>
                      <span style={{ fontSize: '40px' }}>🛍️</span>
                    </div>
                  )}
                  {product.stok === 0 && (
                    <span className="badge bg-danger position-absolute top-0 start-0 m-3 rounded-pill px-3 py-2 shadow-sm fw-bold">Habis</span>
                  )}
                </div>


                <div className="d-flex flex-column flex-grow-1">
                  <p className="text-muted text-uppercase mb-1" style={{ fontSize: '10px', letterSpacing: '0.5px', fontWeight: '700' }}>
                    {product.kategori?.nama_kategori || 'Tanpa Kategori'}
                  </p>
                  <h6 className="fw-bold text-dark mb-1" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.4', fontSize: '15px' }}>
                    {product.nama_barang}
                  </h6>
                  <p className="text-secondary mb-3" style={{ fontSize: '12px', fontWeight: '500' }}>
                    Pcs • Sedia {product.stok}
                  </p>


                  <div className="mt-auto d-flex justify-content-between align-items-center pt-2">
                    <span className="fw-bolder text-success font-monospace" style={{ fontSize: '16px' }}>
                      Rp {product.harga.toLocaleString('id-ID')}
                    </span>
                    <button
                      className={`btn ${product.stok === 0 ? 'btn-light text-muted' : 'btn-success'} btn-sm rounded-pill fw-bold px-3 shadow-sm`}
                      disabled={product.stok === 0}
                      onClick={() => handleAddToCart(product)}
                    >
                      {product.stok === 0 ? 'Habis' : '+ Beli'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {!loading && filteredProducts.length > 0 && (
        <div className="d-flex justify-content-center mt-5 mb-2">
          <nav aria-label="Page navigation">
            <ul className="pagination pagination-md shadow-sm rounded-pill overflow-hidden bg-white mb-0">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link text-success fw-bold border-0 border-end" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
                  &laquo; Prev
                </button>
              </li>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let startPage = Math.max(1, currentPage - 2);
                let endPage = Math.min(totalPages, startPage + 4);
                if (endPage - startPage < 4) {
                  startPage = Math.max(1, endPage - 4);
                }
                const p = startPage + i;
                if (p > totalPages) return null;

                return (
                  <li key={p} className={`page-item ${currentPage === p ? 'active' : ''}`}>
                    <button className={`page-link fw-bold border-0 border-end ${currentPage === p ? 'bg-success text-white' : 'text-success'}`} onClick={() => setCurrentPage(p)}>
                      {p}
                    </button>
                  </li>
                );
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <li className="page-item disabled"><span className="page-link text-success fw-bold border-0 border-end bg-light">...</span></li>
                  <li className="page-item">
                    <button className="page-link text-success fw-bold border-0 border-end" onClick={() => setCurrentPage(totalPages)}>{totalPages}</button>
                  </li>
                </>
              )}

              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button className="page-link text-success fw-bold border-0" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>
                  Next &raquo;
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}


      <style jsx>{`
        .category-scroll::-webkit-scrollbar {
          display: none;
        }
        .hover-bg-light:hover {
          background-color: #f8f9fa !important;
        }
      `}</style>
    </div>
  );
}

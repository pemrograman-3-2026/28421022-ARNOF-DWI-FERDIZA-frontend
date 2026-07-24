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
  "Alat mandi & Sabun",
  "Kebutuhan Anak",
  "Kebutuhan Pokok"
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
    try {
      const { showToast } = require('@/Components/toast/toast');
      showToast(`${product.nama_barang} ditambahkan ke keranjang`, 'success');
    } catch (e) {
      alert(`${product.nama_barang} ditambahkan ke keranjang`);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get<any>('/barang');
        setProducts(res.data.data || res.data || []);
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
    let matchesCategory = activeCategory === "Semua Barang Sembako" || 
                          (product.kategori?.nama_kategori || '').toLowerCase().includes(activeCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const itemsPerPage = 10;
  const currentProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="container py-3" style={{ fontFamily: "'Inter', sans-serif", backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      
      {/* Search Bar */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control form-control-lg border-0 shadow-sm"
          placeholder="Cari barang..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Grid Produk */}
      <div className="row g-2">
        {loading ? (
          <div className="col-12 text-center py-5">Memuat data...</div>
        ) : currentProducts.length === 0 ? (
          <div className="col-12 text-center py-5">Produk tidak ditemukan.</div>
        ) : (
          currentProducts.map((product) => (
            <div key={product.id} className="col-6 col-md-4 col-lg-3">
              <div className="card h-100 p-2 border-0 shadow-sm rounded-3">
                {/* Image Area */}
                <div className="position-relative bg-light rounded-2 mb-2" style={{ aspectRatio: '1/1', overflow: 'hidden' }}>
                  <img
                    src={product.image ? `http://localhost:3100/image/${product.image}` : '/placeholder.png'}
                    alt={product.nama_barang}
                    className="w-100 h-100"
                    style={{ objectFit: 'contain' }}
                  />
                </div>

                {/* Info */}
                <div className="d-flex flex-column flex-grow-1 px-1">
                  <h6 className="fw-bold mb-1" style={{ fontSize: '0.85rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product.nama_barang}
                  </h6>
                  <p className="text-primary fw-bolder mb-2" style={{ fontSize: '0.95rem' }}>
                    Rp {product.harga.toLocaleString('id-ID')}
                  </p>
                  
                  {/* Action Button */}
                  <div className="mt-auto">
                    <button
                      className="btn btn-primary w-100 fw-bold rounded-2 py-2"
                      style={{ fontSize: '0.8rem' }}
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stok === 0}
                    >
                      + Keranjang
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
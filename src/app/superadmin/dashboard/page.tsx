'use client';
import { Users, Store, Activity, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function SuperAdminDashboard() {
  return (
    <div className="container-fluid py-3">
      <h4 className="fw-bold mb-4">Dashboard Super Admin</h4>
      
      <div className="row g-4 mb-4">
        {/* Card 1 */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-body p-4 d-flex align-items-center">
              <div className="bg-primary bg-opacity-10 text-primary rounded-circle p-3 me-3">
                <Store size={24} />
              </div>
              <div>
                <h6 className="text-muted small fw-semibold mb-1">Total Toko Aktif</h6>
                <h3 className="fw-bold mb-0">12</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-body p-4 d-flex align-items-center">
              <div className="bg-success bg-opacity-10 text-success rounded-circle p-3 me-3">
                <Users size={24} />
              </div>
              <div>
                <h6 className="text-muted small fw-semibold mb-1">Total Admin</h6>
                <h3 className="fw-bold mb-0">15</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-body p-4 d-flex align-items-center">
              <div className="bg-warning bg-opacity-10 text-warning rounded-circle p-3 me-3">
                <Activity size={24} />
              </div>
              <div>
                <h6 className="text-muted small fw-semibold mb-1">Total Transaksi Global</h6>
                <h3 className="fw-bold mb-0">342</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-body p-4 d-flex align-items-center">
              <div className="bg-info bg-opacity-10 text-info rounded-circle p-3 me-3">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h6 className="text-muted small fw-semibold mb-1">Status Server</h6>
                <h3 className="fw-bold mb-0 text-success">Online</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-12">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
              <h5 className="fw-semibold mb-0">Monitoring Toko (Admin)</h5>
              <Link href="/superadmin/kelola-admin">
                <button className="btn btn-sm btn-outline-primary">Lihat Semua</button>
              </Link>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="px-4 py-3">Nama Toko / Admin</th>
                      <th className="py-3">Status</th>
                      <th className="py-3">Total Produk</th>
                      <th className="py-3">Bergabung Sejak</th>
                      <th className="px-4 py-3 text-end">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-3">
                        <div className="d-flex align-items-center">
                          <div className="bg-secondary bg-opacity-10 rounded p-2 me-3">
                            <Store size={20} className="text-secondary" />
                          </div>
                          <div>
                            <div className="fw-semibold">Toko Sembako Pusat</div>
                            <div className="text-muted small">adminpusat</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3"><span className="badge bg-success rounded-pill px-3">Aktif</span></td>
                      <td className="py-3">45 Item</td>
                      <td className="py-3">10 Jan 2026</td>
                      <td className="px-4 py-3 text-end">
                        <Link href="/superadmin/kelola-admin">
                          <button className="btn btn-sm btn-light border text-primary">Kelola</button>
                        </Link>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">
                        <div className="d-flex align-items-center">
                          <div className="bg-secondary bg-opacity-10 rounded p-2 me-3">
                            <Store size={20} className="text-secondary" />
                          </div>
                          <div>
                            <div className="fw-semibold">Toko Cabang Bintaro</div>
                            <div className="text-muted small">admin_bintaro</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3"><span className="badge bg-success rounded-pill px-3">Aktif</span></td>
                      <td className="py-3">12 Item</td>
                      <td className="py-3">15 Mei 2026</td>
                      <td className="px-4 py-3 text-end">
                        <button className="btn btn-sm btn-light border text-primary">Kelola</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

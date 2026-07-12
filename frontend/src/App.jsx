import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Komponen penting yang di-load sinkronous
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';

// Komponen berat / modul di-load secara async (Lazy Loading) untuk performa
const Dashboard = lazy(() => import('./pages/Dashboard'));
const DataBarang = lazy(() => import('./pages/Barang/DataBarang'));
const FormBarang = lazy(() => import('./pages/Barang/FormBarang'));
const ManajemenStok = lazy(() => import('./pages/Stok/ManajemenStok'));
const POS = lazy(() => import('./pages/Kasir/POS'));
const LaporanDashboard = lazy(() => import('./pages/Laporan/LaporanDashboard'));
const DataKaryawan = lazy(() => import('./pages/Karyawan/DataKaryawan'));
const FormKaryawan = lazy(() => import('./pages/Karyawan/FormKaryawan'));
const AbsensiDashboard = lazy(() => import('./pages/Absensi/AbsensiDashboard'));
const PenggajianDashboard = lazy(() => import('./pages/Karyawan/PenggajianDashboard'));

const NotFound = () => <div className="p-8"><h1 className="text-4xl text-[var(--danger)] font-bold">404 - Not Found</h1></div>;

// Fallback loader saat modul sedang diunduh
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)]">
    <div className="font-mono text-sm font-bold animate-pulse text-[var(--ink)]">Memuat Modul...</div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[var(--bg-base)] font-sans text-[var(--ink)]">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={<LandingPage />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />

            <Route path="/barang" element={
              <ProtectedRoute>
                <DataBarang />
              </ProtectedRoute>
            } />

            <Route path="/barang/tambah" element={
              <ProtectedRoute>
                <FormBarang />
              </ProtectedRoute>
            } />

            <Route path="/barang/edit/:id" element={
              <ProtectedRoute>
                <FormBarang />
              </ProtectedRoute>
            } />

            <Route path="/stok" element={
              <ProtectedRoute>
                <ManajemenStok />
              </ProtectedRoute>
            } />

            <Route path="/kasir" element={
              <ProtectedRoute>
                <POS />
              </ProtectedRoute>
            } />

            <Route path="/laporan" element={
              <ProtectedRoute>
                <LaporanDashboard />
              </ProtectedRoute>
            } />

            <Route path="/karyawan" element={
              <ProtectedRoute>
                <DataKaryawan />
              </ProtectedRoute>
            } />

            <Route path="/karyawan/tambah" element={
              <ProtectedRoute>
                <FormKaryawan />
              </ProtectedRoute>
            } />

            <Route path="/karyawan/edit/:id" element={
              <ProtectedRoute>
                <FormKaryawan />
              </ProtectedRoute>
            } />

            <Route path="/absensi" element={
              <ProtectedRoute>
                <AbsensiDashboard />
              </ProtectedRoute>
            } />

            <Route path="/penggajian" element={
              <ProtectedRoute>
                <PenggajianDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;

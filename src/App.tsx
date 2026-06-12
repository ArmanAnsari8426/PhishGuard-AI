import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ScanPage from './pages/ScanPage';
import ScanResultPage from './pages/ScanResultPage';
import HistoryPage from './pages/HistoryPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import PasswordCheckerPage from './pages/PasswordCheckerPage';
import QRScannerPage from './pages/QRScannerPage';
import BulkScannerPage from './pages/BulkScannerPage';
import DomainMonitorPage from './pages/DomainMonitorPage';
import AboutPage from './pages/AboutPage';
import APIDocsPage from './pages/APIDocsPage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import GDPRPage from './pages/GDPRPage';
import { isAuthenticated, isAdmin } from './utils/auth';

function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  if (requireAdmin && !isAdmin()) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/scan/:id" element={<ScanResultPage />} />
            <Route path="/password-checker" element={<PasswordCheckerPage />} />
            <Route path="/qr-scanner" element={<QRScannerPage />} />
            <Route path="/bulk-scanner" element={<BulkScannerPage />} />
            <Route path="/domain-monitor" element={<DomainMonitorPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/api-docs" element={<APIDocsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blog" element={<BlogPage />} />

            {/* Legal Pages */}
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/cookie-policy" element={<CookiePolicyPage />} />
            <Route path="/gdpr" element={<GDPRPage />} />

            {/* Protected Pages */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminPage /></ProtectedRoute>} />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DonorDashboard } from './pages/DonorDashboard';
import { MakeDonationPage } from './pages/MakeDonationPage';
import { MyDonationsPage } from './pages/MyDonationsPage';
import { NGODashboard } from './pages/NGODashboard';
import { NGONeedsPage } from './pages/NGONeedsPage';
import { SupplierMarketplacePage } from './pages/SupplierMarketplacePage';
import { ProcurementOrdersPage } from './pages/ProcurementOrdersPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';
import { AccessDeniedPage } from './pages/AccessDeniedPage';
import { Module1PlatformEngineering } from './pages/Module1PlatformEngineering';
import { Module2BigDataML } from './pages/Module2BigDataML';
import { Module3GenAIRAG } from './pages/Module3GenAIRAG';
import { Module4CloudSecurity } from './pages/Module4CloudSecurity';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const { currentRole } = useAuth();

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;
      case 'login':
        return <LoginPage onNavigate={handleNavigate} />;
      case 'donor-dashboard':
        return <DonorDashboard onNavigate={handleNavigate} />;
      case 'make-donation':
        return <MakeDonationPage onNavigate={handleNavigate} />;
      case 'my-donations':
        return <MyDonationsPage />;
      case 'ngo-dashboard':
        return <NGODashboard onNavigate={handleNavigate} />;
      case 'ngo-needs':
        return <NGONeedsPage onNavigate={handleNavigate} />;
      case 'supplier-marketplace':
        return <SupplierMarketplacePage onNavigate={handleNavigate} />;
      case 'procurement-orders':
        return <ProcurementOrdersPage />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'profile':
        return <ProfileSettingsPage />;
      case 'access-denied':
        return <AccessDeniedPage onNavigate={handleNavigate} />;
      case 'module1-platform':
        return <Module1PlatformEngineering />;
      case 'module2-bigdata':
        return <Module2BigDataML />;
      case 'module3-genai':
        return <Module3GenAIRAG />;
      case 'module4-security':
        return <Module4CloudSecurity />;
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  const isLandingPage = currentPage === 'landing';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-teal-500 selection:text-white">
      {/* Global Header */}
      <Header onNavigate={handleNavigate} currentPage={currentPage} />

      {/* Main Body */}
      {isLandingPage ? (
        <main className="flex-1">
          {renderPage()}
        </main>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <Sidebar
            currentPage={currentPage}
            onNavigate={handleNavigate}
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          />

          {/* Dynamic Content View */}
          <main className="flex-1 overflow-y-auto bg-slate-50">
            {renderPage()}
          </main>
        </div>
      )}
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;

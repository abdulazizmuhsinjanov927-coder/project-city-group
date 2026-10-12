/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrandingProvider } from './context/BrandingContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ActiveTab, Employee } from './types';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { LoginView } from './components/auth/LoginView';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { EmployeeList } from './components/employees/EmployeeList';
import { EmployeeModal } from './components/employees/EmployeeModal';
import { EmployeeDetailModal } from './components/employees/EmployeeDetailModal';
import { PayrollView } from './components/payroll/PayrollView';
import { PromotionsView } from './components/promotions/PromotionsView';
import { VacationsView } from './components/vacations/VacationsView';
import { BirthdaysView } from './components/birthdays/BirthdaysView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';

const MainApp: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Modals
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
  const [selectedEmployeeForDetail, setSelectedEmployeeForDetail] = useState<Employee | null>(null);

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setActiveTab('employees');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isAuthenticated) {
    return <LoginView />;
  }

  const handleOpenNewEmployee = () => {
    setEmployeeToEdit(null);
    setIsEmployeeModalOpen(true);
  };

  const handleEditEmployee = (emp: Employee) => {
    setEmployeeToEdit(emp);
    setIsEmployeeModalOpen(true);
  };

  const handleSelectEmployee = (emp: Employee) => {
    setSelectedEmployeeForDetail(emp);
  };

  return (
    <div className="min-h-screen bg-[#060B18] text-slate-100 flex flex-col antialiased">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'
        }`}
      >
        {/* Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
        />

        {/* View Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardOverview
              setActiveTab={setActiveTab}
              onOpenNewEmployee={handleOpenNewEmployee}
              onSelectEmployee={handleSelectEmployee}
            />
          )}

          {activeTab === 'employees' && (
            <EmployeeList
              onOpenNewEmployee={handleOpenNewEmployee}
              onEditEmployee={handleEditEmployee}
              onSelectEmployee={handleSelectEmployee}
            />
          )}

          {activeTab === 'payroll' && <PayrollView />}

          {activeTab === 'promotions' && <PromotionsView />}

          {activeTab === 'vacations' && <VacationsView />}

          {activeTab === 'birthdays' && <BirthdaysView />}

          {activeTab === 'reports' && <ReportsView />}

          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Employee Create / Edit Modal */}
      <EmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={() => {
          setIsEmployeeModalOpen(false);
          setEmployeeToEdit(null);
        }}
        employeeToEdit={employeeToEdit}
      />

      {/* Employee Detail Modal */}
      <EmployeeDetailModal
        employee={selectedEmployeeForDetail}
        onClose={() => setSelectedEmployeeForDetail(null)}
        onEdit={(emp) => {
          setSelectedEmployeeForDetail(null);
          handleEditEmployee(emp);
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <BrandingProvider>
      <AuthProvider>
        <DataProvider>
          <MainApp />
        </DataProvider>
      </AuthProvider>
    </BrandingProvider>
  );
}

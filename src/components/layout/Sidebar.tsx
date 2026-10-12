import React from 'react';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  TrendingUp,
  CalendarCheck,
  Cake,
  FileSpreadsheet,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { ActiveTab } from '../../types';
import { Logo } from '../common/Logo';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const { currentUser, logout } = useAuth();
  const { vacationRecords, employees } = useData();

  // Calculate upcoming birthdays count in next 30 days
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  const upcomingBirthdaysCount = employees.filter((e) => {
    const [, m, d] = e.birthDate.split('-').map(Number);
    if (m === currentMonth && d >= currentDay && d <= currentDay + 30) return true;
    if (m === (currentMonth % 12) + 1 && d <= 15) return true;
    return false;
  }).length;

  const pendingVacationsCount = vacationRecords.filter(
    (v) => v.status === "Ko'rib chiqilmoqda"
  ).length;

  const menuItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Bosh sahifa',
      icon: LayoutDashboard,
    },
    {
      id: 'employees' as ActiveTab,
      label: 'Xodimlar ro‘yxati',
      icon: Users,
      badge: employees.length,
    },
    {
      id: 'payroll' as ActiveTab,
      label: 'Ish haqi & Mukofotlar',
      icon: CreditCard,
    },
    {
      id: 'promotions' as ActiveTab,
      label: 'Martaba tarixi',
      icon: TrendingUp,
    },
    {
      id: 'vacations' as ActiveTab,
      label: 'Ta’tillar jadvali',
      icon: CalendarCheck,
      badge: pendingVacationsCount > 0 ? pendingVacationsCount : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
    },
    {
      id: 'birthdays' as ActiveTab,
      label: 'Tug‘ilgan kunlar',
      icon: Cake,
      badge: upcomingBirthdaysCount > 0 ? upcomingBirthdaysCount : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/40',
    },
    {
      id: 'reports' as ActiveTab,
      label: 'Rasmiy hisobotlar',
      icon: FileSpreadsheet,
    },
    {
      id: 'settings' as ActiveTab,
      label: 'Sozlamalar & Brending',
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out border-r border-slate-800/80 bg-[#080E21]/95 backdrop-blur-xl ${
          isCollapsed ? 'w-20' : 'w-72'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand header */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-slate-800/80">
          <div className="flex items-center overflow-hidden">
            <Logo
              size={isCollapsed ? 'sm' : 'md'}
              variant={isCollapsed ? 'symbol' : 'full'}
            />
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title={isCollapsed ? "Kengaytirish" : "Kichraytirish"}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
            {!isCollapsed && "Asosiy boshqaruv"}
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
                title={item.label}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/15 via-blue-900/30 to-transparent text-amber-300 border border-amber-500/30 shadow-lg shadow-amber-500/5'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <div
                  className={`relative p-1.5 rounded-lg transition-colors ${
                    isActive
                      ? 'text-amber-400 bg-amber-400/10'
                      : 'text-slate-400 group-hover:text-amber-300 group-hover:bg-slate-800'
                  }`}
                >
                  <Icon size={18} />
                </div>
                {!isCollapsed && (
                  <span className="flex-1 text-left truncate tracking-wide">
                    {item.label}
                  </span>
                )}
                {!isCollapsed && item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 text-xs font-semibold rounded-full tabular-nums ${
                      item.badgeColor || 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* User Card & Logout */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/40">
          {currentUser && (
            <div className={`flex items-center gap-3 p-2 rounded-xl bg-slate-800/30 border border-slate-800 ${isCollapsed ? 'justify-center' : ''}`}>
              <img
                src={currentUser.avatar}
                alt={currentUser.fullName}
                className="w-9 h-9 rounded-full object-cover border border-amber-400/30"
              />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-200 truncate">
                    {currentUser.fullName}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] text-amber-400/80 truncate">
                    <ShieldCheck size={12} className="shrink-0" />
                    <span>{currentUser.role}</span>
                  </div>
                </div>
              )}
              {!isCollapsed && (
                <button
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  title="Tizimdan chiqish"
                >
                  <LogOut size={16} />
                </button>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  Printer,
  Calendar,
  Sparkles,
  UserCheck,
  ChevronDown,
} from 'lucide-react';
import { ActiveTab } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface HeaderProps {
  activeTab: ActiveTab;
  onOpenMobileSidebar: () => void;
  onQuickSearch?: (query: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onOpenMobileSidebar,
  setActiveTab,
}) => {
  const { currentUser, availableUsers, loginAs } = useAuth();
  const { employees, vacationRecords, bonusRecords } = useData();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const tabLabels: Record<ActiveTab, { title: string; category: string }> = {
    dashboard: { title: 'Bosh boshqaruv paneli', category: 'Umumiy tahlil' },
    employees: { title: 'Xodimlar ro‘yxati va profillari', category: 'Kadrlar tarkibi' },
    payroll: { title: 'Ish haqi va Mukofotlar jamg‘armasi', category: 'Moliyaviy hisob-kitob' },
    promotions: { title: 'Martaba va Lavozim ko‘tarilishi', category: 'Karyera dinamikasi' },
    vacations: { title: 'Mehnat ta’tillari grafigi', category: 'Dam olish va ta’tillar' },
    birthdays: { title: 'Tug‘ilgan kunlar taqvimi', category: 'Korporativ sanalar' },
    reports: { title: 'Rasmiy hujjatlar va hisobotlar', category: 'Analitika' },
    settings: { title: 'Tizim va Korporativ brending', category: 'Administrator' },
  };

  const currentTabInfo = tabLabels[activeTab] || { title: 'Bosh sahifa', category: 'PCG' };

  // Calculate notifications
  const pendingLeaves = vacationRecords.filter((v) => v.status === "Ko'rib chiqilmoqda");
  const recentBonuses = bonusRecords.slice(0, 3);

  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="sticky top-0 z-30 h-20 bg-[#070D1F]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 flex items-center justify-between gap-4">
      {/* Zone 1: Mobile toggle & Breadcrumb */}
      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white"
          aria-label="Menyu"
        >
          <Menu size={20} />
        </button>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-medium tracking-wide">
            <span>PROJECT CITY GROUP</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400 truncate">{currentTabInfo.category}</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold text-white truncate font-heading">
            {currentTabInfo.title}
          </h1>
        </div>
      </div>

      {/* Zone 2: Actions & Profile */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Quick Search shortcut that jumps to Employees tab */}
        <button
          onClick={() => setActiveTab('employees')}
          className="hidden md:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60 transition-colors text-xs"
        >
          <Search size={15} className="text-amber-400" />
          <span className="hidden lg:inline">Xodimlar bo‘yicha qidiruv...</span>
          <kbd className="hidden lg:inline px-1.5 py-0.5 text-[10px] bg-slate-900 border border-slate-700 rounded text-slate-400">
            Ctrl+K
          </kbd>
        </button>

        {/* Print Button */}
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 text-xs font-medium transition-colors"
          title="Sahifani chop etish"
        >
          <Printer size={15} className="text-slate-400" />
          <span className="hidden sm:inline">Chop etish</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
            title="Bildirishnomalar"
          >
            <Bell size={17} />
            {pendingLeaves.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0B132B] border border-amber-500/20 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-400" />
                  Bildirishnomalar
                </span>
                <span className="text-xs text-amber-400/80">
                  {pendingLeaves.length} ta tasdiq kutilmoqda
                </span>
              </div>

              <div className="py-2 space-y-2 max-h-80 overflow-y-auto">
                {pendingLeaves.length > 0 ? (
                  pendingLeaves.map((leave) => (
                    <div
                      key={leave.id}
                      onClick={() => {
                        setActiveTab('vacations');
                        setShowNotifications(false);
                      }}
                      className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-200">
                          {leave.employeeName}
                        </span>
                        <span className="text-amber-400 text-[11px]">Ta’til so‘rovi</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                        {leave.daysCount} kun ({leave.type})
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4">
                    Yangi ko‘rib chiqilmagan ta’tillar mavjud emas
                  </p>
                )}

                <div className="pt-2 border-t border-slate-800">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    So‘nggi mukofotlar
                  </p>
                  {recentBonuses.map((b) => (
                    <div key={b.id} className="text-xs text-slate-300 py-1 flex justify-between items-center">
                      <span className="truncate">{b.employeeName}</span>
                      <span className="text-amber-300 font-mono font-medium shrink-0 ml-2">
                        +{b.amount.toLocaleString('uz-UZ')} so‘m
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User profile & Role switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors"
          >
            <img
              src={currentUser?.avatar}
              alt={currentUser?.fullName}
              className="w-8 h-8 rounded-full object-cover border border-amber-400/40"
            />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-200 leading-tight">
                {currentUser?.fullName.split(' ')[0]}
              </p>
              <p className="text-[10px] text-amber-400 font-medium">
                {currentUser?.role}
              </p>
            </div>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0B132B] border border-slate-800 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="pb-3 border-b border-slate-800">
                <p className="text-xs font-bold text-white">{currentUser?.fullName}</p>
                <p className="text-[11px] text-slate-400">{currentUser?.email}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-semibold">
                  <UserCheck size={12} />
                  {currentUser?.role}
                </div>
              </div>

              <div className="py-2">
                <p className="text-[11px] text-slate-500 font-semibold tracking-wider uppercase px-2 py-1">
                  Profilni almashtirish (Demo)
                </p>
                {availableUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      loginAs(u);
                      setShowUserMenu(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-xl text-xs text-left transition-colors ${
                      u.id === currentUser?.id
                        ? 'bg-amber-500/20 text-amber-300 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <img
                      src={u.avatar}
                      alt={u.fullName}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{u.fullName}</p>
                      <p className="text-[10px] text-slate-400">{u.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

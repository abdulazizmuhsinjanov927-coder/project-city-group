import React from 'react';
import {
  Users,
  CreditCard,
  Calendar,
  Cake,
  TrendingUp,
  Building2,
  ArrowUpRight,
  Plus,
  Award,
  Sparkles,
  Shield,
  FileText,
} from 'lucide-react';
import { ActiveTab, Employee } from '../../types';
import { useData } from '../../context/DataContext';
import { useBranding } from '../../context/BrandingContext';
import { useAuth } from '../../context/AuthContext';
import { CORPORATE_HQ_IMAGE } from '../../data/initialData';
import { Logo } from '../common/Logo';

interface DashboardOverviewProps {
  setActiveTab: (tab: ActiveTab) => void;
  onOpenNewEmployee: () => void;
  onSelectEmployee: (emp: Employee) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  setActiveTab,
  onOpenNewEmployee,
  onSelectEmployee,
}) => {
  const { employees, salaryRecords, vacationRecords, bonusRecords, promotionRecords, departments } = useData();
  const { branding } = useBranding();
  const { currentUser } = useAuth();

  // Metrics
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.status === 'Faol').length;
  const onLeaveEmployees = employees.filter((e) => e.status === "Ta'tilda").length;
  const probationEmployees = employees.filter((e) => e.status === 'Sinov muddatida').length;

  const totalPayroll = salaryRecords.reduce((sum, r) => sum + r.netSalary, 0);
  const totalBonuses = bonusRecords.reduce((sum, b) => sum + b.amount, 0);
  const avgSalary = Math.round(
    employees.reduce((sum, e) => sum + e.salary, 0) / (totalEmployees || 1)
  );

  // Upcoming birthdays in next 30 days
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  const upcomingBirthdays = employees
    .filter((e) => {
      const [, m, d] = e.birthDate.split('-').map(Number);
      if (m === currentMonth && d >= currentDay) return true;
      if (m === (currentMonth % 12) + 1 && d <= 15) return true;
      return false;
    })
    .sort((a, b) => {
      const [, ma, da] = a.birthDate.split('-').map(Number);
      const [, mb, db] = b.birthDate.split('-').map(Number);
      return ma !== mb ? ma - mb : da - db;
    });

  // Department counts
  const departmentCounts = departments.map((dept) => {
    const count = employees.filter((e) => e.department === dept).length;
    return { name: dept, count };
  });

  return (
    <div className="space-y-8 pb-12">
      {/* 3D Glassmorphic Corporate Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-amber-500/20 shadow-2xl">
        {/* Architectural backdrop with gradient overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={CORPORATE_HQ_IMAGE}
            alt="PCG Headquarters"
            className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105 transform hover:scale-100 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070D1F] via-[#070D1F]/90 to-[#0F1E4A]/80" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="relative z-10 p-6 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wider uppercase">
              <Sparkles size={14} className="text-amber-400" />
              <span>{branding.companyName} Boshqaruv Markazi</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading tracking-tight leading-tight">
              Xush kelibsiz, <span className="gold-gradient-text">{currentUser?.fullName}</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Kompaniyaning markaziy kadrlar tizimi orqali barcha {totalEmployees} nafar mutaxassislar faoliyati,
              oylik maosh fondi, mehnat ta’tillari va korporativ o‘sish ko‘rsatkichlarini nazorat qiling.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenNewEmployee}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
              >
                <Plus size={16} strokeWidth={3} />
                <span>Yangi xodim qo‘shish</span>
              </button>

              <button
                onClick={() => setActiveTab('reports')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition-all hover:border-slate-500"
              >
                <FileText size={16} className="text-amber-400" />
                <span>Korporativ hisobot</span>
              </button>
            </div>
          </div>

          {/* 3D Glass Company Crest Badge */}
          <div className="hidden sm:flex flex-col items-center p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-amber-400/30 shadow-2xl backdrop-blur-md min-w-[240px]">
            <Logo size="lg" variant="symbol" />
            <span className="mt-3 text-sm font-bold text-white font-heading tracking-wider">
              {branding.companyName}
            </span>
            <span className="text-[11px] text-amber-300 font-medium">
              PCG Tower · Toshkent
            </span>
            <div className="mt-4 pt-3 border-t border-white/10 w-full flex justify-between text-xs text-slate-300">
              <span>Faol mutaxassislar:</span>
              <span className="font-bold text-amber-400 tabular-nums">{activeEmployees} ta</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3D-Inspired KPI Grid (Zero-pill discipline, tabular nums) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* KPI 1: Employees */}
        <div
          onClick={() => setActiveTab('employees')}
          className="glass-card rounded-2xl p-5 cursor-pointer group"
        >
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Jami xodimlar
            </span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform">
              <Users size={18} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-heading tabular-nums tracking-tight">
            {totalEmployees}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>{activeEmployees} faol</span>
            <span className="text-slate-600">·</span>
            <span>{probationEmployees} sinovda</span>
            <span className="text-slate-600">·</span>
            <span>{onLeaveEmployees} ta’tilda</span>
          </div>
        </div>

        {/* KPI 2: Monthly Payroll Fund */}
        <div
          onClick={() => setActiveTab('payroll')}
          className="glass-card rounded-2xl p-5 cursor-pointer group"
        >
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Oylik maosh fondi (Net)
            </span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform">
              <CreditCard size={18} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-300 font-heading tabular-nums tracking-tight">
            {(totalPayroll / 1000000).toFixed(1)} mln <span className="text-xs font-normal text-slate-400">so‘m</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>O‘rtacha:</span>
            <span className="font-mono text-slate-200 tabular-nums">
              {(avgSalary / 1000000).toFixed(1)} mln so‘m
            </span>
          </div>
        </div>

        {/* KPI 3: Bonuses Distributed */}
        <div
          onClick={() => setActiveTab('payroll')}
          className="glass-card rounded-2xl p-5 cursor-pointer group"
        >
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Mukofotlar & Rag‘bat
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <Award size={18} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-300 font-heading tabular-nums tracking-tight">
            {(totalBonuses / 1000000).toFixed(1)} mln <span className="text-xs font-normal text-slate-400">so‘m</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Berilgan mukofotlar:</span>
            <span className="font-mono text-slate-200 tabular-nums">{bonusRecords.length} ta</span>
          </div>
        </div>

        {/* KPI 4: Upcoming Birthdays */}
        <div
          onClick={() => setActiveTab('birthdays')}
          className="glass-card rounded-2xl p-5 cursor-pointer group"
        >
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Tug‘ilgan kunlar
            </span>
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 group-hover:scale-110 transition-transform">
              <Cake size={18} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-rose-300 font-heading tabular-nums tracking-tight">
            {upcomingBirthdays.length} <span className="text-sm font-normal text-slate-400">yaqin kunlarda</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Shu oyda:</span>
            <span className="text-slate-200 font-medium">
              {upcomingBirthdays[0]?.fullName ? upcomingBirthdays[0].fullName.split(' ')[0] : "Barchasi ko'rildi"}
            </span>
          </div>
        </div>
      </div>

      {/* Main split: Left = Department Distribution, Right = Upcoming Birthdays & Recent Promotions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Department Structure */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white font-heading">
                Bo‘limlar bo‘yicha xodimlar taqsimoti
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                PROJECT CITY GROUP tarkibiy bo‘linmalari va jamoa sig‘imi
              </p>
            </div>
            <button
              onClick={() => setActiveTab('employees')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <span>Barcha xodimlar</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="space-y-4">
            {departmentCounts.map((dept) => {
              const percentage = Math.round((dept.count / (totalEmployees || 1)) * 100);
              return (
                <div key={dept.name} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-200">{dept.name}</span>
                    <span className="text-slate-400 font-mono tabular-nums">
                      {dept.count} xodim · {percentage}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-800/80 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Staff Spotlight */}
          <div className="pt-4 border-t border-slate-800/80">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
              Kompaniya rahbariyati va yetakchi mutaxassislar
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {employees.slice(0, 4).map((emp) => (
                <div
                  key={emp.id}
                  onClick={() => onSelectEmployee(emp)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 cursor-pointer transition-colors"
                >
                  <img
                    src={emp.avatar}
                    alt={emp.fullName}
                    className="w-10 h-10 rounded-xl object-cover border border-amber-400/30"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-200 truncate">{emp.fullName}</p>
                    <p className="text-[11px] text-amber-400/90 truncate">{emp.position}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Birthdays & Promotions */}
        <div className="space-y-6">
          {/* Upcoming Celebrations Card */}
          <div className="glass-panel-gold rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-500/20 text-rose-300">
                  <Cake size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-heading">
                    Tug‘ilgan kunlar
                  </h4>
                  <p className="text-[11px] text-slate-400">Yaqin 30 kun ichida</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('birthdays')}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
              >
                Barchasi
              </button>
            </div>

            <div className="space-y-3">
              {upcomingBirthdays.slice(0, 3).map((emp) => {
                const [, m, d] = emp.birthDate.split('-').map(Number);
                const isThisMonth = m === currentMonth;
                return (
                  <div
                    key={emp.id}
                    onClick={() => onSelectEmployee(emp)}
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={emp.avatar}
                        alt={emp.fullName}
                        className="w-9 h-9 rounded-full object-cover border border-amber-400/30"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-200 truncate">{emp.fullName}</p>
                        <p className="text-[11px] text-slate-400 truncate">{emp.position}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <span className="text-xs font-bold text-amber-300 font-mono">
                        {d}-{m < 10 ? `0${m}` : m}
                      </span>
                      <p className="text-[10px] text-slate-500">
                        {isThisMonth ? "Shu oyda" : "Keyingi oy"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Promotions / Career Upgrades */}
          <div className="glass-panel rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-heading">
                    So‘nggi martaba o‘sishi
                  </h4>
                  <p className="text-[11px] text-slate-400">Lavozim oshirilganlar</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('promotions')}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
              >
                Tarix
              </button>
            </div>

            <div className="space-y-3">
              {promotionRecords.slice(0, 3).map((promo) => (
                <div
                  key={promo.id}
                  className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-200">{promo.employeeName}</span>
                    <span className="text-[10px] font-mono text-slate-400">{promo.effectiveDate}</span>
                  </div>
                  <div className="text-[11px] text-slate-300 flex items-center gap-1">
                    <span className="text-slate-400 line-through truncate">{promo.previousPosition}</span>
                    <span className="text-amber-400">→</span>
                    <span className="text-amber-300 font-medium truncate">{promo.newPosition}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

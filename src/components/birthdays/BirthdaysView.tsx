import React, { useState } from 'react';
import { Cake, Sparkles, Gift, Calendar, Phone, Send, Printer, Copy, Check, Heart } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useBranding } from '../../context/BrandingContext';
import { Employee } from '../../types';
import { Logo } from '../common/Logo';

export const BirthdaysView: React.FC = () => {
  const { employees } = useData();
  const { branding } = useBranding();

  const [selectedMonth, setSelectedMonth] = useState<number>(0); // 0 = all
  const [selectedGreetingEmp, setSelectedGreetingEmp] = useState<Employee | null>(null);
  const [copied, setCopied] = useState(false);

  const months = [
    'Barcha oylar',
    'Yanvar',
    'Fevral',
    'Mart',
    'Aprel',
    'May',
    'Iyun',
    'Iyul',
    'Avgust',
    'Sentyabr',
    'Oktyabr',
    'Noyabr',
    'Dekabr',
  ];

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  // Sort employees by upcoming birthday relative to today
  const sortedEmployees = [...employees].sort((a, b) => {
    const [, ma, da] = a.birthDate.split('-').map(Number);
    const [, mb, db] = b.birthDate.split('-').map(Number);

    // month distance
    const diffA = (ma - currentMonth + 12) % 12 * 31 + (da - currentDay);
    const diffB = (mb - currentMonth + 12) % 12 * 31 + (db - currentDay);

    const normalA = diffA < 0 ? diffA + 372 : diffA;
    const normalB = diffB < 0 ? diffB + 372 : diffB;

    return normalA - normalB;
  });

  const filtered = sortedEmployees.filter((emp) => {
    if (selectedMonth === 0) return true;
    const [, m] = emp.birthDate.split('-').map(Number);
    return m === selectedMonth;
  });

  // Today birthdays
  const todayBirthdays = employees.filter((e) => {
    const [, m, d] = e.birthDate.split('-').map(Number);
    return m === currentMonth && d === currentDay;
  });

  const generateGreetingText = (emp: Employee) => {
    return `Hurmatli ${emp.fullName}!\n\nPROJECT CITY GROUP jamoasi va rahbariyati nomidan Sizni tavallud ayyomingiz bilan samimiy muborakbod etamiz!\n\nSizga mustahkam sog'liq, oilaviy baxt, ulkan zafarlar va professional faoliyatingizda yangi cho'qqilarni zabt etishingizni tilaymiz. Kompaniyamiz rivojiga qo'shayotgan munosib hissangiz uchun minnatdorchilik bildiramiz!\n\nEzgu tilaklar bilan,\nPROJECT CITY GROUP Boshqaruvi`;
  };

  const handleCopyGreeting = (emp: Employee) => {
    const text = generateGreetingText(emp);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white font-heading">
            Tug‘ilgan kunlar taqvimi
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            PROJECT CITY GROUP xodimlarining tavallud sanalari va korporativ tabriknomalari
          </p>
        </div>

        {/* Month selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 focus:outline-none focus:border-amber-400"
          >
            {months.map((m, idx) => (
              <option key={idx} value={idx}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Today's Special Celebration Highlight Banner if any or next upcoming */}
      {todayBirthdays.length > 0 ? (
        <div className="glass-panel-gold rounded-3xl p-6 sm:p-8 relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5 text-center sm:text-left">
              <div className="p-4 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/30">
                <Cake size={36} />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
                  Bugungi tavallud ayyomi!
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white font-heading mt-1">
                  {todayBirthdays.map((b) => b.fullName).join(', ')}
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Bugun kompaniyamiz a’zosining qutlug‘ tavallud kuni nishonlanmoqda.
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedGreetingEmp(todayBirthdays[0])}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <Gift size={16} />
              <span>Tabriknoma yaratish</span>
            </button>
          </div>
        </div>
      ) : null}

      {/* Birthday Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((emp) => {
          const [year, m, d] = emp.birthDate.split('-').map(Number);
          const age = today.getFullYear() - year;

          // Days remaining
          const thisYearBday = new Date(today.getFullYear(), m - 1, d);
          if (thisYearBday < today && thisYearBday.toDateString() !== today.toDateString()) {
            thisYearBday.setFullYear(today.getFullYear() + 1);
          }
          const diffTime = thisYearBday.getTime() - today.getTime();
          const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const isToday = m === currentMonth && d === currentDay;

          return (
            <div
              key={emp.id}
              className={`glass-card rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group ${
                isToday ? 'border-amber-400/60 shadow-lg shadow-amber-500/10' : ''
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={emp.avatar}
                      alt={emp.fullName}
                      className="w-13 h-13 rounded-2xl object-cover border border-slate-700 group-hover:border-amber-400/60 transition-colors"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white line-clamp-1">
                        {emp.fullName}
                      </h4>
                      <p className="text-xs text-amber-400 font-medium line-clamp-1">
                        {emp.position}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {emp.department}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-extrabold text-amber-300 font-mono">
                      {d} {months[m]}
                    </span>
                    <p className="text-[10px] text-slate-500 font-mono">
                      {year}-yil ({age} yosh)
                    </p>
                  </div>
                </div>

                {/* Days remaining badge */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Holat:</span>
                  {isToday ? (
                    <span className="text-amber-300 font-bold flex items-center gap-1">
                      <Sparkles size={13} />
                      Bugun tavallud kuni!
                    </span>
                  ) : daysLeft <= 30 ? (
                    <span className="text-emerald-400 font-mono font-medium tabular-nums">
                      {daysLeft} kundan keyin
                    </span>
                  ) : (
                    <span className="text-slate-400 font-mono tabular-nums">
                      {daysLeft} kun qoldi
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 mt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <a
                  href={`tel:${emp.phone}`}
                  className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-colors"
                  title="Qo‘ng‘iroq qilish"
                >
                  <Phone size={13} className="text-amber-400" />
                  <span>Qo‘ng‘iroq</span>
                </a>

                <button
                  onClick={() => setSelectedGreetingEmp(emp)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles size={13} />
                  <span>Tabriknoma</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Greeting Card Generator Modal */}
      {selectedGreetingEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl bg-[#080E21] border border-amber-500/40 p-6 sm:p-8 shadow-2xl text-slate-100 print-include">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800 no-print">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Rasmiy Korporativ Tabriknoma
              </span>
              <button
                onClick={() => setSelectedGreetingEmp(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Visual Corporate Card */}
            <div className="my-6 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#101C42] via-[#0B132B] to-[#070D1F] border-2 border-amber-400/30 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-white to-amber-500" />

              <Logo size="md" variant="symbol" className="mx-auto mb-3" />
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-widest font-heading">
                {branding.companyName}
              </h4>

              <div className="my-4">
                <img
                  src={selectedGreetingEmp.avatar}
                  alt={selectedGreetingEmp.fullName}
                  className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-amber-400 shadow-xl"
                />
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white font-heading">
                Hurmatli {selectedGreetingEmp.fullName}!
              </h3>
              <p className="text-xs text-amber-400 font-semibold mt-0.5">
                {selectedGreetingEmp.position}
              </p>

              <div className="text-xs text-slate-300 leading-relaxed my-5 px-2 text-justify">
                PROJECT CITY GROUP jamoasi va rahbariyati nomidan Sizni qutlug‘ tavallud ayyomingiz bilan chin dildan muborakbod etamiz!
                Sizga sihat-salomatlik, bitmas-tuganmas g‘ayrat-shijoat, oilaviy xotirjamlik va professional faoliyatingizda yangi yuksak marralarni zabt etishingizni tilaymiz.
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-between items-center text-[10px] text-slate-400">
                <span>{branding.companyName} Boshqaruvi</span>
                <span className="font-mono text-amber-400">{today.toISOString().split('T')[0]}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 no-print">
              <button
                onClick={() => handleCopyGreeting(selectedGreetingEmp)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copied ? 'Nusxalandi!' : 'Matnni nusxalash'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedGreetingEmp(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  Yopish
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <Printer size={14} />
                  <span>Chop etish</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

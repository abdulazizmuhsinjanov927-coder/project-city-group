import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Building,
  CreditCard,
  Users,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useBranding } from '../../context/BrandingContext';
import { Logo } from '../common/Logo';

export const ReportsView: React.FC = () => {
  const { employees, salaryRecords, departments, vacationRecords, bonusRecords } = useData();
  const { branding } = useBranding();

  const [activeReportType, setActiveReportType] = useState<'staffing' | 'payroll' | 'vacation'>('staffing');

  const totalEmployees = employees.length;
  const activeCount = employees.filter((e) => e.status === 'Faol').length;
  const leaveCount = employees.filter((e) => e.status === "Ta'tilda").length;
  const probationCount = employees.filter((e) => e.status === 'Sinov muddatida').length;

  const totalPayroll = salaryRecords.reduce((sum, r) => sum + r.netSalary, 0);
  const totalTaxes = salaryRecords.reduce((sum, r) => sum + r.tax, 0);
  const totalBonuses = bonusRecords.reduce((sum, b) => sum + b.amount, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,F.I.Sh.,Lavozimi,Bo'limi,Holati,Oylik maosh (UZS),Telefon,Elektron pochta,Tug'ilgan sana,Ishga kirgan sana\n";

    employees.forEach((e) => {
      csvContent += `"${e.id}","${e.fullName}","${e.position}","${e.department}","${e.status}","${e.salary}","${e.phone}","${e.email}","${e.birthDate}","${e.hireDate}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `PROJECT_CITY_GROUP_Xodimlar_Hisoboti_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-2xl font-extrabold text-white font-heading">
            Rasmiy korporativ hisobotlar
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            PROJECT CITY GROUP kadrlar va mehnat resurslari rasmiy yakuniy ma’lumotnomasi
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold flex items-center gap-2 border border-slate-700 transition-colors"
          >
            <Download size={15} className="text-amber-400" />
            <span>Excel / CSV yuklab olish</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <Printer size={15} />
            <span>Chop etish (Hujjat)</span>
          </button>
        </div>
      </div>

      {/* Report Selector Pills */}
      <div className="flex items-center gap-2 no-print border-b border-slate-800 pb-3 text-xs">
        <span className="text-slate-400 font-medium">Hisobot turi:</span>
        <button
          onClick={() => setActiveReportType('staffing')}
          className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
            activeReportType === 'staffing'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Shtat jadvali va xodimlar tarkibi
        </button>
        <button
          onClick={() => setActiveReportType('payroll')}
          className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
            activeReportType === 'payroll'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Ish haqi va soliq xarajatlari
        </button>
      </div>

      {/* OFFICIAL PRINTABLE CORPORATE DOCUMENT CONTAINER */}
      <div className="rounded-3xl bg-white text-slate-900 p-8 sm:p-12 shadow-2xl border border-slate-200 printable-area">
        {/* Document Official Letterhead */}
        <div className="pb-6 border-b-2 border-slate-900 flex flex-col sm:flex-row justify-between items-start gap-6">
          <div className="space-y-2">
            <Logo size="lg" variant="light" />
            <div className="text-xs text-slate-600 space-y-0.5 pt-2">
              <p className="font-semibold">{branding.officialAddress}</p>
              <p>Telefon: {branding.officialPhone} · Email: {branding.officialEmail}</p>
              <p>Veb-sayt: {branding.officialWebsite}</p>
              <p className="font-mono text-[11px] text-slate-500">
                STIR (INN): {branding.tin} · MFO: {branding.mfo} · H/r: {branding.accountNumber}
              </p>
            </div>
          </div>

          <div className="text-right sm:border-l sm:border-slate-300 sm:pl-6 space-y-1">
            <span className="text-[11px] font-bold tracking-widest uppercase text-slate-500 block">
              RASMIY HUJJAT
            </span>
            <h3 className="text-base font-extrabold text-slate-900 font-heading">
              KADRLAR HISOBI VA MAOSH REESTRI
            </h3>
            <p className="text-xs text-slate-700 font-mono">
              Hujjat №: PCG-HR-{new Date().getFullYear()}/{(new Date().getMonth() + 1).toString().padStart(2, '0')}-09
            </p>
            <p className="text-xs text-slate-500">
              Sana: {new Date().toLocaleDateString('uz-UZ')}
            </p>
          </div>
        </div>

        {/* Corporate Summary KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-200 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 block">Jami xodimlar:</span>
            <span className="text-lg font-bold text-slate-900 font-mono tabular-nums">
              {totalEmployees} nafar
            </span>
            <span className="text-[10px] text-slate-500 block">{activeCount} faol · {leaveCount} ta’tilda</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 block">Tarkibiy bo‘linmalar:</span>
            <span className="text-lg font-bold text-slate-900 font-mono tabular-nums">
              {departments.length} ta
            </span>
            <span className="text-[10px] text-slate-500 block">Boshqaruv va muhandislik</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 block">Oylik maosh fondi:</span>
            <span className="text-lg font-bold text-slate-900 font-mono tabular-nums">
              {(totalPayroll / 1000000).toFixed(1)} mln
            </span>
            <span className="text-[10px] text-slate-500 block">Net to‘lovlar summasi</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 block">Davlat soliqlari (JShDS):</span>
            <span className="text-lg font-bold text-slate-900 font-mono tabular-nums">
              {(totalTaxes / 1000000).toFixed(1)} mln
            </span>
            <span className="text-[10px] text-slate-500 block">12% daromad solig‘i</span>
          </div>
        </div>

        {/* Staff Table */}
        <div className="py-6 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            1. PROJECT CITY GROUP xodimlarining to‘liq ro‘yxati va shtat ma’lumotlari
          </h4>

          <table className="w-full text-left text-xs border border-slate-300 border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <th className="py-2.5 px-3 border-r border-slate-300">№</th>
                <th className="py-2.5 px-3 border-r border-slate-300">Xodim F.I.Sh.</th>
                <th className="py-2.5 px-3 border-r border-slate-300">Lavozimi</th>
                <th className="py-2.5 px-3 border-r border-slate-300">Bo‘limi</th>
                <th className="py-2.5 px-3 border-r border-slate-300">Holati</th>
                <th className="py-2.5 px-3 border-r border-slate-300 text-right">Oylik maosh</th>
                <th className="py-2.5 px-3 text-right">Telefon</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {employees.map((emp, idx) => (
                <tr key={emp.id} className="hover:bg-slate-50">
                  <td className="py-2 px-3 border-r border-slate-300 font-mono text-center">
                    {idx + 1}
                  </td>
                  <td className="py-2 px-3 border-r border-slate-300 font-semibold text-slate-900">
                    {emp.fullName}
                  </td>
                  <td className="py-2 px-3 border-r border-slate-300">{emp.position}</td>
                  <td className="py-2 px-3 border-r border-slate-300">{emp.department}</td>
                  <td className="py-2 px-3 border-r border-slate-300">{emp.status}</td>
                  <td className="py-2 px-3 border-r border-slate-300 text-right font-mono font-semibold tabular-nums">
                    {emp.salary.toLocaleString('uz-UZ')} so‘m
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums">{emp.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Official Signatures & Seal Area */}
        <div className="pt-10 mt-6 border-t-2 border-slate-900 grid grid-cols-1 sm:grid-cols-3 gap-8 text-xs">
          <div>
            <p className="font-bold text-slate-900">Bosh ijrochi direktor (CEO):</p>
            <div className="h-12 border-b border-dashed border-slate-400 mt-2 flex items-end">
              <span className="font-serif italic text-slate-700">{branding.ceoName}</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Imzo va shaxsiy muhr</p>
          </div>

          <div>
            <p className="font-bold text-slate-900">Kadrlar boshqarmasi rahbari:</p>
            <div className="h-12 border-b border-dashed border-slate-400 mt-2 flex items-end">
              <span className="font-serif italic text-slate-700">{branding.hrLeadName}</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Imzo</p>
          </div>

          <div className="relative flex flex-col items-center sm:items-end justify-center">
            {/* Corporate Circular Stamp Representation */}
            <div className="w-24 h-24 rounded-full border-2 border-amber-600/70 p-1 flex flex-col items-center justify-center text-center text-amber-800 rotate-[-8deg] select-none">
              <div className="w-full h-full rounded-full border border-dashed border-amber-600 flex flex-col items-center justify-center p-1 text-[8px] font-bold leading-tight uppercase">
                <span>PROJECT CITY GROUP</span>
                <span className="text-[7px] my-0.5 text-amber-900">★ HR DEPT ★</span>
                <span>TOSHKENT</span>
              </div>
            </div>
            <p className="text-[9px] text-slate-500 mt-1 text-center">Tashkilot rasmiy muhri</p>
          </div>
        </div>
      </div>
    </div>
  );
};

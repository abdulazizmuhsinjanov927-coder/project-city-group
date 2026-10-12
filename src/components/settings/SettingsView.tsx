import React, { useState, useRef } from 'react';
import {
  Upload,
  RotateCcw,
  Save,
  Check,
  Building,
  Shield,
  Download,
  FileUp,
  Image as ImageIcon,
  Sparkles,
  Info,
} from 'lucide-react';
import { useBranding } from '../../context/BrandingContext';
import { useData } from '../../context/DataContext';
import { Logo } from '../common/Logo';

export const SettingsView: React.FC = () => {
  const { branding, updateBranding, uploadLogo, resetLogo, activeLogoSrc } = useBranding();
  const { exportDataAsJson, importDataFromJson, resetToDefaultData } = useData();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    companyName: branding.companyName,
    companyShortName: branding.companyShortName,
    title: branding.title,
    officialAddress: branding.officialAddress,
    officialPhone: branding.officialPhone,
    officialEmail: branding.officialEmail,
    officialWebsite: branding.officialWebsite,
    tin: branding.tin,
    mfo: branding.mfo,
    accountNumber: branding.accountNumber,
    ceoName: branding.ceoName,
    hrLeadName: branding.hrLeadName,
  });

  const [customUrl, setCustomUrl] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("Iltimos, faqat rasm faylini yuklang (PNG, JPG, SVG, WebP)");
      return;
    }

    try {
      setUploadStatus('Yuklanmoqda...');
      await uploadLogo(file);
      setUploadStatus('Muvaffaqiyatli yuklandi!');
      setTimeout(() => setUploadStatus(null), 3000);
    } catch (err) {
      setUploadStatus('Xatolik yuz berdi');
    }
  };

  const handleApplyUrl = () => {
    if (!customUrl.trim()) return;
    updateBranding({ logoUrl: customUrl.trim(), usePresetLogoImage: false });
    setUploadStatus('Logo havolasi saqlandi!');
    setTimeout(() => setUploadStatus(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBranding(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleBackupDownload = () => {
    const json = exportDataAsJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PROJECT_CITY_GROUP_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content && importDataFromJson(content)) {
        alert("Ma'lumotlar bazasi zaxira nusxadan muvaffaqiyatli tiklandi!");
      } else {
        alert("Xatolik: Noto'g'ri JSON zaxira fayli!");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top action bar */}
      <div>
        <h2 className="text-2xl font-extrabold text-white font-heading">
          Tizim va Korporativ brending sozlamalari
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          PROJECT CITY GROUP rasmiy ramzlari, logotipi, rekvizitlari va ma’lumotlar xavfsizligi
        </p>
      </div>

      {/* SECTION 1: LOGO UPLOAD & MANAGEMENT */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <Sparkles size={18} className="text-amber-400" />
              <span>Kompaniya logotipini o‘zgartirish yoki yangilash</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Yuklangan logotip login sahifasi, yon menyu, guvohnomalar va hisobotlarda avtomatik aks etadi
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetLogo}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Boshlang‘ich PCG monogramiga qaytarish"
            >
              <RotateCcw size={14} />
              <span>Standart logotipga qaytarish</span>
            </button>
          </div>
        </div>

        {/* Live Logo Preview Across Contexts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Context 1: Dark Mode / Sidebar */}
          <div className="p-5 rounded-2xl bg-[#080E21] border border-slate-800 space-y-3 text-center">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              1. Qorong‘i fon (Yon menyu & Tizim)
            </span>
            <div className="h-20 flex items-center justify-center p-2 rounded-xl bg-slate-900/80 border border-slate-800">
              <Logo size="md" variant="full" />
            </div>
          </div>

          {/* Context 2: ID Badge & Light Print Mode */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 text-center">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              2. Chop etish foni (Oq qog‘oz / Blank)
            </span>
            <div className="h-20 flex items-center justify-center p-2 rounded-xl bg-white border border-slate-300">
              <Logo size="md" variant="light" />
            </div>
          </div>

          {/* Context 3: Crest / Avatar View */}
          <div className="p-5 rounded-2xl bg-[#080E21] border border-slate-800 space-y-3 text-center">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              3. Monogram emblem (Kvadrat shakl)
            </span>
            <div className="h-20 flex items-center justify-center p-2">
              <Logo size="lg" variant="symbol" />
            </div>
          </div>
        </div>

        {/* Upload Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
          {/* File Upload Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-6 rounded-2xl border-2 border-dashed border-slate-700 hover:border-amber-400/80 bg-slate-900/40 hover:bg-slate-900/80 cursor-pointer transition-all flex flex-col items-center justify-center text-center space-y-2 group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
              <Upload size={22} />
            </div>
            <p className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
              Yangi logotip rasmini yuklash
            </p>
            <p className="text-[11px] text-slate-400">
              PNG, JPG, SVG yoki WebP (Tavsiya: kvadrat yoki shaffof PNG)
            </p>
          </div>

          {/* URL Input Area */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col justify-center space-y-3">
            <label className="text-xs font-semibold text-slate-300">
              Yoki logotip internet URL manzilini kiriting:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://example.com/logo.png"
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-amber-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0"
              >
                O‘rnatish
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Joriy manba: {branding.logoUrl ? 'Foydalanuvchi rasmi' : 'PCG Rasmiy 3D Crest'}
            </p>
          </div>
        </div>

        {uploadStatus && (
          <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-medium text-center">
            {uploadStatus}
          </div>
        )}
      </div>

      {/* SECTION 2: COMPANY LEGAL & CONTACT REQUISITES */}
      <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="pb-4 border-b border-slate-800">
          <h3 className="text-base font-bold text-white font-heading">
            Tashkilotning rasmiy rekvizitlari va nomlanishi
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Blanklar, hisobotlar va maosh vedomostlarida foydalaniladigan yuridik ma’lumotlar
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Kompaniyaning rasmiy nomi *
            </label>
            <input
              type="text"
              required
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white font-bold focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Qisqa brend nomi
            </label>
            <input
              type="text"
              required
              value={formData.companyShortName}
              onChange={(e) => setFormData({ ...formData, companyShortName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-amber-300 font-mono font-bold focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Asosiy sarlavha va tizim tavsifi *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Yuridik va amaldagi manzil
            </label>
            <input
              type="text"
              value={formData.officialAddress}
              onChange={(e) => setFormData({ ...formData, officialAddress: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Aloqa telefoni
            </label>
            <input
              type="text"
              value={formData.officialPhone}
              onChange={(e) => setFormData({ ...formData, officialPhone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white font-mono focus:border-amber-400 focus:outline-none tabular-nums"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Rasmiy elektron pochta
            </label>
            <input
              type="email"
              value={formData.officialEmail}
              onChange={(e) => setFormData({ ...formData, officialEmail: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              STIR (INN / Soliq to‘lovchi kodi)
            </label>
            <input
              type="text"
              value={formData.tin}
              onChange={(e) => setFormData({ ...formData, tin: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white font-mono focus:border-amber-400 focus:outline-none tabular-nums"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Bank MFO kodi
            </label>
            <input
              type="text"
              value={formData.mfo}
              onChange={(e) => setFormData({ ...formData, mfo: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white font-mono focus:border-amber-400 focus:outline-none tabular-nums"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Bosh ijrochi direktor (CEO) F.I.Sh.
            </label>
            <input
              type="text"
              value={formData.ceoName}
              onChange={(e) => setFormData({ ...formData, ceoName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Kadrlar boshqarmasi rahbari F.I.Sh.
            </label>
            <input
              type="text"
              value={formData.hrLeadName}
              onChange={(e) => setFormData({ ...formData, hrLeadName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-amber-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          {savedSuccess ? (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <Check size={16} />
              O‘zgarishlar muvaffaqiyatli saqlandi!
            </span>
          ) : (
            <span className="text-xs text-slate-500">
              Barcha o‘zgarishlar darhol butun tizimda qo‘llaniladi
            </span>
          )}

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <Save size={16} />
            <span>Sozlamalarni saqlash</span>
          </button>
        </div>
      </form>

      {/* SECTION 3: DATABASE BACKUP & RESTORE */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="pb-3 border-b border-slate-800">
          <h3 className="text-base font-bold text-white font-heading">
            Ma’lumotlar bazasi va zaxira nusxalar
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Xodimlar, maoshlar, ta’tillar va mukofotlar bazasini eksport yoki import qilish
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleBackupDownload}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700"
          >
            <Download size={15} className="text-amber-400" />
            <span>JSON zaxira nusxasini yuklab olish</span>
          </button>

          <input
            ref={jsonInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImportJson}
          />

          <button
            type="button"
            onClick={() => jsonInputRef.current?.click()}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700"
          >
            <FileUp size={15} className="text-blue-400" />
            <span>JSON zaxiradan qayta tiklash</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm("Barcha ma'lumotlarni boshlang'ich PCG holatiga qaytarishni tasdiqlaysizmi?")) {
                resetToDefaultData();
                resetLogo();
                alert("Ma'lumotlar qayta tiklandi!");
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 text-xs font-semibold flex items-center gap-2 ml-auto"
          >
            <RotateCcw size={14} />
            <span>Standart bazaga qaytarish</span>
          </button>
        </div>
      </div>
    </div>
  );
};

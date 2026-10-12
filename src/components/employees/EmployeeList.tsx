import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  Phone,
  Mail,
  Send,
  Linkedin,
  Calendar,
  Building,
  CreditCard,
  Cake,
  Edit2,
  Trash2,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { Employee, EmployeeStatus } from '../../types';
import { useData } from '../../context/DataContext';

interface EmployeeListProps {
  onOpenNewEmployee: () => void;
  onEditEmployee: (emp: Employee) => void;
  onSelectEmployee: (emp: Employee) => void;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({
  onOpenNewEmployee,
  onEditEmployee,
  onSelectEmployee,
}) => {
  const { employees, departments, deleteEmployee } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        emp.fullName.toLowerCase().includes(q) ||
        emp.position.toLowerCase().includes(q) ||
        emp.department.toLowerCase().includes(q) ||
        emp.phone.toLowerCase().includes(q) ||
        (emp.telegram && emp.telegram.toLowerCase().includes(q));

      const matchesDept = selectedDept === 'all' || emp.department === selectedDept;
      const matchesStatus = selectedStatus === 'all' || emp.status === selectedStatus;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [employees, searchQuery, selectedDept, selectedStatus]);

  const handleDelete = (emp: Employee) => {
    if (window.confirm(`Haqiqatan ham ${emp.fullName} xodimini ro'yxatdan o'chirmoqchimisiz?`)) {
      deleteEmployee(emp.id);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top action bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white font-heading">
            Xodimlar tarkibi
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            PROJECT CITY GROUP xodimlari ma’lumotlar bazasi ({filteredEmployees.length} ta natija)
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-amber-500/20 text-amber-300 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Katakcha ko‘rinishi"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-amber-500/20 text-amber-300 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Jadval ko‘rinishi"
            >
              <List size={16} />
            </button>
          </div>

          {/* Add Employee CTA */}
          <button
            onClick={onOpenNewEmployee}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <Plus size={16} strokeWidth={3} />
            <span>Yangi xodim</span>
          </button>
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="F.I.Sh., lavozim, bo‘lim yoki telefon bo‘yicha qidiring..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/80 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Tozalash
              </button>
            )}
          </div>

          {/* Department Select */}
          <div className="w-full md:w-64">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-sm text-slate-200 focus:outline-none focus:border-amber-400/80"
            >
              <option value="all">Barcha bo‘limlar ({departments.length})</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Status Select */}
          <div className="w-full md:w-48">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-sm text-slate-200 focus:outline-none focus:border-amber-400/80"
            >
              <option value="all">Barcha holatlar</option>
              <option value="Faol">Faol</option>
              <option value="Ta'tilda">Ta’tilda</option>
              <option value="Sinov muddatida">Sinov muddatida</option>
              <option value="Nofaol">Nofaol</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredEmployees.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center space-y-3">
          <p className="text-base text-slate-300 font-semibold">Hech qanday xodim topilmadi</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Qidiruv so‘zini o‘zgartiring yoki filtrlarni tozalang
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDept('all');
              setSelectedStatus('all');
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 text-amber-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
          >
            Filtrlarni bekor qilish
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredEmployees.map((emp) => (
            <div
              key={emp.id}
              className="glass-card rounded-2xl p-5 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Top Row: Avatar & Basic info */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                      <img
                        src={emp.avatar}
                        alt={emp.fullName}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-700 group-hover:border-amber-400/60 transition-colors shadow-md"
                      />
                      <span
                        className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#070D1F] ${
                          emp.status === 'Faol'
                            ? 'bg-emerald-500'
                            : emp.status === "Ta'tilda"
                            ? 'bg-amber-500'
                            : 'bg-blue-500'
                        }`}
                        title={emp.status}
                      />
                    </div>
                    <div>
                      <h3
                        onClick={() => onSelectEmployee(emp)}
                        className="text-sm font-bold text-white hover:text-amber-300 cursor-pointer transition-colors line-clamp-1"
                      >
                        {emp.fullName}
                      </h3>
                      <p className="text-xs text-amber-400/90 font-medium line-clamp-1">
                        {emp.position}
                      </p>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Building size={12} className="shrink-0" />
                        <span className="truncate">{emp.department}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Unboxed Metadata (Zero-pill discipline) */}
                <div className="text-xs text-slate-400 space-y-1.5 pt-1 border-t border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Holat:</span>
                    <span className="text-slate-200 font-medium">{emp.status}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Oylik maosh:</span>
                    <span className="font-mono text-amber-300 font-semibold tabular-nums">
                      {emp.salary.toLocaleString('uz-UZ')} so‘m
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Ta’til qoldig‘i:</span>
                    <span className="text-slate-300 font-mono tabular-nums">
                      {emp.vacationDaysLeft} kun
                    </span>
                  </div>
                </div>

                {/* Contact links */}
                <div className="flex items-center gap-2 pt-1 text-slate-400 text-xs">
                  <a
                    href={`tel:${emp.phone}`}
                    className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700 hover:text-white transition-colors"
                    title={emp.phone}
                  >
                    <Phone size={14} />
                  </a>
                  <a
                    href={`mailto:${emp.email}`}
                    className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700 hover:text-white transition-colors"
                    title={emp.email}
                  >
                    <Mail size={14} />
                  </a>
                  {emp.telegram && (
                    <span
                      className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
                      title={emp.telegram}
                    >
                      <Send size={14} />
                    </span>
                  )}
                  {emp.linkedin && (
                    <span
                      className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
                      title={emp.linkedin}
                    >
                      <Linkedin size={14} />
                    </span>
                  )}
                  <span className="ml-auto text-[11px] text-slate-500 tabular-nums">
                    {emp.phone}
                  </span>
                </div>
              </div>

              {/* Action Footer */}
              <div className="flex items-center justify-end gap-2 pt-4 mt-3 border-t border-slate-800/80">
                <button
                  onClick={() => onSelectEmployee(emp)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Eye size={13} className="text-amber-400" />
                  <span>Profil</span>
                </button>
                <button
                  onClick={() => onEditEmployee(emp)}
                  className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Tahrirlash"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  onClick={() => handleDelete(emp)}
                  className="p-2 rounded-lg bg-slate-800/60 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 transition-colors"
                  title="O‘chirish"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Xodim</th>
                  <th className="py-3.5 px-4">Bo‘lim</th>
                  <th className="py-3.5 px-4">Holat</th>
                  <th className="py-3.5 px-4 text-right">Oylik maosh</th>
                  <th className="py-3.5 px-4">Bog‘lanish</th>
                  <th className="py-3.5 px-4 text-center">Ta’til</th>
                  <th className="py-3.5 px-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                    onClick={() => onSelectEmployee(emp)}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.avatar}
                          alt={emp.fullName}
                          className="w-9 h-9 rounded-xl object-cover border border-slate-700"
                        />
                        <div>
                          <p className="font-bold text-white hover:text-amber-300 transition-colors">
                            {emp.fullName}
                          </p>
                          <p className="text-[11px] text-amber-400/90">{emp.position}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{emp.department}</td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-200">{emp.status}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-amber-300 font-semibold tabular-nums">
                      {emp.salary.toLocaleString('uz-UZ')} so‘m
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono tabular-nums">
                      {emp.phone}
                    </td>
                    <td className="py-3 px-4 text-center font-mono tabular-nums">
                      {emp.vacationDaysLeft} kun
                    </td>
                    <td
                      className="py-3 px-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEditEmployee(emp)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                          title="Tahrirlash"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(emp)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400"
                          title="O‘chirish"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

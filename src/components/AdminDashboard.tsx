import React, { useState, useEffect, useCallback } from 'react';
import { Registration } from '../types';
import { getFilteredRegistrations, getStats, deleteRegistration, initDatabase } from '../db';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  Users, 
  Calendar, 
  Clock, 
  Search, 
  Download, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw, 
  LogOut, 
  ShieldAlert, 
  AlertTriangle, 
  Filter, 
  Check, 
  Loader2,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminDashboard: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(() => localStorage.getItem('admin_logged_in') === 'true');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Dashboard Data State
  const [registrationsData, setRegistrationsData] = useState<{ items: Registration[]; total: number; stats?: any } | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [experienceFilter, setExperienceFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<Registration | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchRegistrations = useCallback(async () => {
    if (!loggedIn) return;
    setIsLoading(true);

    try {
      const [result, stats] = await Promise.all([
        getFilteredRegistrations({
          q: searchQuery || undefined,
          experience: experienceFilter || undefined,
          page: currentPage,
          limit: 10,
        }),
        getStats(),
      ]);
      setRegistrationsData({ ...result, stats });
    } catch (err) {
      console.error('Fetch error:', err);
      setActionMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to load registrations.' });
    } finally {
      setIsLoading(false);
    }
  }, [loggedIn, currentPage, searchQuery, experienceFilter]);

  useEffect(() => {
    if (loggedIn) {
      fetchRegistrations();
    }
  }, [loggedIn, fetchRegistrations]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_logged_in', 'true');
      setLoggedIn(true);
      setPasswordInput('');
      await initDatabase();
    } catch (err: any) {
      setLoginError(err.message || 'Error connecting to database.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_token');
    setRegistrationsData(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      await deleteRegistration(deleteTarget.id);
      setActionMessage({ type: 'success', text: `Deleted registration for ${deleteTarget.fullName}` });
      setDeleteTarget(null);
      fetchRegistrations();
    } catch (err) {
      console.error('Delete error:', err);
      setActionMessage({ type: 'error', text: 'Failed to delete record.' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const csv = await (await fetch('/api/admin/export', {
        headers: { 'x-admin-password': localStorage.getItem('admin_token') || '' },
      })).text();
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `course_registrations_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setActionMessage({ type: 'success', text: 'Exported registrations as CSV!' });
    } catch (err) {
      console.error('Export error:', err);
      setActionMessage({ type: 'error', text: 'Failed to export CSV.' });
    }
  };

  // Dismiss Toast
  useEffect(() => {
    if (actionMessage) {
      const timer = setTimeout(() => setActionMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [actionMessage]);

  // LOGIN VIEW IF NOT AUTHENTICATED
  if (!loggedIn) {
    return (
      <div className="py-20 px-4 max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#161618] p-8 rounded-3xl border border-zinc-800 shadow-2xl space-y-6"
        >
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#C9A227]/10 border border-[#C9A227]/30 flex items-center justify-center text-[#C9A227] mx-auto gold-glow">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Admin Portal</h2>
            <p className="text-xs text-zinc-400">
              Enter your admin password to view student registrations & metrics.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs text-center flex items-center justify-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter password..."
                  required
                  className="w-full px-4 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227] pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-[#C9A227] text-black hover:bg-[#d8b132] transition-all flex items-center justify-center gap-2 gold-glow"
            >
              {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Log In To Dashboard'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN DASHBOARD
  const stats = registrationsData?.stats;
  const items = registrationsData?.items || [];
  const totalPages = registrationsData?.total ? Math.ceil(registrationsData.total / 10) : 0;

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Toast notification */}
      {actionMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl border shadow-2xl text-sm font-semibold flex items-center gap-3 ${
            actionMessage.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-800'
              : 'bg-rose-950/90 text-rose-200 border-rose-800'
          }`}
        >
          {actionMessage.type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C9A227]/20 border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Admin Dashboard</h1>
              <p className="text-xs text-zinc-400">Course Registration Management & Real-time Metrics</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchRegistrations}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#C9A227]' : ''}`} />
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 hover:text-white hover:border-[#C9A227]/50 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4 text-[#C9A227]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* METRICS STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Registrations */}
        <div className="bg-[#161618] p-6 rounded-2xl border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold uppercase tracking-wider">
            <span>Total Registrations</span>
            <Users className="w-4 h-4 text-[#C9A227]" />
          </div>
          <p className="text-3xl font-extrabold text-white font-display">
            {stats?.totalRegistrations ?? 0}
          </p>
          <p className="text-[11px] text-zinc-500">Live enrolled candidates</p>
        </div>

        {/* Today's Registrations */}
        <div className="bg-[#161618] p-6 rounded-2xl border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold uppercase tracking-wider">
            <span>Today's Registrations</span>
            <Calendar className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-white font-display">
            {stats?.todayRegistrations ?? 0}
          </p>
          <p className="text-[11px] text-zinc-500">Registered since midnight</p>
        </div>

        {/* Recent Registrations */}
        <div className="bg-[#161618] p-6 rounded-2xl border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold uppercase tracking-wider">
            <span>Last 24 Hours</span>
            <Clock className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-3xl font-extrabold text-white font-display">
            {stats?.recentRegistrations ?? 0}
          </p>
          <p className="text-[11px] text-zinc-500">Recent 24h activity</p>
        </div>

        {/* Experience Breakdown */}
        <div className="bg-[#161618] p-6 rounded-2xl border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold uppercase tracking-wider">
            <span>Experience Breakdown</span>
            <Filter className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
              Beg: <strong className="text-[#C9A227]">{stats?.experienceBreakdown.beginner ?? 0}</strong>
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
              Int: <strong className="text-[#C9A227]">{stats?.experienceBreakdown.intermediate ?? 0}</strong>
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
              Adv: <strong className="text-[#C9A227]">{stats?.experienceBreakdown.advanced ?? 0}</strong>
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 pt-1">Student experience distribution</p>
        </div>

      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="bg-[#161618] p-4 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row gap-4 justify-between items-center">
        
        {/* Search input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name, email, phone, location..."
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
          />
        </div>

        {/* Experience filter dropdown */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-xs text-zinc-400 font-medium whitespace-nowrap">Level Filter:</label>
          <select
            value={experienceFilter}
            onChange={(e) => {
              setExperienceFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-zinc-900 border border-zinc-800 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
          >
            <option value="">All Experience Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

      </div>

      {/* RESPONSIVE DATA TABLE */}
      <div className="bg-[#161618] rounded-2xl border border-zinc-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-900/90 uppercase text-[10px] tracking-wider text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="p-4 font-bold">Candidate</th>
                <th className="p-4 font-bold">Contact</th>
                <th className="p-4 font-bold">Occupation & Level</th>
                <th className="p-4 font-bold">Source</th>
                <th className="p-4 font-bold">Registered At</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-zinc-500 space-y-2">
                    <Users className="w-8 h-8 mx-auto text-zinc-600 mb-2" />
                    <p className="text-sm font-semibold text-zinc-400">No registrations found</p>
                    <p className="text-xs">Try clearing search filters or add sample entries.</p>
                  </td>
                </tr>
              ) : (
                items.map((r) => (
                  <tr key={r.id} className="hover:bg-zinc-900/50 transition-colors">
                    
                    {/* Candidate Name & ID */}
                    <td className="p-4">
                      <div className="font-bold text-white text-sm">{r.fullName}</div>
                      <div className="font-mono text-[10px] text-[#C9A227] mt-0.5">{r.id}</div>
                    </td>

                    {/* Contact */}
                    <td className="p-4 space-y-0.5">
                      <div className="text-zinc-200">{r.email}</div>
                      <div className="text-zinc-400 text-[11px]">{r.phone}</div>
                    </td>

                    {/* Occupation & Level */}
                    <td className="p-4 space-y-1">
                      <div className="text-zinc-300 font-medium">{r.occupation}</div>
                      <span
                        className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border ${
                          r.experience === 'Beginner'
                            ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                            : r.experience === 'Intermediate'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        {r.experience}
                      </span>
                    </td>

                    {/* Source */}
                    <td className="p-4">
                      <div className="text-zinc-300">{r.source}</div>
                    </td>

                    {/* Registered At */}
                    <td className="p-4 text-zinc-400 text-[11px]">
                      {new Date(r.createdAt).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    {/* Delete Action */}
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setDeleteTarget(r)}
                        className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                        title="Delete Registration"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        {registrationsData && totalPages > 1 && (
          <div className="p-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400 bg-zinc-900/50">
            <span>
              Showing Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({registrationsData.total} total items)
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 disabled:opacity-40 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 disabled:opacity-40 hover:text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CONFIRMATION DELETE DIALOG MODAL */}
      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#161618] max-w-md w-full p-6 rounded-2xl border border-zinc-800 space-y-5 shadow-2xl text-left"
            >
              <div className="flex items-center gap-3 text-rose-400">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Confirm Registration Delete</h3>
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed">
                Are you sure you want to permanently delete the registration record for{' '}
                <strong className="text-white">{deleteTarget.fullName}</strong> ({deleteTarget.email})?
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setDeleteTarget(null)}
                  disabled={isDeleting}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg"
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  <span>Delete Permanently</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

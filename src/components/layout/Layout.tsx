import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { useMission } from '../../hooks/useMission';
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { notification, dismissNotification } = useMission();

  return (
    <div className="relative min-h-screen flex flex-col bg-space-950 text-telemetry-text bg-tech-grid selection:bg-sky-300/20 selection:text-sky-100">
      <Header />

      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed top-14 right-4 z-50 max-w-md w-full animate-slide-in">
          <div className={`p-3.5 border rounded-lg backdrop-blur-xl shadow-2xl flex items-start gap-3 ${
            notification.type === 'alert'
              ? 'bg-rose-950/90 border-rose-500/40 text-rose-200 shadow-rose-950/40'
              : notification.type === 'warning'
              ? 'bg-amber-950/90 border-amber-500/40 text-amber-200 shadow-amber-950/40'
              : notification.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200 shadow-emerald-950/40'
              : 'bg-slate-900/95 border-white/[0.12] text-slate-200 shadow-black/50'
          }`}>
            <div className="mt-0.5 shrink-0">
              {notification.type === 'alert' || notification.type === 'warning' ? (
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              ) : notification.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              ) : (
                <Info className="w-4 h-4 text-sky-400" />
              )}
            </div>
            <div className="flex-1 min-w-0 font-sans">
              <h4 className="text-sm font-semibold">{notification.title}</h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{notification.message}</p>
            </div>
            <button
              onClick={dismissNotification}
              className="text-white/60 hover:text-white p-1 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative w-full">
        {children}
      </main>

      <Footer />
    </div>
  );
};

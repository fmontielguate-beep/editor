
import React from 'react';

interface EditorLayoutProps {
  children: React.ReactNode;
}

export const EditorLayout: React.FC<EditorLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white/80 backdrop-blur-md border-b border-indigo-100 sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-xl shadow-md">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 serif-title leading-none tracking-tight">PediatricEditor <span className="text-indigo-600">Pro</span></h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.15em] mt-1">Estrategia Editorial Q1/Q2</p>
          </div>
        </div>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-bold text-slate-500">
          <span className="hover:text-indigo-600 cursor-pointer transition-colors">Guías CARE</span>
          <span className="hover:text-indigo-600 cursor-pointer transition-colors">Metodología</span>
          <span className="bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full border border-indigo-100 shadow-sm">Modo: Editor Senior</span>
        </nav>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-10 relative z-10">
        {children}
      </main>
      <footer className="bg-white/50 backdrop-blur-sm border-t border-indigo-50 py-8 px-6 text-center">
        <p className="text-xs text-slate-400 font-medium tracking-wide">© 2024 Herramienta de Soporte Editorial Pediátrico. Diseñado con excelencia clínica para investigadores.</p>
      </footer>
    </div>
  );
};


import React, { useState } from 'react';
import type { EditorAnalysis } from '../types';

interface ResultDisplayProps {
  analysis: EditorAnalysis;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ analysis }) => {
  const [activeTab, setActiveTab] = useState<'review' | 'manuscript' | 'tables' | 'discussion'>('review');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const TabButton = ({ id, label, icon }: { id: typeof activeTab, label: string, icon: React.ReactNode }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-2 px-6 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
        activeTab === id 
        ? 'border-blue-600 text-blue-600 bg-blue-50/50' 
        : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Tabs Header */}
      <div className="flex border-b border-slate-200 overflow-x-auto scrollbar-hide bg-slate-50/30">
        <TabButton id="review" label="Revisión Editorial" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        <TabButton id="manuscript" label="Texto Mejorado" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>} />
        <TabButton id="tables" label="Tablas e Ideas" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>} />
        <TabButton id="discussion" label="Puntos Críticos" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
      </div>

      <div className="p-6 md:p-10 bg-white">
        
        {/* TAB: REVIEW - SUGGESTIONS */}
        {activeTab === 'review' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-100">
              <div className="max-w-xl">
                <h3 className="text-2xl font-black serif-title mb-2">Evaluación del Editor</h3>
                <p className="text-blue-100 text-sm leading-relaxed italic">"{analysis.scoreExplanation}"</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex flex-col items-center min-w-[120px]">
                <span className="text-5xl font-black">{analysis.score}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Puntaje Q1</span>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-slate-900 font-bold text-xl flex items-center">
                <span className="bg-amber-100 text-amber-600 p-1.5 rounded-lg mr-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </span>
                Optimización de Dicción y Estilo
              </h4>
              
              <div className="grid gap-6">
                {analysis.styleSuggestions.map((s, i) => (
                  <div key={i} className="group border border-slate-100 rounded-2xl overflow-hidden hover:border-blue-200 transition-all shadow-sm">
                    <div className="bg-slate-50 px-5 py-2 flex items-center justify-between border-b border-slate-100">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{s.category}</span>
                      <button 
                        onClick={() => copyToClipboard(s.replacement, `sugg-${i}`)}
                        className={`text-xs font-bold transition-all flex items-center space-x-1 ${copiedId === `sugg-${i}` ? 'text-green-600' : 'text-blue-600 hover:text-blue-700'}`}
                      >
                        {copiedId === `sugg-${i}` ? <span>¡Copiado!</span> : <span>Copiar Propuesta</span>}
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3" /></svg>
                      </button>
                    </div>
                    <div className="p-5 grid md:grid-cols-2 gap-4 items-center">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-red-400 uppercase">Texto Original</span>
                        <p className="text-sm text-slate-500 line-through decoration-red-200">{s.original}</p>
                      </div>
                      <div className="space-y-1 bg-blue-50/30 p-3 rounded-lg border border-blue-50">
                        <span className="text-[9px] font-bold text-blue-500 uppercase">Propuesta Editorial</span>
                        <p className="text-sm text-slate-900 font-semibold">{s.replacement}</p>
                      </div>
                    </div>
                    <div className="px-5 py-3 bg-slate-50/50">
                      <p className="text-[11px] text-slate-500 italic"><span className="font-bold">Nota del Editor:</span> {s.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: MANUSCRIPT */}
        {activeTab === 'manuscript' && (
          <div className="animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-slate-900 serif-title">Manuscrito Académico</h3>
              <button 
                onClick={() => copyToClipboard(analysis.improvedText, 'full-text')}
                className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-xl transition-all"
              >
                {copiedId === 'full-text' ? <span>¡Copiado al Portapapeles!</span> : <span>Copiar Texto Completo</span>}
              </button>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 md:p-16 font-serif text-slate-800 text-lg leading-loose shadow-inner selection:bg-blue-100">
              <div className="whitespace-pre-wrap">{analysis.improvedText}</div>
            </div>
          </div>
        )}

        {/* TAB: TABLES & IDEAS */}
        {activeTab === 'tables' && (
          <div className="animate-in fade-in duration-500 space-y-12">
            
            {/* Real Tables */}
            <section className="space-y-6">
              <h3 className="text-xl font-bold text-slate-900 serif-title border-b border-slate-100 pb-2">Tablas Extraídas del Texto</h3>
              {analysis.tables.length > 0 ? (
                analysis.tables.map((table, tIdx) => (
                  <div key={tIdx} className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
                      <h4 className="font-bold text-sm">{table.title}</h4>
                      <button 
                         className="text-[10px] font-bold bg-white/10 hover:bg-white/20 px-3 py-1 rounded uppercase transition-colors"
                         onClick={() => copyToClipboard(table.rows.map(r => r.join('\t')).join('\n'), `table-real-${tIdx}`)}
                      >
                         {copiedId === `table-real-${tIdx}` ? 'Copiado' : 'Copiar para Excel'}
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead className="bg-slate-50 border-b-2 border-slate-900">
                          <tr>
                            {table.headers.map((h, i) => (
                              <th key={i} className="px-6 py-4 text-left font-black uppercase tracking-wider text-slate-900">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {table.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-blue-50/30 transition-colors">
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className={`px-6 py-4 text-slate-700 ${rIdx === table.rows.length - 1 ? 'border-b-2 border-slate-900' : ''}`}>{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 text-sm font-medium italic">No se hallaron datos estructurables en el borrador.</p>
                </div>
              )}
            </section>

            {/* Table Ideas */}
            <section className="space-y-6">
              <h3 className="text-xl font-bold text-slate-900 serif-title border-b border-slate-100 pb-2 flex items-center">
                Ideas Estratégicas para Tablas
                <span className="ml-3 bg-emerald-100 text-emerald-600 text-[10px] px-2 py-0.5 rounded-full uppercase font-black">Recomendado Q1</span>
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {analysis.tableIdeas.map((idea, i) => (
                  <div key={i} className="bg-emerald-50/30 border border-emerald-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                    <h4 className="text-emerald-900 font-bold mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                      {idea.title}
                    </h4>
                    <p className="text-xs text-emerald-800/70 mb-4 italic leading-relaxed">{idea.rational}</p>
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Columnas Sugeridas:</span>
                      <div className="flex flex-wrap gap-2">
                        {idea.suggestedColumns.map((col, cIdx) => (
                          <span key={cIdx} className="bg-white border border-emerald-100 text-emerald-700 px-2 py-1 rounded-md text-[10px] font-bold shadow-sm">
                            {col}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* TAB: DISCUSSION */}
        {activeTab === 'discussion' && (
          <div className="animate-in fade-in duration-500 max-w-3xl mx-auto space-y-10">
            <h3 className="text-2xl font-bold text-slate-900 serif-title mb-6">Puntos Críticos para la Discusión</h3>
            <div className="space-y-6">
              {analysis.discussionPoints.map((point, idx) => (
                <div key={idx} className="flex gap-6 p-6 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100">
                  <span className="text-3xl font-black text-slate-200">{idx + 1}</span>
                  <p className="text-slate-700 leading-relaxed text-md">{point}</p>
                </div>
              ))}
            </div>
            <div className="bg-slate-900 text-white p-10 rounded-3xl relative overflow-hidden shadow-2xl">
              <div className="relative z-10">
                <h4 className="font-bold text-xl mb-3 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                  Recordatorio Editorial
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Los revisores de revistas Q1 valoran la autocrítica. Incluir una sección de "Limitaciones del reporte" y "Perspectiva del paciente/familia" suele ser determinante para la aceptación.
                </p>
              </div>
              <div className="absolute -bottom-10 -right-10 opacity-10">
                <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.45l8.28 14.55H3.72L12 5.45zM11 16h2v2h-2v-2zm0-7h2v5h-2V9z"/></svg>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};


import React, { useState, useRef } from 'react';
import { EditorLayout } from './components/EditorLayout';
import { ResultDisplay } from './components/ResultDisplay';
import { analyzeCaseReport } from './services/geminiService';
import { EditorAnalysis, AppStatus } from './types';
import * as pdfjsLib from 'pdfjs-dist';

// Configurar el worker de PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@4.10.38/build/pdf.worker.mjs`;

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [isExtractingPdf, setIsExtractingPdf] = useState(false);
  const [analysis, setAnalysis] = useState<EditorAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    setStatus(AppStatus.LOADING);
    setError(null);
    
    try {
      const result = await analyzeCaseReport(inputText);
      setAnalysis(result);
      setStatus(AppStatus.SUCCESS);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al procesar el reporte. Por favor, verifica tu conexión o API key.');
      setStatus(AppStatus.ERROR);
    }
  };

  const extractTextFromPdf = async (file: File) => {
    setIsExtractingPdf(true);
    setError(null);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");
        fullText += pageText + "\n";
      }
      
      setInputText(fullText.trim());
    } catch (err) {
      console.error("PDF Extraction Error:", err);
      setError("No se pudo extraer el texto del PDF. Asegúrate de que no esté protegido o escaneado como imagen.");
    } finally {
      setIsExtractingPdf(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      extractTextFromPdf(file);
    } else if (file) {
      setError("Por favor, sube un archivo PDF válido.");
    }
  };

  const handleReset = () => {
    setAnalysis(null);
    setStatus(AppStatus.IDLE);
    setInputText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const exampleText = `Paciente de 4 años que llega a consulta con fiebre de 3 días. Tiene una mancha en la pierna que parece celulitis. El niño está decaído pero come algo. Le dimos amoxicilina ayer pero sigue igual. No tiene alergias. Peso 16kg. Talla 102cm. FC 110, FR 24, T 38.5.`;

  return (
    <EditorLayout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Input Section */}
        <div className={`lg:col-span-5 space-y-8 ${status === AppStatus.SUCCESS ? 'lg:sticky lg:top-28' : ''}`}>
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl shadow-indigo-100/50 p-8 md:p-10 border border-white">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-slate-900 serif-title tracking-tight">Borrador Clínico</h2>
              <p className="text-sm text-slate-500 mt-2 font-medium">Inicie pegando su texto o cargando el manuscrito original.</p>
            </div>

            {/* PDF Upload Area */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`mb-8 border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer flex flex-col items-center justify-center space-y-4 group
                ${isExtractingPdf ? 'bg-indigo-50 border-indigo-300' : 'bg-slate-50 border-slate-200 hover:border-indigo-400 hover:bg-white hover:shadow-lg'}`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".pdf" 
                onChange={handleFileChange} 
              />
              {isExtractingPdf ? (
                <div className="flex flex-col items-center animate-pulse text-indigo-600">
                  <svg className="w-10 h-10 mb-2 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span className="text-sm font-black uppercase tracking-widest">Digitalizando PDF...</span>
                </div>
              ) : (
                <>
                  <div className="bg-white p-4 rounded-2xl shadow-sm group-hover:scale-110 transition-transform text-indigo-600">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  </div>
                  <div className="text-center">
                    <p className="text-md font-bold text-slate-700">Subir Manuscrito (PDF)</p>
                    <p className="text-xs text-slate-400 font-medium">Extraemos el texto clínico al instante</p>
                  </div>
                </>
              )}
            </div>

            <div className="relative group">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Introduzca los datos del paciente o pegue el reporte aquí..."
                className="w-full min-h-[350px] p-6 text-slate-700 bg-white/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none resize-none font-serif text-lg leading-relaxed shadow-inner"
                disabled={status === AppStatus.LOADING || isExtractingPdf}
              />
              {status === AppStatus.IDLE && inputText === '' && !isExtractingPdf && (
                <button 
                  onClick={() => setInputText(exampleText)}
                  className="absolute bottom-6 right-6 text-xs font-bold text-indigo-600 bg-white px-4 py-2 rounded-xl hover:bg-indigo-50 transition-all shadow-md border border-indigo-50"
                >
                  Cargar Caso Ejemplo
                </button>
              )}
            </div>

            <div className="mt-8 flex flex-col space-y-4">
              <button
                onClick={handleAnalyze}
                disabled={status === AppStatus.LOADING || isExtractingPdf || !inputText.trim()}
                className={`w-full py-5 rounded-2xl font-black text-white shadow-2xl transition-all flex items-center justify-center space-x-3 tracking-widest uppercase text-sm ${
                  status === AppStatus.LOADING || isExtractingPdf || !inputText.trim() 
                  ? 'bg-slate-300 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 active:scale-95 shadow-indigo-200 hover:shadow-indigo-300'
                }`}
              >
                {status === AppStatus.LOADING ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span>Optimizando Manuscrito...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    <span>Transformar a Editorial Q1</span>
                  </>
                )}
              </button>
              
              {status === AppStatus.SUCCESS && (
                <button
                  onClick={handleReset}
                  className="w-full py-3 text-slate-400 hover:text-indigo-600 font-bold text-xs transition-colors flex items-center justify-center uppercase tracking-widest"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  Nuevo Análisis
                </button>
              )}
            </div>

            {error && (
              <div className="mt-6 p-5 bg-rose-50 border border-rose-100 rounded-2xl flex items-center space-x-4 shadow-sm animate-bounce">
                <div className="bg-rose-100 p-2 rounded-full text-rose-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                </div>
                <p className="text-xs text-rose-700 font-bold">{error}</p>
              </div>
            )}
          </div>

          <div className="bg-white/40 backdrop-blur-sm border border-indigo-100/50 rounded-3xl p-8 text-sm text-indigo-900 shadow-xl">
            <h4 className="font-black mb-4 flex items-center uppercase tracking-widest text-indigo-700">
              <span className="bg-indigo-100 p-1.5 rounded-lg mr-3">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
              </span>
              Checklist CARE de Rigor
            </h4>
            <ul className="space-y-3 opacity-90">
              <li className="flex items-center font-bold text-xs"><svg className="w-4 h-4 mr-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg> Título: "Case Report" incluido</li>
              <li className="flex items-center font-bold text-xs"><svg className="w-4 h-4 mr-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg> Evolución Cronológica Detallada</li>
              <li className="flex items-center font-bold text-xs"><svg className="w-4 h-4 mr-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg> Justificación Metodológica</li>
              <li className="flex items-center font-bold text-xs"><svg className="w-4 h-4 mr-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg> Consentimiento Ético Explícito</li>
            </ul>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-7">
          {status === AppStatus.IDLE && (
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-dashed border-indigo-200 p-20 flex flex-col items-center justify-center text-center shadow-inner">
              <div className="bg-white p-8 rounded-full mb-8 shadow-xl text-indigo-300">
                <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-400 serif-title">Soporte Editorial Inteligente</h3>
              <p className="text-slate-400 text-sm max-w-sm mt-4 leading-relaxed font-medium">Cargue un manuscrito para que el sistema realice una revisión exhaustiva basada en estándares de alto impacto (Q1).</p>
            </div>
          )}

          {status === AppStatus.LOADING && (
            <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-20 flex flex-col items-center justify-center text-center space-y-8">
              <div className="relative">
                <div className="w-28 h-28 border-[6px] border-indigo-50 border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-12 h-12 text-indigo-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-slate-800 serif-title tracking-tight">Evaluando Rigor Científico</h3>
                <p className="text-slate-500 text-sm font-medium">Consultando corpus bibliográfico para optimizar la discusión...</p>
              </div>
              <div className="w-full max-w-xs space-y-2">
                 <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 animate-[loading_2s_ease-in-out_infinite]" style={{ width: '45%' }}></div>
                 </div>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Nivel de procesamiento: Avanzado</p>
              </div>
            </div>
          )}

          {status === AppStatus.SUCCESS && analysis && (
            <ResultDisplay analysis={analysis} />
          )}

          {status === AppStatus.ERROR && (
            <div className="bg-white rounded-3xl shadow-2xl border border-rose-100 p-20 flex flex-col items-center justify-center text-center">
               <div className="bg-rose-50 p-8 rounded-full mb-8 shadow-inner">
                <svg className="w-20 h-20 text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-rose-600 serif-title">Incidencia en el Procesamiento</h3>
              <p className="text-slate-500 text-sm max-w-sm mt-4 font-medium leading-relaxed">{error}</p>
              <button 
                onClick={handleAnalyze}
                className="mt-10 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 shadow-xl"
              >
                Reintentar Análisis
              </button>
            </div>
          )}
        </div>

      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
      `}</style>
    </EditorLayout>
  );
};

export default App;

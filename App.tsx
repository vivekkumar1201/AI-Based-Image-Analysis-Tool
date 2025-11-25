
import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Sparkles, 
  Download, 
  AlertCircle, 
  RefreshCw, 
  LayoutTemplate, 
  Settings, 
  FileText,
  ChevronRight,
  CheckCircle2,
  Clock
} from 'lucide-react';
import ImageUploader from './components/ImageUploader';
import { generateImageReport } from './services/geminiService';
import { FileData, AppStatus } from './types';

// Tabs
enum Tab {
  SETUP = 'SETUP',
  REPORT = 'REPORT'
}

function App() {
  const [apiKey, setApiKey] = useState('');
  const [imageA, setImageA] = useState<FileData | null>(null);
  const [imageB, setImageB] = useState<FileData | null>(null);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [reportHtml, setReportHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.SETUP);
  
  // New configuration states
  const [reportTitle, setReportTitle] = useState('Technical Image Analysis Report');
  const [reportId, setReportId] = useState(() => `QA-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`);

  useEffect(() => {
    if (process.env.API_KEY) {
      setApiKey(process.env.API_KEY);
    }
  }, []);

  // Auto-switch tabs on completion
  useEffect(() => {
    if (status === AppStatus.COMPLETE) {
      setActiveTab(Tab.REPORT);
    }
  }, [status]);

  const handleGenerate = async () => {
    if (!imageA || !imageB || !apiKey) return;

    setStatus(AppStatus.ANALYZING);
    setError(null);
    setReportHtml(null);

    try {
      const html = await generateImageReport(apiKey, imageA, imageB, reportTitle, reportId);
      setReportHtml(html);
      setStatus(AppStatus.COMPLETE);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      setStatus(AppStatus.ERROR);
    }
  };

  const handleDownload = () => {
    if (!reportHtml) return;
    const blob = new Blob([reportHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `QA_Report_${reportId}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const regenerateId = () => {
    setReportId(`QA-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-indigo-500/20">
            <Camera className="text-white w-5 h-5" />
          </div>
          <div>
             <h1 className="font-bold text-slate-100 text-sm tracking-wide">GEMINI STUDIO</h1>
             <span className="text-[10px] text-emerald-500 font-bold uppercase font-mono tracking-wider">Enterprise v1.0 (Stable)</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab(Tab.SETUP)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === Tab.SETUP ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
          >
            <LayoutTemplate size={18} />
            <span>Project Setup</span>
          </button>
          
          <button 
            onClick={() => status === AppStatus.COMPLETE && setActiveTab(Tab.REPORT)}
            disabled={status !== AppStatus.COMPLETE}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors 
              ${activeTab === Tab.REPORT ? 'bg-slate-800 text-white' : 'text-slate-400'}
              ${status !== AppStatus.COMPLETE ? 'opacity-50 cursor-not-allowed' : 'hover:text-white hover:bg-slate-800/50'}
            `}
          >
            <div className="flex items-center gap-3">
              <FileText size={18} />
              <span>Analysis Report</span>
            </div>
            {status === AppStatus.COMPLETE && <CheckCircle2 size={14} className="text-emerald-500" />}
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
            <div className="flex items-center gap-2 mb-2">
              <Settings size={14} className="text-slate-500" />
              <span className="text-xs font-semibold text-slate-400">System Status</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">API</span>
              <span className={apiKey ? "text-emerald-500 font-mono" : "text-amber-500 font-mono"}>
                {apiKey ? 'CONNECTED' : 'MISSING'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-slate-500">Model</span>
              <span className="text-indigo-400 font-mono">Flash 2.5</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative">
        
        {/* Mobile Header (simplified) */}
        <div className="md:hidden h-14 bg-slate-900 border-b border-slate-800 flex items-center px-4 justify-between">
           <span className="font-bold text-white">Gemini Studio</span>
           <div className="flex gap-2">
             <button onClick={() => setActiveTab(Tab.SETUP)} className={`p-2 rounded ${activeTab === Tab.SETUP ? 'bg-slate-800' : ''}`}><LayoutTemplate size={18}/></button>
             <button onClick={() => status === AppStatus.COMPLETE && setActiveTab(Tab.REPORT)} className={`p-2 rounded ${activeTab === Tab.REPORT ? 'bg-slate-800' : ''}`} disabled={status !== AppStatus.COMPLETE}><FileText size={18}/></button>
           </div>
        </div>

        {/* Top Bar / Breadcrumb */}
        <header className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-8">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span>Projects</span>
            <ChevronRight size={14} />
            <span className="text-white font-medium">Image Comparison QA</span>
          </div>

          <div className="flex items-center gap-4">
            {status === AppStatus.ANALYZING && (
              <div className="flex items-center gap-2 text-indigo-400 text-sm bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20 animate-pulse">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
                <span>Processing Analysis...</span>
              </div>
            )}
             {status === AppStatus.COMPLETE && (
              <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                <CheckCircle2 size={14} />
                <span>Report Ready</span>
              </div>
            )}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-slate-950 p-6 md:p-8">
          <div className="max-w-6xl mx-auto h-full">

            {/* TAB: SETUP */}
            <div className={`${activeTab === Tab.SETUP ? 'block' : 'hidden'} animate-in fade-in duration-300`}>
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 md:p-8 shadow-sm">
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-white mb-2">New Analysis Task</h2>
                  <p className="text-slate-400">Configure your inputs. The system will generate a standardized comparison report.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <ImageUploader 
                    label="Reference Asset (Image A)" 
                    selectedImage={imageA} 
                    onImageSelected={setImageA} 
                    disabled={status === AppStatus.ANALYZING}
                  />
                  <ImageUploader 
                    label="Comparison Asset (Image B)" 
                    selectedImage={imageB} 
                    onImageSelected={setImageB}
                    disabled={status === AppStatus.ANALYZING}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 border-t border-slate-800 pt-8">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">Report Title</label>
                    <input 
                      type="text" 
                      value={reportTitle}
                      onChange={(e) => setReportTitle(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
                      placeholder="e.g. Technical Image Analysis Report"
                      disabled={status === AppStatus.ANALYZING}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">Report ID</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={reportId}
                        onChange={(e) => setReportId(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors font-mono"
                        disabled={status === AppStatus.ANALYZING}
                      />
                      <button 
                        onClick={regenerateId}
                        disabled={status === AppStatus.ANALYZING}
                        className="absolute right-2 top-1.5 p-1 text-slate-500 hover:text-indigo-400 disabled:opacity-50"
                        title="Generate New ID"
                      >
                        <RefreshCw size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-950/30 border border-red-900/50 rounded-lg flex items-start gap-3 text-red-200">
                    <AlertCircle size={20} className="shrink-0 mt-0.5" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-800">
                   {status === AppStatus.COMPLETE && (
                      <button 
                        onClick={() => setActiveTab(Tab.REPORT)}
                        className="text-sm text-slate-400 hover:text-white transition-colors"
                      >
                        View Existing Report
                      </button>
                   )}
                   <button
                    onClick={handleGenerate}
                    disabled={!imageA || !imageB || !apiKey || status === AppStatus.ANALYZING}
                    className={`
                      px-6 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2 shadow-lg
                      ${!imageA || !imageB || !apiKey 
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none' 
                        : status === AppStatus.ANALYZING
                          ? 'bg-indigo-600 text-white cursor-wait'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'
                      }
                    `}
                  >
                    {status === AppStatus.ANALYZING ? (
                      <>
                        <Clock size={16} className="animate-spin" />
                        <span>Running Analysis...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        <span>Run Comparison</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* TAB: REPORT */}
            <div className={`${activeTab === Tab.REPORT ? 'block' : 'hidden'} h-full flex flex-col`}>
              {reportHtml ? (
                <div className="h-full flex flex-col gap-4 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between bg-slate-900 p-4 rounded-lg border border-slate-800">
                     <div className="flex gap-4 text-sm">
                       <div className="flex flex-col">
                         <span className="text-slate-500 text-xs uppercase">Reference</span>
                         <span className="text-slate-200 font-mono">{imageA?.file.name}</span>
                       </div>
                       <div className="w-px bg-slate-800"></div>
                       <div className="flex flex-col">
                         <span className="text-slate-500 text-xs uppercase">Comparison</span>
                         <span className="text-slate-200 font-mono">{imageB?.file.name}</span>
                       </div>
                     </div>
                     <div className="flex gap-2">
                       <button 
                        onClick={() => setActiveTab(Tab.SETUP)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        title="Edit Inputs"
                       >
                         <Settings size={18} />
                       </button>
                       <button 
                        onClick={handleDownload}
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm border border-slate-700 transition-colors"
                       >
                         <Download size={16} />
                         <span>Export HTML</span>
                       </button>
                     </div>
                  </div>

                  <div className="flex-1 bg-white rounded-lg shadow-xl overflow-hidden border border-slate-700 relative">
                    <iframe
                      title="Report Preview"
                      srcDoc={reportHtml}
                      className="w-full h-full absolute inset-0"
                      style={{ border: 'none' }}
                    />
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600">
                   <FileText size={48} className="mb-4 opacity-20" />
                   <p>No report generated yet.</p>
                   <button onClick={() => setActiveTab(Tab.SETUP)} className="text-indigo-400 hover:underline mt-2 text-sm">Go to Setup</button>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
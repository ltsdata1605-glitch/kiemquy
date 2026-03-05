import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { domToPng } from 'modern-screenshot';
import { DenominationCount, AuditState } from './types';
import { INITIAL_DENOMINATIONS } from './constants';
import { saveCurrentState, loadCurrentState, saveVersion, loadAllVersions, loadVersion } from './db';
import Header from './components/Header';
import Summary from './components/Summary';
import DenominationTable from './components/DenominationTable';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [auditorName, setAuditorName] = useState('');
  const [erpCash, setErpCash] = useState(0);
  const [denominations, setDenominations] = useState<DenominationCount[]>(INITIAL_DENOMINATIONS);
  const [notes, setNotes] = useState('');
  const [auditTimestamp, setAuditTimestamp] = useState(new Date().toISOString());
  const [isLoaded, setIsLoaded] = useState(false);
  const [savedVersions, setSavedVersions] = useState<AuditState[]>([]);
  const [loadedVersionInfo, setLoadedVersionInfo] = useState<AuditState | null>(null);
  const [isInIframe, setIsInIframe] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Detect if the app is running in an iframe
    try {
      setIsInIframe(window.self !== window.top);
    } catch (e) {
      // Cross-origin error also means it's in an iframe
      setIsInIframe(true);
    }
  }, []);

  const loadAndSetVersions = useCallback(async () => {
    const versions = await loadAllVersions();
    setSavedVersions(versions);
  }, []);

  useEffect(() => {
    const loadState = async () => {
      const savedState = await loadCurrentState();
      if (savedState) {
        setAuditorName(savedState.auditorName);
        setErpCash(savedState.erpCash);
        setDenominations(savedState.denominations);
        setAuditTimestamp(savedState.auditTimestamp);
        setNotes(savedState.notes || '');
      }
      await loadAndSetVersions();
      setIsLoaded(true);
    };
    loadState();
  }, [loadAndSetVersions]);

  useEffect(() => {
    if (!isLoaded) return;

    const stateToSave: Omit<AuditState, 'id'> = {
      auditorName,
      erpCash,
      denominations,
      notes,
      auditTimestamp: new Date().toISOString(),
    };

    const debounceSave = setTimeout(() => {
      saveCurrentState(stateToSave);
      setAuditTimestamp(stateToSave.auditTimestamp);
    }, 1000);

    return () => clearTimeout(debounceSave);
  }, [auditorName, erpCash, denominations, notes, isLoaded]);

  const actualCash = useMemo(() => {
    return denominations.reduce((total, item) => total + item.value * item.count, 0);
  }, [denominations]);

  const difference = useMemo(() => actualCash - erpCash, [actualCash, erpCash]);

  const handleDenominationChange = useCallback((value: number, count: number) => {
    if (loadedVersionInfo) setLoadedVersionInfo(null);
    setDenominations((prev) =>
      prev.map((item) => (item.value === value ? { ...item, count: isNaN(count) ? 0 : count } : item))
    );
  }, [loadedVersionInfo]);

  const handleAuditorNameChange = (name: string) => {
    if(loadedVersionInfo) setLoadedVersionInfo(null);
    setAuditorName(name);
  };

  const handleErpCashChange = (value: number) => {
      if(loadedVersionInfo) setLoadedVersionInfo(null);
      setErpCash(value);
  };
    
  const handleNotesChange = (notesValue: string) => {
      if(loadedVersionInfo) setLoadedVersionInfo(null);
      setNotes(notesValue);
  };

  const handleExportImage = useCallback(async () => {
    const element = printRef.current;
    if (!element) return;
    
    try {
      element.classList.add('is-exporting');
      // Give a bit of time for the class to apply and any layout to settle
      await new Promise(resolve => setTimeout(resolve, 300));

      const dataUrl = await domToPng(element, {
        scale: 2,
        backgroundColor: '#ffffff',
      });

      const link = document.createElement('a');
      const date = new Date().toISOString().split('T')[0];
      link.download = `kiem-quy-910-${date}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Error exporting image:', error);
      alert('Có lỗi khi xuất ảnh. Vui lòng thử lại.');
    } finally {
      element.classList.remove('is-exporting');
    }
  }, []);
  
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleReset = useCallback(() => {
    setAuditorName('');
    setErpCash(0);
    setDenominations(INITIAL_DENOMINATIONS);
    setNotes('');
    setAuditTimestamp(new Date().toISOString());
    setLoadedVersionInfo(null);
  }, []);

  const handleSaveVersion = useCallback(async () => {
    const stateToSave: Omit<AuditState, 'id'> = {
      auditorName,
      erpCash,
      denominations,
      notes,
      auditTimestamp: new Date().toISOString(),
    };
    await saveVersion(stateToSave);
    alert('Phiên bản đã được lưu!');
    await loadAndSetVersions(); // Refresh the list
  }, [auditorName, erpCash, denominations, notes, loadAndSetVersions]);

  const handleLoadVersion = useCallback(async (idStr: string) => {
    const id = Number(idStr);
    if (!id) return;
    const versionToLoad = await loadVersion(id);
    if (versionToLoad) {
      setAuditorName(versionToLoad.auditorName);
      setErpCash(versionToLoad.erpCash);
      setDenominations(versionToLoad.denominations);
      setAuditTimestamp(versionToLoad.auditTimestamp);
      setNotes(versionToLoad.notes || '');
      setLoadedVersionInfo(versionToLoad);
    } else {
      console.error('Không thể tải phiên bản.');
    }
  }, []);


  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const inputs = Array.from(document.querySelectorAll('input[type="text"], textarea'));
      const currentIndex = inputs.indexOf(e.currentTarget);
      const nextInput = inputs[currentIndex + 1];
      if (nextInput instanceof HTMLInputElement || nextInput instanceof HTMLTextAreaElement) {
        nextInput.focus();
        if (nextInput instanceof HTMLInputElement) nextInput.select();
      }
    }
  }, []);

  const formatCurrency = (value: number) => new Intl.NumberFormat('vi-VN').format(value);

  const getDifferenceStyles = () => {
    if (difference < 0) return { bgColor: 'bg-red-50', textColor: 'text-red-600', borderColor: 'border-red-200' };
    if (difference > 0) return { bgColor: 'bg-blue-50', textColor: 'text-blue-600', borderColor: 'border-blue-200' };
    return { bgColor: 'bg-green-50', textColor: 'text-green-600', borderColor: 'border-green-200' };
  };

  const diffStyles = getDifferenceStyles();

  return (
    <div className="h-screen flex flex-col bg-slate-50 font-sans overflow-hidden">
      {/* Fixed Top Section */}
      <Header 
          onPrint={handlePrint} 
          onExportImage={handleExportImage} 
          onReset={handleReset}
          onSaveVersion={handleSaveVersion}
          onLoadVersion={handleLoadVersion}
          savedVersions={savedVersions}
          isInIframe={isInIframe}
      />
      
      <Summary
        auditorName={auditorName}
        setAuditorName={handleAuditorNameChange}
        erpCash={erpCash}
        setErpCash={handleErpCashChange}
        loadedVersionInfo={loadedVersionInfo}
      />

      {/* Scrollable Middle Section */}
      <main id="printable-area" ref={printRef} className="flex-grow overflow-y-auto bg-white print:overflow-visible print:h-auto export:overflow-visible export:h-auto">
        {/* Export/Print Header */}
        <div className="hidden export:block print:block p-6 text-black border-b-2 border-slate-800">
          <div className="text-center mb-6">
            <h2 className="text-xl font-black uppercase tracking-tighter text-slate-900">Biên Bản Kiểm Quỹ</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Cụm 910 - {new Date(auditTimestamp).toLocaleDateString('vi-VN')}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6">
            <div className="space-y-1">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Người kiểm</span>
              <p className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-1">{auditorName || '...'}</p>
            </div>
            <div className="space-y-1 text-right">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Số tiền ERP</span>
              <p className="text-sm font-bold text-indigo-600 border-b border-slate-100 pb-1">{formatCurrency(erpCash)}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Tổng cộng thực tế</span>
              <p className="text-sm font-bold text-emerald-600 border-b border-slate-100 pb-1">{formatCurrency(actualCash)}</p>
            </div>
            <div className="space-y-1 text-right">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Chênh lệch</span>
              <p className={`text-sm font-bold border-b border-slate-100 pb-1 ${difference < 0 ? 'text-red-600' : difference > 0 ? 'text-blue-600' : 'text-green-600'}`}>
                {formatCurrency(difference)}
              </p>
            </div>
          </div>
          
          <div className="text-[9px] text-slate-400 italic text-center">
            Thời gian hệ thống: {new Date(auditTimestamp).toLocaleString('vi-VN')}
          </div>
        </div>

        <DenominationTable
          denominations={denominations}
          onCountChange={handleDenominationChange}
          totalAmount={actualCash}
          difference={difference}
          erpCash={erpCash}
        />

        <div className="p-4 bg-slate-50 border-t border-slate-100">
           <label htmlFor="notes-main" className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Ghi chú:</label>
           <textarea
             id="notes-main"
             value={notes}
             onChange={(e) => setNotes(e.target.value)}
             onKeyDown={handleKeyDown}
             placeholder="Thêm ghi chú..."
             rows={2}
             className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white shadow-sm export:hidden print:hidden"
           />
           <div className="hidden export:block print:block p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 text-sm mt-1 whitespace-pre-wrap">
             {notes || 'Không có ghi chú'}
           </div>
        </div>

        {/* Export-only Footer */}
        <div className="hidden export:block p-6 text-center border-t border-slate-100 bg-slate-50/50">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ứng dụng Kiểm kê Tiền mặt</p>
          <p className="text-[8px] text-slate-300 mt-1">Hệ thống quản lý nội bộ - Cụm 910</p>
        </div>
      </main>

      {/* Fixed Bottom Bar */}
      <div className="bg-white border-t border-slate-200 p-2 sm:p-4 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] print:hidden">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Tổng cộng</span>
            <span className="text-lg font-black text-indigo-700 leading-none">{formatCurrency(actualCash)}</span>
          </div>

          <div className={`flex flex-col items-end px-3 py-1 rounded-lg border ${diffStyles.borderColor} ${diffStyles.bgColor}`}>
            <span className={`text-[10px] font-bold uppercase ${diffStyles.textColor}`}>Chênh lệch</span>
            <span className={`text-lg font-black leading-none ${diffStyles.textColor}`}>{formatCurrency(difference)}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportImage}
              className="flex items-center justify-center h-10 w-10 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors"
              title="Xuất ảnh"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>
            </button>
            
            {isInIframe ? (
              <a
                href={window.location.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-10 w-10 bg-slate-600 text-white rounded-xl hover:bg-slate-500 transition-colors"
                title="Mở tab mới để in"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </a>
            ) : (
              <button
                onClick={handlePrint}
                className="flex items-center justify-center h-10 w-10 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                title="In"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7"></path><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
              </button>
            )}
          </div>
        </div>
      </div>
      
      <Footer auditTimestamp={auditTimestamp} />
    </div>
  );
};

export default App;
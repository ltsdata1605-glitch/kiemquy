import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';
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
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      const link = document.createElement('a');
      link.download = `kiem-quy-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error exporting image:', error);
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


  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Header 
            onPrint={handlePrint} 
            onExportImage={handleExportImage} 
            onReset={handleReset}
            onSaveVersion={handleSaveVersion}
            onLoadVersion={handleLoadVersion}
            savedVersions={savedVersions}
            isInIframe={isInIframe}
        />
        <main id="printable-area" ref={printRef} className="bg-white p-6 sm:p-8 rounded-xl shadow-lg mt-6 lg:grid lg:grid-cols-2 lg:gap-8 print:block print:shadow-none print:p-0">
          
          {/* Print-only Header: Appears only when printing */}
          <div className="hidden print:block col-span-2 text-center mb-4 text-black">
            <h2 className="text-xl font-bold">BIÊN BẢN KIỂM QUỸ - CỤM 910</h2>
            <p className="text-sm">{`Lúc: ${new Date(auditTimestamp).toLocaleString('vi-VN')}`}</p>
          </div>

          <Summary
            auditorName={auditorName}
            setAuditorName={handleAuditorNameChange}
            erpCash={erpCash}
            setErpCash={handleErpCashChange}
            actualCash={actualCash}
            difference={difference}
            notes={notes}
            setNotes={handleNotesChange}
            loadedVersionInfo={loadedVersionInfo}
          />
          
          <DenominationTable
            denominations={denominations}
            onCountChange={handleDenominationChange}
            totalAmount={actualCash}
          />
          
        </main>
        <Footer auditTimestamp={auditTimestamp} />
      </div>
    </div>
  );
};

export default App;
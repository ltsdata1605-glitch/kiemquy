import React from 'react';
import { AuditState } from '../types';

interface SummaryProps {
  auditorName: string;
  setAuditorName: (name: string) => void;
  erpCash: number;
  setErpCash: (value: number) => void;
  loadedVersionInfo: AuditState | null;
}

const Summary: React.FC<SummaryProps> = ({
  auditorName,
  setAuditorName,
  erpCash,
  setErpCash,
  loadedVersionInfo,
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  const handleErpCashChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = parseInt(e.target.value.replace(/\./g, ''), 10) || 0;
    setErpCash(numericValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const inputs = Array.from(document.querySelectorAll('input[type="text"], textarea'));
      const currentIndex = inputs.indexOf(e.currentTarget);
      const nextInput = inputs[currentIndex + 1];
      if (nextInput instanceof HTMLInputElement || nextInput instanceof HTMLTextAreaElement) {
        nextInput.focus();
        if (nextInput instanceof HTMLInputElement) nextInput.select();
      }
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2 p-2 bg-slate-100 border-b border-slate-200 shrink-0 print:border-b print:border-dashed print:p-4">
       <div className="flex items-center bg-white border border-slate-300 rounded-lg px-2 py-1 shadow-sm">
        <span className="text-[10px] font-bold text-slate-400 uppercase mr-2 shrink-0">Người kiểm</span>
        <input
          id="auditorName"
          type="text"
          value={auditorName}
          onChange={(e) => setAuditorName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="..."
          className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none"
        />
      </div>

      <div className="flex items-center bg-indigo-50 border border-indigo-200 rounded-lg px-2 py-1 shadow-sm">
          <span className="text-[10px] font-bold text-indigo-400 uppercase mr-2 shrink-0">ERP</span>
          <input
            id="erpCash"
            type="text"
            inputMode="numeric"
            value={erpCash === 0 ? '' : formatCurrency(erpCash)}
            onChange={handleErpCashChange}
            onKeyDown={handleKeyDown}
            placeholder="0"
            className="w-full bg-transparent text-sm font-bold text-indigo-700 text-right focus:outline-none"
          />
      </div>
    </div>
  );
};

export default Summary;
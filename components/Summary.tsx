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
    <div className="space-y-4 text-base text-slate-700 pb-4 mb-4 lg:pb-0 lg:mb-0 print:border-b print:border-dashed print:border-gray-500 print:pb-4 print:mb-4">
       {loadedVersionInfo && (
        <div className="mb-4 p-3 bg-indigo-50 border-l-4 border-indigo-400 text-indigo-800 rounded-r-md text-sm" role="alert">
          <p>
            Đang hiển thị phiên bản của <strong>{loadedVersionInfo.auditorName || 'Chưa đặt tên'}</strong>
            {' đã lưu lúc '}
            <strong>{new Date(loadedVersionInfo.auditTimestamp).toLocaleString('vi-VN')}</strong>.
          </p>
        </div>
      )}

       <div className="flex flex-col sm:flex-row sm:items-center print-auditor-row">
        <label htmlFor="auditorName" className="w-full sm:w-40 font-semibold text-slate-800 mb-1 sm:mb-0">Người kiểm:</label>
        <input
          id="auditorName"
          type="text"
          value={auditorName}
          onChange={(e) => setAuditorName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nhập tên người kiểm quỹ"
          className="flex-grow p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 shadow-sm"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center p-4 rounded-xl bg-indigo-50 border border-indigo-100">
          <label htmlFor="erpCash" className="w-full sm:w-36 font-bold text-indigo-900 mb-1 sm:mb-0">Tiền giữ ERP:</label>
          <input
            id="erpCash"
            type="text"
            inputMode="numeric"
            value={erpCash === 0 ? '' : formatCurrency(erpCash)}
            onChange={handleErpCashChange}
            onKeyDown={handleKeyDown}
            placeholder="0"
            className="flex-grow p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-right transition-colors duration-200 font-bold text-indigo-700 bg-white shadow-sm"
          />
      </div>
    </div>
  );
};

export default Summary;
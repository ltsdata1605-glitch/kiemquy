import React from 'react';
import { AuditState } from '../types';

interface SummaryProps {
  auditorName: string;
  setAuditorName: (name: string) => void;
  erpCash: number;
  setErpCash: (value: number) => void;
  actualCash: number;
  difference: number;
  notes: string;
  setNotes: (notes: string) => void;
  loadedVersionInfo: AuditState | null;
}

const Summary: React.FC<SummaryProps> = ({
  auditorName,
  setAuditorName,
  erpCash,
  setErpCash,
  actualCash,
  difference,
  notes,
  setNotes,
  loadedVersionInfo,
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  const getDifferenceStyles = () => {
    if (difference < 0) return { borderColor: 'border-red-500', textColor: 'text-red-600' };
    if (difference > 0) return { borderColor: 'border-blue-500', textColor: 'text-blue-600' };
    return { borderColor: 'border-green-500', textColor: 'text-green-600' };
  };
  
  const handleErpCashChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = parseInt(e.target.value.replace(/\./g, ''), 10) || 0;
    setErpCash(numericValue);
  };
  
  const differenceStyles = getDifferenceStyles();

  return (
    <div className="space-y-6 text-base text-slate-700 border-b border-slate-200 pb-6 mb-6 lg:border-b-0 lg:pb-0 lg:mb-0 print:border-b print:border-dashed print:border-gray-500 print:pb-4 print:mb-4">
       {loadedVersionInfo && (
        <div className="mb-6 p-3 bg-indigo-50 border-l-4 border-indigo-400 text-indigo-800 rounded-r-md text-sm" role="alert">
          <p>
            Đang hiển thị phiên bản của <strong>{loadedVersionInfo.auditorName || 'Chưa đặt tên'}</strong>
            {' đã lưu lúc '}
            <strong>{new Date(loadedVersionInfo.auditTimestamp).toLocaleString('vi-VN')}</strong>.
          </p>
          <p className="mt-1">Mọi thay đổi sẽ được tự động lưu thành phiên làm việc hiện tại.</p>
        </div>
      )}

       <div className="flex flex-col sm:flex-row sm:items-center print-auditor-row">
        <label htmlFor="auditorName" className="w-full sm:w-40 font-semibold text-slate-800 mb-2 sm:mb-0">Người kiểm:</label>
        <input
          id="auditorName"
          type="text"
          value={auditorName}
          onChange={(e) => setAuditorName(e.target.value)}
          placeholder="Nhập tên người kiểm quỹ"
          className="flex-grow p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
        />
      </div>

      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center p-4 rounded-lg bg-slate-50 border-l-4 border-slate-400">
            <label htmlFor="erpCash" className="w-full sm:w-36 font-bold text-[#004b79] mb-2 sm:mb-0">Tiền giữ ERP:</label>
            <input
            id="erpCash"
            type="text"
            inputMode="numeric"
            value={erpCash === 0 ? '' : formatCurrency(erpCash)}
            onChange={handleErpCashChange}
            placeholder="0"
            className="flex-grow p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 text-right transition-colors duration-200 font-bold text-[#004b79]"
            />
        </div>
        <div className="flex items-center p-4 rounded-lg bg-slate-50 border-l-4 border-green-500">
            <p className="w-40 font-bold text-[#9900ff]">Tiền thực tế:</p>
            <p className="font-bold text-lg text-[#9900ff]">{formatCurrency(actualCash)}</p>
        </div>
        <div className={`flex items-center p-4 rounded-lg bg-slate-50 border-l-4 ${differenceStyles.borderColor}`}>
            <p className={`w-40 font-semibold ${differenceStyles.textColor}`}>Tiền chênh lệch:</p>
            <p className={`font-bold text-2xl ${differenceStyles.textColor}`}>{formatCurrency(difference)}</p>
        </div>
      </div>

      <div className="flex flex-col">
        <label htmlFor="notes" className="w-full font-semibold text-slate-800 mb-2">Ghi chú:</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Thêm ghi chú nếu cần..."
          rows={2}
          className="flex-grow p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
        />
      </div>
    </div>
  );
};

export default Summary;
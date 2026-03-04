import React, { useRef } from 'react';
import { AuditState } from '../types';

interface HeaderProps {
  onPrint: () => void;
  onExportImage: () => void;
  onReset: () => void;
  onSaveVersion: () => void;
  onLoadVersion: (id: string) => void;
  savedVersions: AuditState[];
  isInIframe: boolean;
}

const Header: React.FC<HeaderProps> = ({ onPrint, onExportImage, onReset, onSaveVersion, onLoadVersion, savedVersions, isInIframe }) => {
  const selectRef = useRef<HTMLSelectElement>(null);

  const PrintButton = () => {
    if (isInIframe) {
      return (
        <a
          href={window.location.href}
          target="_blank"
          rel="noopener noreferrer"
          title="Mở trong tab mới để in"
          className="flex items-center justify-center h-10 w-10 text-white bg-slate-700 rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
          aria-label="Mở trong tab mới để in"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
        </a>
      );
    }
    return (
      <button
        onClick={onPrint}
        title="In"
        className="flex items-center justify-center h-10 w-10 text-white bg-slate-700 rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
        aria-label="In biên bản"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
      </button>
    );
  };

  return (
    <header className="flex flex-wrap justify-between items-center gap-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">KIỂM QUỸ - CỤM 910</h1>
      <div className="flex items-center space-x-2 print:hidden">
        
        {/* Versioning controls */}
        <div className="flex items-center space-x-2">
            <button
                onClick={onSaveVersion}
                title="Lưu phiên bản"
                className="flex items-center justify-center h-10 w-10 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                aria-label="Lưu phiên bản hiện tại"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
            </button>
            <select
                ref={selectRef}
                onChange={(e) => {
                    if (e.target.value) {
                      onLoadVersion(e.target.value);
                    }
                    if (selectRef.current) {
                      selectRef.current.value = '';
                    }
                }}
                className="h-10 px-3 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                title="Tải phiên bản"
                defaultValue=""
                aria-label="Chọn một phiên bản để tải"
            >
                <option value="" disabled>Tải phiên bản...</option>
                {savedVersions.map(version => (
                    version.id && <option key={version.id} value={version.id}>
                        {`${version.auditorName || 'Chưa đặt tên'} - ${new Date(version.auditTimestamp).toLocaleString('vi-VN')}`}
                    </option>
                ))}
            </select>
        </div>

        <div className="h-8 border-l border-slate-300 mx-1"></div>
        
        {/* Action buttons */}
        <button
            onClick={onReset}
            title="Làm lại"
            className="flex items-center justify-center h-10 w-10 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            aria-label="Làm lại từ đầu"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                <path d="M21 3v5h-5"></path>
                <path d="M3 12a9 9 0 0 1 9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                <path d="M3 21v-5h5"></path>
            </svg>
        </button>
        <button
            onClick={onExportImage}
            title="Xuất ảnh"
            className="flex items-center justify-center h-10 w-10 text-white bg-slate-700 rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
            aria-label="Xuất ra hình ảnh"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                <circle cx="12" cy="13" r="3"></circle>
            </svg>
        </button>
        <PrintButton />
      </div>
    </header>
  );
};

export default Header;
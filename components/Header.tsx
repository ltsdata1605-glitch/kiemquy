import React, { useRef } from 'react';
import { AuditState } from '../types';
import { Printer, Image as ImageIcon, RotateCcw, Save, History, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

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

  const ActionButton = ({ onClick, icon: Icon, title, variant = 'slate' }: { onClick: () => void, icon: any, title: string, variant?: 'slate' | 'indigo' | 'red' }) => {
    const variants = {
      slate: 'bg-slate-800 hover:bg-slate-700 text-white shadow-slate-200',
      indigo: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200',
      red: 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200'
    };

    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        title={title}
        className={`flex items-center justify-center h-10 w-10 rounded-xl shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-indigo-500/20 ${variants[variant]}`}
        aria-label={title}
      >
        <Icon className="w-5 h-5" />
      </motion.button>
    );
  };

  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          KIỂM QUỸ <span className="text-indigo-600">CỤM 910</span>
        </h1>
        <p className="text-slate-500 text-sm font-medium mt-1">Công cụ đối soát tiền mặt nội bộ</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 print:hidden">
        <div className="flex items-center bg-white p-1.5 border border-slate-200 rounded-2xl shadow-sm gap-2">
          <div className="flex items-center px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100 gap-2">
            <History className="w-4 h-4 text-slate-400" />
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
              className="bg-transparent text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer min-w-[140px]"
              title="Tải phiên bản"
              defaultValue=""
            >
              <option value="" disabled>Lịch sử kiểm quỹ...</option>
              {savedVersions.map(version => (
                  version.id && <option key={version.id} value={version.id}>
                      {`${version.auditorName || 'Chưa tên'} - ${new Date(version.auditTimestamp).toLocaleDateString('vi-VN')}`}
                  </option>
              ))}
            </select>
          </div>
          
          <ActionButton onClick={onSaveVersion} icon={Save} title="Lưu phiên bản" variant="indigo" />
        </div>

        <div className="flex items-center gap-2">
          <ActionButton onClick={onReset} icon={RotateCcw} title="Làm lại" variant="red" />
          <ActionButton onClick={onExportImage} icon={ImageIcon} title="Xuất ảnh" />
          
          {isInIframe ? (
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={window.location.href}
              target="_blank"
              rel="noopener noreferrer"
              title="Mở trong tab mới để in"
              className="flex items-center justify-center h-10 w-10 bg-slate-800 text-white rounded-xl shadow-lg shadow-slate-200 hover:bg-slate-700 transition-all duration-200"
            >
              <ExternalLink className="w-5 h-5" />
            </motion.a>
          ) : (
            <ActionButton onClick={onPrint} icon={Printer} title="In biên bản" />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

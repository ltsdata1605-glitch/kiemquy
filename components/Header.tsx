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
      slate: 'bg-slate-800 hover:bg-slate-700 text-white',
      indigo: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      red: 'bg-rose-500 hover:bg-rose-600 text-white'
    };

    return (
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        title={title}
        className={`flex items-center justify-center h-9 w-9 rounded-lg transition-all duration-200 focus:outline-none ${variants[variant]}`}
        aria-label={title}
      >
        <Icon className="w-4 h-4" />
      </motion.button>
    );
  };

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white border-b border-slate-200 shrink-0 print:hidden">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-black text-slate-900 tracking-tight">
          910 <span className="text-indigo-600">TOOL</span>
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 gap-1">
          <History className="w-3.5 h-3.5 text-slate-400" />
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
            className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer max-w-[80px]"
            title="Lịch sử"
            defaultValue=""
          >
            <option value="" disabled>Lịch sử</option>
            {savedVersions.map(version => (
                version.id && <option key={version.id} value={version.id}>
                    {`${version.auditorName || 'Chưa tên'} - ${new Date(version.auditTimestamp).toLocaleDateString('vi-VN')}`}
                </option>
            ))}
          </select>
        </div>
        
        <ActionButton onClick={onSaveVersion} icon={Save} title="Lưu" variant="indigo" />
        <ActionButton onClick={onReset} icon={RotateCcw} title="Làm lại" variant="red" />
      </div>
    </header>
  );
};

export default Header;

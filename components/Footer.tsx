import React from 'react';

interface FooterProps {
  auditTimestamp: string;
}

const Footer: React.FC<FooterProps> = ({ auditTimestamp }) => {
  const formattedTimestamp = new Date(auditTimestamp).toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <footer className="text-center text-xs text-slate-400 mt-8 mb-4 print:hidden">
      <p className="font-medium">Cập nhật lúc: {formattedTimestamp}</p>
      <p className="mt-1 opacity-75">Biên Bản Kiểm Quỹ - Cụm 910</p>
    </footer>
  );
};

export default Footer;
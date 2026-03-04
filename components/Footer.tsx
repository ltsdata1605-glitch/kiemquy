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
    <footer className="text-center text-xs text-slate-400 mt-8 print:hidden">
      <p>Kiểm lúc: {formattedTimestamp}</p>
      <p>Version: 1.0.0 - 2024</p>
    </footer>
  );
};

export default Footer;
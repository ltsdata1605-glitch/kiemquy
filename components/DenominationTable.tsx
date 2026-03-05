import React from 'react';
import { DenominationCount } from '../types';

interface DenominationTableProps {
  denominations: DenominationCount[];
  onCountChange: (value: number, count: number) => void;
  totalAmount: number;
  difference: number;
  erpCash: number;
}

const DenominationTableRow: React.FC<{
    item: DenominationCount;
    onCountChange: (value: number, count: number) => void;
}> = React.memo(({ item, onCountChange }) => {
    const formatCurrency = (value: number) => new Intl.NumberFormat('vi-VN').format(value);

    const getDenominationStyle = (value: number): string => {
        switch (value) {
            case 500000:
                return 'text-red-600 font-bold';
            case 200000:
                return 'text-blue-600 font-bold';
            case 100000:
                return 'text-green-600 font-bold';
            default:
                return 'font-medium text-slate-800';
        }
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const sanitizedValue = e.target.value.replace(/[^0-9]/g, '');
      onCountChange(item.value, parseInt(sanitizedValue, 10) || 0);
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
        <tr className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50 transition-colors duration-150">
            <td className={`p-3 text-right ${getDenominationStyle(item.value)}`}>{formatCurrency(item.value)}</td>
            <td className="p-3 w-32">
                <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    min="0"
                    value={item.count === 0 ? '' : item.count}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="w-full p-2 text-right border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors font-bold shadow-sm"
                    placeholder="0"
                />
            </td>
            <td className="p-3 text-right text-slate-600 font-bold">{formatCurrency(item.value * item.count)}</td>
        </tr>
    );
});

const DenominationTable: React.FC<DenominationTableProps> = ({ denominations, onCountChange, totalAmount, difference, erpCash }) => {
  const formatCurrency = (value: number) => new Intl.NumberFormat('vi-VN').format(value);

  const getDifferenceStyles = () => {
    if (difference < 0) return { bgColor: 'bg-red-50', textColor: 'text-red-600', borderColor: 'border-red-200' };
    if (difference > 0) return { bgColor: 'bg-blue-50', textColor: 'text-blue-600', borderColor: 'border-blue-200' };
    return { bgColor: 'bg-green-50', textColor: 'text-green-600', borderColor: 'border-green-200' };
  };

  const diffStyles = getDifferenceStyles();

  return (
    <div className="overflow-hidden border border-slate-200 rounded-xl shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Mệnh giá</th>
            <th className="p-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-32">Số tờ</th>
            <th className="p-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {denominations.map((item) => (
            <DenominationTableRow key={item.value} item={item} onCountChange={onCountChange} />
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-indigo-50 font-bold border-t-2 border-indigo-100">
            <td colSpan={2} className="p-3 text-right text-indigo-900">Tổng cộng</td>
            <td className="p-3 text-right text-xl text-indigo-700">{formatCurrency(totalAmount)}</td>
          </tr>
          <tr className="bg-slate-50 font-bold border-t border-slate-200">
            <td colSpan={2} className="p-3 text-right text-slate-700">Tiền giữ ERP</td>
            <td className="p-3 text-right text-lg text-slate-900">{formatCurrency(erpCash)}</td>
          </tr>
          <tr className={`${diffStyles.bgColor} font-bold border-t border-dashed ${diffStyles.borderColor}`}>
            <td colSpan={2} className={`p-3 text-right ${diffStyles.textColor}`}>Tiền chênh lệch</td>
            <td className={`p-3 text-right text-2xl ${diffStyles.textColor}`}>{formatCurrency(difference)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default DenominationTable;
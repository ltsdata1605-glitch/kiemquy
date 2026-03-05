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
        <tr className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors duration-150">
            <td className={`p-2 text-right text-xs sm:text-sm whitespace-nowrap ${getDenominationStyle(item.value)}`}>{formatCurrency(item.value)}</td>
            <td className="p-1 text-center">
                <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    min="0"
                    value={item.count === 0 ? '' : item.count}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="w-20 sm:w-24 p-1.5 text-right border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors font-bold shadow-sm text-sm export:hidden print:hidden"
                    placeholder="0"
                />
                <span className="hidden export:block print:block text-center font-bold text-sm">
                    {item.count}
                </span>
            </td>
            <td className="p-2 text-right text-slate-600 font-bold text-xs sm:text-sm whitespace-nowrap">{formatCurrency(item.value * item.count)}</td>
        </tr>
    );
});

const DenominationTable: React.FC<DenominationTableProps> = ({ denominations, onCountChange, totalAmount, difference, erpCash }) => {
  return (
    <div className="bg-white overflow-x-auto">
      <table className="w-full max-w-md mx-auto text-left border-collapse table-auto">
        <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
          <tr>
            <th className="p-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right whitespace-nowrap w-px">Mệnh giá</th>
            <th className="p-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center whitespace-nowrap w-px">Số tờ</th>
            <th className="p-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right whitespace-nowrap">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {denominations.map((item) => (
            <DenominationTableRow key={item.value} item={item} onCountChange={onCountChange} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DenominationTable;
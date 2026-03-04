import React from 'react';
import { DenominationCount } from '../types';

interface DenominationTableProps {
  denominations: DenominationCount[];
  onCountChange: (value: number, count: number) => void;
  totalAmount: number;
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
      // Chỉ cho phép nhập số bằng cách loại bỏ các ký tự không phải là số
      const sanitizedValue = e.target.value.replace(/[^0-9]/g, '');
      onCountChange(item.value, parseInt(sanitizedValue, 10) || 0);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const table = e.currentTarget.closest('table');
            if (table) {
                const inputs = Array.from(
                    table.querySelectorAll('tbody input[type="text"]')
                );
                const currentIndex = inputs.indexOf(e.currentTarget);
                const nextInput = inputs[currentIndex + 1];
                // FIX: Use `instanceof HTMLInputElement` as a type guard to ensure `nextInput`
                // is correctly typed before accessing its methods. This resolves the errors:
                // "Property 'focus' does not exist on type 'unknown'" and
                // "Property 'select' does not exist on type 'unknown'".
                if (nextInput instanceof HTMLInputElement) {
                    nextInput.focus();
                    nextInput.select();
                }
            }
        }
    };

    return (
        <tr className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50 transition-colors duration-150">
            <td className={`p-2 text-right ${getDenominationStyle(item.value)}`}>{formatCurrency(item.value)}</td>
            <td className="p-2 w-40">
                <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    min="0"
                    value={item.count === 0 ? '' : item.count}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="w-full p-2 text-right border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors font-bold"
                    placeholder="0"
                />
            </td>
            <td className="p-2 text-right text-slate-600 font-bold">{formatCurrency(item.value * item.count)}</td>
        </tr>
    );
});

const DenominationTable: React.FC<DenominationTableProps> = ({ denominations, onCountChange, totalAmount }) => {
  const formatCurrency = (value: number) => new Intl.NumberFormat('vi-VN').format(value);

  return (
    <div className="overflow-x-auto border border-slate-200 rounded-lg">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-200">
          <tr>
            <th className="p-2 text-sm font-bold text-slate-600 uppercase tracking-wider text-right">Mệnh giá</th>
            <th className="p-2 text-sm font-bold text-slate-600 uppercase tracking-wider text-center w-40">Số tờ</th>
            <th className="p-2 text-sm font-bold text-slate-600 uppercase tracking-wider text-right">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {denominations.map((item) => (
            <DenominationTableRow key={item.value} item={item} onCountChange={onCountChange} />
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-slate-100 font-bold border-t-2 border-slate-200">
            <td colSpan={2} className="p-2 text-right text-slate-800">Tổng cộng</td>
            <td className="p-2 text-right text-lg text-indigo-700">{formatCurrency(totalAmount)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default DenominationTable;
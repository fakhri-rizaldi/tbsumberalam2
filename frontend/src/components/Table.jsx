import React from 'react';

const Table = ({ headers, children }) => {
  return (
    <div className="w-full overflow-x-auto rounded-md border-2 border-[var(--ink)] shadow-[4px_4px_0_0_var(--ink)] bg-[var(--surface)]">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-[var(--ink)] text-[var(--surface)] uppercase font-bold tracking-widest text-xs">
          <tr>
            {headers.map((header, idx) => (
              <th key={idx} className="px-4 py-3 border-b-2 border-[var(--ink)]">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--ink)]/10 text-[var(--ink)]">
          {children}
        </tbody>
      </table>
    </div>
  );
};

export const TableRow = ({ children }) => (
  <tr className="hover:bg-[var(--bg-base)] transition-colors">
    {children}
  </tr>
);

export const TableCell = ({ children, className = '' }) => (
  <td className={`px-4 py-3 font-mono text-sm ${className}`}>
    {children}
  </td>
);

export default Table;

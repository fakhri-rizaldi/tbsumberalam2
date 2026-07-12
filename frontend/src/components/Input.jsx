import React from 'react';

const Input = ({ label, type = 'text', className = '', ...props }) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink)]/80">
          {label}
        </label>
      )}
      <input
        type={type}
        className="w-full px-4 py-2 bg-[var(--bg-base)] border-2 border-[var(--ink)]/20 focus:border-[var(--ink)] rounded-md font-mono text-sm outline-none transition-colors"
        {...props}
      />
    </div>
  );
};

export default Input;

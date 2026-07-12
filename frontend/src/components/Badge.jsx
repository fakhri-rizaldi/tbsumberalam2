import React from 'react';

const Badge = ({ children, variant = 'info' }) => {
  let variantClass = "";
  if (variant === 'info') variantClass = "bg-[var(--ink)]/10 text-[var(--ink)] border-[var(--ink)]";
  if (variant === 'danger') variantClass = "bg-[var(--danger)]/10 text-[var(--danger)] border-[var(--danger)]";
  if (variant === 'success') variantClass = "bg-[var(--accent-secondary)]/10 text-[var(--accent-secondary)] border-[var(--accent-secondary)]";
  if (variant === 'warning') variantClass = "bg-[var(--accent-primary)]/20 text-[#a06d1a] border-[var(--accent-primary)]";

  return (
    <span className={`px-2 py-0.5 border border-dashed text-[10px] uppercase font-bold tracking-widest rounded-sm ${variantClass}`}>
      {children}
    </span>
  );
};

export default Badge;

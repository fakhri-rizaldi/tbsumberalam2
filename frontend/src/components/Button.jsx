import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClass = "flex items-center justify-center py-2 px-4 font-bold uppercase tracking-widest rounded-md border-2 border-[var(--ink)] transition-all active:translate-y-[2px] active:shadow-none shadow-[2px_2px_0_0_var(--ink)] disabled:opacity-50 disabled:cursor-not-allowed";
  
  let variantClass = "";
  if (variant === 'primary') {
    variantClass = "bg-[var(--accent-primary)] hover:bg-[#e09b30] text-[var(--ink)]";
  } else if (variant === 'secondary') {
    variantClass = "bg-[var(--bg-base)] hover:bg-gray-200 text-[var(--ink)]";
  } else if (variant === 'danger') {
    variantClass = "bg-[var(--danger)] hover:bg-red-800 text-[var(--surface)] border-[var(--danger)] shadow-[2px_2px_0_0_#5a1a10]";
  }

  return (
    <button className={`${baseClass} ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;

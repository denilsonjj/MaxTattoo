import React from 'react';

export function Button({ children, className, variant = 'default', ...props }) {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000] disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-[#E60000] text-white hover:bg-[#C50000] h-10 px-4 py-2",
    destructive: "bg-red-500 text-white hover:bg-red-600 h-10 px-4 py-2",
    outline: "border border-[#E60000]/20 bg-transparent hover:bg-[#E60000]/10 text-white h-10 px-4 py-2",
    secondary: "bg-neutral-800 text-white hover:bg-neutral-700 h-10 px-4 py-2",
    ghost: "hover:bg-[#E60000]/10 text-white h-10 px-4 py-2",
    link: "text-white underline-offset-4 hover:underline h-10 px-4 py-2",
    icon: "h-10 w-10", // Tamanho quadrado para ícones
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
  };

  // Se passar className extra, ele junta com o estilo base
  const finalClass = `${baseStyles} ${variants[variant] || variants.default} ${className || ''}`;

  return (
    <button className={finalClass} {...props}>
      {children}
    </button>
  );
}
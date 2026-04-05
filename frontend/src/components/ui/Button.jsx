export default function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const baseStyles = "inline-flex items-center justify-center font-bold rounded-xl transition-spring active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-ink text-white hover:bg-slate-800 shadow-xl shadow-slate-900/20 focus:ring-slate-900",
    secondary: "bg-brand-100 text-brand-900 hover:bg-brand-200 focus:ring-brand-500",
    outline: "border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-white focus:ring-slate-500 bg-white/50",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-ink focus:ring-slate-500",
    destructive: "bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-500 border border-red-100"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}

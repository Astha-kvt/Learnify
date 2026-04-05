export default function Badge({ children, variant = 'default', className = '', icon: Icon }) {
  const variants = {
    default: "bg-slate-100 text-slate-600 border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    brand: "bg-brand-50 text-brand-700 border-brand-200",
    dark: "bg-ink text-white border-slate-800"
  };

  return (
    <span className={`inline-flex flex-shrink-0 items-center px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-black border tracking-widest uppercase ${variants[variant]} ${className}`}>
      {Icon && <Icon className="w-3 h-3 mr-1.5" />}
      {children}
    </span>
  );
}

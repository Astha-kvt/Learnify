export default function Input({ className = '', label, type="text", ...props }) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-bold text-ink mb-2">{label}</label>}
      {type === "textarea" ? (
        <textarea 
          className={`w-full px-4 py-3 bg-white/60 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:bg-white transition-spring placeholder:text-slate-400 shadow-sm ${className}`} 
          {...props} 
        />
      ) : (
        <input 
          type={type}
          className={`w-full px-4 py-3 bg-white/60 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:bg-white transition-spring placeholder:text-slate-400 shadow-sm ${className}`} 
          {...props} 
        />
      )}
    </div>
  );
}

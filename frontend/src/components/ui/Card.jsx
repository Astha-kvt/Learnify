export default function Card({ children, className = '', noPadding = false, interactive = false }) {
  return (
    <div className={`glass-card rounded-2xl ${interactive ? 'hover:-translate-y-1 hover:shadow-xl hover:border-brand-200 cursor-pointer' : ''} transition-all duration-300 ${noPadding ? '' : 'p-6 sm:p-8'} ${className}`}>
      {children}
    </div>
  );
}

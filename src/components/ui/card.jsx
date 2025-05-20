export function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-[#01ff09] bg-white text-black shadow-lg ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children }) {
  return <div className="p-6">{children}</div>;
}
export default function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded-xl bg-[#01ff09] hover:bg-[#60ff40] text-black font-semibold shadow transition duration-300 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
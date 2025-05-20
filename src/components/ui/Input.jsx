export default function Input({ label, ...props }) {
  return (
    <div className="flex flex-col space-y-1">
      {label && (
        <label className="text-sm font-medium text-black">{label}</label>
      )}
      <input
        className="border border-[#01ff09] rounded-xl px-3 py-2 bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#60ff40] shadow-sm transition"
        {...props}
      />
    </div>
  );
}

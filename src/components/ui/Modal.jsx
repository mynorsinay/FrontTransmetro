export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-[#60ff40]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-black">{title}</h2>
          <button
            onClick={onClose}
            className="text-xl font-bold text-black hover:text-[#60ff40] transition"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
        <div className="text-black">{children}</div>
      </div>
    </div>
  );
}

export default function Header({ titulo, fechaHora }) {
  return (
    <div className="flex justify-between items-center mb-6 border-b border-[#01ff09] pb-2">
      <h1 className="text-3xl font-bold text-black">{titulo}</h1>
      {fechaHora && (
        <span className="text-sm text-gray-600 font-medium">
          {fechaHora.toLocaleString("es-ES")}
        </span>
      )}
    </div>
  );
}


import { useState, useEffect } from "react";
import { Card, CardContent } from "../../components/ui/card"; 
import Header from "../../components/ui/Header";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import api from "../../services/api"; 
import { useNavigate } from "react-router-dom"; 

export default function CrearPiloto() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    idEstado: 1,
    idHorario: "",
    primerNombre: "",
    segundoNombre: "",
    primerApellido: "",
    segundoApellido: "",
    cui: "",
    tipoLicencia: "A",
    numeroLicencia: "",
    vencimientoLicencia: "",
    horasActivo: "",
    correo: "",
    telefono: "",
  });

  const [modalOpen, setModalOpen] = useState({
    isOpen: false,
    isSuccess: false
  });
  const [modalMessage, setModalMessage] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [horarios, setHorarios] = useState([]);
  const [cargandoHorarios, setCargandoHorarios] = useState(false);

  const tiposLicencia = ["A", "B", "C"];

  useEffect(() => {
    const obtenerHorarios = async () => {
      setCargandoHorarios(true);
      try {
        const response = await api.post("/Horarios/ConsultarHorarios", {});
        setHorarios(response.data);
      } catch (error) {
        console.error("Error al obtener horarios:", error);
        setModalMessage("Error al cargar los horarios disponibles");
        setModalOpen({ isOpen: true, isSuccess: false });
      } finally {
        setCargandoHorarios(false);
      }
    };

    obtenerHorarios();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (["primerNombre", "segundoNombre", "primerApellido", "segundoApellido"].includes(name)) {
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) return;
    }
    
    if (name === "cui") {
      if (!/^\d*$/.test(value)) return;
      setFormData(prev => ({
        ...prev,
        [name]: value,
        numeroLicencia: value
      }));
      return;
    }

    if (name === "horasActivo" || name === "telefono") {
      if (!/^\d*$/.test(value)) return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDateToDDMMYYYY = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

    if (!formData.primerNombre || !nameRegex.test(formData.primerNombre)) {
      newErrors.primerNombre = "Solo se permiten letras";
    }
    if (formData.segundoNombre && !nameRegex.test(formData.segundoNombre)) {
      newErrors.segundoNombre = "Solo se permiten letras";
    }
    if (!formData.primerApellido || !nameRegex.test(formData.primerApellido)) {
      newErrors.primerApellido = "Solo se permiten letras";
    }
    if (formData.segundoApellido && !nameRegex.test(formData.segundoApellido)) {
      newErrors.segundoApellido = "Solo se permiten letras";
    }

    if (!formData.cui || !/^\d{13}$/.test(formData.cui)) {
      newErrors.cui = "Debe tener 13 dígitos numéricos";
    }

    if (!formData.horasActivo || !/^\d+$/.test(formData.horasActivo)) {
      newErrors.horasActivo = "Solo se permiten números";
    }

    if (!formData.correo || !emailRegex.test(formData.correo)) {
      newErrors.correo = "Ingrese un correo válido";
    }

    if (!formData.telefono || !/^\d{8}$/.test(formData.telefono)) {
      newErrors.telefono = "Debe tener 8 dígitos numéricos";
    }

    if (!formData.idHorario) {
      newErrors.idHorario = "Debe seleccionar un horario";
    }

    if (!formData.vencimientoLicencia) {
      newErrors.vencimientoLicencia = "Debe seleccionar una fecha";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setModalMessage("⚠️ Por favor corrija los errores en el formulario");
      setModalOpen({ isOpen: true, isSuccess: false });
      return;
    }

    try {
      const datosParaEnviar = {
        idEstado: 1,
        idHorario: parseInt(formData.idHorario),
        primerNombre: formData.primerNombre,
        segundoNombre: formData.segundoNombre,
        primerApellido: formData.primerApellido,
        segundoApellido: formData.segundoApellido,
        cui: formData.cui,
        tipoLicencia: formData.tipoLicencia,
        numeroLicencia: formData.numeroLicencia,
        vencimientoLicencia: formatDateToDDMMYYYY(formData.vencimientoLicencia),
        horasActivo: parseInt(formData.horasActivo),
        correo: formData.correo,
        telefono: parseInt(formData.telefono)
      };

      console.log("Enviando datos:", datosParaEnviar);

      const res = await api.post("/Pilotos/CrearPilotos", datosParaEnviar);

      if (res.status === 200) {
        setModalMessage("✅ El piloto ha sido creado correctamente.");
        setModalOpen({ isOpen: true, isSuccess: true });
        setFormData({
          idEstado: 1,
          idHorario: "",
          primerNombre: "",
          segundoNombre: "",
          primerApellido: "",
          segundoApellido: "",
          cui: "",
          tipoLicencia: "A",
          numeroLicencia: "",
          vencimientoLicencia: "",
          horasActivo: "",
          correo: "",
          telefono: "",
        });
      }
    } catch (error) {
      console.error("Error detallado:", {
        message: error.message,
        response: error.response?.data,
        request: error.request
      });
      
      const serverMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Error al conectar con el servidor";
      
      setModalMessage(`⚠️ ${serverMessage}`);
      setModalOpen({ isOpen: true, isSuccess: false });
    }
  };

  const handleCloseModal = () => {
    setModalOpen({ isOpen: false, isSuccess: false });
    if (modalOpen.isSuccess) {
      window.location.reload();
    }
  };

  return (
    <div className="p-6">
      <button
        onClick={() => navigate("/app/pilotos/dashboard")}
        className="mb-6 px-4 py-2 bg-[#01ff09] text-black rounded-xl font-semibold hover:bg-[#00e607] transition"
      >
        ⬅️ Regresar
      </button>

      <Header titulo="Crear Piloto" fechaHora={new Date()} />

      <Button onClick={() => setFormVisible(!formVisible)}>
        {formVisible ? "Ocultar Formulario" : "Crear Nuevo Piloto"}
      </Button>

      {formVisible && (
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input 
                  label="Primer Nombre *" 
                  name="primerNombre" 
                  value={formData.primerNombre} 
                  onChange={handleChange} 
                />
                {errors.primerNombre && <p className="text-red-500 text-sm">{errors.primerNombre}</p>}
              </div>
              
              <div>
                <Input 
                  label="Segundo Nombre" 
                  name="segundoNombre" 
                  value={formData.segundoNombre} 
                  onChange={handleChange} 
                />
                {errors.segundoNombre && <p className="text-red-500 text-sm">{errors.segundoNombre}</p>}
              </div>
              
              <div>
                <Input 
                  label="Primer Apellido *" 
                  name="primerApellido" 
                  value={formData.primerApellido} 
                  onChange={handleChange} 
                />
                {errors.primerApellido && <p className="text-red-500 text-sm">{errors.primerApellido}</p>}
              </div>
              
              <div>
                <Input 
                  label="Segundo Apellido" 
                  name="segundoApellido" 
                  value={formData.segundoApellido} 
                  onChange={handleChange} 
                />
                {errors.segundoApellido && <p className="text-red-500 text-sm">{errors.segundoApellido}</p>}
              </div>
              
              <div>
                <Input 
                  label="CUI *" 
                  name="cui" 
                  value={formData.cui} 
                  onChange={handleChange}
                  maxLength="13"
                />
                {errors.cui && <p className="text-red-500 text-sm">{errors.cui}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Tipo de Licencia *</label>
                <select
                  name="tipoLicencia"
                  value={formData.tipoLicencia}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  {tiposLicencia.map((tipo) => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>
              
              <Input 
                label="Número de Licencia" 
                name="numeroLicencia" 
                value={formData.numeroLicencia} 
                onChange={handleChange}
                disabled
              />
              
              <div>
                <Input 
                  label="Vencimiento de Licencia *" 
                  name="vencimientoLicencia" 
                  type="date" 
                  value={formData.vencimientoLicencia} 
                  onChange={handleChange} 
                />
                {errors.vencimientoLicencia && <p className="text-red-500 text-sm">{errors.vencimientoLicencia}</p>}
              </div>
              
              <div>
                <Input 
                  label="Horas Activo *" 
                  name="horasActivo" 
                  value={formData.horasActivo} 
                  onChange={handleChange}
                />
                {errors.horasActivo && <p className="text-red-500 text-sm">{errors.horasActivo}</p>}
              </div>
              
              <div>
                <Input 
                  label="Correo *" 
                  name="correo" 
                  value={formData.correo} 
                  onChange={handleChange} 
                />
                {errors.correo && <p className="text-red-500 text-sm">{errors.correo}</p>}
              </div>
              
              <div>
                <Input 
                  label="Teléfono *" 
                  name="telefono" 
                  value={formData.telefono} 
                  onChange={handleChange}
                  maxLength="8"
                />
                {errors.telefono && <p className="text-red-500 text-sm">{errors.telefono}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Horario *</label>
                <select
                  name="idHorario"
                  value={formData.idHorario}
                  onChange={handleChange}
                  className={`block w-full px-3 py-2 border ${errors.idHorario ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  disabled={cargandoHorarios}
                >
                  <option value="">Seleccione un horario</option>
                  {horarios.map((horario) => (
                    <option key={horario.idHorario} value={horario.idHorario}>
                      {horario.horario}
                    </option>
                  ))}
                </select>
                {errors.idHorario && <p className="text-red-500 text-sm">{errors.idHorario}</p>}
                {cargandoHorarios && <p className="text-sm text-gray-500">Cargando horarios...</p>}
              </div>
              
              <div className="flex justify-end">
                <Button type="submit">Crear Piloto</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Modal 
        isOpen={modalOpen.isOpen} 
        onClose={handleCloseModal} 
        title="Resultado de la Creación"
      >
        <p>{modalMessage}</p>
        <Button onClick={handleCloseModal}>Cerrar</Button>
      </Modal>
    </div>
  );
}
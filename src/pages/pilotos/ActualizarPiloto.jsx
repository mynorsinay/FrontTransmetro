import { useState, useEffect } from "react";
import { Card, CardContent } from "../../components/ui/card";
import Header from "../../components/ui/Header";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function ActualizarPiloto() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    CUI: "",
    idEstado: 1,
    idHorario: "",
    primerNombre: "",
    segundoNombre: "",
    primerApellido: "",
    segundoApellido: "",
    tipoLicencia: "A",
    numeroLicencia: "",
    vencimientoLicencia: "",
    horasActivo: "",
    correo: "",
    telefono: ""
  });

  const [modalOpen, setModalOpen] = useState({
    isOpen: false,
    isSuccess: false
  });
  const [modalMessage, setModalMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [horarios, setHorarios] = useState([]);
  const [cargandoHorarios, setCargandoHorarios] = useState(false);
  const [formEnabled, setFormEnabled] = useState(false);

  const tiposLicencia = ["A", "B", "C"];

  useEffect(() => {
    const cargarHorarios = async () => {
      setCargandoHorarios(true);
      try {
        const response = await api.post("/Horarios/ConsultarHorarios", {});
        setHorarios(response.data);
      } catch (error) {
        console.error("Error al cargar horarios:", error);
        setModalMessage("Error al cargar los horarios disponibles");
        setModalOpen({ isOpen: true, isSuccess: false });
      } finally {
        setCargandoHorarios(false);
      }
    };

    cargarHorarios();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validación para campos de texto (solo letras)
    if (["primerNombre", "segundoNombre", "primerApellido", "segundoApellido"].includes(name)) {
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) return;
    }
    
    // Validación para CUI (solo números)
    if (name === "CUI") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 13) return;
    }
    
    // Validación para campos numéricos
    if (["horasActivo", "telefono"].includes(name)) {
      if (!/^\d*$/.test(value)) return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error al modificar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const consultarPiloto = async () => {
    if (!formData.CUI) {
      setModalMessage("Por favor ingrese un CUI para consultar");
      setModalOpen({ isOpen: true, isSuccess: false });
      return;
    }

    try {
      const res = await api.post("/Pilotos/ConsultarPilotos", { CUI: formData.CUI });
      if (res.data && res.data.length > 0) {
        const piloto = res.data[0];
        setFormData({
          ...formData,
          idHorario: piloto.idHorario || "",
          primerNombre: piloto.primerNombre || "",
          segundoNombre: piloto.segundoNombre || "",
          primerApellido: piloto.primerApellido || "",
          segundoApellido: piloto.segundoApellido || "",
          tipoLicencia: piloto.tipoLicencia || "A",
          numeroLicencia: piloto.numeroLicencia || "",
          vencimientoLicencia: formatDateForInput(piloto.vencimientoLicencia),
          horasActivo: piloto.horasActivo || "",
          correo: piloto.correo || "",
          telefono: piloto.telefono || ""
        });
        setModalMessage("Piloto encontrado. Puede editar los campos habilitados.");
        setFormEnabled(true);
      } else {
        setModalMessage("No se encontró ningún piloto con ese CUI");
        setFormEnabled(false);
      }
      setModalOpen({ isOpen: true, isSuccess: false });
    } catch (error) {
      console.error("Error al consultar el piloto:", error);
      setModalMessage("Error al consultar el piloto");
      setModalOpen({ isOpen: true, isSuccess: false });
      setFormEnabled(false);
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const [day, month, year] = dateString.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

    // Validaciones para nombres y apellidos
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

    // Validación para CUI
    if (!formData.CUI || !/^\d{13}$/.test(formData.CUI)) {
      newErrors.CUI = "Debe tener 13 dígitos numéricos";
    }

    // Validación para horas activo
    if (!formData.horasActivo || !/^\d+$/.test(formData.horasActivo)) {
      newErrors.horasActivo = "Solo se permiten números";
    }

    // Validación para correo
    if (!formData.correo || !emailRegex.test(formData.correo)) {
      newErrors.correo = "Ingrese un correo válido";
    }

    // Validación para teléfono
    if (!formData.telefono || !/^\d{8}$/.test(formData.telefono)) {
      newErrors.telefono = "Debe tener 8 dígitos numéricos";
    }

    // Validación para horario
    if (!formData.idHorario) {
      newErrors.idHorario = "Debe seleccionar un horario";
    }

    // Validación para vencimiento de licencia
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
        CUI: formData.CUI,
        idEstado: formData.idEstado,
        idHorario: parseInt(formData.idHorario),
        primerNombre: formData.primerNombre,
        segundoNombre: formData.segundoNombre,
        primerApellido: formData.primerApellido,
        segundoApellido: formData.segundoApellido,
        tipoLicencia: formData.tipoLicencia,
        numeroLicencia: formData.numeroLicencia,
        vencimientoLicencia: formatDateToDDMMYYYY(formData.vencimientoLicencia),
        horasActivo: parseInt(formData.horasActivo),
        correo: formData.correo,
        telefono: formData.telefono
      };

      const res = await api.post("/Pilotos/ActualizarPilotos", datosParaEnviar);
      console.log("Piloto actualizado: ", res.data);
      setModalMessage("✅ El piloto ha sido actualizado correctamente.");
      setModalOpen({ isOpen: true, isSuccess: true });
    } catch (error) {
      console.error("Error al actualizar el piloto:", error);
      setModalMessage(`⚠️ ${error.response?.data?.message || "Error al actualizar el piloto"}`);
      setModalOpen({ isOpen: true, isSuccess: false });
    }
  };

  const formatDateToDDMMYYYY = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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
        onClick={() => navigate("/pilotos/dashboard")}
        className="mb-6 px-4 py-2 bg-[#01ff09] text-black rounded-xl font-semibold hover:bg-[#00e607] transition"
      >
        ⬅️ Regresar
      </button>

      <Header titulo="Actualizar Piloto" fechaHora={new Date()} />

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Input
                  label="CUI del Piloto *"
                  name="CUI"
                  value={formData.CUI}
                  onChange={handleChange}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength="13"
                />
                {errors.CUI && <p className="text-red-500 text-sm">{errors.CUI}</p>}
              </div>
              <Button 
                type="button" 
                onClick={consultarPiloto}
                className="h-[42px]"
              >
                Consultar
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Primer Nombre *"
                  name="primerNombre"
                  value={formData.primerNombre}
                  onChange={handleChange}
                  readOnly
                />
                {errors.primerNombre && <p className="text-red-500 text-sm">{errors.primerNombre}</p>}
              </div>
              <div>
                <Input
                  label="Segundo Nombre"
                  name="segundoNombre"
                  value={formData.segundoNombre}
                  onChange={handleChange}
                  readOnly
                />
                {errors.segundoNombre && <p className="text-red-500 text-sm">{errors.segundoNombre}</p>}
              </div>
              <div>
                <Input
                  label="Primer Apellido *"
                  name="primerApellido"
                  value={formData.primerApellido}
                  onChange={handleChange}
                  readOnly
                />
                {errors.primerApellido && <p className="text-red-500 text-sm">{errors.primerApellido}</p>}
              </div>
              <div>
                <Input
                  label="Segundo Apellido"
                  name="segundoApellido"
                  value={formData.segundoApellido}
                  onChange={handleChange}
                  readOnly
                />
                {errors.segundoApellido && <p className="text-red-500 text-sm">{errors.segundoApellido}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Tipo de Licencia *</label>
              <select
                name="tipoLicencia"
                value={formData.tipoLicencia}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300  shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                disabled={!formEnabled}
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
                disabled={!formEnabled}
              />
              {errors.vencimientoLicencia && <p className="text-red-500 text-sm">{errors.vencimientoLicencia}</p>}
            </div>
            
            <div>
              <Input
                label="Horas Activo *"
                name="horasActivo"
                value={formData.horasActivo}
                onChange={handleChange}
                disabled={!formEnabled}
              />
              {errors.horasActivo && <p className="text-red-500 text-sm">{errors.horasActivo}</p>}
            </div>
            
            <div>
              <Input
                label="Correo *"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                disabled={!formEnabled}
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
                disabled={!formEnabled}
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
                disabled={!formEnabled || cargandoHorarios}
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
              <Button 
                type="submit" 
                disabled={!formEnabled}
              >
                Actualizar Piloto
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Modal
        isOpen={modalOpen.isOpen}
        onClose={handleCloseModal}
        title="Resultado de la Operación"
      >
        <p>{modalMessage}</p>
        <Button onClick={handleCloseModal}>Cerrar</Button>
      </Modal>
    </div>
  );
}
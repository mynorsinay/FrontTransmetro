import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import Header from "../../components/ui/Header";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import api from "../../services/api";

export default function RegistrarGuardia() {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    idEstacion: "",
    idEstado: 1,
    idHorario: "",
    primerNombre: "",
    segundoNombre: "",
    primerApellido: "",
    segundoApellido: "",
    cui: "",
  });

  const [estaciones, setEstaciones] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [modalOpen, setModalOpen] = useState({
    isOpen: false,
    isSuccess: false
  });
  const [modalMessage, setModalMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [cargandoEstaciones, setCargandoEstaciones] = useState(false);
  const [cargandoHorarios, setCargandoHorarios] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      setCargandoEstaciones(true);
      setCargandoHorarios(true);
      
      try {
        const resEstaciones = await api.post("/Estaciones/ConsultarEstaciones", {});
        setEstaciones(resEstaciones.data || []);

        const resHorarios = await api.post("/Horarios/ConsultarHorarios", {});
        setHorarios(resHorarios.data || []);
        
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setModalMessage("❌ Error al cargar los datos necesarios");
        setModalOpen({ isOpen: true, isSuccess: false });
      } finally {
        setCargandoEstaciones(false);
        setCargandoHorarios(false);
      }
    };

    cargarDatos();
  }, []);

  const handleNameChange = (e) => {
    const { name, value } = e.target;
    if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) {
      setFormData(prev => ({
        ...prev,
        [name]: value.trimStart(),
      }));
    }
  };

  const handleCUIChange = (e) => {
    const { name, value } = e.target;
    if (/^\d{0,13}$/.test(value)) {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
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

    if (!formData.idEstacion) {
      newErrors.idEstacion = "Debe seleccionar una estación";
    }

    if (!formData.idHorario) {
      newErrors.idHorario = "Debe seleccionar un horario";
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
      const payload = {
        idEstacion: parseInt(formData.idEstacion),
        idEstado: 1,
        idHorario: parseInt(formData.idHorario),
        primerNombre: formData.primerNombre.trim(),
        segundoNombre: formData.segundoNombre.trim(),
        primerApellido: formData.primerApellido.trim(),
        segundoApellido: formData.segundoApellido.trim(),
        cui: formData.cui
      };

      console.log("Enviando payload:", payload);

      const res = await api.post("/Guardias/RegistrarGuardia", payload);
      
      if (res.status === 200) {
        setModalMessage("✅ Guardia registrado exitosamente");
        setModalOpen({ isOpen: true, isSuccess: true });
        setFormData({
          idEstacion: "",
          idEstado: 1,
          idHorario: "",
          primerNombre: "",
          segundoNombre: "",
          primerApellido: "",
          segundoApellido: "",
          cui: "",
        });
      } else {
        throw new Error(res.data?.message || "Error en el servidor");
      }
    } catch (error) {
      console.error("Error completo:", error);
      let message = "Error al procesar la solicitud";
      
      if (error.response) {
        message = error.response.data?.message || 
                 `Error ${error.response.status}: ${error.response.statusText}`;
      } else if (error.request) {
        message = "No se recibió respuesta del servidor";
      } else {
        message = error.message;
      }
      
      setModalMessage(`❌ ${message}`);
      setModalOpen({ isOpen: true, isSuccess: false });
    }
  };

  const handleCloseModal = () => {
    setModalOpen({ isOpen: false, isSuccess: false });
    if (modalOpen.isSuccess) {
      navigate("/guardias");
    }
  };

  return (
    <div className="p-6">
      <Header titulo="Registrar Guardia" fechaHora={new Date()} />

      <div className="mb-4">
        <Button onClick={() => navigate("/app/guardias")}>⬅️ Regresar</Button>
      </div>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Selector de Estación */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Estación *
              </label>
              <select
                name="idEstacion"
                value={formData.idEstacion}
                onChange={handleSelectChange}
                className={`w-full px-3 py-2 border ${errors.idEstacion ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-[#01ff09] focus:border-[#01ff09]`}
                disabled={cargandoEstaciones}
              >
                <option value="">Seleccione una estación</option>
                {estaciones.map((estacion) => (
                  <option key={estacion.idEstacion} value={estacion.idEstacion}>
                    {estacion.nombre}
                  </option>
                ))}
              </select>
              {errors.idEstacion && <p className="text-red-500 text-sm">{errors.idEstacion}</p>}
              {cargandoEstaciones && (
                <p className="text-sm text-gray-500">Cargando estaciones...</p>
              )}
            </div>

            {/* Selector de Horario */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Horario *
              </label>
              <select
                name="idHorario"
                value={formData.idHorario}
                onChange={handleSelectChange}
                className={`w-full px-3 py-2 border ${errors.idHorario ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-[#01ff09] focus:border-[#01ff09]`}
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
              {cargandoHorarios && (
                <p className="text-sm text-gray-500">Cargando horarios...</p>
              )}
            </div>

            <div>
              <Input
                label="Primer Nombre *"
                name="primerNombre"
                value={formData.primerNombre}
                onChange={handleNameChange}
              />
              {errors.primerNombre && <p className="text-red-500 text-sm">{errors.primerNombre}</p>}
            </div>

            <div>
              <Input
                label="Segundo Nombre"
                name="segundoNombre"
                value={formData.segundoNombre}
                onChange={handleNameChange}
              />
              {errors.segundoNombre && <p className="text-red-500 text-sm">{errors.segundoNombre}</p>}
            </div>

            <div>
              <Input
                label="Primer Apellido *"
                name="primerApellido"
                value={formData.primerApellido}
                onChange={handleNameChange}
              />
              {errors.primerApellido && <p className="text-red-500 text-sm">{errors.primerApellido}</p>}
            </div>

            <div>
              <Input
                label="Segundo Apellido"
                name="segundoApellido"
                value={formData.segundoApellido}
                onChange={handleNameChange}
              />
              {errors.segundoApellido && <p className="text-red-500 text-sm">{errors.segundoApellido}</p>}
            </div>

            <div>
              <Input
                label="CUI *"
                name="cui"
                value={formData.cui}
                onChange={handleCUIChange}
                maxLength={13}
              />
              {errors.cui && <p className="text-red-500 text-sm">{errors.cui}</p>}
            </div>

            <div className="flex justify-end">
              <Button type="submit">Registrar Guardia</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Modal
        isOpen={modalOpen.isOpen}
        onClose={handleCloseModal}
        title="Resultado de Registro"
      >
        <p className="py-4">{modalMessage}</p>
        <div className="flex justify-end mt-4">
          <Button onClick={handleCloseModal}>Cerrar</Button>
        </div>
      </Modal>
    </div>
  );
}
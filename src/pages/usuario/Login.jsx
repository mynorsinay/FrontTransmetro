import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import Header from "../../components/ui/Header";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/"); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black p-6">
      <div className="w-full max-w-md">
        <Header titulo="🔐 Iniciar Sesión (Deshabilitado)" />

        <Card>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Nombre de Usuario" name="nombreUsuario" />
              <Input label="Contraseña" name="contrasena" type="password" />
              <div className="flex justify-end">
                <Button type="submit">Entrar al Sistema</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

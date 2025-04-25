import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/usuarios/login", {
        email,
        senha,
      });
      
      const { token, role, id } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("id", id);

      if (role === "CLIENT") {
        navigate("/dashboard/cliente");
      } else if (role === "TECNICO") {
        navigate("/dashboard/tecnico");
      } else if (role === "ADMIN") {
        navigate("/dashboard/admin");
      } else {
        setError("Tipo de usuário não reconhecido.");
      }
  
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'Erro ao fazer login');
      } else if (error.request) {
        setError('Erro de comunicação com o servidor');
      } else {
        setError('Ocorreu um erro inesperado. Tente novamente.');
      }
      console.error('Erro ao fazer login:', error);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-900">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Entrar</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition"
          >
            Entrar
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Não tem uma conta?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Cadastre-se
          </a>
        </p>
      </div>
    </div>
  );
}

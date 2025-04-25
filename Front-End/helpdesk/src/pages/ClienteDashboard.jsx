import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ClienteDashboard() {
  const [chamados, setChamados] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [prioridade, setPrioridade] = useState("BAIXA");
  const [loadingChamados, setLoadingChamados] = useState(true);
  const [loadingCriacao, setLoadingCriacao] = useState(false);
  const [erroCriacao, setErroCriacao] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChamados = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/chamados/cliente", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setChamados(response.data);
      } catch (error) {
        console.error("Erro ao buscar chamados", error);
      } finally {
        setLoadingChamados(false);
      }
    };

    fetchChamados();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingCriacao(true);
    setErroCriacao("");

    const chamadoData = {
      titulo,
      descricao,
      prioridade,
      id: localStorage.getItem("id"),
    };

    try {
      await axios.post(
        `http://localhost:8080/api/chamados?usuarioId=${localStorage.getItem("id")}`,
        chamadoData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );      
      setTitulo("");
      setDescricao("");
      setPrioridade("Baixa");
      setLoadingChamados(true);
      const response = await axios.get("http://localhost:8080/api/chamados/cliente", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setChamados(response.data);
    } catch (error) {
      console.error("Erro ao criar chamado", error);
      setErroCriacao("Ocorreu um erro ao criar o chamado. Tente novamente mais tarde.");
    } finally {
      setLoadingCriacao(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    navigate("/login");
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-6 fixed top-0 left-0 w-full z-10 shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold">Dashboard do Cliente</h1>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none transition duration-300"
            onClick={handleLogout}
          >
            Sair
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 pt-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-semibold text-gray-800 mb-8">Criar Novo Chamado</h2>
          {erroCriacao && (
            <div className="text-red-500 text-sm mb-4 font-medium">{erroCriacao}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-lg">
            <div>
              <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">Título</label>
              <input
                id="titulo"
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                required
              />
            </div>

            <div>
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">Descrição</label>
              <textarea
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                required
              ></textarea>
            </div>

            <div>
              <label htmlFor="prioridade" className="block text-sm font-medium text-gray-700">Prioridade</label>
              <select
                id="prioridade"
                value={prioridade}
                onChange={(e) => setPrioridade(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
              >
                <option value="BAIXA">Baixa</option>
                <option value="MEDIA">Média</option>
                <option value="ALTA">Alta</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none transition duration-300"
              disabled={loadingCriacao}
            >
              {loadingCriacao ? "Criando..." : "Criar Chamado"}
            </button>
          </form>
        </div>

        <div className="max-w-6xl mx-auto mt-12">
          <h2 className="text-4xl font-semibold text-gray-800 mb-6">Seus Chamados</h2>

          {loadingChamados ? (
            <div className="text-center text-lg text-gray-600">Carregando seus chamados...</div>
          ) : chamados.length === 0 ? (
            <div className="text-center text-lg text-gray-600">Você ainda não tem chamados registrados.</div>
          ) : (
            <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-lg">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-6 text-left text-gray-600">Título</th>
                    <th className="py-3 px-6 text-left text-gray-600">Descrição</th>
                    <th className="py-3 px-6 text-left text-gray-600">Prioridade</th>
                    <th className="py-3 px-6 text-left text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {chamados.map((chamado) => (
                    <tr key={chamado.id} className="border-t border-gray-200">
                      <td className="py-4 px-6">{chamado.titulo}</td>
                      <td className="py-4 px-6">{chamado.descricao}</td>
                      <td className="py-4 px-6">{chamado.prioridade}</td>
                      <td className="py-4 px-6">{chamado.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClienteDashboard;

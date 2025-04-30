import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [usuarios, setUsuarios] = useState([]);
  const [chamados, setChamados] = useState([]);
  const [rolesTemp, setRolesTemp] = useState({});
  const [relatorio, setRelatorio] = useState({
    statusCount: {},
    prioridadeCount: {},
  });
  const [selectedPrioridade, setSelectedPrioridade] = useState("");
  const [activeTab, setActiveTab] = useState("usuarios");
  const [selectedTecnico, setSelectedTecnico] = useState(null);
  const [selectedChamado, setSelectedChamado] = useState(null);
  const navigate = useNavigate();

  const [relatorioSLA, setRelatorioSLA] = useState(null);
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [loading, setLoading] = useState(false);

  // Função para pegar o token do localStorage
  const getAuthToken = () => {
    return localStorage.getItem("token"); // Supondo que o token é salvo com a chave "token"
  };

  // Configuração do axios para incluir o token no cabeçalho
  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api", // baseURL para as suas requisições
    headers: {
      "Authorization": `Bearer ${getAuthToken()}`, // Adiciona o token ao cabeçalho
      "Content-Type": "application/json",
    },
  });

  const gerarRelatorio = async () => {
    if (!inicio || !fim) {
      alert("Por favor, preencha ambos os campos de data.");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `/chamados/sla?inicio=${inicio}&fim=${fim}`
      );
      setRelatorioSLA(response.data);
    } catch (error) {
      console.error("Erro ao gerar relatório SLA", error);
      alert("Erro ao gerar relatório.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await axiosInstance.get("/usuarios");
      setUsuarios(response.data);
      const rolesIniciais = {};
      response.data.forEach((user) => {
        rolesIniciais[user.id] = user.role;
      });
      setRolesTemp(rolesIniciais);
    } catch (error) {
      console.error("Erro ao buscar usuários", error);
    }
  };

  const fetchChamados = async () => {
    try {
      const response = await axiosInstance.get("/chamados/todas");
      setChamados(response.data);
    } catch (error) {
      console.error("Erro ao buscar chamados", error);
    }
  };

  const atribuirTecnico = async () => {
    if (!selectedTecnico || !selectedChamado) {
      alert("Selecione um técnico e um chamado.");
      return;
    }

    try {
      await axiosInstance.put(
        `/chamados/${selectedChamado}/atribuir-tecnico/${selectedTecnico}`
      );
      fetchChamados();
      alert("Técnico atribuído com sucesso!");
    } catch (error) {
      console.error("Erro ao atribuir técnico", error);
      alert("Erro ao atribuir técnico.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    navigate("/login");
  };

  const handleUpdateRole = async (userId) => {
    try {
      const role = rolesTemp[userId];
      await axiosInstance.put(
        `/usuarios/${userId}/role`,
        role
      );
      alert("Role atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar role", error);
      alert("Erro ao atualizar role.");
    }
  };

  const atualizarPrioridade = async () => {
    if (!selectedChamado) {
      alert("Selecione um chamado primeiro.");
      return;
    }
    if (!selectedPrioridade) {
      alert("Selecione uma prioridade.");
      return;
    }

    try {
      await axiosInstance.put(
        `/chamados/${selectedChamado}/prioridade`,
        { prioridade: selectedPrioridade.toUpperCase() }
      );
      fetchChamados();
      alert("Prioridade atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar prioridade", error);
      alert("Erro ao atualizar prioridade.");
    }
  };

  useEffect(() => {
    fetchUsuarios();
    fetchChamados();
  }, []);

  const rolesDisponiveis = ["CLIENT", "TECNICO", "ADMIN"];

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="bg-indigo-600 text-white p-4 fixed top-0 left-0 w-full z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Admin Panel</h1>
          <div className="space-x-4 flex flex-wrap justify-between sm:space-x-4 sm:space-y-0 space-y-4">
            <button
              className={`px-4 py-2 rounded ${activeTab === "usuarios" ? "bg-indigo-500" : "bg-indigo-700"} hover:bg-indigo-600`}
              onClick={() => setActiveTab("usuarios")}
            >
              Usuários
            </button>
            <button
              className={`px-4 py-2 rounded ${activeTab === "atribuir-tecnico" ? "bg-indigo-500" : "bg-indigo-700"} hover:bg-indigo-600`}
              onClick={() => setActiveTab("atribuir-tecnico")}
            >
              Atribuir Técnico
            </button>
            <button
              className={`px-4 py-2 rounded ${activeTab === "relatorio" ? "bg-indigo-500" : "bg-indigo-700"} hover:bg-indigo-600`}
              onClick={() => setActiveTab("relatorio")}
            >
              Relatórios
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none"
              onClick={handleLogout}
            >
              Sair
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 pt-20">
        {activeTab === "usuarios" && (
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-2xl font-semibold text-gray-800 mb-6">Painel de Administração de Usuários</h2>
            <div className="overflow-x-auto bg-white shadow-xl rounded-xl">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Nome</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Papel</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {usuarios.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.id}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.nome}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4">
                        <select
                          className="w-full bg-gray-100 border border-gray-300 text-gray-700 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          value={rolesTemp[user.id]}
                          onChange={(e) =>
                            setRolesTemp({ ...rolesTemp, [user.id]: e.target.value })
                          }
                        >
                          {rolesDisponiveis.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          onClick={() => handleUpdateRole(user.id)}
                        >
                          Atualizar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "atribuir-tecnico" && (
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-2xl font-semibold text-gray-800 mb-6">Atribuição de Técnico aos Chamados</h2>
            <div className="bg-white p-6 shadow-xl rounded-xl">
              <div className="mb-4">
                <label htmlFor="chamado" className="block text-sm font-medium text-gray-700">Escolha um Chamado:</label>
                <select
                  id="chamado"
                  className="w-full bg-gray-100 border border-gray-300 text-gray-700 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onChange={(e) => setSelectedChamado(e.target.value)}
                >
                  <option value="">Selecione um Chamado</option>
                  {chamados.map((chamado) => (
                    <option key={chamado.id} value={chamado.id}>
                      {chamado.titulo} {chamado.tecnico ? `(Técnico: ${chamado.tecnico.nome})` : '(Sem técnico)'}
                    </option>
                  ))}
                </select>
                {selectedChamado && (() => {
                  const chamado = chamados.find(c => c.id.toString() === selectedChamado);
                  return (
                    <div className="mt-2 text-sm text-gray-700">
                      Técnico Atual: {chamado?.tecnico ? chamado.tecnico.nome : 'Nenhum técnico atribuído'}
                    </div>
                  );
                })()}
              </div>
              <div className="mb-4">
                <label htmlFor="tecnico" className="block text-sm font-medium text-gray-700">Escolha um Técnico:</label>
                <select
                  id="tecnico"
                  className="w-full bg-gray-100 border border-gray-300 text-gray-700 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onChange={(e) => setSelectedTecnico(e.target.value)}
                >
                  <option value="">Selecione</option>
                  {usuarios.filter(user => user.role === "TECNICO").map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.nome}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={atribuirTecnico}
              >
                Atribuir Técnico
              </button>
            </div>

            <div className="mt-6">
              <div className="mb-4">
                <label htmlFor="prioridade" className="block text-sm font-medium text-gray-700">Selecione a Prioridade:</label>
                <select
                  id="prioridade"
                  className="w-full bg-gray-100 border border-gray-300 text-gray-700 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  value={selectedPrioridade}
                  onChange={(e) => setSelectedPrioridade(e.target.value)}
                >
                  <option value="">Selecione a Prioridade</option>
                  <option value="BAIXA">Baixa</option>
                  <option value="MEDIA">Média</option>
                  <option value="ALTA">Alta</option>
                </select>
              </div>

              <button
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                onClick={atualizarPrioridade}
                disabled={!selectedPrioridade}
              >
                Atualizar Prioridade do Chamado
              </button>
            </div>
          </div>
        )}

        {activeTab === "relatorio" && (
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-2xl font-semibold text-gray-800 mb-6">Gerar Relatório SLA</h2>
            <div className="bg-white p-6 shadow-xl rounded-xl">
              <div className="mb-4">
                <label htmlFor="inicio" className="block text-sm font-medium text-gray-700">Data de Início</label>
                <input
                  type="datetime-local"
                  id="inicio"
                  value={inicio}
                  onChange={(e) => setInicio(e.target.value)}
                  className="w-full bg-gray-100 border border-gray-300 text-gray-700 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="fim" className="block text-sm font-medium text-gray-700">Data de Fim</label>
                <input
                  type="datetime-local"
                  id="fim"
                  value={fim}
                  onChange={(e) => setFim(e.target.value)}
                  className="w-full bg-gray-100 border border-gray-300 text-gray-700 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none"
                onClick={gerarRelatorio}
                disabled={loading}
              >
                {loading ? "Gerando Relatório..." : "Gerar Relatório SLA"}
              </button>
            </div>

            {relatorioSLA && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-indigo-700 mb-2">Relatório SLA</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 shadow-xl rounded-lg">
                    <h4 className="text-lg font-medium text-gray-800 mb-2">Chamados Fechados</h4>
                    <p className="text-sm text-gray-600">Total: {relatorioSLA.chamadosFechados}</p>
                    <p className="text-sm text-gray-600">Dentro do SLA: {relatorioSLA.chamadosDentroSLA}</p>
                    <p className="text-sm text-gray-600">Fora do SLA: {relatorioSLA.chamadosForaSLA}</p>
                    <p className="text-sm text-gray-600">Percentual Cumprido: {relatorioSLA.percentualCumprimento.toFixed(2)}%</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}


      </div>
    </div>
  );
}

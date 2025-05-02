import axios from "axios";
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

export default function TecnicoDashboard() {
  const [chamados, setChamados] = useState([]);
  const [chamadoSelecionado, setChamadoSelecionado] = useState(null);
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novaDescricao, setNovaDescricao] = useState('');
  const [novoStatus, setNovoStatus] = useState('');
  const [novaPrioridade, setNovaPrioridade] = useState('');
  const [abaSelecionada, setAbaSelecionada] = useState('ativos');
  const [selectedChamado, setSelectedChamado] = useState(null);
  const navigate = useNavigate();
  const tecnicoId = localStorage.getItem("id");

  const fetchChamadosTecnico = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `http://localhost:8080/api/chamados/tecnico/${tecnicoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setChamados(response.data);
    } catch (error) {
      console.error('Erro ao buscar chamados do técnico', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    navigate("/login");
  };

  const handleRecusarChamado = async (chamadoId) => {
    const token = localStorage.getItem('token');

    try {
      await axios.put(
        `http://localhost:8080/api/chamados/${chamadoId}/recusar`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }
      );
      alert("Chamado recusado e atribuído a outro técnico.");
      fetchChamadosTecnico();
    } catch (error) {
      console.error('Erro ao recusar chamado', error);
      if (error.response) {
        console.error(`Erro ao recusar chamado: ${error.response.data || error.response.statusText}`);
      } else {
        alert("Erro inesperado ao recusar chamado.");
      }
    }
  };

  const handleConcluirChamado = async (chamadoId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `http://localhost:8080/api/chamados/${chamadoId}/concluir`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      alert("Chamado concluído com sucesso!");
      fetchChamadosTecnico();
      setChamadoSelecionado(null);
    } catch (error) {
      console.error('Erro ao concluir chamado', error);
      alert("Erro ao concluir chamado.");
    }
  };

  const atualizarChamado = async () => {
    if (!chamadoSelecionado) {
      alert("Nenhum chamado selecionado.");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Usuário não autenticado.");
      return;
    }

    const payload = {};
    if (novoTitulo?.trim()) payload.novoTitulo = novoTitulo.trim();
    if (novaDescricao?.trim()) payload.novaDescricao = novaDescricao.trim();
    if (novoStatus) payload.novoStatus = novoStatus;
    if (novaPrioridade) payload.novaPrioridade = novaPrioridade.toUpperCase();

    if (Object.keys(payload).length === 0) {
      alert("Nenhuma atualização informada.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:8080/api/chamados/${chamadoSelecionado.id}/atualizar`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      alert("Chamado atualizado com sucesso!");
      fetchChamadosTecnico();
      setChamadoSelecionado(null);
    } catch (error) {
      console.error("Erro ao atualizar chamado", error);
      alert("Erro ao atualizar chamado.");
    }
  };

  const atualizarPrioridadeChamado = async () => {
    if (!chamadoSelecionado) {
      alert("Nenhum chamado selecionado.");
      return;
    }
  
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Usuário não autenticado.");
      return;
    }
  
    if (!novaPrioridade?.trim()) {
      alert("Nenhuma prioridade informada.");
      return;
    }
  
    try {
      await axios.put(
        `http://localhost:8080/api/chamados/${chamadoSelecionado.id}/prioridade`,
        { prioridade: novaPrioridade.toUpperCase() },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
  
      alert("Prioridade do chamado atualizada com sucesso!");
      fetchChamadosTecnico();
      setChamadoSelecionado(null);
    } catch (error) {
      console.error("Erro ao atualizar prioridade do chamado", error);
      alert("Erro ao atualizar prioridade do chamado.");
    }
  };
  
  useEffect(() => {
    fetchChamadosTecnico();
  }, []);

  const statusDisponiveis = ['ABERTO', 'PENDENTE', 'EM_ATENDIMENTO', 'RESOLVIDO', 'FECHADO'];
  const prioridadesDisponiveis = ['BAIXA', 'MEDIA', 'ALTA'];

  const chamadosAtivos = chamados.filter(c => c.status !== 'RESOLVIDO' && c.status !== 'FECHADO');
  const chamadosFinalizados = chamados.filter(c => c.status === 'RESOLVIDO' || c.status === 'FECHADO');
  const chamadosFiltrados = abaSelecionada === 'ativos' ? chamadosAtivos : chamadosFinalizados;

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="bg-indigo-600 text-white p-4 fixed top-0 left-0 w-full z-10 shadow-md">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold">Painel do Técnico</h1>
          <button
            className="px-4 py-2 bg-red-500 rounded hover:bg-red-600 transition"
            onClick={handleLogout}
          >
            Sair
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 pt-20 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">Meus Chamados</h2>
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 rounded ${abaSelecionada === 'ativos' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setAbaSelecionada('ativos')}
            >
              Ativos ({chamadosAtivos.length})
            </button>
            <button
              className={`px-4 py-2 rounded ${abaSelecionada === 'concluidos' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setAbaSelecionada('concluidos')}
            >
              Concluídos / Fechados ({chamadosFinalizados.length})
            </button>
          </div>
        </div>

        <div className="overflow-x-auto bg-white shadow-xl rounded-xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Título</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Descrição</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Prioridade</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {chamadosFiltrados.map((chamado) => (
                <tr
                  key={chamado.id}
                  className="hover:bg-gray-100 cursor-pointer transition"
                  onClick={() => setChamadoSelecionado(chamado)}
                >
                  <td className="px-6 py-4 text-sm text-gray-900">{chamado.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{chamado.titulo}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{chamado.descricao}</td>
                  <td className="px-6 py-4">
                    <span className={`px-4 py-2 rounded-lg font-medium ${chamado.status === 'RESOLVIDO' ? 'bg-green-100 text-green-700' :
                      chamado.status === 'FECHADO' ? 'bg-gray-200 text-gray-700' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                      {chamado.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-4 py-2 rounded-lg font-medium ${chamado.prioridade === 'ALTA' ? 'bg-red-100 text-red-700' :
                      chamado.prioridade === 'MEDIA' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                      {chamado.prioridade}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition ml-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConcluirChamado(chamado.id);
                      }}
                    >
                      Concluir
                    </button>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition ml-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRecusarChamado(chamado.id);
                      }}
                    >
                      Recusar
                    </button>
                  </td>
                </tr>
              ))}
              {chamadosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">Nenhum chamado nesta aba.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {chamadoSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 animate-fade-in">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
              onClick={() => setChamadoSelecionado(null)}
              aria-label="Fechar"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="mb-6">
              <h2 className="text-3xl font-bold text-indigo-600">📋 Detalhes do Chamado</h2>
              <p className="text-sm text-gray-500 mt-1">Informações detalhadas do chamado selecionado</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
              <div>
                <p className="text-sm text-gray-500 mb-1">ID</p>
                <div className="bg-gray-100 rounded-lg px-4 py-2 font-medium">{chamadoSelecionado.id}</div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <div className={`px-4 py-2 rounded-lg font-medium ${chamadoSelecionado.status === 'RESOLVIDO'
                  ? 'bg-green-100 text-green-700'
                  : chamadoSelecionado.status === 'FECHADO'
                    ? 'bg-gray-200 text-gray-700'
                    : 'bg-yellow-100 text-yellow-800'
                  }`}>
                  {chamadoSelecionado.status}
                </div>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500 mb-1">Título</p>
                <div className="bg-gray-100 rounded-lg px-4 py-2 font-medium">{chamadoSelecionado.titulo}</div>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500 mb-1">Descrição</p>
                <div className="bg-gray-100 rounded-lg px-4 py-2">{chamadoSelecionado.descricao}</div>
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm text-gray-500 mb-1">Novo Título</label>
              <textarea
                value={novoTitulo}
                onChange={(e) => setNovoTitulo(e.target.value)}
                className="w-full bg-gray-100 border border-gray-300 text-gray-700 py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              ></textarea>
            </div>
            <div className="mt-6">
              <label className="block text-sm text-gray-500 mb-1">Nova Descrição</label>
              <textarea
                value={novaDescricao}
                onChange={(e) => setNovaDescricao(e.target.value)}
                className="w-full bg-gray-100 border border-gray-300 text-gray-700 py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              ></textarea>
            </div>
            <div className="mt-6">
              <label className="block text-sm text-gray-500 mb-1">Novo Status</label>
              <select
                value={novoStatus}
                onChange={(e) => setNovoStatus(e.target.value)}
                className="w-full bg-gray-100 border border-gray-300 text-gray-700 py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {statusDisponiveis.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-6">
              <label className="block text-sm text-gray-500 mb-1">Nova Prioridade</label>
              <select
                value={novaPrioridade}
                onChange={(e) => setNovaPrioridade(e.target.value)}
                className="w-full bg-gray-100 border border-gray-300 text-gray-700 py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {prioridadesDisponiveis.map((prioridade) => (
                  <option key={prioridade} value={prioridade}>
                    {prioridade}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-6 flex justify-end gap-x-4">
              <button
                className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                onClick={atualizarPrioridadeChamado}
              >
                Atualizar Prioridade
              </button>
              <button
                onClick={atualizarChamado}
                className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              >
                Atualizar Chamado
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

import React from "react";

function TecnicoDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bem-vindo, Técnico!</h1>
      <ul className="space-y-2">
        <li>🗂 Ver chamados atribuídos a mim</li>
        <li>🔄 Alterar status dos chamados</li>
        <li>💬 Responder mensagens dos clientes</li>
        <li>📝 Adicionar observações internas</li>
      </ul>
    </div>
  );
}

export default TecnicoDashboard;

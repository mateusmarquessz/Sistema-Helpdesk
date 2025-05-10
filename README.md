#  Sistema de Help Desk

O **Sistema de Help Desk** foi desenvolvido para otimizar a gestão de chamados e melhorar a comunicação entre clientes, técnicos e administradores. Com uma interface moderna e intuitiva, este sistema permite o controle de SLA, notificações em tempo real e o gerenciamento eficiente de tarefas.

##  Funcionalidades

### **Cliente:**
- ** Criar Chamados:** Criação de chamados com definição de título, descrição e prioridade.
- ** Acompanhar Chamados:** Visualização dos chamados criados, incluindo tempo de atendimento e SLA.
- ** Notificações:** Recebe alertas sempre que a prioridade do chamado for alterada.
- ** Monitoramento de SLA:** Acompanhamento do tempo restante para o atendimento dos chamados.

### **Admin:**
- ** Gerenciar Usuários:** Visualização de todos os clientes e técnicos, com a possibilidade de atribuir papéis (cliente, técnico, admin).
- ** Gerenciar Chamados:** Definição da prioridade e do técnico responsável por cada chamado.
- ** Relatórios:** Acesso a relatórios detalhados sobre os chamados, incluindo SLA, tempos de atendimento e prazos.

### **Técnico:**
- ** Recebimento Automático de Chamados:** Atribuição de chamados automaticamente via **RoundRobin**.
- ** Recusar Chamado:** Opção de recusar chamados, permitindo que sejam redistribuídos para outros técnicos.
- ** Atualização de Chamados:** O técnico pode atualizar dados como título, descrição, status e prioridade de chamados.

##  Tecnologias Utilizadas

### **Front-end:**
- **React** + **Vite**: Framework moderno para uma interface reativa e ágil.
- **Tailwind CSS**: Estilização com utilitários de CSS, proporcionando um design limpo e responsivo.

### **Back-end:**
- **Spring Boot**: Framework para construção da API RESTful.
- **Spring Security**: Autenticação e autorização seguras com **JWT**.
- **Lombok**: Redução de código boilerplate.
- **PostgreSQL**: Banco de dados relacional robusto e escalável.

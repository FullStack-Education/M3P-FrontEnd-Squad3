# Aang - Gestão Educacional

## Descrição do Projeto

O **Aang - Gestão Educacional** é uma aplicação web desenvolvida para facilitar a gestão educacional em instituições de ensino. O sistema oferece funcionalidades para gerenciar docentes, alunos, turmas e notas, proporcionando uma interface amigável e intuitiva para administradores e professores. 

### Problema que Resolve

A aplicação resolve o problema da complexidade na gestão de informações acadêmicas, como o cadastro e controle de docentes, alunos, turmas e avaliações. Ela centraliza esses dados em um único sistema, permitindo um gerenciamento eficiente e organizado, além de garantir que apenas usuários autorizados possam acessar ou modificar certas informações.

## Tecnologias Utilizadas

### Backend
- **JSON Server:** Utilizado como backend fake para simular operações CRUD (Create, Read, Update, Delete) e armazenar os dados do sistema.
- **Node.js:** Ambiente de execução para o servidor backend e gerenciamento de pacotes com NPM.

### Frontend
- **Angular 18:** Framework utilizado para construir a aplicação SPA (Single Page Application).
- **Angular Material:** Biblioteca de componentes UI para Angular, utilizada para criar uma interface de usuário consistente e responsiva.
- **RxJS:** Biblioteca para programação reativa, utilizada em conjunto com Angular para manipulação de fluxos de dados assíncronos.
- **TypeScript:** Linguagem utilizada para desenvolvimento do frontend, com tipagem estática para maior segurança e qualidade do código.

### Ferramentas de Desenvolvimento
- **Visual Studio Code:** Editor de código utilizado durante o desenvolvimento.
- **Git:** Sistema de controle de versão utilizado para o gerenciamento do código-fonte.
- **Trello:** Plataforma utilizada para organização das tarefas do projeto no formato KANBAN.

### Estrutura da Aplicação
A aplicação é organizada em módulos, componentes e serviços, facilitando a manutenção e escalabilidade. 

## Como Executar o Projeto

### Pré-requisitos
- **Node.js** instalado na máquina (versão 14 ou superior).
- **Angular CLI** instalado globalmente: `npm install -g @angular/cli`
- **Git** para clonar o repositório.

### Passos para Execução

1. **Clone o repositório:**
git clone https://github.com/seu-usuario/ts-angular-labPCP.git
cd /ts-angular-labPCP

2. **Instale as dependências:**
  npm install

3. **Inicie o JSON Server:**
  npm run json-server

4. **Inicie a aplicação Angular:**
    ng serve

5. **Acesse a aplicação no navegador:**
  http://localhost:4200
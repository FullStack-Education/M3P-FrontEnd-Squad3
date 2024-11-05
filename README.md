# LabPCP - Gestão Educacional

## Descrição do Projeto

Bem-vindo(a) ao repositório Front-End do projeto!

O **LabPCP - Gestão Educacional** é uma aplicação web desenvolvida para facilitar a gestão educacional em instituições de ensino. O sistema oferece funcionalidades para gerenciar docentes, alunos, turmas e notas, proporcionando uma interface amigável e intuitiva para administradores e professores.

### Problema que Resolve

A aplicação resolve o problema da complexidade na gestão de informações acadêmicas, como o cadastro e controle de docentes, alunos, turmas e avaliações. Ela centraliza esses dados em um único sistema, permitindo um gerenciamento eficiente e organizado, além de garantir que apenas usuários autorizados possam acessar ou modificar certas informações.

## Tecnologias Utilizadas

### Backend
- **Java e Spring:** Execução de API externa feita em Java e Spring referente ao Back-end deste projeto.

  [Veja e baixe aqui](https://github.com/FullStack-Education/M3P-BackEnd-Squad3)

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
- **Angular CLI** instalado globalmente: npm install -g @angular/cli
- **Git** para clonar o repositório.
- **Back-end** em execução juntamente à aplicação.  
   [Veja aqui o Back-end](https://github.com/FullStack-Education/M3P-BackEnd-Squad3)

### Passos para Execução

1. **Clone o repositório:**  
   ```
   git clone https://github.com/FullStack-Education/M3P-FrontEnd-Squad3.git cd /M3P-FrontEnd-Squad3
   ```

2. **Iniciar o Back-end:**
  Se não iniciado, rodar a aplicação do back-end. 
  [Veja como](https://github.com/FullStack-Education/M3P-BackEnd-Squad3)

1. **Instale as dependências:**
    ```
    npm install
    ```

2. **Inicie a aplicação:**
    ```
    npm run start:proxi
    ```

3. **Acesse a aplicação no navegador:**
  http://localhost:4200

### Dados Predefinidos

Para facilitar os testes e utilização do sistema, a aplicação possui alguns dados predefinidos em seu banco de dados. Refira-se aos dados a seguir para acessar diferentes tipos de contas.

- ADMIN
  - Login: `ADM`
  - Senha: `ADM`
- PEDAGOGICO  
  - ...

## Possíveis Melhorias

- ### Dashboard com Visualizações  
  Incluir gráficos e visualizações com dados agregados, como número de alunos por turma, desempenho médio por disciplina, etc., utilizando bibliotecas como D3.js ou Chart.js.

- ### Pesquisa e Filtro Avançados
  Implementar filtros e uma barra de pesquisa global para facilitar a navegação pelos registros de alunos, docentes e turmas, melhorando a acessibilidade e a experiência do usuário.

- ### Tema Personalizável
  Incluir a opção de temas claro e escuro, além de uma seção de configurações onde o usuário possa personalizar a aparência da interface.

- ### Suporte Multilíngue
  Adicionar suporte para múltiplos idiomas, permitindo que o sistema seja usado em diferentes regiões.
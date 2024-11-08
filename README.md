# LabPCP - Gestão Educacional

![Imagem da tela de login do sistema LabPCP](/public/assets/LABPCP.png)


## Descrição do Projeto

O **LabPCP - Gestão Educacional** é um sistema web de gestão educacional desenvolvido como parte do projeto avaliativo do módulo 3.

Este sistema proporciona funcionalidades essenciais para a administração de instituições educacionais, permitindo o cadastro de turmas, avaliações, docentes e alunos, além de oferecer recursos para alocação de professores, gerenciamento de notas e controle de acesso dos usuários.

Desenvolvido utilizando Angular 18, o **LabPCP - Gestão Educacional** emprega tecnologias modernas e práticas de desenvolvimento, incluindo TypeScript, HTML, SCSS, Material UI e GitHub para versionamento do código.

Além disso, a metodologia de desenvolvimento utiliza o Kanban no Trello para organização das tarefas, garantindo uma abordagem ágil e eficiente.

O sistema atende a uma variedade de papéis de usuários, como administradores, docentes e alunos, cada um com suas permissões específicas de acesso e funcionalidades disponíveis.

Com uma arquitetura sólida e uma implementação cuidadosa das regras de negócio, o Educação FullStack é uma solução completa para a gestão educacional, proporcionando uma experiência de usuário eficaz para todas as partes envolvidas no processo educativo.

---

### Problema que Resolve

A aplicação resolve o problema da complexidade na gestão de informações acadêmicas, como o cadastro e controle de docentes, alunos, turmas e avaliações. Ela centraliza esses dados em um único sistema, permitindo um gerenciamento eficiente e organizado, além de garantir que apenas usuários autorizados possam acessar ou modificar certas informações.

---

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

---

## Como Executar o Projeto

### Pré-requisitos
- **Node.js** instalado na máquina (versão 14 ou superior).
- **Angular CLI** instalado globalmente: npm install -g @angular/cli
- **Git** para clonar o repositório.
- **Back-end** em execução juntamente à aplicação.  
   [Veja aqui o Back-end](https://github.com/FullStack-Education/M3P-BackEnd-Squad3)

### Passos para Execução

1. **Iniciar o Back-end:**
  Se não iniciado, rodar a aplicação do back-end. 
  [Veja como](https://github.com/FullStack-Education/M3P-BackEnd-Squad3)


2. **Clone o repositório:**
   ```
   git clone https://github.com/FullStack-Education/M3P-FrontEnd-Squad3.git cd /M3P-FrontEnd-Squad3
   ```

3. **Instale as dependências:**
    ```
    npm install
    ```

4. **Inicie a aplicação:**
    ```
    npm run start:proxi
    ```

5. **Acesse a aplicação no navegador:**
  http://localhost:4200

### Obs: Garanta que a porta `4200` estaja diponivel no seu dispositivo

### Dados Predefinidos

Para facilitar os testes e utilização do sistema, a aplicação possui alguns dados predefinidos em seu banco de dados. Refira-se aos dados a seguir para acessar diferentes tipos de contas.

- ADMIN
  - Login: `admin@mail.com`
  - Senha: `admin@mail.com`
- PROFESSOR  
  - Login: `gabriel@mail.com`
  - Senha: `123456`
- ALUNO
  - Login: `maria@mail.com`
  - Senha: `123456`

---

## Roteiro da Aplicação

Possuir as seguintes páginas e funcionalidades:

- Login
- Menu Lateral
- Toolbar
- Início (Dashboard)
- Cadastro/Edição de Docente
- Cadastro/Edição de Alunos
- Cadastro de Turmas
- Cadastro de Notas
- Listagem de Docentes
- Listagem de Avaliações

---

## Possíveis Melhorias

- ### Dashboard com Visualizações  
  Incluir gráficos e visualizações com dados agregados, como número de alunos por turma, desempenho médio por disciplina, etc., utilizando bibliotecas como D3.js ou Chart.js.

- ### Pesquisa e Filtro Avançados
  Implementar filtros e uma barra de pesquisa global para facilitar a navegação pelos registros de alunos, docentes e turmas, melhorando a acessibilidade e a experiência do usuário.

- ### Tema Personalizável
  Incluir a opção de temas claro e escuro, além de uma seção de configurações onde o usuário possa personalizar a aparência da interface.

- ### Suporte Multilíngue
  Adicionar suporte para múltiplos idiomas, permitindo que o sistema seja usado em diferentes regiões.
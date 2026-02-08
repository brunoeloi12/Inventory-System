# 🏭 StockMaster - Sistema de Controle Industrial

![Project Status](https://img.shields.io/badge/status-concluded-success)
![License](https://img.shields.io/badge/license-MIT-blue)
![Java](https://img.shields.io/badge/java-17%2B-orange)
![React](https://img.shields.io/badge/react-18-blue)

O **StockMaster** é uma solução Full-Stack robusta para gestão de estoque industrial. O sistema permite o cadastro detalhado de matérias-primas, criação de produtos com fichas técnicas (receitas) complexas e possui um **Simulador de Produção** inteligente, que calcula a capacidade de manufatura baseada no estoque atual e prioriza itens de maior valor agregado para maximizar a receita.

---

## 🚀 Tecnologias Utilizadas

O projeto foi construído utilizando uma arquitetura moderna, focada em performance, escalabilidade e qualidade de código.

### 🎨 Front-end (Web)
* **Core:** [React](https://react.dev/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
* **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/) (Nova engine de alta performance).
* **Gerenciamento de Estado (Híbrido):**
    * **Server State:** [TanStack Query (React Query)](https://tanstack.com/query) para cache, refetching e sincronização com API.
    * **Client State:** [Redux Toolkit](https://redux-toolkit.js.org/) para gerenciamento de estados globais complexos.
* **UI Components:** [Shadcn/ui](https://ui.shadcn.com/) (Radix UI) + [Lucide React](https://lucide.dev/).
* **Quality Assurance:**
    * **Unitários/Integração:** [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/).
    * **End-to-End (E2E):** [Cypress](https://www.cypress.io/).

### ☕ Back-end (API)
* **Framework:** [Quarkus](https://quarkus.io/) (Java supersônico e subatômico).
* **Linguagem:** Java 17+.
* **Persistência:** Hibernate ORM com Panache.
* **Banco de Dados:** PostgreSQL.
* **Testes:** JUnit 5 + RestAssured.

---

## ✨ Funcionalidades Principais

### 1. Dashboard Analítico
* Visão geral de valor monetário em estoque.
* Contagem de produtos e insumos.
* **Alertas Inteligentes:** Notificação automática para matérias-primas com estoque crítico (abaixo do mínimo).

### 2. Gestão de Matérias-Primas (Insumos)
* CRUD completo (Create, Read, Update, Delete).
* Validação de integridade referencial (impede exclusão de insumos em uso).
* Controle de estoque físico.

### 3. Gestão de Produtos e Engenharia de Receita
* Criação de produtos compostos.
* **Ficha Técnica Dinâmica:** Vinculação de múltiplos insumos com quantidades específicas (Ex: 1 Bolo = 0.5kg Farinha + 2 Ovos).
* Cálculo automático de dependências.

### 4. Simulador de Produção (Algoritmo)
* Analisa todo o estoque disponível em tempo real.
* Cruza dados com as receitas dos produtos.
* **Algoritmo de Prioridade:** Sugere a produção priorizando produtos com **maior valor de venda**, garantindo o melhor uso possível dos recursos escassos.

---

## 🛠️ Instalação e Execução

### Pré-requisitos
* **Node.js** (v20 ou superior)
* **Java JDK** (17 ou superior)
* **Maven** (3.8+)
* **Docker** (Opcional, recomendado para o banco de dados)

### 1. Configurando o Banco de Dados
O projeto espera um banco PostgreSQL rodando na porta `5432`.

**Via Docker (Recomendado):**
```bash
docker run --name stock-postgres \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=inventory_db \
  -p 5432:5432 \
  -d postgres
```

### Configuração manual `(application.properties)`.

```bash
quarkus.datasource.jdbc.url=jdbc:postgresql://localhost:5432/inventory_db
quarkus.datasource.username=user
quarkus.datasource.password=password
```
### 2. Configurando o Banco de Dados
Navegue até a pasta do backend (onde está o `pom.xml`):

```bash
# Modo de desenvolvimento (Hot Reload ativado)
mvn quarkus:dev
```
A API estará disponível em: http://localhost:8080

### 3. Executando o Front-end
Navegue até a pasta `web`:

```bash
# Instalar dependências
npm install

# Rodar servidor de desenvolvimento
npm run dev
```
A aplicação estará disponível em: http://localhost:5173

---

## 🧪 Estratégia de Testes
O projeto possui uma suíte de testes robusta cobrindo diversas camadas da aplicação.

### Testes Unitários (Front-end)
Focados na lógica dos componentes, reducers e hooks customizados. Utiliza ambiente `jsdom`.

```bash
cd web
npx vitest run
# Para ver cobertura de código:
npx vitest run --coverage
```

### Testes End-to-End (E2E)
Simulam o usuário real navegando na aplicação, clicando em botões e interagindo com a API real (ou mockada).

Certifique-se de que o Front-end (`npm run dev`) e o Back-end (``mvn quarkus:dev``) estejam rodando.

```bash
cd web

# Modo Headless (Executa no terminal, ideal para CI/CD)
npx cypress run

# Modo Interativo (Abre a interface visual do Cypress)
npx cypress open
```

---

## 📂 Estrutura do Projeto

```bash
inventory-system/
├── backend/ (Quarkus API)
│   ├── src/main/java/br/com/brunoeloi/inventory/
│   │   ├── model/       # Entidades JPA (Product, RawMaterial)
│   │   ├── resource/    # Controllers REST
│   │   └── service/     # Regras de Negócio (Production Logic)
│   └── src/test/        # Testes de Integração Java (RestAssured)
│
└── web/ (React Frontend)
    ├── cypress/e2e/     # Testes E2E (Fluxos de Usuário)
    ├── src/
    │   ├── components/  # Componentes UI (Shadcn/Reutilizáveis)
    │   ├── hooks/       # Custom Hooks (React Query)
    │   ├── pages/       # Telas da aplicação
    │   ├── store/       # Redux Slices e Store config
    │   └── test/        # Configuração do Vitest (setup.ts)
    ├── vite.config.ts   # Config Vite + Vitest + Tailwind Plugin
    └── package.json
```

---

## 🤝 Como Contribuir

1. Faça um Fork do projeto.

2. Crie uma Branch para sua Feature (git checkout -b feature/NovaFeature).

3. Faça o Commit (git commit -m 'Add some NovaFeature').

4. Faça o Push (git push origin feature/NovaFeature).

5. Abra um Pull Request.


<div align="center"> <strong>Desenvolvido por Bruno Eloi</strong> 🚀<br/>
<em>Full Stack Developer | Java & React Specialist</em> </div>

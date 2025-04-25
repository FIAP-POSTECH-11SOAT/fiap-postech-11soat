# Backend RMS (Restaurant Management System) com NestJS

![Badge Licença](https://img.shields.io/badge/license-MIT-blue.svg)
![Badge NestJS](https://img.shields.io/badge/NestJS-%5E10.0.0-red.svg)
![Badge Prisma](https://img.shields.io/badge/Prisma-%5E5.0.0-blueviolet.svg)
![Badge PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)
![Badge Jest](https://img.shields.io/badge/Tests-Jest-brightgreen.svg)
![Badge Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)

<!-- Adicione badges de status do GitHub Actions aqui quando configurado -->
<!-- ![Badge Build Status](https://github.com/SEU_USUARIO/SEU_REPOSITORIO/actions/workflows/main.yml/badge.svg) -->

Backend robusto e escalável para um Sistema de Gerenciamento de Restaurantes (RMS), construído com NestJS e seguindo as melhores práticas de desenvolvimento de software.

## ✨ Visão Geral

Este projeto implementa o backend para um RMS, fornecendo APIs para gerenciar entidades como clientes, pedidos, pagamentos, etc. A arquitetura foi projetada para ser modular, testável e fácil de manter, utilizando conceitos modernos de engenharia de software e priorizando a facilidade de execução com Docker.

## 🚀 Tecnologias e Conceitos Chave

- **Framework:** [NestJS](https://nestjs.com/) (v10+)
- **Arquitetura:** [Arquitetura Hexagonal (Ports & Adapters)](https://alistair.cockburn.us/hexagonal-architecture/)
- **Princípios:** [SOLID](https://pt.wikipedia.org/wiki/SOLID)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/)
- **Testes Unitários:** [Jest](https://jestjs.io/)
- **Containerização:** [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- **CI/CD:** [GitHub Actions](https://github.com/features/actions)
- **Design Patterns:** Repository, Factory, Dependency Injection, etc.
- **Identificadores:** UUID
- **Soft Delete:** Campo `deletedAt`

## 📋 Pré-requisitos

- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/products/docker-desktop/)
- [Docker Compose](https://docs.docker.com/compose/install/) (Geralmente incluído na instalação do Docker Desktop)

_(Opcional, para desenvolvimento local/contribuição):_

- [Node.js](https://nodejs.org/) (v18 ou superior recomendado)
- [NPM](https://www.npmjs.com/)

## 🚀 Quick Start (Rodando com Docker)

Esta é a forma mais rápida e recomendada para executar a aplicação e todos os seus serviços (como o banco de dados).

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
    cd SEU_REPOSITORIO
    ```

2.  **Inicie os containers:**
    ```bash
    docker-compose up --build -d
    ```
    - `--build`: Garante que as imagens Docker sejam construídas (necessário na primeira vez ou após mudanças no Dockerfile).
    - `-d`: Executa os containers em modo detached (background).

**O que acontece com `docker-compose up`?**

- Constrói a imagem Docker da aplicação NestJS (se ainda não existir ou se o `Dockerfile` mudou).
- Inicia o container da aplicação.
- Inicia o container do banco de dados PostgreSQL.
- **(Importante)** Aplica as migrações do Prisma automaticamente (geralmente configurado no `entrypoint` do Dockerfile ou no `command` do serviço no `docker-compose.yml` para executar `npx prisma migrate deploy`).
- Expõe a porta da aplicação (definida no `.env` ou `docker-compose.yml`, geralmente `3000`).

A aplicação estará disponível em `http://localhost:3000` (ou a porta configurada).

**Para parar os containers:**

```bash
docker-compose down
```
🛠️ Desenvolvimento Local (Alternativa)

Se você preferir rodar a aplicação diretamente na sua máquina (fora do Docker) para desenvolvimento ou depuração:

Instale as dependências:
```bash
npm install
# ou
yarn install
```

Certifique-se que o Banco de Dados está rodando: Você pode usar o container do Postgres iniciado com o Docker Compose (docker-compose up -d postgres_db) ou ter uma instância local do PostgreSQL. Ajuste a DATABASE_URL no seu arquivo .env para apontar para localhost se estiver usando uma instância local fora do Docker Compose.

# .env (Exemplo para DB local fora do Docker)
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/rms?schema=public"
```

Execute as migrações do Prisma manualmente:
```bash
npx prisma migrate dev
```

Inicie a aplicação em modo de desenvolvimento:
```bash
npm run start:dev
```

A aplicação estará disponível em http://localhost:3000 (ou a porta definida em .env).

## ✅ Rodando os Testes (Ambiente Local)

Certifique-se de ter as dependências de desenvolvimento instaladas (npm install ou yarn install).

Testes Unitários:
```bash
npm run test
```

Testes com Cobertura:
```bash
npm run test:cov
```

Testes End-to-End (se configurados):

Geralmente requerem um banco de dados de teste. Verifique a configuração específica dos testes E2E.
```bash
npm run test:e2e
```

## 🔄 CI/CD (GitHub Actions)

Este projeto está configurado (ou será configurado) com GitHub Actions para automação de build, testes e (opcionalmente) deploy. Verifique a pasta .github/workflows.

## 📄 Documentação da API (Swagger)

Se habilitado, a documentação da API gerada pelo Swagger pode ser acessada em:

http://localhost:3000/api

(Ajuste a URL e o path conforme a configuração do seu main.ts)

(Veja o código para a estrutura detalhada)

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, abra uma issue ou envie um pull request.

## 📜 Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo LICENSE para mais detalhes.

**Principais Mudanças:**

1.  **Pré-requisitos:** Docker e Docker Compose são listados primeiro como essenciais. Node/NPM/Yarn são movidos para "Opcional".
2.  **Quick Start:** Esta seção agora é a principal para rodar o projeto, focando no comando `docker-compose up --build -d`. Explica o que o comando faz, incluindo a aplicação automática de migrações (assumindo que seu Docker setup faz isso).
3.  **Desenvolvimento Local:** As instruções para rodar localmente (`npm install`, `prisma migrate dev`, `npm run start:dev`) foram movidas para uma seção separada e claramente marcada como uma *alternativa*.
4.  **`.env`:** A instrução para configurar o `.env` foi mantida antes do `docker-compose up`, pois o Compose precisa ler esse arquivo. A URL do banco de dados no exemplo foi ajustada para usar o nome do serviço Docker (`postgres_db`).
5.  **Clareza:** A separação entre o método principal (Docker) e o alternativo (Local) está mais explícita.

Lembre-se de garantir que seu `Dockerfile` ou `docker-compose.yml` realmente execute `npx prisma migrate deploy` (ou similar) na inicialização do container da aplicação para que a experiência do "Quick Start" funcione como descrito.

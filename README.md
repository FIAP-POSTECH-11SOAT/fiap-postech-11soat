# Backend RMS (Restaurant Management System) com NestJS

![Badge Licença](https://img.shields.io/badge/license-MIT-blue.svg)
![Badge NestJS](https://img.shields.io/badge/NestJS-%5E10.0.0-red.svg)
![Badge Prisma](https://img.shields.io/badge/Prisma-%5E5.0.0-blueviolet.svg)
![Badge PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)
![Badge Jest](https://img.shields.io/badge/Tests-Jest-brightgreen.svg)
![Badge Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)
![Badge Kubernetes](https://img.shields.io/badge/Kubernetes-Ready-blue.svg)

<!-- Adicione badges de status do GitHub Actions aqui quando configurado -->
<!-- ![Badge Build Status](https://github.com/SEU_USUARIO/SEU_REPOSITORIO/actions/workflows/main.yml/badge.svg) -->

Backend robusto e escalável para um Sistema de Gerenciamento de Restaurantes (RMS), construído com NestJS e seguindo as melhores práticas de desenvolvimento de software.

## ✨ Visão Geral

Este projeto implementa o backend para um RMS, fornecendo APIs para gerenciar entidades como clientes, pedidos, pagamentos, etc. A arquitetura foi projetada para ser modular, testável e fácil de manter, utilizando conceitos modernos de engenharia de software e priorizando a facilidade de execução com Docker.

## 🚀 Tecnologias e Conceitos Chave

- **Framework:** [NestJS](https://nestjs.com/) (v10+)
- **Arquitetura:** [Arquitetura Limpa (Clean Arch)](https://alistair.cockburn.us/hexagonal-architecture/)
- **Princípios:** [SOLID](https://pt.wikipedia.org/wiki/SOLID)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/)
- **Testes Unitários:** [Jest](https://jestjs.io/)
- **Containerização:** [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) & [Kubernetes](https://kubernetes.io/)
- **CI/CD:** [GitHub Actions](https://github.com/features/actions)
- **Design Patterns:** Repository, Factory, Dependency Injection, etc.
- **Identificadores:** UUID
- **Soft Delete:** Campo `deletedAt`

## 📋 Pré-requisitos

- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/products/docker-desktop/)
- [Docker Compose](https://docs.docker.com/compose/install/) (Geralmente incluído na instalação do Docker Desktop)
- [Kubernetes](https://docs.docker.com/desktop/features/kubernetes/) (Ativação no Docker Desktop)

_(Opcional, para desenvolvimento local/contribuição):_

- [Node.js](https://nodejs.org/) (v18 ou superior recomendado)
- [NPM](https://www.npmjs.com/)

## ⚡ Fluxo de Pedido

```mermaid
sequenceDiagram
  participant C as Cliente
  participant O as Orders Service
  participant P as Payments Service
  participant MP as Mercado Pago

  C ->> O: Criar Pedido
  O -->> C: Pedido Criado (orderId)
  C ->> O: Adicionar Itens
  O -->> C: Pedido Atualizado
  C ->> P: Solicitar Pagamento
  P -->> O: Obter informações do Pedido
  O -->> P: Retorna Informações Pedido
  P ->> MP: Criar Cobrança
  MP -->> P: Retorna QR Code
  P -->> C: QR Code Criado
  C ->> MP: Efetua Pagamento
  MP ->> P: Webhook Confirmação
  P ->> O: Pagamento Aprovado
```
### 📍 Ordem de execução dos EndPoints
1. POST `/orders` >> criar pedido
2. POST `/orders/items` >> adicionar itens
3. POST `/payments` >> realizar pagamento
4. GET  `/payments/orders/:orderId` >> obter pagamento (QRCode)
5. POST `/payments/webhook` >> Atualizar status pagamento e atualizar status pedido (para aguardando preparação ou cancelado)
6. PUT  `/orders/status` >> atualizar status pedido (na cozinha)

## 🚀 Executando com Kubernetes (Ambiente Local)

### 1. Configurar o `PersistentVolume`

Edite o arquivo `src/k8s/database/pv.yaml`, alterando o valor da propriedade `hostPath.path` para o caminho **absoluto** da pasta local onde o volume persistente será armazenado.

Exemplo:

```yaml
hostPath:
  path: '/Users/igorgregorio/Desktop/fiap-postech-11soat/k8s/database/data'
```

> 📌 Certifique-se de que esse caminho exista na máquina onde os containers serão executados.

### 2. Subir os serviços com Kubernetes

Execute o comando:

```bash
npm run kubernets:on
```

Isso iniciará os serviços definidos nos manifests Kubernetes.

### 3. Derrubar os serviços

Para destruir os recursos criados, execute:

```bash
npm run kubernets:off
```

### 4. Arquitetura

![Diagrama de arquitetura](./docs/readme/kubernetes.png)

> ⚠️ O **PersistentVolume (PV)** **não é excluído automaticamente**.
> Para removê-lo completamente, é necessário deletar manualmente ou editar o arquivo `pv.yaml`.

## 🚀 Executando com Docker

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

## 🛠️ Desenvolvimento Local (Alternativa)

Se você preferir rodar a aplicação diretamente na sua máquina (fora do Docker) para desenvolvimento ou depuração:

Instale as dependências:

```bash
npm install
# ou
yarn install
```

Certifique-se que o Banco de Dados está rodando: Você pode usar o container do Postgres iniciado com o Docker Compose (docker-compose up -d postgres_db) ou ter uma instância local do PostgreSQL. Ajuste a DATABASE_URL no seu arquivo .env para apontar para localhost se estiver usando uma instância local fora do Docker Compose.

### .env (Exemplo para DB local fora do Docker)

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

Testes com Cobertura (se configurados):

```bash
npm run test:cov
```

Testes End-to-End (se configurados):

Geralmente requerem um banco de dados de teste. Verifique a configuração específica dos testes E2E.

```bash
npm run test:e2e
```

## 📄 Documentação da API (Swagger)

A documentação da API gerada pelo Swagger pode ser acessada em:

executando com kubernets:
http://localhost:31000/api

executando com docker ou localmente:
http://localhost:3000/api

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, abra uma issue ou envie um pull request.

## 📜 Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo LICENSE para mais detalhes.

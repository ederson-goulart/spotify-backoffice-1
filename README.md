## Dependências do projeto

- Docker
- Docker Compose

## Iniciando localmente

1. Copie `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```
2. Atualize `DATABASE_URL` com as credenciais do banco de dados PostgreSQL local.
3. Construa e execute o serviço em modo de desenvolvimento:
   ```bash
   docker compose -f docker-compose.dev.yml up --build
   ```
4. Acesse a aplicação em `http://localhost:3001`.

## Deploy no Coolify

1. Crie um novo app no Coolify e selecione o repositório `spotify-backoffice-prof`.
2. Escolha a opção Docker Compose e aponte para `docker-compose.yaml`.
3. No painel de variáveis de ambiente do Coolify, configure `DATABASE_URL` com a string de conexão do PostgreSQL de produção.
4. Execute o deploy.

## Observações

- O arquivo `.env` é usado apenas para desenvolvimento local e não deve ser comitado.
- Para testes locais com o banco, execute o serviço do `spotify-db-prof` em paralelo ou use um PostgreSQL externo.

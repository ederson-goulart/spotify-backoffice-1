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

## Imagens no MinIO (covers)

Este projeto armazena as imagens (capas) no **MinIO** no bucket público `uploads`.

### Variáveis de ambiente (produção / Coolify)

Configure no app do backoffice no Coolify:

- **`MINIO_ENDPOINT_INTERNAL`**: endpoint interno na rede Docker (ex.: `http://minio:9000`)
- **`MINIO_ACCESS_KEY`**: access key do MinIO (normalmente igual ao `MINIO_ROOT_USER`)
- **`MINIO_SECRET_KEY`**: secret do MinIO (normalmente igual ao `MINIO_ROOT_PASSWORD`)
- **`MINIO_BUCKET`**: `uploads`
- **`NEXT_PUBLIC_MINIO_PUBLIC_BASE_URL`**: base URL pública do MinIO (ex.: `https://minio.seudominio.com`)
- **`S3_FORCE_PATH_STYLE`**: (opcional) `true` (padrão). Use `false` somente se você souber que precisa de virtual-host-style.

### Como a URL é montada no front

- A UI usa a URL pública em:
  - `src/app/utils/uploads.ts` (helper `getPublicUploadUrl`)
- A imagem final fica assim:
  - `${NEXT_PUBLIC_MINIO_PUBLIC_BASE_URL}/uploads/${coverUrl}`

### Atenção: `next/image` e domínio do MinIO

O `next/image` precisa permitir o host remoto do MinIO. Este projeto configura isso automaticamente a partir de `NEXT_PUBLIC_MINIO_PUBLIC_BASE_URL` em `next.config.ts`.

Se você trocar o domínio do MinIO no Coolify, basta atualizar `NEXT_PUBLIC_MINIO_PUBLIC_BASE_URL` e redeployar.

### Migração (opcional) de arquivos antigos do disco

Se você tinha capas antigas em `public/uploads`, existe um script para subir esses arquivos para o MinIO **mantendo o mesmo nome do arquivo** (compatível com `coverUrl` antigo):

```bash
npm run migrate:uploads
```

Requisitos:
- As variáveis `MINIO_ENDPOINT_INTERNAL`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY` e `MINIO_BUCKET` precisam estar configuradas no ambiente onde você executa o script.

## Sistema de Métricas (Analytics)

O sistema inclui um dashboard completo de analytics que rastreia automaticamente eventos de uso do aplicativo.

### Tipos de Eventos Rastreados

- **PAGE_VIEW**: Visualização de página (automático em toda navegação)
- **CREATE_BAND**: Criação de uma nova banda
- **UPDATE_BAND**: Atualização de dados de banda
- **DELETE_BAND**: Exclusão de banda
- **CREATE_TRACK**: Criação de uma nova trilha
- **UPDATE_TRACK**: Atualização de dados de trilha
- **DELETE_TRACK**: Exclusão de trilha
- **ERROR**: Erros capturados na aplicação

### Dashboard de Métricas

Acesse o dashboard em: **`http://localhost:3001/admin/analytics`**

#### Métricas Exibidas

1. **KPIs Principais** (primeira linha)

   - **Page Views**: Total de visualizações de página nos últimos 24h, 7 dias, 30 dias ou total
   - **Total Bandas**: Número total de bandas no sistema
   - **Total Trilhas**: Número total de trilhas cadastradas
   - **Taxa de Erros**: Percentual de eventos de erro registrados

2. **Operações CRUD** (segunda linha, esquerda)

   - Contagem de operações de criação, atualização e exclusão
   - Divisão entre operações em Bandas e Trilhas
   - Gráfico de distribuição em barras

3. **Distribuição Horária** (segunda linha, direita)

   - Visualização de page views por hora do dia
   - Gráfico de barras das últimas 24 horas
   - Identifica picos de utilização

4. **Páginas Mais Acessadas**

   - Ranking das 5 páginas com mais visualizações
   - Barras de proporção relativa
   - Contagem exata de views

5. **Eventos Recentes**
   - Tabela com os últimos 50 eventos
   - Tipo, página, ação e timestamp
   - Atualiza em tempo real

### Seletores de Período

Na parte superior do dashboard, escolha o período de análise:

- **24 horas**: Últimas 24 horas
- **7 dias**: Últimos 7 dias
- **30 dias**: Últimos 30 dias
- **Tudo**: Todos os eventos desde o início

### Implementação Técnica

#### Estrutura de Dados

O modelo `AnalyticsEvent` na tabela `analytics_events` armazena:

```typescript
{
  id: UUID,
  type: AnalyticsEventType,
  page: string,          // Ex: /admin/bands, /admin/tracks
  action?: string,       // Ex: create, update, delete
  metadata?: JSON,       // Dados flexíveis (bandId, trackId, etc)
  timestamp: DateTime    // Data/hora do evento
}
```

#### Endpoints

- **POST `/api/analytics`**: Coleta um novo evento (cliente envia page view)
- **GET `/api/analytics/stats`**: Retorna estatísticas agregadas (dashboard consulta)
  - Parâmetro: `?period=24h|7d|30d|all`

#### Componentes

- **`src/app/utils/analytics.ts`**: Funções helper para tracking (`trackPageView`, `trackCreate`, etc)
- **`src/app/components/AnalyticsTracker.tsx`**: Componente global que rastreia automaticamente page views
- **`src/app/(admin)/analytics/page.tsx`**: Página principal do dashboard
- **`src/app/(admin)/analytics/components/`**: Componentes de visualização de dados

### Configurando a Migração

Quando o banco de dados estiver disponível, execute:

```bash
npm install
npx prisma migrate dev --name add_analytics_event
```

Isso criará a tabela `analytics_events` e o enum `AnalyticsEventType`.

### Como Usar

#### Rastream Automático

O rastreamento de page views está **ativado automaticamente** no layout raiz. Toda navegação é registrada.

#### Rastreamento Manual de Eventos

Para rastrear eventos CRUD customizados fora das rotas padrão:

```typescript
import { trackCreate, trackUpdate, trackDelete } from "@/app/utils/analytics";

// Ao criar uma banda
await trackCreate("band", "/admin/bands");

// Ao atualizar uma trilha
await trackUpdate("track", "/admin/tracks");

// Ao deletar algo
await trackDelete("band", "/admin/bands");
```

#### Visualizando Dados

1. Acesse `http://localhost:3001/admin/analytics`
2. Selecione o período desejado no topo
3. Observe os gráficos e indicadores em tempo real

### Extensões Futuras

- Exportar relatórios em CSV/PDF
- Configurar alertas para taxas de erro
- Segmentação por usuário
- Integração com Google Analytics (opcional)

## Deploy no Coolify

1. Crie um novo app no Coolify e selecione o repositório `spotify-backoffice-prof`.
2. Escolha a opção Docker Compose e aponte para `docker-compose.yaml`.
3. No painel de variáveis de ambiente do Coolify, configure:
   - `DATABASE_URL` com a string de conexão do PostgreSQL de produção
   - variáveis do MinIO (ver seção **Imagens no MinIO**)
4. Execute o deploy.

## Observações

- O arquivo `.env` é usado apenas para desenvolvimento local e não deve ser comitado.
- Para testes locais com o banco, execute o serviço do `spotify-db-prof` em paralelo ou use um PostgreSQL externo.
- O dashboard de analytics está disponível apenas na rota `/admin/analytics` e requer navegação autenticada.

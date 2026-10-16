# 🎶 SoundBuddy

A indústria musical é movida por conexões e oportunidades, mas o processo de encontrar músicos e contratantes ainda é fragmentado, exigindo buscas extensas e negociações descentralizadas. O **SoundBuddy** surge como uma solução para essa necessidade, funcionando como um **"LinkedIn musical"** que conecta músicos, produtores e contratantes em um ambiente digital dinâmico e interativo.

## Estrutura

| Pasta | Função |
| --- | --- |
| [`frontend/`](frontend/) | Aplicação Next.js integrada à API local e código da demo estática em `frontend/demo/` |
| [`backend/`](backend/) | API Express e modelos MongoDB |
| [`landing-page/`](landing-page/) | Página de apresentação e animação para GitHub Pages |
| [`docs/`](docs/) | Relatórios e documentação do projeto |

## Demonstração pública

A publicação combina `landing-page/` na raiz do site e `frontend/demo/` em `/app/`. A apresentação inclui uma prévia animada do percurso descobrir → conhecer → conectar. O aplicativo demonstrativo oferece busca e filtros, perfis detalhados, publicações, oportunidades, perfis salvos e rascunhos de propostas. Salvos e rascunhos persistem apenas no navegador via `localStorage`.

Os perfis e briefings são dados editoriais fictícios, criados para retratar situações plausíveis no mercado musical do Nordeste. A demonstração não envia mensagens, não autentica usuários e não utiliza a API ou o MongoDB. A interface deixa essas limitações claras onde afetam uma ação.

Para abrir localmente, monte a mesma estrutura publicada e sirva os arquivos estáticos:

```bash
mkdir -p /tmp/soundbuddy-site/app
cp -R landing-page/. /tmp/soundbuddy-site/
cp -R frontend/demo/. /tmp/soundbuddy-site/app/
python3 -m http.server 8080 --directory /tmp/soundbuddy-site
```

Depois acesse `http://localhost:8080/`. O fluxo [`.github/workflows/pages.yml`](.github/workflows/pages.yml) monta e publica essas pastas no GitHub Pages quando houver um push para `main` ou uma execução manual. No repositório, configure **Settings → Pages → Build and deployment → GitHub Actions**. O endereço esperado, após a primeira publicação, é `https://jambotechufpb.github.io/SoundBuddy/`.

## 🔄 Fluxo de Trabalho

Para garantir consistência no desenvolvimento:

1. **Atualize a branch de desenvolvimento local:**

   ```bash
   git checkout dev
   git pull origin dev
   ```

2. **Crie uma nova branch:**

   ```bash
   git checkout -b <id-descricao-simples-da-task>
   ```

   - **ID:** Número da task ou issue.
   - Exemplo: `7-adicionar-sistema-notificacoes`

3. **Finalize a tarefa:**  
   Após testes e revisões, abra um **Merge Request (MR)** para a branch `dev`.  
   **⚠️ Não envie diretamente para a branch principal (`main`).**

---

## 📝 Padrão de Commits

As mensagens de commit devem ser claras, seguindo o padrão:

```bash
git commit -m "tipo: descrição"
```

**Exemplo:**

```bash
feat: adiciona integração com banco de dados PostgreSQL
```

---

### 📂 Tipos de Commits

| Tipo       | Descrição                                                                         |
| ---------- | --------------------------------------------------------------------------------- |
| `feat`     | Adição de uma nova funcionalidade.                                                |
| `fix`      | Correção de bugs.                                                                 |
| `docs`     | Alterações na documentação (ex.: README).                                         |
| `test`     | Alterações ou criação de testes unitários.                                        |
| `build`    | Modificações em arquivos de build e dependências.                                 |
| `style`    | Alterações de formatação, linting ou estilo (sem mudanças na lógica de código).   |
| `refactor` | Refatorações sem alteração de funcionalidade.                                     |
| `chore`    | Atualizações administrativas ou configurações (ex.: `.gitignore`, pacotes, etc.). |

---

💻 **Siga este padrão para manter a consistência e colaboração eficaz no projeto!**

---

## Para rodar a aplicação

Testes normais

```bash
$ docker compose --env-file .env.local up --build
```

Expor para a rede

```bash
$ docker compose --env-file .env.expose up --build
```

Para descobrir o IP do computador

```bash
hostname -I
# ou
ip addr show
# ou
ifconfig
```

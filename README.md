# 🎶 SoundBuddy

A indústria musical é movida por conexões e oportunidades, mas o processo de encontrar músicos e contratantes ainda é fragmentado, exigindo buscas extensas e negociações descentralizadas. O **SoundBuddy** surge como uma solução para essa necessidade, funcionando como um **"LinkedIn musical"** que conecta músicos, produtores e contratantes em um ambiente digital dinâmico e interativo.

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

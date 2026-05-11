# Relatório de Planejamento de Testes

## Projeto: Carrinho de Inspeção Robotizada

## 1. Objetivo

Este documento tem como objetivo planejar e documentar os casos de teste da aplicação desenvolvida no projeto Carrinho de Inspeção Robotizada.

Os testes foram planejados para verificar se as principais funcionalidades do sistema estão funcionando corretamente, garantindo maior qualidade, confiabilidade e segurança no uso da aplicação.

---

## 2. Escopo dos Testes

Os testes serão aplicados nas principais funcionalidades da aplicação, incluindo:

- Login do usuário;
- Navegação entre telas;
- Cadastro de informações;
- Visualização de dados;
- Validação de campos obrigatórios;
- Tratamento de erros;
- Funcionamento da interface.

---

## 3. Tipos de Testes Planejados

### 3.1 Testes Funcionais

Verificam se as funcionalidades do sistema funcionam conforme esperado.

### 3.2 Testes Unitários

Validam funções ou partes específicas do código de forma isolada.

### 3.3 Testes de Interface

Verificam se os elementos visuais da aplicação aparecem corretamente e se o usuário consegue interagir com eles.

---

## 4. Casos de Teste

| ID | Funcionalidade | Cenário de Teste | Entrada | Resultado Esperado | Status |
|---|---|---|---|---|---|
| CT01 | Tela inicial | Verificar carregamento da página inicial | Acessar a aplicação | A tela inicial deve carregar corretamente | Planejado |
| CT02 | Login | Realizar login com dados válidos | Usuário e senha corretos | O sistema deve permitir o acesso | Planejado |
| CT03 | Login inválido | Realizar login com dados incorretos | Usuário ou senha inválidos | O sistema deve exibir mensagem de erro | Planejado |
| CT04 | Campos obrigatórios | Enviar formulário vazio | Campos em branco | O sistema deve exibir aviso de preenchimento obrigatório | Planejado |
| CT05 | Cadastro de inspeção | Cadastrar uma nova inspeção | Dados válidos preenchidos | O sistema deve salvar as informações | Planejado |
| CT06 | Visualização de dados | Acessar registros cadastrados | Clique na área de listagem | O sistema deve exibir os dados corretamente | Planejado |
| CT07 | Navegação | Trocar entre páginas do sistema | Clique nos menus | A página selecionada deve ser exibida | Planejado |
| CT08 | Responsividade | Acessar em tela menor | Redimensionar a tela | A interface deve se adaptar corretamente | Planejado |
| CT09 | Logout | Encerrar sessão | Clique no botão sair | O sistema deve finalizar a sessão | Planejado |
| CT10 | Tratamento de erro | Inserir dados inválidos | Informações incorretas | O sistema deve impedir o envio e orientar o usuário | Planejado |

---

## 5. Critérios de Aceitação

A aplicação será considerada aprovada nos testes quando:

- As principais telas carregarem corretamente;
- Os formulários validarem campos obrigatórios;
- O sistema impedir entradas inválidas;
- A navegação funcionar sem erros;
- Os testes automatizados forem executados com sucesso;
- A pipeline de CI finalizar sem falhas.

---

## 6. Ferramentas Previstas

| Ferramenta | Finalidade |
|---|---|
| Vitest | Testes unitários |
| Playwright | Testes de interface |
| GitHub Actions | Execução automática dos testes |
| GitHub | Versionamento do projeto |

---

## 7. Conclusão

O planejamento dos testes permite organizar as verificações necessárias antes da implementação dos testes automatizados. Com os casos de teste documentados, a equipe consegue identificar melhor as funcionalidades críticas do sistema e garantir que a aplicação funcione corretamente.

# 🏖️ BeachBuddy

Plataforma de gestão e agendamento para Centros de Treinamento (CTs) de futevôlei e funcional na praia. O projeto visa conectar alunos a professores e gerentes de CTs, facilitando a inscrição em aulas e a gestão dos espaços.

## 👥 Integrantes do Grupo

*   **Felipe Fortini**
*   **Ana Clara Galvão**

---

## 📋 Escopo do Projeto

O **BeachBuddy** foi desenvolvido como uma aplicação *Full Stack* moderna, utilizando **Angular 19** no frontend. O sistema atende a três perfis de usuários distintos, cada um com funcionalidades específicas:

1.  **Aluno**:
    *   Busca de CTs por lista ou **mapa interativo**.
    *   Visualização de detalhes do CT (endereço, modalidades, contato).
    *   Inscrição em treinos disponíveis.
    *   Gestão de agenda ("Meus Treinos").
2.  **Professor**:
    *   Dashboard com métricas de aulas.
    *   Criação e agendamento de novos treinos.
    *   Visualização de alunos inscritos.
3.  **Gerente**:
    *   Cadastro e gestão de Centros de Treinamento.
    *   Gestão do corpo docente (adicionar/remover professores vinculados ao CT).
    *   Acompanhamento de estatísticas do CT.

### 🛠️ Tecnologias Utilizadas

*   **Frontend**: Angular 19 (Standalone Components, Signals, SSR), Leaflet (Mapas), CSS3 Moderno.
*   **Backend**: Django 4.1, Django REST Framework, SQLite (Dev) / PostgreSQL (Prod).
*   **Integração**: API RESTful com autenticação JWT.

---

## 📖 Manual do Usuário

### Acesso Inicial
Ao acessar a plataforma, o usuário é recebido na **Home Page**, que apresenta os CTs em destaque e atalhos para as principais funcionalidades.

### 1. Cadastro e Login
*   Clique em **"Entrar"** para fazer login.
*   Para novos usuários, clique em **"Cadastre-se"** e escolha o perfil desejado (Aluno, Professor ou Gerente).
*   O sistema redireciona automaticamente para a área correta após o login com base no perfil.

### 2. Para Alunos
*   **Encontrar CTs**: Acesse a aba "CTs". Você pode visualizar os locais em uma lista ou clicar no mapa interativo (focado no Rio de Janeiro) para ver pinos com a localização exata.
*   **Inscrever-se**: Clique em um CT, veja a grade de horários (Treinos) e clique em "Inscrever-se".
*   **Meus Treinos**: Acompanhe suas próximas aulas na aba "Meus Treinos".

### 3. Para Professores
*   **Dashboard**: Visualize seus próximos treinos e total de alunos.
*   **Criar Treino**: No menu, selecione a opção de criar treino, defina data, horário, vagas e nível.
*   **Gerenciar**: Veja a lista de presença dos seus treinos agendados.

### 4. Para Gerentes
*   **Meus CTs**: Cadastre seus pontos de treinamento com endereço e localização (latitude/longitude para o mapa).
*   **Professores**: Busque professores cadastrados na plataforma e vincule-os ao seu CT para que eles possam criar aulas.

---

## ✅ Relato de Funcionamento

Durante o desenvolvimento e testes finais, **todas as funcionalidades planejadas foram implementadas e estão operando corretamente**.

### ✔️ O que funciona (Testado):
*   **Autenticação e Autorização**: Login, Cadastro e Proteção de Rotas (Guards) funcionam para todos os perfis. Tokens JWT são gerenciados corretamente.
*   **Gestão de CTs**: Criação, edição e listagem de CTs.
*   **Geolocalização**: Integração com **Leaflet** funcionando perfeitamente. O mapa exibe os pinos nas coordenadas cadastradas e permite navegação para os detalhes do CT.
*   **Fluxo de Treinos**:
    *   Professores conseguem criar treinos com validação de horário.
    *   Alunos conseguem se inscrever (controle de vagas ativo).
    *   Listagem de treinos por CT.
*   **Responsividade**: O layout se adapta a dispositivos móveis e desktop.
*   **Server-Side Rendering (SSR)**: Configurado para melhor performance e SEO, com tratamento adequado para rotas dinâmicas e objetos de janela (window/document).

### ❌ O que não funciona:
*   **N/A**: Não foram identificados bugs ou funcionalidades incompletas na versão final entregue. Todos os requisitos do escopo foram atendidos.

---

## 🚀 Como Rodar o Projeto

Acesse "beachbuddy.com.br". Se quiser rodar localmente siga os seguintes passos:

### Pré-requisitos
*   Node.js (v18+)
*   Angular CLI (v19)

### Passos
1.  Instale as dependências:
    ```bash
    npm install
    ```
2.  Execute o servidor de desenvolvimento:
    ```bash
    npm start
    ```
3.  Acesse `http://localhost:4200`.
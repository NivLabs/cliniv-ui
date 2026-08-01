<h1 align="center">
  <a href="http://app.nivlabs.com.br">
    <img alt="CLINIV Logo" src="./readme/logo.png" width="350px" />
  </a>
</h1>
<h2 align="center">
  CliNiv - UI
</h2>

CliNiv - UI é uma UI RestClient criada inicialmente como doação para hospitais que não possuem nenhuma solução de automação no processo de prontuário. O CLINIV-UI é integrado com uma API baseado em Java, o [CLINIV-API](https://github.com/niv-labs/cliniv-api).

<p align="center">
    <a href="https://github.com/niv-labs/">
        <img alt="Made by Vinícios Rodrigues" src="https://img.shields.io/badge/made%20by-Vin%C3%ADcios%20Rodrigues-brightgreen" />
    </a>
    <img alt="License" src="https://img.shields.io/badge/license-MIT-%2304D361" />
</p>

Atualmente encontra-se na versão 1.1.0 em desenvolvimento - [CLINIV-UI](http://app.nivlabs.com.br)

---

<p align="center">
  <img alt="Tela 1" src="./readme/Tela 7.jpeg" height="400px" width="200px" />
  <img alt="Tela 2" src="./readme/Tela 3.jpeg" height="400px" width="200px" />
  <img alt="Tela 3" src="./readme/Tela 4.jpeg" height="400px" width="200px" />
  <img alt="Tela 4" src="./readme/Tela 2.jpeg" height="400px" width="200px" />
</p>

---

## Índice

<ul>
  <li><a href="#funcionalidades-da-ui">Funcionalidades da UI</a></li>
  <li><a href="#mínimo-para-rodar">Mínimo para rodar</a></li>
  <li><a href="#como-rodar-a-aplicação">Como rodar a aplicação?</a></li>
  <li><a href="#como-contribuir">Como contribuir?</a></li>
  <li><a href="#contato">Contato</a></li>
  <li><a href="#-license">License</a></li>
</ul>

---

## Funcionalidades da UI

- [x] Cadastro e busca de Pacientes (identificados e não identificados)
- [x] Atendimentos ambulatoriais e emergenciais, com histórico em timeline
- [x] Agendamentos
- [x] Prontuário: evolução, prescrição, anamnese, formulários dinâmicos
- [x] Cadastro de Profissionais (Responsáveis) e Usuários com controle de acesso
- [x] Cadastro de Setores e Acomodações (salas/leitos)
- [x] Cadastro de Especialidades, Procedimentos, Operadoras e Planos de Saúde
- [x] Formas de Pagamento
- [x] Modelos de documento e geração de relatórios (JasperReports via API)
- [x] Configurações da instituição: dados cadastrais, logo, ativação de licença
- [x] Login multi-tenant, cadastro de novo ambiente e recuperação de senha
- [ ] Módulo financeiro (telas existem como placeholder; sem endpoint no backend ainda)
- [ ] Cadastro de Fornecedores (link existe; sem endpoint no backend ainda)

---

## Mínimo para rodar
Para contribuir com o projeto, existem alguns requisítos mínimos de configurações, são eles?
- Node 18.19.1 **(Obrigatório — ver `engines` em `package.json`)**
- Angular 14 (Community) **(Obrigatório)**
- Uma instância do [CLINIV-API](https://github.com/niv-labs/cliniv-api) rodando (por padrão a UI espera a API em `http://localhost:8080`, configurável em `src/environments/environment.ts`) **(Obrigatório)**
- Qualquer editor de texto *(Opcional)*

> Se o `node` padrão da sua máquina não for a 18.x, use um gerenciador de versões (ex: `nvm use 18`) antes de rodar os comandos abaixo — em outras versões (ex: Node 21) o build costuma falhar com um erro obscuro do `sass`, sem relação aparente com o projeto.

---

## Como rodar a aplicação?

### Passo 1

- 👯 Clone este repositório na sua máquina local usando `https://github.com/niv-labs/cliniv-ui.git`

### Passo 2

- 📌 Instale as dependências do projeto usando o comando `npm i`

### Passo 3

- 🔃 Rode a aplicação usando o comando `ng serve` e acesse a porta padrão 4200. Caso queira rodar em outra porta, adicione o argumento `--port PORTA_DESEJADA`, ex: `ng serve --port 8080`

---


## Como contribuir

### Passo 1

- 🍴 Realize um Fork deste respositório!

### Passo 2

- 👯 Clone este repositório na sua máquina local usando `https://github.com/niv-labs/cliniv-ui.git`

### Passo 3

- 🎋 Crie sua branch de funcionalidade usando `git checkout -b minha-funcionalidade`

### Passo 4

- ✅ Realize o commit de suas alterações usando `git commit -m 'feat: Minha nova funcionalidade'`;

### Passo 5

- 📌 Realize o push para a branch usando `git push origin minha-funcionalidade`;

### Passo 6

- 🔃 Crie um novo pull request

Depois que seu Pull Request é aceito e o merge é realizado, você pode deletar a sua branch de funcionalidade.

---

## Contato

> Você pode me encontrar por aqui...
- Vinícios (eu) :: [viniciosarodrigues@gmail.com](viniciosarodrigues@gmail.com)

---

## 📝 License

<img alt="License" src="https://img.shields.io/badge/license-MIT-%2304D361">

Este projeto é licenciado por MIT License - Veja a licença no arquivo [LICENSE](LICENSE) para mais detalhes.

---
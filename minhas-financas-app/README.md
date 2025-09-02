# Projeto Minhas Finanças - Frontend (minhas-financas-app)

## Descrição

O Minhas Finanças é um projeto desenvolvido com o objetivo de auxiliar a gestão de finanças pessoais. Nele o usuário consegue lançar suas receitas e despesas, e monitorá-las de uma maneira intuitiva. 

Esse componente foi desenvolvido com o objetivo de consumir a API, além de ser a interface desenvolvida para o usuário interagir com a aplicação.

[Projeto Backend](https://github.com/jackelinepaula/minhas-financas-api)

## Tecnologias Utilizadas

- React 18.3.1
- Axios 0.19.0
- Bootswatch 4.3.1
- Currency-formatter 1.5.9
- Jsonwebtoken 9.0.2 
- Primeicons 7.0.0
- Primereact 10.8.2
- Toastr 2.1.4
- ArcGIS API para Javascript 4.20.0

## Pré-requisitos

- Node.js 14.21.3

## Instalação

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/jackelinepaula/minhas-financas-app.git
   ```

2. **Navegue até o diretório do projeto:**

   ```bash
   cd minhas-financas-app
   ```

3. **Instale as dependências:**

   Com npm:
   ```bash
   npm install
   ```

   Com yarn:
   ```bash
   yarn install
   ```

4. **Configure as variáveis de ambiente:**

   Crie um arquivo `.env` na raiz do projeto e adicione as configurações necessárias, como a URL do backend:

   ```
   REACT_APP_API_URL=http://localhost:8080
   ```

5. **Inicie o projeto:**

   Com npm:
   ```bash
   npm start
   ```

   Com yarn:
   ```bash
   yarn start
   ```

   O aplicativo estará disponível em `http://localhost:3000`.

## Estrutura do Projeto

```packages
pem-jackeline-paula-front
├── public
│   ├── favicon.ico
│   ├── manifest.json
│   ├── index.html
│   ├── logo.png
│
├── src
│   ├── app
│   ├─── exceptions
│   │    └── ErroValidacao.json
│   ├─── service
│   │    ├── authService.js
│   │    ├── categoriaService.js
│   │    ├── lancamentoService.js
│   │    ├── locaStorageService.js
│   │    ├── mapService.js
│   │    ├── usuarioService.js
│   ├─── apiService.js
│   ├── components
│   │   ├── Badge.js
│   │   ├── Button.js
│   │   ├── Card.js
│   │   ├── FormGroup.js
│   │   ├── Mapa.js
│   │   ├── MapaCadastro.js
│   │   ├── NavBar.js
│   │   ├── NavItem.js
│   │   ├── SelectMenu.js
│   │   ├── Toast.js
│   ├── constants
│   │    └── constants.js
│   ├── main
│   │   ├── App.js
│   │   ├── ProvedorAutenticacao.js
│   │   ├── rotas.js
│   ├── utils
│   │    └── sorts.js
│   ├── views
│   │   ├── lancamentos
│   │   │   ├── CadastroLancamentos.js
│   │   │   ├── ConsultaLancamento.js
│   │   │   ├── TableLancamento.js
│   │   ├── CadastroUsuario.js
│   │   ├── Home.js
│   │   ├── ConsultaLancamento.js
│   │   ├── LandingPage.js
│   │   ├── Login.js
│   ├── estilo.css
│   └── index.js


```
### Descrição dos pacotes

- `public`: Diretório que contém arquivos estáticos do projeto como imagens. Também armazena o `index.html`, que é o arquivo inicial onde o React é renderizado.
- `src`: Diretório raiz do projeto, onde contém todo o código desenvolvido.
- `app`: Esse diretório armazena arquivos para serviços de aplicativo e tratamento de exceções.Interagem diretamente com a API da aplicação.
- `components`: Diretório que contém os componentes desenvolvidos que montam a interface da aplicação, por onde o usuário interage.
- `constants`: Diretório que contém os valores contantes que serão usados pelo projeto, por exemplo: lista de meses.
- `main`: Esse diretório contém o arquivo principal (App.js), de contexto de autenticação (ProvedorAutenticacao.js) e configuração de rotas para a navegação(rotas.js).
- `utils`: Diretório que contém utilizades como conversões ou ordenações, métodos que serão utilizados ao longo do projeto.
- `views`: Diretório que contém as telas por onde o usuário pode navegar.
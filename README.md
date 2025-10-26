# Estrutura do Projeto Mobile SIGO (React Native)

Olá equipe,

Este documento detalha a estrutura proposta de pastas e a arquitetura que vamos adotar para a versão mobile do nosso projeto SIGO. A ideia é manter uma organização clara, modular e consistente com o que já fizemos na versão web.

## Estrutura de Pastas Proposta

Aqui está a visão geral da estrutura de pastas proposta.

```
sigo-mobile/
├── src/
│   ├── api/             # Equivalente à nossa pasta 'services'
│   │   ├── OcorrenciasService.js
│   │   └── UserProfileService.js
│   │   └── index.js     # (Opcional) para exportar todos os serviços
│   │
│   ├── assets/          # Para imagens, ícones e fontes
│   │   ├── fonts/
│   │   └── images/
│   │
│   ├── components/      # Componentes de UI reutilizáveis (Botões, Inputs, Cards)
│   │   ├── common/      # Componentes genéricos (Button.js, TextInput.js)
│   │   └── layout/      # Componentes de estrutura (Header.js, Container.js)
│   │
│   ├── config/          # Configurações globais e variáveis de ambiente
│   │   └── index.js
│   │
│   ├── contexts/        # Gerenciamento de estado global com Context API
│   │   ├── UserContext.js
│   │   └── AccessibilityContext.js
│   │
│   ├── hooks/           # Hooks customizados
│   │   └── useSpeech.js
│   │
│   ├── navigation/      # Tudo relacionado à navegação do app
│   │   ├── AppNavigator.js
│   │   └── AuthNavigator.js
│   │   └── index.js     # Roteador principal que decide entre Auth e App
│   │
│   ├── screens/         # As telas do aplicativo (equivalente a 'pages' na web)
│   │   ├── Auth/        # Telas de autenticação
│   │   │   ├── LoginScreen.js
│   │   │   └── LoginScreen.style.js
│   │   │
│   │   ├── Main/        # Telas principais após o login
│   │   │   ├── DashboardScreen.js
│   │   │   └── ...
│   │
│   ├── styles/          # Estilos globais (cores, tipografia, espaçamentos)
│   │   ├── colors.js
│   │   └── typography.js
│   │
│   └── utils/           # Funções utilitárias
│       └── permissions.js
│
├── App.js               # Ponto de entrada principal da aplicação
└── package.json         # Dependências e scripts do projeto
```

## Detalhando Cada Pasta

* **`src/`**: O coração do nosso código, assim como no projeto web.
* **`api/`** (ou **`services/`**): Centraliza toda a comunicação com nosso backend. Manter o nome `services` pode ser uma boa ideia para manter a consistência entre os projetos. Aqui vamos adaptar as chamadas `fetch` ou `axios` para o ambiente React Native.
* **`assets/`**: Para todas as mídias estáticas do app, como imagens, ícones e fontes customizadas.
* **`components/`**: Guardará nossos componentes de UI reutilizáveis. Exemplos: `Button.js`, `Card.js`, `TextInput.js`. A subpasta `common/` pode ter componentes genéricos e a `layout/` componentes de estrutura como `Header.js`.
* **`config/`**: Ótimo lugar para armazenar a URL base da nossa API, chaves de serviços e outras configurações que podem variar entre os ambientes (dev, prod).
* **`contexts/`**: Perfeito para gerenciar estado global com a Context API. Aqui ficarão os providers de `UserContext`, `AccessibilityContext`, etc.
* **`hooks/`**: Para nossos hooks customizados, mantendo a lógica reutilizável e isolada dos componentes.
* **`navigation/`**: Essencial no React Native. Aqui definiremos as pilhas de navegação (telas de autenticação vs. telas principais) usando o **React Navigation**. O arquivo `index.js` principal conterá a lógica para exibir a rota de login ou a rota principal do app.
* **`screens/`**: O equivalente à nossa pasta `pages` da web. Cada arquivo aqui representa uma tela inteira do app. Vamos adotar a prática de criar um arquivo de estilo (`.style.js`) para cada tela para manter o código JSX mais limpo.
* **`styles/`**: Para definir constantes de design globais: nossa paleta de cores (`colors.js`), tamanhos de fontes (`typography.js`), etc. Isso garante a consistência visual do app.
* **`utils/`**: Funções auxiliares e lógicas que podem ser reaproveitadas em várias partes do código.
* **`App.js`**: Ponto de entrada da aplicação. Ele será responsável por renderizar o nosso navegador principal (de `src/navigation`) e por envolver toda a aplicação com os providers dos nossos contextos.

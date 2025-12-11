# SIGO Mobile 

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-orange)
![Tech](https://img.shields.io/badge/stack-React%20Native%20|%20Expo-blue)
![Plataforma](https://img.shields.io/badge/plataforma-Android%20|%20iOS-gray)
[![Licença](https://img.shields.io/badge/licen%C3%A7a-MIT-red)](./LICENSE)

Aplicativo móvel oficial do sistema SIGO para gestão, registro e acompanhamento de ocorrências de forma ágil e acessível.

---

## Sobre o Projeto

O **SIGO Mobile** é a extensão móvel da plataforma SIGO, desenvolvida para permitir que usuários registrem e acompanhem ocorrências diretamente de seus smartphones.

O foco principal do aplicativo é a **acessibilidade** e a facilidade de uso, permitindo o envio de informações detalhadas (fotos, localização e assinatura) para o sistema central.

---

## Funcionalidades

* **Autenticação Segura:** Login integrado e persistência de sessão.
* **Registro de Ocorrências:** Formulário completo para cadastro de novos incidentes.
* **Geolocalização:** Captura automática da localização da ocorrência (via `expo-location`).
* **Evidências Multimídia:** Anexo de fotos da galeria ou câmera (via `expo-image-picker`).
* **Assinatura Digital:** Coleta de assinatura diretamente na tela (via `react-native-signature-canvas`).
* **Meus Registros:** Histórico e visualização do status das ocorrências reportadas.
* **Acessibilidade:** Controle de tamanho de fonte e contraste (via Context API).
* **Exportação:** Geração e compartilhamento de relatórios/comprovantes (via `expo-print` e `expo-sharing`).

---

## Tecnologias Utilizadas

O projeto foi construído utilizando o ecossistema **Expo** para garantir compatibilidade e agilidade no desenvolvimento.

* **Core:** React Native, Expo, React 19.
* **Navegação:** React Navigation v7 (Stack Navigator).
* **Comunicação:** Axios (Consumo de API REST).
* **Armazenamento:** Async Storage.
* **UI/UX:** React Native SVG, React Native Screens, Safe Area Context.
* **Recursos Nativos:**
    * Câmera e Galeria
    * Geolocalização (GPS)
    * Sistema de Arquivos e Compartilhamento

---

## Como Executar Localmente

**Pré-requisitos:**
* [Node.js](https://nodejs.org/) instalado.
* Dispositivo físico (com app **Expo Go**) ou Emulador (Android Studio/Xcode).

### Passo 1: Clonar e instalar

1. **Clone o repositório:**

```bash
git clone [https://github.com/jmtmds/sigo-mobile.git](https://github.com/jmtmds/sigo-mobile.git)
```

2. Acesse a pasta do projeto:

```bash
cd sigo-mobile
```

3. Instale as dependências:

```bash
npm instal
```

### Passo 2: Configuração da API

Verifique o arquivo src/services/api.js.

Caso esteja rodando o backend localmente, lembre-se de alterar o baseURL para o IP da sua máquina (ex: http://192.168.x.x:PORTA), pois o emulador/celular não reconhece "localhost".

### Passo 3: Rodar o App

```bash
npx expo start
```

Para rodar no celular: Escaneie o QR Code exibido no terminal com o app Expo Go.

Para rodar no emulador: Pressione a (Android) ou i (iOS) no terminal.

# OrbitSense 🛰️
### Global Solution 2026.1 — Cross-Platform Application Development | FIAP

## Descrição

OrbitSense é uma plataforma mobile de análise preditiva espacial que monitora sistemas de uma missão orbital simulada em tempo real. A solução coleta e processa dados de sensores, energia, comunicação e estabilidade orbital, gerando alertas automáticos quando limiares críticos são ultrapassados. O diferencial está na visualização temática espacial com dark mode nativo e gráficos históricos de cada sistema.

## Equipe

| Nome | RM |
|------|----|
| [Guilherme Carreri Giampietro] | RM565676 |
| [Arthur Souza Matos Dias] | RM566068 |

## Telas do Aplicativo

<table>
  <tr>
    <td align="center"><b>Home</b></td>
    <td align="center"><b>Dashboards</b></td>
    <td align="center"><b>Sensores</b></td>
    <td align="center"><b>Energia</b></td>
  </tr>
  <tr>
    <td><img src="assets/screenshots/Home.png" width="200"/></td>
    <td><img src="assets/screenshots/Dashboards.png" width="200"/></td>
    <td><img src="assets/screenshots/Grafico Sensores.png" width="200"/></td>
    <td><img src="assets/screenshots/Grafico Energia.png" width="200"/></td>
  </tr>
  <tr>
    <td align="center"><b>Comunicação</b></td>
    <td align="center"><b>Orbital</b></td>
    <td align="center"><b>Alertas</b></td>
    <td align="center"><b>Configurações</b></td>
  </tr>
  <tr>
    <td><img src="assets/screenshots/Grafico comunicacao.png" width="200"/></td>
    <td><img src="assets/screenshots/Grafico Estabilidade Orbital.png" width="200"/></td>
    <td><img src="assets/screenshots/Alertas.png" width="200"/></td>
    <td><img src="assets/screenshots/Configuracoes.png" width="200"/></td>
  </tr>
</table>

## Funcionalidades

- [x] Dashboard com indicadores em tempo real (simulado, atualiza a cada 2s)
- [x] Sistema de alertas automáticos por limiar crítico (com deduplicação)
- [x] Persistência de limiares e histórico de alertas com AsyncStorage
- [x] Navegação com Expo Router (Tabs + Stack)
- [x] Context API para estado global da missão
- [x] Formulário de configuração com validação
- [x] Dark Mode completo com paleta temática espacial
- [x] TypeScript em todo o projeto

## Tecnologias

- React Native + Expo SDK 56
- Expo Router v4
- AsyncStorage (`@react-native-async-storage/async-storage`)
- Context API
- TypeScript (strict mode)
- `react-native-chart-kit` para gráficos
- `@expo/vector-icons` para ícones

## Como Executar

### Pré-requisitos
- Node.js instalado
- Expo Go instalado no celular (iOS ou Android)

### Instalação

```bash
git clone https://github.com/carrerigcg/GS---Cross-Plataform.git
cd GS---Cross-Plataform
npm install
npx expo start
```

Escaneie o QR Code com o Expo Go para rodar no dispositivo físico.

## Vídeo de Demonstração

[Clique aqui para assistir à demonstração](https://youtube.com/shorts/Gle26tmh3jo?feature=share)

## Licença

Este projeto foi desenvolvido para fins acadêmicos — FIAP 2026.

# Documentação Geral - Projeto VUPT

Esta documentação fornece uma visão técnica aprofundada da arquitetura, do fluxo de dados e dos componentes do projeto VUPT (Sistema de Monitoramento de Ônibus Inteligente).

---

## 🏗️ 1. Visão Geral da Arquitetura

O sistema é construído utilizando uma arquitetura orientada a eventos e baseada em componentes, dividida em três frentes principais de tecnologia que se comunicam em tempo real.

1. **Hardware (Arduino + Sensores)**: Responsável por monitorar o mundo físico e detectar a presença do ônibus na maquete.
2. **Integração Backend (Python)**: Um script que atua como uma "ponte" serial. Ele processa os dados brutos do Arduino, aplica as regras de negócio de tempo (timer de viagem) e atualiza o banco de dados na nuvem.
3. **Frontend (React + Vite)**: Um Dashboard interativo na nuvem que reage instantaneamente a alterações no banco de dados, mostrando animações, status da viagem e histórico.
4. **Banco de Dados (Firebase Realtime Database)**: O hub central que recebe informações do Python e distribui automaticamente para o painel React via WebSockets.

---

## 📂 2. Estrutura de Diretórios e Arquivos

### `/arduino/sensor_maquete/`
* `sensor_maquete.ino`: Código C++ rodando na placa Arduino. 
  * Faz o pulso do HC-SR04 e calcula a distância.
  * **Lógica de Debounce (Filtro anti-ruído)**: Impede que "esbarrões" ou objetos rápidos acionem o sistema. O ônibus precisa ficar presente (distância < 8cm) por pelo menos **1.5 segundos** contínuos para o sistema enviar "CHEGOU". Da mesma forma, precisa ficar ausente por 1.5s para enviar "PARTIU".

### `/` (Raiz do Projeto)
* `integracao.py`: O script de Backend.
  * Ouve ativamente a porta Serial (`COM6` ou equivalente).
  * Traduz a mensagem do Arduino e toma ações de negócio.
  * Conta o "timer" regressivo de 8 segundos quando o ônibus sai da estação.
  * Possui conexão contínua com a base em tempo real.
* `chave.json`: Arquivo de credenciais de serviço do Firebase que autoriza o script Python a escrever dados no banco.
* `requirements.txt`: Lista as dependências do ambiente Python (`pyserial`, `firebase-admin`).

### `/frontend/`
Aplicação Web Componentizada utilizando Vite, React e TailwindCSS.

* **`/src/App.jsx`**: É o container global. Ele inicia a conexão com o Firebase, captura as variáveis reativas (`onValue`) limitadas a 15 ocorrências para o histórico e repassa esses dados para os sub-componentes.
* **`/src/components/`**: Módulos independentes de interface que montam o Dashboard.
  * `Header.jsx`: Cabeçalho com informações de hora em tempo real e chaveador de Dark Mode.
  * `StatusPanel.jsx`: Cartão de Status dinâmico ("A CAMINHO", "EMBARCANDO", "NA GARAGEM"), incluindo o timer.
  * `HistoryPanel.jsx`: Lida com a lista rolável das notificações que chegam do banco.
  * `Footer.jsx`: Componente de créditos da equipe de desenvolvimento.
* **`/src/components/map/` (dentro de `Map.jsx`)**: 
  * O `Map.jsx` lida com a matemática da elipse (que leva 7.9 segundos por volta) baseada no relógio nativo do navegador `requestAnimationFrame`.
  * Os elementos visuais (SVGs) foram abstraídos para não poluir o arquivo:
    * `BusMarker.jsx`: Ícone que pisca e muda de cor.
    * `StationMarker.jsx`: Placa "Etec/Escola".
    * `MonumentMarker.jsx`: Arte desenhada à mão por polígonos representando o Cristo Redentor.

---

## 🔄 3. Fluxo de Dados e Ciclo de Vida do Sistema

1. O **Ônibus da maquete** para na frente do sensor.
2. O **Arduino** verifica que a distância caiu abaixo do corte e permanece assim por > 1500ms. Ele então escreve na porta USB (Serial) a string `"CHEGOU"`.
3. O loop ativo do **Python** captura a string `"CHEGOU"`.
4. O Python reinicia a estimativa de tempo e escreve no **Firebase Realtime Database** as informações atualizadas (Status: embarcando, Estimativa: 0) e adiciona um log no histórico.
5. O banco de dados propaga os dados para o navegador da web. O **React** altera seu estado `busData`.
6. A tela é atualizada quase instantaneamente: O ícone do ônibus para na base da estação e acende a cor amarela, e a placa pisca "EMBARCANDO".

---

## ⚡ 4. Principais Regras de Negócio Implementadas

- **Proteção de Dados Serial:** Se o Arduino for desconectado ou houver problema na Serial, a exceção é tratada em Python sem corromper o banco.
- **Timer Autônomo:** O Python diminui a estimativa "tempo aproximado" todo segundo assim que recebe "PARTIU", sendo que a animação Frontend faz o movimento gráfico. O timer de `integracao.py` foi projetado para parar e travar no 1º segundo caso o ônibus real demore a chegar ao sensor.
- **Execução Contínua:** Não há limites de Timeout (Watchdogs de desligamento foram removidos) para permitir que a maquete rode por horas e que paradas propositais no meio do trilho (para fotos ou demonstrações) não causem a "queda" do sistema ou avisos de obstáculo, priorizando a estabilidade visual e a interatividade da apresentação.
- **Responsividade e Temas:** O layout com TailwindCSS é inteiramente auto-ajustável. O scroll do painel de notificação obedece regras do Flexbox (encolhendo sem exceder o viewport), e há um toggle universal entre o modo claro (`bg-white`) e o modo escuro (`dark`).

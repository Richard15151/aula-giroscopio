# 🎮 Jogo do Orbe - Giroscópio

> Status do Projeto: Concluído ✔️

---

### Tabela de Conteúdos
* [Descrição do Projeto](#descrição-do-projeto)
* [Demonstração da Aplicação](#demonstração-da-aplicação)
* [Funcionalidades](#funcionalidades)
* [Tecnologias Utilizadas](#tecnologias-utilizadas)
* [Como Rodar o Projeto Localmente](#como-rodar-o-projeto-localmente)
* [Funcionalidade Adicional](#funcionalidade-adicional-dificuldade-dinâmica)
* [Autor](#autor)

---

### Descrição do Projeto
<p align="center">
Este projeto é um jogo interativo desenvolvido em React Native com Expo, onde o jogador deve movimentar seu celular utilizando o giroscópio para coletar orbes azuis dentro do tempo limite. O tamanho do orbe, o tempo da partida e a dificuldade do movimento variam de acordo com a dificuldade escolhida (Fácil, Médio ou Difícil). Além disso, agora o jogo inclui obstáculos móveis que o jogador deve evitar.
</p>

---

### Demonstração da Aplicação
<p align="center">
  <img src="./assets/videos/videojogoorbe.gif" alt="Demonstração do App" width="300"/>
</p>

---

### Funcionalidades

- **Movimento com Giroscópio:** O jogador move a bolinha laranja inclinando o celular.
- **Coleta de Orbes:** O objetivo é coletar o máximo de orbes azuis possível antes do tempo acabar.
- **Obstáculo Móvel:** Quadrado vermelho se move horizontalmente no centro da tela; encostar nele finaliza o jogo.
- **Pontuação em Tempo Real:** O score é atualizado a cada orbe coletado.
- **Dificuldades:**  
  - Fácil → Orbe maior e mais tempo.  
  - Médio → Orbe menor e tempo reduzido.  
  - Difícil → Orbe ainda menor e pouco tempo.  
- **Feedback Visual e Sonoro:** Orbe pisca e emite som quando coletado.
- **Tela de Fim de Jogo:** Mostra a pontuação final e opção de reiniciar.

---

### Tecnologias Utilizadas

- **[React Native](https://reactnative.dev/)**  
- **[Expo](https://expo.dev/)**  
- **[TypeScript](https://www.typescriptlang.org/)**  
- **[Expo Sensors](https://docs.expo.dev/versions/latest/sdk/gyroscope/)** (para usar o giroscópio)  
- **[Expo AV](https://docs.expo.dev/versions/latest/sdk/av/)** (para sons)  
- **[Safe Area Context](https://docs.expo.dev/versions/latest/sdk/safe-area-context/)** (para respeitar áreas seguras do celular)  

---

### Como Rodar o Projeto Localmente

```bash
# 1. Clone o repositório
$ git clone [link-do-seu-repositorio]

# 2. Navegue até o diretório do projeto
$ cd jogo-orbe

# 3. Instale as dependências
$ npm install

# 4. Inicie o servidor de desenvolvimento
$ npm start
```
Após executar `npm start`, pressione `w` para abrir no navegador ou escaneie o QR Code com o app **Expo Go** no seu celular.

---

## Funcionalidade Adicional: Dificuldade Dinâmica

### Descrição
O jogo agora inclui ajustes dinâmicos e desafios extras:

- **Tamanho do Orbe e Tempo:** Variam de acordo com a dificuldade escolhida.

- **Sensibilidade do Player:** Ajustada para movimentos suaves e responsivos.

- **Obstáculo Horizontal:** Obstáculo vermelho se move horizontalmente no centro da tela; encostar nele termina o jogo.

- **Score Garantido:** Correção para garantir que a pontuação final seja exibida corretamente, mesmo quando o tempo termina.  

### Desafios e Aprendizados
- Trabalhar com **sensores do celular** (giroscópio) para capturar movimentos em tempo real.  
- Usar o **SafeArea** para evitar que os orbes aparecessem fora da área segura da tela.  
- Implementar lógica de colisão entre player e orbe.
- Garantir pontuação final consistente, evitando bugs de atualização durante o render.

---

### Autor

Desenvolvido por **Richard de Oliveira Ribeiro**.  

Sob a orientação do **Prof. Rafael Ribas**.

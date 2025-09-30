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
Este projeto é um jogo interativo desenvolvido em React Native com Expo, onde o jogador deve movimentar seu celular utilizando o giroscópio para coletar orbes azuis dentro do tempo limite. O tamanho do orbe e o tempo da partida variam de acordo com a dificuldade escolhida (Fácil, Médio ou Difícil).
</p>

---

### Demonstração da Aplicação
<p align="center">
  <img src="link-para-seu-gif-ou-video.gif" alt="Demonstração do App" width="300"/>
</p>

---

### Funcionalidades

- **Movimento com Giroscópio:** O jogador move a bolinha laranja inclinando o celular.
- **Coleta de Orbes:** O objetivo é coletar o máximo de orbes azuis possível antes do tempo acabar.
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
A principal funcionalidade adicional é o ajuste dinâmico do **tamanho do orbe** e do **tempo limite da partida** conforme a dificuldade escolhida.  

- No **Fácil**, o orbe é maior e há mais tempo para jogar.  
- No **Médio**, o orbe é menor e o tempo é reduzido.  
- No **Difícil**, o orbe é ainda menor e o tempo é bem limitado.  

### Desafios e Aprendizados
- Trabalhar com **sensores do celular** (giroscópio) para capturar movimentos em tempo real.  
- Usar o **SafeArea** para evitar que os orbes aparecessem fora da área segura da tela.  
- Implementar lógica de colisão entre player e orbe.  

### Demonstração da Nova Funcionalidade
<p align="center">
  <img src="link-para-seu-gif-ou-screenshot.png" alt="Demonstração da Dificuldade Dinâmica" width="300"/>
</p>

---

### Autor

Desenvolvido por **[Seu Nome Completo]**.  

Sob a orientação do **Prof. Rafael Ribas**.

  import { useState } from "react";
  import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
  import TelaInicial from "../components/Telainicial";
  import Jogo from "../components/Coleteoorbe";

  export default function App() {
    const [dificuldade, setDificuldade] = useState<null | "facil" | "medio" | "dificil">(null);
    const [scoreFinal, setScoreFinal] = useState<number | null>(null);

    const tempos = { facil: 40, medio: 20, dificil: 10 };

    const reiniciar = () => { setDificuldade(null); setScoreFinal(null); };

    return (
      <View style={styles.container}>
        {!dificuldade && !scoreFinal && (
          <TelaInicial onStart={(dif) => setDificuldade(dif)} />
        )}

        {dificuldade && !scoreFinal && (
          <Jogo tempoLimite={tempos[dificuldade]} onGameOver={(score) => setScoreFinal(score)} dificuldade={dificuldade}/>
        )}

        {scoreFinal !== null && (
          <View style={styles.gameOver}>
            <Text style={styles.gameOverText}>🎉 Game Over!</Text>
            <Text style={styles.gameOverText}>Pontuação: {scoreFinal}</Text>
            <TouchableOpacity style={styles.botao} onPress={reiniciar}>
              <Text style={styles.botaoTexto}>Voltar à tela inicial</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: { flex: 1 },
    gameOver: { flex:1, justifyContent:"center", alignItems:"center", backgroundColor:"#101020" },
    gameOverText: { fontSize:26, color:"#fff", marginBottom:20, fontWeight:"bold" },
    botao: { backgroundColor:"#4CAF50", padding:15, borderRadius:10 },
    botaoTexto: { color:"#fff", fontWeight:"bold", fontSize:18 },
  });

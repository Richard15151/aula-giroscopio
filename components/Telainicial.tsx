import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type TelaInicialProps = {
  onStart: (dificuldade: "facil" | "medio" | "dificil") => void;
};

export default function TelaInicial({ onStart }: TelaInicialProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>🎮 Jogo do Giroscópio</Text>
      <Text style={styles.descricao}>
        Mova seu celular para coletar o maior número de orbes azuis antes do tempo acabar.
        Escolha uma dificuldade para começar:
      </Text>

      <TouchableOpacity style={[styles.botao, { backgroundColor: "#4CAF50" }]} onPress={() => onStart("facil")}>
        <Text style={styles.textoBotao}>Fácil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.botao, { backgroundColor: "#FFC107" }]} onPress={() => onStart("medio")}>
        <Text style={styles.textoBotao}>Médio</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.botao, { backgroundColor: "#F44336" }]} onPress={() => onStart("dificil")}>
        <Text style={styles.textoBotao}>Difícil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#101020" },
  titulo: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 20, textAlign: "center" },
  descricao: { fontSize: 16, color: "#ccc", marginBottom: 30, textAlign: "center" },
  botao: { padding: 15, borderRadius: 10, marginVertical: 10, width: "60%", alignItems: "center" },
  textoBotao: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

import { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Text, Animated } from 'react-native';
import { Gyroscope } from 'expo-sensors';
import { Audio } from 'expo-av';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const PLAYER_SIZE = 50;
const ORB_BASE_SIZE = 30;

type JogoProps = {
  tempoLimite: number;
  onGameOver: (score: number) => void;
};

function GameContent({ tempoLimite, onGameOver }: JogoProps) {
  const insets = useSafeAreaInsets(); // pega margens seguras do iPhone
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [playerPosition, setPlayerPosition] = useState({ x: width / 2, y: height / 2 });
  const [score, setScore] = useState(0);
  const [tempoRestante, setTempoRestante] = useState(tempoLimite);
  const [som, setSom] = useState<Audio.Sound | null>(null);
  const [orbSize, setOrbSize] = useState(ORB_BASE_SIZE);
  const [orbOpacity] = useState(new Animated.Value(1));

  // Gera posição respeitando safe area
  const generateRandomPosition = () => ({
    x: Math.random() * (width - ORB_BASE_SIZE),
    y: insets.top + Math.random() * (height - insets.top - insets.bottom - ORB_BASE_SIZE),
  });

  const [orbPosition, setOrbPosition] = useState(generateRandomPosition());

  // Carrega o som do orbe
  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(require('../assets/som.mp3'));
      setSom(sound);
    };
    loadSound();
    return () => { som?.unloadAsync(); };
  }, []);

  // Giroscópio
  useEffect(() => {
    Gyroscope.setUpdateInterval(11);
    const subscription = Gyroscope.addListener(gyroscopeData => {
      setData(gyroscopeData);
    });
    return () => subscription.remove();
  }, []);

  // Movimento do player
  useEffect(() => {
    let newX = playerPosition.x + data.y * 10;
    let newY = playerPosition.y + data.x * 10;

    if (newX < 0) newX = 0;
    if (newX > width - PLAYER_SIZE) newX = width - PLAYER_SIZE;
    if (newY < insets.top) newY = insets.top; // respeita top
    if (newY > height - insets.bottom - PLAYER_SIZE) newY = height - insets.bottom - PLAYER_SIZE;

    setPlayerPosition({ x: newX, y: newY });
  }, [data]);

  // Colisão player-orbe
  useEffect(() => {
    const playerCenterX = playerPosition.x + PLAYER_SIZE / 2;
    const playerCenterY = playerPosition.y + PLAYER_SIZE / 2;
    const orbCenterX = orbPosition.x + orbSize / 2;
    const orbCenterY = orbPosition.y + orbSize / 2;

    const dx = playerCenterX - orbCenterX;
    const dy = playerCenterY - orbCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < (PLAYER_SIZE / 2) + (orbSize / 2)) {
      setScore(prev => prev + 1);
      setOrbPosition(generateRandomPosition());

      // Diminuir o tamanho do orbe progressivamente, mínimo 10
      setOrbSize(prev => Math.max(10, ORB_BASE_SIZE - Math.floor(score / 5)));

      // Efeito de piscar
      Animated.sequence([
        Animated.timing(orbOpacity, { toValue: 0.2, duration: 100, useNativeDriver: true }),
        Animated.timing(orbOpacity, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();

      // Toca o som
      som?.replayAsync();
    }
  }, [playerPosition]);

  // Timer regressivo
  useEffect(() => {
    if (tempoRestante <= 0) {
      onGameOver(score);
      return;
    }
    const timer = setInterval(() => setTempoRestante(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [tempoRestante]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.score}>Score: {score}</Text>
        <Text style={[styles.info, { top: 80 }]}>Tempo: {tempoRestante}s</Text>

        <Animated.View
          style={[
            styles.orb,
            {
              left: orbPosition.x,
              top: orbPosition.y,
              width: orbSize,
              height: orbSize,
              borderRadius: orbSize / 2,
              opacity: orbOpacity,
            }
          ]}
        />
        <View style={[styles.player, { left: playerPosition.x, top: playerPosition.y }]} />
      </View>
    </SafeAreaView>
  );
}

export default function Jogo(props: JogoProps) {
  return (
    <SafeAreaProvider>
      <GameContent {...props} />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#000" },
  container: { flex: 1, backgroundColor: '#2c3e50', justifyContent: "center", alignItems: "center" },
  score: { fontSize: 24, color: "#fff", marginTop: 10 },
  info: { position: 'absolute', left: 20, fontSize: 20, color: '#fff', fontWeight: 'bold' },
  player: { position: 'absolute', width: PLAYER_SIZE, height: PLAYER_SIZE, borderRadius: PLAYER_SIZE / 2, backgroundColor: 'coral', borderWidth: 2, borderColor: '#fff' },
  orb: { position: 'absolute', backgroundColor: '#3498db', borderWidth: 2, borderColor: '#fff' },
});
